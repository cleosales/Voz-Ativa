package br.com.vozativa.vozativa.handler;

import br.com.vozativa.vozativa.exception.ErroResposta;
import br.com.vozativa.vozativa.exception.RecursoNaoEncontradoException;
import br.com.vozativa.vozativa.exception.RegraNegocioException;
import br.com.vozativa.vozativa.exception.RequisicaoInvalidaException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log =
            LoggerFactory.getLogger(GlobalExceptionHandler.class);

    private static final int ORA_UNIQUE = 1;
    private static final int ORA_FK_PAI_AUSENTE = 2291;
    private static final int ORA_FK_FILHO_EXISTE = 2292;

    private ResponseEntity<ErroResposta> montar(
            HttpStatus status, String mensagem) {

        return ResponseEntity.status(status)
                .body(new ErroResposta(status.value(), mensagem));
    }

    // 400 - Erros de validação (@Valid)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErroResposta> tratarErroValidacao(
            MethodArgumentNotValidException erro) {

        List<String> mensagens = new ArrayList<>();

        for (FieldError campo : erro.getBindingResult().getFieldErrors()) {
            mensagens.add(campo.getDefaultMessage());
        }

        return montar(
                HttpStatus.BAD_REQUEST,
                String.join("; ", mensagens)
        );
    }

    // 400 - JSON malformado ou corpo inválido
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErroResposta> tratarJsonInvalido(
            HttpMessageNotReadableException erro) {

        return montar(
                HttpStatus.BAD_REQUEST,
                "Corpo da requisição inválido ou mal formatado."
        );
    }

    // 400 - Tipo inválido, por exemplo: /ocorrencias/abc
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ErroResposta> tratarTipoInvalido(
            MethodArgumentTypeMismatchException erro) {

        return montar(
                HttpStatus.BAD_REQUEST,
                "O valor informado para '" + erro.getName()
                        + "' é inválido."
        );
    }

    // 400 - Dados inválidos identificados manualmente
    @ExceptionHandler(RequisicaoInvalidaException.class)
    public ResponseEntity<ErroResposta> tratarRequisicaoInvalida(
            RequisicaoInvalidaException erro) {

        return montar(HttpStatus.BAD_REQUEST, erro.getMessage());
    }

    // 404 - Recurso não encontrado
    @ExceptionHandler(RecursoNaoEncontradoException.class)
    public ResponseEntity<ErroResposta> tratarNaoEncontrado(
            RecursoNaoEncontradoException erro) {

        return montar(HttpStatus.NOT_FOUND, erro.getMessage());
    }

    // 404 - Rota inexistente
    @ExceptionHandler({
            NoResourceFoundException.class,
            NoHandlerFoundException.class
    })
    public ResponseEntity<ErroResposta> tratarRotaInexistente(
            Exception erro) {

        return montar(
                HttpStatus.NOT_FOUND,
                "Rota não encontrada."
        );
    }

    // 405 - Método HTTP não permitido
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ErroResposta> tratarMetodoNaoPermitido(
            HttpRequestMethodNotSupportedException erro) {

        return montar(
                HttpStatus.METHOD_NOT_ALLOWED,
                "Método HTTP não permitido para esta rota."
        );
    }

    // 409 - Regra de negócio
    @ExceptionHandler(RegraNegocioException.class)
    public ResponseEntity<ErroResposta> tratarRegraNegocio(
            RegraNegocioException erro) {

        return montar(HttpStatus.CONFLICT, erro.getMessage());
    }

    // 409 para violações de integridade do Oracle
    // 500 para erros inesperados
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErroResposta> tratarErroGeral(Exception erro) {

        Integer codigoOracle = buscarCodigoIntegridade(erro);

        if (codigoOracle != null) {
            log.warn(
                    "Violação de integridade no banco (ORA-{})",
                    codigoOracle
            );

            String mensagem = switch (codigoOracle) {
                case ORA_FK_PAI_AUSENTE ->
                        "O registro relacionado informado não existe.";

                case ORA_FK_FILHO_EXISTE ->
                        "Não é possível excluir: existem registros vinculados.";

                default ->
                        "Já existe um registro com estes dados.";
            };

            return montar(HttpStatus.CONFLICT, mensagem);
        }

        log.error("Erro inesperado", erro);

        return montar(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Ocorreu um erro interno no servidor."
        );
    }

    // Procura um SQLException na cadeia de causas
    private Integer buscarCodigoIntegridade(Throwable erro) {

        Throwable atual = erro;

        while (atual != null) {
            if (atual instanceof SQLException sql) {

                int codigo = sql.getErrorCode();

                if (codigo == ORA_UNIQUE
                        || codigo == ORA_FK_PAI_AUSENTE
                        || codigo == ORA_FK_FILHO_EXISTE) {

                    return codigo;
                }
            }

            atual = atual.getCause();
        }

        return null;
    }
}