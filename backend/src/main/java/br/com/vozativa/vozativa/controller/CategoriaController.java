package br.com.vozativa.vozativa.controller;

import br.com.vozativa.vozativa.service.CategoriaService;
import br.com.vozativa.vozativa.dto.CategoriaDto;
import br.com.vozativa.vozativa.model.Categoria;
import br.com.vozativa.vozativa.model.Ocorrencia;
import br.com.vozativa.vozativa.exception.RecursoNaoEncontradoException;
import br.com.vozativa.vozativa.dto.CategoriaRespostaDto;
import br.com.vozativa.vozativa.dto.OcorrenciaRespostaDto;

import org.modelmapper.ModelMapper;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.ArrayList;

@RestController
@RequestMapping("/categorias")
public class CategoriaController {

    private final CategoriaService categoriaService;
    private final ModelMapper modelMapper;

    public CategoriaController(
            CategoriaService categoriaService,
            ModelMapper modelMapper) {

        this.categoriaService = categoriaService;
        this.modelMapper = modelMapper;
    }

    @PostMapping
    public ResponseEntity<String> cadastrar(
            @Valid @RequestBody CategoriaDto categoriaDto) {

        Categoria categoria = modelMapper.map(
                categoriaDto, Categoria.class
        );

        int id = categoriaService.cadastrar(categoria);

        var location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(id)
                .toUri();

        return ResponseEntity
                .created(location)
                .body("Categoria cadastrada com sucesso!");
    }

    @GetMapping
    public ResponseEntity<ArrayList<CategoriaRespostaDto>> listar() {

        ArrayList<Categoria> categorias = categoriaService.listar();
        ArrayList<CategoriaRespostaDto> respostas = new ArrayList<>();

        for (Categoria categoria : categorias) {
            respostas.add(modelMapper.map(
                    categoria, CategoriaRespostaDto.class
            ));
        }

        return ResponseEntity.ok(respostas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoriaRespostaDto> buscarPorId(
            @PathVariable int id) {

        Categoria categoria = categoriaService.buscarPorId(id);

        if (categoria == null) {
            throw new RecursoNaoEncontradoException(
                    "Categoria não encontrada."
            );
        }

        return ResponseEntity.ok(
                modelMapper.map(categoria, CategoriaRespostaDto.class)
        );
    }

    @GetMapping("/{id}/ocorrencias")
    public ResponseEntity<ArrayList<OcorrenciaRespostaDto>> listarOcorrencias(
            @PathVariable int id) {

        ArrayList<Ocorrencia> ocorrencias =
                categoriaService.listarOcorrencias(id);

        ArrayList<OcorrenciaRespostaDto> respostas = new ArrayList<>();

        for (Ocorrencia ocorrencia : ocorrencias) {
            respostas.add(modelMapper.map(
                    ocorrencia, OcorrenciaRespostaDto.class
            ));
        }

        return ResponseEntity.ok(respostas);
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> atualizar(
            @PathVariable int id,
            @Valid @RequestBody CategoriaDto categoriaDto) {

        Categoria categoria = categoriaService.buscarPorId(id);

        if (categoria == null) {
            throw new RecursoNaoEncontradoException(
                    "Categoria não encontrada."
            );
        }

        Categoria dadosAtualizados = modelMapper.map(
                categoriaDto, Categoria.class
        );

        dadosAtualizados.setId(id);
        categoriaService.atualizar(dadosAtualizados);

        return ResponseEntity.ok("Categoria atualizada com sucesso!");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable int id) {

        boolean excluiu = categoriaService.excluir(id);

        if (!excluiu) {
            throw new RecursoNaoEncontradoException(
                    "Categoria não encontrada."
            );
        }

        return ResponseEntity.noContent().build();
    }
}
