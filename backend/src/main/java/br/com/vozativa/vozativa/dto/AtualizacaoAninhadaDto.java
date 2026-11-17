package br.com.vozativa.vozativa.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AtualizacaoAninhadaDto {

    @NotBlank(message = "A descrição da atualização é obrigatória.")
    @Size(max = 500, message = "A descrição deve ter no máximo 500 caracteres.")
    private String descricao;

    @NotBlank(message = "O novo status é obrigatório.")
    @Size(max = 30, message = "O status deve ter no máximo 30 caracteres.")
    private String novoStatus;

    public AtualizacaoAninhadaDto() {
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