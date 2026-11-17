package br.com.vozativa.vozativa.dto;

import java.time.LocalDateTime;

public class AtualizacaoRespostaDto {

    private Integer id;
    private Integer ocorrenciaId;
    private String descricao;
    private String novoStatus;
    private LocalDateTime dataAtualizacao;

    public AtualizacaoRespostaDto() {
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