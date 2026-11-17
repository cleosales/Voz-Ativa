
package br.com.vozativa.vozativa.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public class AtualizacaoDto {

    @NotNull(message = "O ID da ocorrência é obrigatório.")
    @Positive(message = "O ID da ocorrência deve ser positivo.")
    private Integer ocorrenciaId;

    @NotBlank(message = "A descrição da atualização é obrigatória.")
    @Size(max = 500, message = "A descrição deve ter no máximo 500 caracteres.")
    private String descricao;

    @NotBlank(message = "O novo status é obrigatório.")
    @Size(max = 30, message = "O status deve ter no máximo 30 caracteres.")
    private String novoStatus;

    public AtualizacaoDto() {
    }

    public AtualizacaoDto(Integer ocorrenciaId, String descricao, String novoStatus) {
        this.ocorrenciaId = ocorrenciaId;
        this.descricao = descricao;
        this.novoStatus = novoStatus;
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
}
