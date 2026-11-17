
package br.com.vozativa.vozativa.service;

import br.com.vozativa.vozativa.dao.AtualizacaoDao;
import br.com.vozativa.vozativa.dao.OcorrenciaDao;
import br.com.vozativa.vozativa.model.Atualizacao;
import br.com.vozativa.vozativa.model.Ocorrencia;
import br.com.vozativa.vozativa.exception.RecursoNaoEncontradoException;
import br.com.vozativa.vozativa.exception.RegraNegocioException;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;

@Service
public class AtualizacaoService {

    private final AtualizacaoDao atualizacaoDao;
    private final OcorrenciaDao ocorrenciaDao;

    public AtualizacaoService(
            AtualizacaoDao atualizacaoDao,
            OcorrenciaDao ocorrenciaDao) {

        this.atualizacaoDao = atualizacaoDao;
        this.ocorrenciaDao = ocorrenciaDao;
    }


    public int cadastrar(Atualizacao atualizacao) {

        Ocorrencia ocorrencia = ocorrenciaDao.buscarPorId(
                atualizacao.getOcorrenciaId()
        );

        if (ocorrencia == null) {
            throw new RecursoNaoEncontradoException(
                    "A ocorrência informada não foi encontrada."
            );
        }

        validarStatus(atualizacao.getNovoStatus());

        if ("RESOLVIDA".equals(ocorrencia.getStatus())) {
            throw new RegraNegocioException(
                    "Não é possível adicionar atualizações a uma ocorrência resolvida."
            );
        }

        atualizacao.setDataAtualizacao(LocalDateTime.now());

        int id = atualizacaoDao.cadastrar(atualizacao);

        ocorrencia.setStatus(atualizacao.getNovoStatus());
        ocorrenciaDao.atualizar(ocorrencia);

        return id;
    }


    public ArrayList<Atualizacao> listarPorOcorrencia(int ocorrenciaId) {

        if (ocorrenciaDao.buscarPorId(ocorrenciaId) == null) {
            throw new RecursoNaoEncontradoException(
                    "A ocorrência informada não foi encontrada."
            );
        }

        return atualizacaoDao.listarPorOcorrencia(ocorrenciaId);
    }

    public Atualizacao buscarPorId(int id) {
        return atualizacaoDao.buscarPorId(id);
    }


    public void atualizar(Atualizacao atualizacao) {

        Atualizacao existente = atualizacaoDao.buscarPorId(
                atualizacao.getId()
        );
        if (existente == null) {
            throw new RecursoNaoEncontradoException(
                    "Atualização não encontrada."
            );
        }
        if (!existente.getOcorrenciaId().equals(atualizacao.getOcorrenciaId())) {
            throw new RegraNegocioException(
                    "Não é permitido transferir uma atualização para outra ocorrência."
            );
        }
        Ocorrencia ocorrencia = ocorrenciaDao.buscarPorId(
                existente.getOcorrenciaId()
        );
        if (ocorrencia == null) {
            throw new RecursoNaoEncontradoException(
                    "A ocorrência informada não foi encontrada."
            );
        }
        validarStatus(atualizacao.getNovoStatus());

        if ("RESOLVIDA".equals(ocorrencia.getStatus())) {
            throw new RegraNegocioException(
                    "Não é possível atualizar registros de uma ocorrência resolvida."
            );
        }

        atualizacaoDao.atualizar(atualizacao);

        ArrayList<Atualizacao> historico =
                atualizacaoDao.listarPorOcorrencia(
                        existente.getOcorrenciaId()
                );

        if (!historico.isEmpty()) {
            Atualizacao ultimaAtualizacao =
                    historico.get(historico.size() - 1);

            ocorrencia.setStatus(ultimaAtualizacao.getNovoStatus());
            ocorrenciaDao.atualizar(ocorrencia);
        }
    }


    public boolean excluir(int id) {

        Atualizacao atualizacao = atualizacaoDao.buscarPorId(id);

        if (atualizacao == null) {
            return false;
        }

        Ocorrencia ocorrencia = ocorrenciaDao.buscarPorId(
                atualizacao.getOcorrenciaId()
        );

        if (ocorrencia == null) {
            throw new RecursoNaoEncontradoException(
                    "A ocorrência informada não foi encontrada."
            );
        }

        if ("RESOLVIDA".equals(ocorrencia.getStatus())) {
            throw new RegraNegocioException(
                    "Não é possível excluir atualizações de uma ocorrência resolvida."
            );
        }

        if (!atualizacaoDao.excluir(id)) {
            return false;
        }

        ArrayList<Atualizacao> atualizacoes =
                atualizacaoDao.listarPorOcorrencia(
                        atualizacao.getOcorrenciaId()
                );

        if (atualizacoes.isEmpty()) {
            ocorrencia.setStatus("ABERTA");
        } else {
            Atualizacao ultimaAtualizacao =
                    atualizacoes.get(atualizacoes.size() - 1);

            ocorrencia.setStatus(ultimaAtualizacao.getNovoStatus());
        }

        ocorrenciaDao.atualizar(ocorrencia);

        return true;
    }


    private void validarStatus(String status) {

        if (status == null ||
                !(status.equals("ABERTA") ||
                        status.equals("EM_ANALISE") ||
                        status.equals("EM_ANDAMENTO") ||
                        status.equals("RESOLVIDA"))) {

            throw new RegraNegocioException(
                    "Status inválido. Utilize ABERTA, EM_ANALISE, EM_ANDAMENTO ou RESOLVIDA."
            );
        }
    }
}


