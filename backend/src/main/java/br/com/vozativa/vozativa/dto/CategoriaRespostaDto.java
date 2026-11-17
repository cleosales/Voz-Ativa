
package br.com.vozativa.vozativa.dto;

public class CategoriaRespostaDto {

    private int id;
    private String nome;
    private String descricao;
    private String acessibilidade;

    public CategoriaRespostaDto() {
    }

    public CategoriaRespostaDto(int id, String nome,
                                String descricao, String acessibilidade) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.acessibilidade = acessibilidade;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
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
