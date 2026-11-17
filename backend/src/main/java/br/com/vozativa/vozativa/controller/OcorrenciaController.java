package br.com.vozativa.vozativa.controller;

import br.com.vozativa.vozativa.model.Ocorrencia;
import br.com.vozativa.vozativa.model.Atualizacao;
import br.com.vozativa.vozativa.service.OcorrenciaService;
import br.com.vozativa.vozativa.service.AtualizacaoService;
import br.com.vozativa.vozativa.exception.RecursoNaoEncontradoException;
import br.com.vozativa.vozativa.dto.OcorrenciaDto;
import br.com.vozativa.vozativa.dto.OcorrenciaRespostaDto;
import br.com.vozativa.vozativa.dto.AtualizacaoAninhadaDto;
import br.com.vozativa.vozativa.dto.AtualizacaoRespostaDto;

import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.ArrayList;

@RestController
@RequestMapping("/ocorrencias")
public class OcorrenciaController {

    private final OcorrenciaService ocorrenciaService;
    private final AtualizacaoService atualizacaoService;
    private final ModelMapper modelMapper;

    public OcorrenciaController(
            OcorrenciaService ocorrenciaService,
            AtualizacaoService atualizacaoService,
            ModelMapper modelMapper) {

        this.ocorrenciaService = ocorrenciaService;
        this.atualizacaoService = atualizacaoService;
        this.modelMapper = modelMapper;
    }

    @PostMapping
    public ResponseEntity<String> cadastrar(
            @Valid @RequestBody OcorrenciaDto ocorrenciaDto) {

        Ocorrencia ocorrencia = modelMapper.map(
                ocorrenciaDto, Ocorrencia.class
        );

        ocorrencia.setDataAbertura(LocalDateTime.now());

        int id = ocorrenciaService.cadastrar(ocorrencia);

        var location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(id)
                .toUri();

        return ResponseEntity
                .created(location)
                .body("Ocorrência cadastrada com sucesso!");
    }

    @GetMapping
    public ResponseEntity<ArrayList<OcorrenciaRespostaDto>> listar() {

        ArrayList<Ocorrencia> ocorrencias = ocorrenciaService.listar();
        ArrayList<OcorrenciaRespostaDto> respostas = new ArrayList<>();

        for (Ocorrencia ocorrencia : ocorrencias) {
            respostas.add(modelMapper.map(
                    ocorrencia, OcorrenciaRespostaDto.class
            ));
        }

        return ResponseEntity.ok(respostas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OcorrenciaRespostaDto> buscarPorId(
            @PathVariable int id) {

        Ocorrencia ocorrencia = ocorrenciaService.buscarPorId(id);

        if (ocorrencia == null) {
            throw new RecursoNaoEncontradoException(
                    "Ocorrência não encontrada."
            );
        }

        return ResponseEntity.ok(
                modelMapper.map(ocorrencia, OcorrenciaRespostaDto.class)
        );
    }

    @GetMapping("/{id}/atualizacoes")
    public ResponseEntity<ArrayList<AtualizacaoRespostaDto>> listarAtualizacoes(
            @PathVariable int id) {

        ArrayList<Atualizacao> atualizacoes =
                atualizacaoService.listarPorOcorrencia(id);

        ArrayList<AtualizacaoRespostaDto> respostas = new ArrayList<>();

        for (Atualizacao atualizacao : atualizacoes) {
            respostas.add(modelMapper.map(
                    atualizacao, AtualizacaoRespostaDto.class
            ));
        }

        return ResponseEntity.ok(respostas);
    }


    @PostMapping("/{id}/atualizacoes")
    public ResponseEntity<String> cadastrarAtualizacao(
            @PathVariable int id,
            @Valid @RequestBody AtualizacaoAninhadaDto dto) {

        Atualizacao atualizacao = new Atualizacao();

        atualizacao.setOcorrenciaId(id);
        atualizacao.setDescricao(dto.getDescricao());
        atualizacao.setNovoStatus(dto.getNovoStatus());
        atualizacao.setDataAtualizacao(LocalDateTime.now());

        int idAtualizacao = atualizacaoService.cadastrar(atualizacao);

        var location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{idAtualizacao}")
                .buildAndExpand(idAtualizacao)
                .toUri();

        return ResponseEntity
                .created(location)
                .body("Atualização cadastrada com sucesso!");
    }


    @PutMapping("/{id}")
    public ResponseEntity<String> atualizar(
            @PathVariable int id,
            @Valid @RequestBody OcorrenciaDto ocorrenciaDto) {

        Ocorrencia ocorrenciaEncontrada =
                ocorrenciaService.buscarPorId(id);

        if (ocorrenciaEncontrada == null) {
            throw new RecursoNaoEncontradoException(
                    "Ocorrência não encontrada."
            );
        }

        Ocorrencia dadosAtualizados = modelMapper.map(
                ocorrenciaDto, Ocorrencia.class
        );

        dadosAtualizados.setId(id);
        dadosAtualizados.setDataAbertura(
                ocorrenciaEncontrada.getDataAbertura()
        );

        ocorrenciaService.atualizar(dadosAtualizados);

        return ResponseEntity.ok("Ocorrência atualizada com sucesso!");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable int id) {

        boolean excluiu = ocorrenciaService.excluir(id);

        if (!excluiu) {
            throw new RecursoNaoEncontradoException(
                    "Ocorrência não encontrada."
            );
        }

        return ResponseEntity.noContent().build();
    }
}