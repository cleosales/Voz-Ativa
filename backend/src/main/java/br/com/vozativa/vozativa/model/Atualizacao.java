package br.com.vozativa.vozativa.model;

import java.time.LocalDateTime;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class Atualizacao {
    private Integer id;

    @NotNull(message = "O identificador da ocorrência é obrigatório.")
    private Integer ocorrenciaId;

    @NotBlank(message = "A descrição da atualização é obrigatória.")
    private String descricao;

    @NotBlank(message = "O novo status da atualização é obrigatório.")
    private String novoStatus;

    @NotNull(message = "A data da atualização é obrigatória.")
    private LocalDateTime dataAtualizacao;

    public Atualizacao() {
    }

    public Atualizacao(Integer id, Integer ocorrenciaId, String descricao,
                       String novoStatus, LocalDateTime dataAtualizacao) {
        this.id = id;
        this.ocorrenciaId = ocorrenciaId;
        this.descricao = descricao;
        this.novoStatus = novoStatus;
        this.dataAtualizacao = dataAtualizacao;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getOcorrenciaId() {
        return ocorrenciaId;
    }

    public void setOcorrenciaId(Integer ocorrenciaId) {
        this.ocorrenciaId = ocorrenciaId;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getNovoStatus() {
        return novoStatus;
    }

    public void setNovoStatus(String novoStatus) {
        this.novoStatus = novoStatus;
    }

    public LocalDateTime getDataAtualizacao() {
        return dataAtualizacao;
    }

    public void setDataAtualizacao(LocalDateTime dataAtualizacao) {
        this.dataAtualizacao = dataAtualizacao;
    }
}