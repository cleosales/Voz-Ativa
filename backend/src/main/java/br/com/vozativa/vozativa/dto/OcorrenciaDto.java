
package br.com.vozativa.vozativa.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public class OcorrenciaDto {

    @NotNull(message = "A categoria da ocorrência é obrigatória.")
    @Positive(message = "O ID da categoria deve ser positivo.")
    private Integer categoriaId;

    @NotBlank(message = "O bairro da ocorrência é obrigatório.")
    @Size(max = 100, message = "O bairro deve ter no máximo 100 caracteres.")
    private String bairro;

    @NotBlank(message = "O local da ocorrência é obrigatório.")
    @Size(max = 150, message = "O local deve ter no máximo 150 caracteres.")
    private String local;

    @NotBlank(message = "A descrição da ocorrência é obrigatória.")
    @Size(max = 500, message = "A descrição deve ter no máximo 500 caracteres.")
    private String descricao;

    @NotBlank(message = "Informe se a ocorrência afeta a acessibilidade.")
    @Pattern(regexp = "[SN]", message = "A acessibilidade deve ser informada como S ou N.")
    private String afetaAcessibilidade;

    @NotBlank(message = "O status da ocorrência é obrigatório.")
    @Size(max = 30, message = "O status deve ter no máximo 30 caracteres.")
    private String status;

    @NotNull(message = "A urgência da ocorrência é obrigatória.")
    @Positive(message = "A urgência deve ser um número positivo.")
    private Integer urgencia;

    public OcorrenciaDto() {
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
}
