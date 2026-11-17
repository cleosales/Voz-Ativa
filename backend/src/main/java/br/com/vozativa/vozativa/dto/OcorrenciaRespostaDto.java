package br.com.vozativa.vozativa.dto;

import java.time.LocalDateTime;

public class OcorrenciaRespostaDto {

    private Integer id;
    private Integer categoriaId;
    private String bairro;
    private String local;
    private String descricao;
    private String afetaAcessibilidade;
    private String status;
    private Integer urgencia;
    private LocalDateTime dataAbertura;

    public OcorrenciaRespostaDto() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getCategoriaId() {
        return categoriaId;
    }

    public void setCategoriaId(Integer categoriaId) {
        this.categoriaId = categoriaId;
    }

    public String getBairro() {
        return bairro;
    }

    public void setBairro(String bairro) {
        this.bairro = bairro;
    }

    public String getLocal() {
        return local;
    }

    public void setLocal(String local) {
        this.local = local;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getAfetaAcessibilidade() {
        return afetaAcessibilidade;
    }

    public void setAfetaAcessibilidade(String afetaAcessibilidade) {
        this.afetaAcessibilidade = afetaAcessibilidade;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getUrgencia() {
        return urgencia;
    }

    public void setUrgencia(Integer urgencia) {
        this.urgencia = urgencia;
    }

    public LocalDateTime getDataAbertura() {
        return dataAbertura;
    }

    public void setDataAbertura(LocalDateTime dataAbertura) {
        this.dataAbertura = dataAbertura;
    }
}
