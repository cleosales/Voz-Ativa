package br.com.vozativa.vozativa.service;

import org.springframework.stereotype.Service;
import br.com.vozativa.vozativa.dao.CategoriaDao;
import br.com.vozativa.vozativa.dao.OcorrenciaDao;
import br.com.vozativa.vozativa.exception.RegraNegocioException;
import br.com.vozativa.vozativa.exception.RecursoNaoEncontradoException;
import br.com.vozativa.vozativa.model.Categoria;
import br.com.vozativa.vozativa.model.Ocorrencia;

import java.util.ArrayList;

@Service
public class CategoriaService {

    private final CategoriaDao categoriaDao;
    private final OcorrenciaDao ocorrenciaDao;

    public CategoriaService(
            CategoriaDao categoriaDao,
            OcorrenciaDao ocorrenciaDao) {

        this.categoriaDao = categoriaDao;
        this.ocorrenciaDao = ocorrenciaDao;
    }

    public int cadastrar(Categoria categoria) {
        return categoriaDao.cadastrar(categoria);
    }

    public ArrayList<Categoria> listar() {
        return categoriaDao.listar();
    }

    public Categoria buscarPorId(int id) {
        return categoriaDao.buscarPorId(id);
    }

    public ArrayList<Ocorrencia> listarOcorrencias(int categoriaId) {

        if (categoriaDao.buscarPorId(categoriaId) == null) {
            throw new RecursoNaoEncontradoException(
                    "Categoria não encontrada."
            );
        }

        return ocorrenciaDao.listarPorCategoria(categoriaId);
    }

    public void atualizar(Categoria categoria) {
        categoriaDao.atualizar(categoria);
    }

    public boolean excluir(int id) {

        if (ocorrenciaDao.existeOcorrenciaPorCategoria(id)) {
            throw new RegraNegocioException(
                    "Não é possível excluir esta categoria, pois existem ocorrências vinculadas a ela."
            );
        }

        return categoriaDao.excluir(id);
    }
}
