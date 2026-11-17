
package br.com.vozativa.vozativa.service;

import br.com.vozativa.vozativa.dao.OcorrenciaDao;
import br.com.vozativa.vozativa.dao.CategoriaDao;
import br.com.vozativa.vozativa.model.Ocorrencia;
import br.com.vozativa.vozativa.exception.RecursoNaoEncontradoException;
import br.com.vozativa.vozativa.exception.RegraNegocioException;

import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class OcorrenciaService {

    private final OcorrenciaDao ocorrenciaDao;
    private final CategoriaDao categoriaDao;

    public OcorrenciaService(
            OcorrenciaDao ocorrenciaDao,
            CategoriaDao categoriaDao) {

        this.ocorrenciaDao = ocorrenciaDao;
        this.categoriaDao = categoriaDao;
    }

    public int cadastrar(Ocorrencia ocorrencia) {

        if (categoriaDao.buscarPorId(ocorrencia.getCategoriaId()) == null) {
            throw new RecursoNaoEncontradoException(
                    "A categoria informada não foi encontrada."
            );
        }

        validarUrgencia(ocorrencia.getUrgencia());

        return ocorrenciaDao.cadastrar(ocorrencia);
    }

    public ArrayList<Ocorrencia> listar() {
        return ocorrenciaDao.listar();
    }

    public Ocorrencia buscarPorId(int id) {
        return ocorrenciaDao.buscarPorId(id);
    }

    public void atualizar(Ocorrencia ocorrencia) {

        if (ocorrenciaDao.buscarPorId(ocorrencia.getId()) == null) {
            throw new RecursoNaoEncontradoException(
                    "Ocorrência não encontrada."
            );
        }

        if (categoriaDao.buscarPorId(ocorrencia.getCategoriaId()) == null) {
            throw new RecursoNaoEncontradoException(
                    "A categoria informada não foi encontrada."
            );
        }

        validarUrgencia(ocorrencia.getUrgencia());

        ocorrenciaDao.atualizar(ocorrencia);
    }

    public boolean excluir(int id) {
        return ocorrenciaDao.excluir(id);
    }

    private void validarUrgencia(Integer urgencia) {

        if (urgencia == null || urgencia < 1 || urgencia > 3) {
            throw new RegraNegocioException(
                    "A urgência deve ser um número entre 1 e 3."
            );
        }
    }
    public ArrayList<Ocorrencia> listarPorCategoria(int categoriaId) {

        if (categoriaDao.buscarPorId(categoriaId) == null) {
            throw new RecursoNaoEncontradoException(
                    "Categoria não encontrada."
            );
        }

        return ocorrenciaDao.listarPorCategoria(categoriaId);
    }
}
