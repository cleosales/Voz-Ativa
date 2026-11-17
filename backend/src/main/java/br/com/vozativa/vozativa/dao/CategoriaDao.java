
package br.com.vozativa.vozativa.dao;

import javax.sql.DataSource;
import org.springframework.stereotype.Repository;
import br.com.vozativa.vozativa.model.Categoria;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.ResultSet;
import java.util.ArrayList;

@Repository
public class CategoriaDao {

    private final DataSource dataSource;

    public CategoriaDao(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    public int cadastrar(Categoria categoria) {
        String sqlId = "SELECT sq_tb_categoria.NEXTVAL FROM dual";

        String sql = "INSERT INTO tb_categoria " +
                "(cd_categoria, nm_categoria, ds_categoria, fl_acessibilidade) " +
                "VALUES (?, ?, ?, ?)";

        try (Connection conexao = dataSource.getConnection()) {

            int id;

            try (PreparedStatement comandoId = conexao.prepareStatement(sqlId);
                 ResultSet resultado = comandoId.executeQuery()) {

                resultado.next();
                id = resultado.getInt(1);
            }

            try (PreparedStatement comando = conexao.prepareStatement(sql)) {

                comando.setInt(1, id);
                comando.setString(2, categoria.getNome());
                comando.setString(3, categoria.getDescricao());
                comando.setString(4, categoria.getAcessibilidade());

                comando.executeUpdate();
            }

            categoria.setId(id);
            return id;

        } catch (SQLException e) {
            throw new RuntimeException("Erro ao cadastrar categoria.", e);
        }
    }

    public ArrayList<Categoria> listar() {
        ArrayList<Categoria> categorias = new ArrayList<>();
        String sql = "SELECT * FROM tb_categoria";

        try (Connection conexao = dataSource.getConnection();
             PreparedStatement comando = conexao.prepareStatement(sql);
             ResultSet resultado = comando.executeQuery()) {

            while (resultado.next()) {
                Categoria categoria = new Categoria();
                categoria.setId(resultado.getInt("cd_categoria"));
                categoria.setNome(resultado.getString("nm_categoria"));
                categoria.setDescricao(resultado.getString("ds_categoria"));
                categoria.setAcessibilidade(resultado.getString("fl_acessibilidade"));
                categorias.add(categoria);
            }

        } catch (SQLException e) {
            throw new RuntimeException("Erro ao listar categorias.", e);
        }

        return categorias;
    }

    public Categoria buscarPorId(int id) {
        String sql = "SELECT * FROM tb_categoria WHERE cd_categoria = ?";

        try (Connection conexao = dataSource.getConnection();
             PreparedStatement comando = conexao.prepareStatement(sql)) {

            comando.setInt(1, id);

            try (ResultSet resultado = comando.executeQuery()) {
                if (resultado.next()) {
                    Categoria categoria = new Categoria();
                    categoria.setId(resultado.getInt("cd_categoria"));
                    categoria.setNome(resultado.getString("nm_categoria"));
                    categoria.setDescricao(resultado.getString("ds_categoria"));
                    categoria.setAcessibilidade(resultado.getString("fl_acessibilidade"));
                    return categoria;
                }
            }

        } catch (SQLException e) {
            throw new RuntimeException("Erro ao buscar categoria.", e);
        }

        return null;
    }

    public void atualizar(Categoria categoria) {
        String sql = "UPDATE tb_categoria SET " +
                "nm_categoria = ?, " +
                "ds_categoria = ?, " +
                "fl_acessibilidade = ? " +
                "WHERE cd_categoria = ?";

        try (Connection conexao = dataSource.getConnection();
             PreparedStatement comando = conexao.prepareStatement(sql)) {

            comando.setString(1, categoria.getNome());
            comando.setString(2, categoria.getDescricao());
            comando.setString(3, categoria.getAcessibilidade());
            comando.setInt(4, categoria.getId());

            comando.executeUpdate();

        } catch (SQLException e) {
            throw new RuntimeException("Erro ao atualizar categoria.", e);
        }
    }

    public boolean excluir(int id) {
        String sql = "DELETE FROM tb_categoria WHERE cd_categoria = ?";

        try (Connection conexao = dataSource.getConnection();
             PreparedStatement comando = conexao.prepareStatement(sql)) {

            comando.setInt(1, id);

            return comando.executeUpdate() > 0;

        } catch (SQLException e) {
            throw new RuntimeException("Erro ao excluir categoria.", e);
        }
    }
}
