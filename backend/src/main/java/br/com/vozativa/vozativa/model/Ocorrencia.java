
package br.com.vozativa.vozativa.model;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public class Ocorrencia {

    private Integer id;

    @NotNull(message = "A categoria da ocorrência é obrigatória.")
    @Positive(message = "O ID da categoria deve ser positivo.")
    private Integer categoriaId;

    @NotBlank(message = "O bairro da ocorrência é obrigatório.")
    @Size(max = 100, message = "O bairro deve ter no máximo 100 caracteres.")
    private String bairro;

    @NotBlank(message = "O local da ocorrência é obrigatório.")
    @Size(max = 200, message = "O local deve ter no máximo 200 caracteres.")
    private String local;

    @NotBlank(message = "A descrição da ocorrência é obrigatória.")
    @Size(max = 500, message = "A descrição deve ter no máximo 500 caracteres.")
    private String descricao;

    @NotBlank(message = "Informe se a ocorrência afeta a acessibilidade.")
    @Pattern(regexp = "[SN]", message = "A acessibilidade deve ser informada como S ou N.")
    private String afetaAcessibilidade;

    @NotBlank(message = "O status da ocorrência é obrigatório.")
    @Pattern(
            regexp = "ABERTA|EM_ANALISE|EM_ANDAMENTO|RESOLVIDA",
            message = "Status inválido. Utilize ABERTA, EM_ANALISE, EM_ANDAMENTO ou RESOLVIDA."
    )
    private String status;

    @NotNull(message = "A urgência da ocorrência é obrigatória.")
    @jakarta.validation.constraints.Min(value = 1, message = "A urgência mínima é 1.")
    @jakarta.validation.constraints.Max(value = 3, message = "A urgência máxima é 3.")
    private Integer urgencia;

    private LocalDateTime dataAbertura;

    public Ocorrencia() {
    }

    public Ocorrencia(Integer id, Integer categoriaId, String bairro,
                      String local, String descricao,
                      String afetaAcessibilidade, String status,
                      Integer urgencia, LocalDateTime dataAbertura) {
        this.id = id;
        this.categoriaId = categoriaId;
        this.bairro = bairro;
        this.local = local;
        this.descricao = descricao;
        this.afetaAcessibilidade = afetaAcessibilidade;
        this.status = status;
        this.urgencia = urgencia;
        this.dataAbertura = dataAbertura;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getAfetaAcessibilidade() {
        return afetaAcessibilidade;
    }

    public void setAfetaAcessibilidade(String afetaAcessibilidade) {
        this.afetaAcessibilidade = afetaAcessibilidade;
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

