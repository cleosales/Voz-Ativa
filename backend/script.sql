
-- =========================================
-- VOZATIVA - SCRIPT DE CRIACAO DO BANCO
-- FIAP - GLOBAL SOLUTION 2026/2
-- =========================================

-- =========================================
-- 1. SEQUENCIAS
-- =========================================

CREATE SEQUENCE sq_tb_categoria
    START WITH 1
    INCREMENT BY 1
    NOCACHE;

CREATE SEQUENCE sq_tb_ocorrencia
    START WITH 1
    INCREMENT BY 1
    NOCACHE;

CREATE SEQUENCE sq_tb_atualizacao
    START WITH 1
    INCREMENT BY 1
    NOCACHE;

-- =========================================
-- 2. TABELA DE CATEGORIAS
-- =========================================

CREATE TABLE tb_categoria (
                              cd_categoria NUMBER PRIMARY KEY,
                              nm_categoria VARCHAR2(100) NOT NULL,
                              ds_categoria VARCHAR2(255),
                              fl_acessibilidade CHAR(1) DEFAULT 'N'
                                  CHECK (fl_acessibilidade IN ('S', 'N'))
);

-- =========================================
-- 3. TABELA DE OCORRENCIAS
-- =========================================

CREATE TABLE tb_ocorrencia (
                               cd_ocorrencia NUMBER PRIMARY KEY,
                               cd_categoria NUMBER NOT NULL,
                               nm_bairro VARCHAR2(100) NOT NULL,
                               ds_local VARCHAR2(200) NOT NULL,
                               ds_ocorrencia VARCHAR2(500) NOT NULL,
                               fl_afeta_acessibilidade CHAR(1) NOT NULL
                                   CHECK (fl_afeta_acessibilidade IN ('S', 'N')),
                               st_ocorrencia VARCHAR2(20) NOT NULL
        CHECK (st_ocorrencia IN (
            'ABERTA',
            'EM_ANALISE',
            'EM_ANDAMENTO',
            'RESOLVIDA'
        )),
                               nr_urgencia NUMBER(1) NOT NULL
        CHECK (nr_urgencia BETWEEN 1 AND 3),
                               dt_abertura TIMESTAMP NOT NULL,

                               CONSTRAINT fk_ocorrencia_categoria
                                   FOREIGN KEY (cd_categoria)
                                       REFERENCES tb_categoria(cd_categoria)
);

-- =========================================
-- 4. TABELA DE ATUALIZACOES
-- =========================================

CREATE TABLE tb_atualizacao (
                                cd_atualizacao NUMBER PRIMARY KEY,
                                cd_ocorrencia NUMBER NOT NULL,
                                ds_atualizacao VARCHAR2(500) NOT NULL,
                                st_novo VARCHAR2(20) NOT NULL
        CHECK (st_novo IN (
            'ABERTA',
            'EM_ANALISE',
            'EM_ANDAMENTO',
            'RESOLVIDA'
        )),
                                dt_atualizacao TIMESTAMP NOT NULL,

                                CONSTRAINT fk_atualizacao_ocorrencia
                                    FOREIGN KEY (cd_ocorrencia)
                                        REFERENCES tb_ocorrencia(cd_ocorrencia)
);

-- =========================================
-- FIM DO SCRIPT
-- =========================================
