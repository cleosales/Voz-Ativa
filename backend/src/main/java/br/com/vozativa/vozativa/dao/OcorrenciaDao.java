
package br.com.vozativa.vozativa.dao;

import br.com.vozativa.vozativa.model.Ocorrencia;
import javax.sql.DataSource;
import org.springframework.stereotype.Repository;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.ResultSet;
import java.util.ArrayList;

@Repository
public class OcorrenciaDao {

    private final DataSource dataSource;

    public OcorrenciaDao(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    public int cadastrar(Ocorrencia ocorrencia) {
        String sqlId = "SELECT sq_tb_ocorrencia.NEXTVAL FROM dual";

        String sql = "INSERT INTO tb_ocorrencia " +
                "(cd_ocorrencia, cd_categoria, nm_bairro, ds_local, " +
                "ds_ocorrencia, fl_afeta_acessibilidade, st_ocorrencia, " +
                "nr_urgencia, dt_abertura) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try (Connection conexao = dataSource.getConnection()) {

            int id;

            try (PreparedStatement comandoId = conexao.prepareStatement(sqlId);
                 ResultSet resultado = comandoId.executeQuery()) {

                resultado.next();
                id = resultado.getInt(1);
            }

            try (PreparedStatement comando = conexao.prepareStatement(sql)) {

                comando.setInt(1, id);
                comando.setInt(2, ocorrencia.getCategoriaId());
                comando.setString(3, ocorrencia.getBairro());
                comando.setString(4, ocorrencia.getLocal());
                comando.setString(5, ocorrencia.getDescricao());
                comando.setString(6, ocorrencia.getAfetaAcessibilidade());
                comando.setString(7, ocorrencia.getStatus());
                comando.setInt(8, ocorrencia.getUrgencia());
                comando.setTimestamp(9,
                        java.sql.Timestamp.valueOf(ocorrencia.getDataAbertura()));

                comando.executeUpdate();
            }

            ocorrencia.setId(id);
            return id;

        } catch (SQLException e) {
            throw new RuntimeException("Erro ao cadastrar ocorrência.", e);
        }
    }

    public ArrayList<Ocorrencia> listar() {
        ArrayList<Ocorrencia> ocorrencias = new ArrayList<>();
        String sql = "SELECT * FROM tb_ocorrencia";

        try (Connection conexao = dataSource.getConnection();
             PreparedStatement comando = conexao.prepareStatement(sql);
             ResultSet resultado = comando.executeQuery()) {

            while (resultado.next()) {
                Ocorrencia ocorrencia = new Ocorrencia();

                ocorrencia.setId(resultado.getInt("cd_ocorrencia"));
                ocorrencia.setCategoriaId(resultado.getInt("cd_categoria"));
                ocorrencia.setBairro(resultado.getString("nm_bairro"));
                ocorrencia.setLocal(resultado.getString("ds_local"));
                ocorrencia.setDescricao(resultado.getString("ds_ocorrencia"));
                ocorrencia.setAfetaAcessibilidade(
                        resultado.getString("fl_afeta_acessibilidade"));
                ocorrencia.setStatus(resultado.getString("st_ocorrencia"));
                ocorrencia.setUrgencia(resultado.getInt("nr_urgencia"));
                ocorrencia.setDataAbertura(
                        resultado.getTimestamp("dt_abertura").toLocalDateTime());

                ocorrencias.add(ocorrencia);
            }

        } catch (SQLException e) {
            throw new RuntimeException("Erro ao listar ocorrências.", e);
        }

        return ocorrencias;
    }

    public Ocorrencia buscarPorId(int id) {
        String sql = "SELECT * FROM tb_ocorrencia WHERE cd_ocorrencia = ?";

        try (Connection conexao = dataSource.getConnection();
             PreparedStatement comando = conexao.prepareStatement(sql)) {

            comando.setInt(1, id);

            try (ResultSet resultado = comando.executeQuery()) {
                if (resultado.next()) {
                    Ocorrencia ocorrencia = new Ocorrencia();

                    ocorrencia.setId(resultado.getInt("cd_ocorrencia"));
                    ocorrencia.setCategoriaId(resultado.getInt("cd_categoria"));
                    ocorrencia.setBairro(resultado.getString("nm_bairro"));
                    ocorrencia.setLocal(resultado.getString("ds_local"));
                    ocorrencia.setDescricao(resultado.getString("ds_ocorrencia"));
                    ocorrencia.setAfetaAcessibilidade(
                            resultado.getString("fl_afeta_acessibilidade"));
                    ocorrencia.setStatus(resultado.getString("st_ocorrencia"));
                    ocorrencia.setUrgencia(resultado.getInt("nr_urgencia"));
                    ocorrencia.setDataAbertura(
                            resultado.getTimestamp("dt_abertura").toLocalDateTime());

                    return ocorrencia;
                }
            }

        } catch (SQLException e) {
            throw new RuntimeException("Erro ao buscar ocorrência.", e);
        }

        return null;
    }

