package br.com.vozativa.vozativa.dao;

import br.com.vozativa.vozativa.model.Atualizacao;
import javax.sql.DataSource;
import org.springframework.stereotype.Repository;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.ResultSet;
import java.util.ArrayList;

@Repository
public class AtualizacaoDao {

    private final DataSource dataSource;

    public AtualizacaoDao(DataSource dataSource) {
        this.dataSource = dataSource;
    }


    public int cadastrar(Atualizacao atualizacao) {
        String sqlId = "SELECT sq_tb_atualizacao.NEXTVAL FROM dual";

        String sql = "INSERT INTO tb_atualizacao " +
                "(cd_atualizacao, cd_ocorrencia, ds_atualizacao, " +
                "st_novo, dt_atualizacao) " +
                "VALUES (?, ?, ?, ?, ?)";

        try (Connection conexao = dataSource.getConnection();
             PreparedStatement consultaId = conexao.prepareStatement(sqlId)) {

            int id;

            try (ResultSet resultado = consultaId.executeQuery()) {
                resultado.next();
                id = resultado.getInt(1);
            }

            try (PreparedStatement comando = conexao.prepareStatement(sql)) {
                comando.setInt(1, id);
                comando.setInt(2, atualizacao.getOcorrenciaId());
                comando.setString(3, atualizacao.getDescricao());
                comando.setString(4, atualizacao.getNovoStatus());
                comando.setTimestamp(5,
                        java.sql.Timestamp.valueOf(atualizacao.getDataAtualizacao()));

                comando.executeUpdate();
            }

            atualizacao.setId(id);
            return id;

        } catch (SQLException e) {
            throw new RuntimeException("Erro ao cadastrar atualização.", e);
        }
    }

    public ArrayList<Atualizacao> listarPorOcorrencia(int ocorrenciaId) {
        ArrayList<Atualizacao> atualizacoes = new ArrayList<>();

        String sql = "SELECT * FROM tb_atualizacao " +
                "WHERE cd_ocorrencia = ? " +
                "ORDER BY dt_atualizacao, cd_atualizacao";

        try (Connection conexao = dataSource.getConnection();
             PreparedStatement comando = conexao.prepareStatement(sql)) {

            comando.setInt(1, ocorrenciaId);

            try (ResultSet resultado = comando.executeQuery()) {
                while (resultado.next()) {
                    Atualizacao atualizacao = new Atualizacao();

                    atualizacao.setId(resultado.getInt("cd_atualizacao"));
                    atualizacao.setOcorrenciaId(resultado.getInt("cd_ocorrencia"));
                    atualizacao.setDescricao(resultado.getString("ds_atualizacao"));
                    atualizacao.setNovoStatus(resultado.getString("st_novo"));
                    atualizacao.setDataAtualizacao(
                            resultado.getTimestamp("dt_atualizacao").toLocalDateTime()
                    );

                    atualizacoes.add(atualizacao);
                }
            }

        } catch (SQLException e) {
            throw new RuntimeException("Erro ao listar atualizações.", e);
        }

        return atualizacoes;
    }
    public Atualizacao buscarPorId(int id) {
        String sql = "SELECT * FROM tb_atualizacao " +
                "WHERE cd_atualizacao = ?";

        try (Connection conexao = dataSource.getConnection();
             PreparedStatement comando = conexao.prepareStatement(sql)) {

            comando.setInt(1, id);

            try (ResultSet resultado = comando.executeQuery()) {
                if (resultado.next()) {
                    Atualizacao atualizacao = new Atualizacao();

                    atualizacao.setId(resultado.getInt("cd_atualizacao"));
                    atualizacao.setOcorrenciaId(resultado.getInt("cd_ocorrencia"));
                    atualizacao.setDescricao(resultado.getString("ds_atualizacao"));
                    atualizacao.setNovoStatus(resultado.getString("st_novo"));
                    atualizacao.setDataAtualizacao(
                            resultado.getTimestamp("dt_atualizacao").toLocalDateTime()
                    );

                    return atualizacao;
                }
            }

        } catch (SQLException e) {
            throw new RuntimeException("Erro ao buscar atualização.", e);
        }

        return null;
    }
    public void atualizar(Atualizacao atualizacao) {
        String sql = "UPDATE tb_atualizacao SET " +
                "ds_atualizacao = ?, " +
                "st_novo = ? " +
                "WHERE cd_atualizacao = ?";

        try (Connection conexao = dataSource.getConnection();
             PreparedStatement comando = conexao.prepareStatement(sql)) {

            comando.setString(1, atualizacao.getDescricao());
            comando.setString(2, atualizacao.getNovoStatus());
            comando.setInt(3, atualizacao.getId());

            comando.executeUpdate();

        } catch (SQLException e) {
            throw new RuntimeException("Erro ao atualizar atualização.", e);
        }
    }
    public boolean excluir(int id) {
        String sql = "DELETE FROM tb_atualizacao " +
                "WHERE cd_atualizacao = ?";

        try (Connection conexao = dataSource.getConnection();
             PreparedStatement comando = conexao.prepareStatement(sql)) {

            comando.setInt(1, id);

            int linhasExcluidas = comando.executeUpdate();

            return linhasExcluidas > 0;

        } catch (SQLException e) {
            throw new RuntimeException("Erro ao excluir atualização.", e);
        }
    }
}