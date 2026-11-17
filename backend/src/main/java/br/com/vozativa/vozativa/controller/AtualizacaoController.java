
package br.com.vozativa.vozativa.controller;

import br.com.vozativa.vozativa.model.Atualizacao;
import br.com.vozativa.vozativa.service.AtualizacaoService;
import br.com.vozativa.vozativa.exception.RecursoNaoEncontradoException;
import br.com.vozativa.vozativa.dto.AtualizacaoDto;
import br.com.vozativa.vozativa.dto.AtualizacaoRespostaDto;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;

@RestController
@RequestMapping("/atualizacoes")
public class AtualizacaoController {

    private final AtualizacaoService atualizacaoService;
    private final ModelMapper modelMapper;

    public AtualizacaoController(
            AtualizacaoService atualizacaoService,
            ModelMapper modelMapper) {

        this.atualizacaoService = atualizacaoService;
        this.modelMapper = modelMapper;
    }


    @PostMapping
    public ResponseEntity<String> cadastrar(
            @Valid @RequestBody AtualizacaoDto atualizacaoDto) {

        Atualizacao atualizacao = modelMapper.map(
                atualizacaoDto, Atualizacao.class
        );

        atualizacao.setDataAtualizacao(LocalDateTime.now());

        int id = atualizacaoService.cadastrar(atualizacao);

        var location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(id)
                .toUri();

        return ResponseEntity
                .created(location)
                .body("Atualização cadastrada com sucesso!");
    }


    @GetMapping("/ocorrencia/{ocorrenciaId}")
    public ResponseEntity<ArrayList<AtualizacaoRespostaDto>> listarPorOcorrencia(
            @PathVariable int ocorrenciaId) {

        ArrayList<Atualizacao> atualizacoes =
                atualizacaoService.listarPorOcorrencia(ocorrenciaId);

        ArrayList<AtualizacaoRespostaDto> respostas = new ArrayList<>();

        for (Atualizacao atualizacao : atualizacoes) {

            AtualizacaoRespostaDto dto = modelMapper.map(
                    atualizacao, AtualizacaoRespostaDto.class
            );

            respostas.add(dto);
        }

        return ResponseEntity.ok(respostas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AtualizacaoRespostaDto> buscarPorId(
            @PathVariable int id) {

        Atualizacao atualizacao = atualizacaoService.buscarPorId(id);

        if (atualizacao == null) {
            throw new RecursoNaoEncontradoException(
                    "Atualização não encontrada."
            );
        }

        AtualizacaoRespostaDto resposta = modelMapper.map(
                atualizacao, AtualizacaoRespostaDto.class
        );

        return ResponseEntity.ok(resposta);
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> atualizar(
            @PathVariable int id,
            @Valid @RequestBody AtualizacaoDto atualizacaoDto) {

        Atualizacao atualizacao =
                atualizacaoService.buscarPorId(id);

        if (atualizacao == null) {
            throw new RecursoNaoEncontradoException(
                    "Atualização não encontrada."
            );
        }

        // Preserva a data original e atualiza somente os campos permitidos.
        atualizacao.setOcorrenciaId(atualizacaoDto.getOcorrenciaId());
        atualizacao.setDescricao(atualizacaoDto.getDescricao());
        atualizacao.setNovoStatus(atualizacaoDto.getNovoStatus());

        atualizacaoService.atualizar(atualizacao);

        return ResponseEntity.ok(
                "Atualização alterada com sucesso!"
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable int id) {

        boolean excluiu = atualizacaoService.excluir(id);

        if (!excluiu) {
            throw new RecursoNaoEncontradoException(
                    "Atualização não encontrada."
            );
        }

        return ResponseEntity.noContent().build();
    }
}
