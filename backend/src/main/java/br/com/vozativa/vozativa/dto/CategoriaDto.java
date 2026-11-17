package br.com.vozativa.vozativa.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class CategoriaDto {

    @NotBlank(message = "O nome da categoria é obrigatório.")
    @Size(max = 100, message = "O nome deve ter no máximo 100 caracteres.")
    private String nome;

    @NotBlank(message = "A descrição da categoria é obrigatória.")
    @Size(max = 255, message = "A descrição deve ter no máximo 255 caracteres.")
    private String descricao;

    @NotBlank(message = "O campo acessibilidade é obrigatório.")
    @Pattern(regexp = "[SN]", message = "A acessibilidade deve ser informada como S ou N.")
    private String acessibilidade;

    public CategoriaDto() {
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getAcessibilidade() {
        return acessibilidade;
    }

    public void setAcessibilidade(String acessibilidade) {
        this.acessibilidade = acessibilidade;
    }
}