    public void atualizar(Ocorrencia ocorrencia) {
        String sql = "UPDATE tb_ocorrencia SET " +
                "cd_categoria = ?, " +
                "nm_bairro = ?, " +
                "ds_local = ?, " +
                "ds_ocorrencia = ?, " +
                "fl_afeta_acessibilidade = ?, " +
                "st_ocorrencia = ?, " +
                "nr_urgencia = ? " +
                "WHERE cd_ocorrencia = ?";

        try (Connection conexao = dataSource.getConnection();
             PreparedStatement comando = conexao.prepareStatement(sql)) {

            comando.setInt(1, ocorrencia.getCategoriaId());
            comando.setString(2, ocorrencia.getBairro());
            comando.setString(3, ocorrencia.getLocal());
            comando.setString(4, ocorrencia.getDescricao());
            comando.setString(5, ocorrencia.getAfetaAcessibilidade());
            comando.setString(6, ocorrencia.getStatus());
            comando.setInt(7, ocorrencia.getUrgencia());
            comando.setInt(8, ocorrencia.getId());

            comando.executeUpdate();

        } catch (SQLException e) {
            throw new RuntimeException("Erro ao atualizar ocorrência.", e);
        }
    }

    public boolean excluir(int id) {
        String sql = "DELETE FROM tb_ocorrencia WHERE cd_ocorrencia = ?";

        try (Connection conexao = dataSource.getConnection();
             PreparedStatement comando = conexao.prepareStatement(sql)) {

            comando.setInt(1, id);

            return comando.executeUpdate() > 0;

        } catch (SQLException e) {
            throw new RuntimeException("Erro ao excluir ocorrência.", e);
        }
    }

    public boolean existeOcorrenciaPorCategoria(int categoriaId) {
        String sql = "SELECT COUNT(*) FROM tb_ocorrencia WHERE cd_categoria = ?";

        try (Connection conexao = dataSource.getConnection();
             PreparedStatement comando = conexao.prepareStatement(sql)) {

            comando.setInt(1, categoriaId);

            try (ResultSet resultado = comando.executeQuery()) {
                if (resultado.next()) {
                    return resultado.getInt(1) > 0;
                }
            }

        } catch (SQLException e) {
            throw new RuntimeException(
                    "Erro ao verificar ocorrências da categoria.", e);
        }

        return false;
    }
    public ArrayList<Ocorrencia> listarPorCategoria(int categoriaId) {

        ArrayList<Ocorrencia> ocorrencias = new ArrayList<>();

        String sql = "SELECT * FROM tb_ocorrencia WHERE cd_categoria = ?";

        try (Connection conexao = dataSource.getConnection();
             PreparedStatement comando = conexao.prepareStatement(sql)) {

            comando.setInt(1, categoriaId);

            try (ResultSet resultado = comando.executeQuery()) {

                while (resultado.next()) {

                    Ocorrencia ocorrencia = new Ocorrencia();

                    ocorrencia.setId(resultado.getInt("cd_ocorrencia"));
                    ocorrencia.setCategoriaId(resultado.getInt("cd_categoria"));
                    ocorrencia.setBairro(resultado.getString("nm_bairro"));
                    ocorrencia.setLocal(resultado.getString("ds_local"));
                    ocorrencia.setDescricao(resultado.getString("ds_ocorrencia"));
                    ocorrencia.setAfetaAcessibilidade(
                            resultado.getString("fl_afeta_acessibilidade"));
                    ocorrencia.setStatus(resultado.getString("st_ocorrencia"));
                    ocorrencia.setUrgencia(resultado.getInt("nr_urgencia"));
                    ocorrencia.setDataAbertura(
                            resultado.getTimestamp("dt_abertura").toLocalDateTime());

                    ocorrencias.add(ocorrencia);
                }
            }

        } catch (SQLException e) {
            throw new RuntimeException(
                    "Erro ao listar ocorrências por categoria.", e);
        }

        return ocorrencias;
    }
}
