-- Schema do banco de dados PostgreSQL para o app de controle de dieta
-- Execute este script para criar todas as tabelas necessárias

-- Tabela de alimentos (catálogo de alimentos)
CREATE TABLE IF NOT EXISTS alimentos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL UNIQUE,
    calorias_por_100g DECIMAL(10, 2) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    unidade VARCHAR(20) NOT NULL DEFAULT 'g',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índice para busca rápida de alimentos
CREATE INDEX IF NOT EXISTS idx_alimentos_nome ON alimentos(nome);
CREATE INDEX IF NOT EXISTS idx_alimentos_categoria ON alimentos(categoria);

-- Tabela de usuários (identificados por deviceId)
CREATE TABLE IF NOT EXISTS usuarios (
    device_id VARCHAR(255) PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de metas do usuário
CREATE TABLE IF NOT EXISTS metas (
    id SERIAL PRIMARY KEY,
    device_id VARCHAR(255) NOT NULL REFERENCES usuarios(device_id) ON DELETE CASCADE,
    calorias INTEGER NOT NULL DEFAULT 1600,
    agua INTEGER NOT NULL DEFAULT 4000,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(device_id)
);

-- Tabela de refeições
CREATE TABLE IF NOT EXISTS refeicoes (
    id BIGSERIAL PRIMARY KEY,
    device_id VARCHAR(255) NOT NULL REFERENCES usuarios(device_id) ON DELETE CASCADE,
    data DATE NOT NULL,
    tipo VARCHAR(50) NOT NULL, -- 'cafe_manha', 'almoco', 'lanche', 'jantar', etc
    calorias_total DECIMAL(10, 2) DEFAULT 0,
    notas TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para refeições
CREATE INDEX IF NOT EXISTS idx_refeicoes_device_data ON refeicoes(device_id, data);
CREATE INDEX IF NOT EXISTS idx_refeicoes_data ON refeicoes(data);

-- Tabela de itens de refeição (alimentos dentro de uma refeição)
CREATE TABLE IF NOT EXISTS refeicao_itens (
    id BIGSERIAL PRIMARY KEY,
    refeicao_id BIGINT NOT NULL REFERENCES refeicoes(id) ON DELETE CASCADE,
    alimento_id INTEGER REFERENCES alimentos(id) ON DELETE SET NULL,
    alimento_nome VARCHAR(255) NOT NULL, -- Nome do alimento (caso alimento_id seja NULL)
    quantidade DECIMAL(10, 2) NOT NULL,
    unidade VARCHAR(20) NOT NULL,
    calorias DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índice para itens de refeição
CREATE INDEX IF NOT EXISTS idx_refeicao_itens_refeicao ON refeicao_itens(refeicao_id);

-- Tabela de registros de água
CREATE TABLE IF NOT EXISTS agua (
    id BIGSERIAL PRIMARY KEY,
    device_id VARCHAR(255) NOT NULL REFERENCES usuarios(device_id) ON DELETE CASCADE,
    data DATE NOT NULL,
    quantidade INTEGER NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para água
CREATE INDEX IF NOT EXISTS idx_agua_device_data ON agua(device_id, data);
CREATE INDEX IF NOT EXISTS idx_agua_data ON agua(data);

-- Tabela de perfil do usuário (perfil único por deviceId)
CREATE TABLE IF NOT EXISTS perfil (
    device_id VARCHAR(255) PRIMARY KEY REFERENCES usuarios(device_id) ON DELETE CASCADE,
    idade INTEGER,
    genero VARCHAR(20),
    altura DECIMAL(5, 2), -- em cm
    peso DECIMAL(5, 2), -- em kg
    atividade VARCHAR(50),
    objetivo VARCHAR(50),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de templates de refeições (refeições salvas como templates)
CREATE TABLE IF NOT EXISTS templates (
    id BIGSERIAL PRIMARY KEY,
    device_id VARCHAR(255) NOT NULL REFERENCES usuarios(device_id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    itens JSONB NOT NULL, -- Array de itens da refeição
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índice para templates
CREATE INDEX IF NOT EXISTS idx_templates_device ON templates(device_id);

-- Tabela de notas (notas gerais do usuário)
CREATE TABLE IF NOT EXISTS notas (
    id BIGSERIAL PRIMARY KEY,
    device_id VARCHAR(255) NOT NULL REFERENCES usuarios(device_id) ON DELETE CASCADE,
    titulo VARCHAR(255),
    conteudo TEXT,
    data DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índice para notas
CREATE INDEX IF NOT EXISTS idx_notas_device_data ON notas(device_id, data);

-- Tabela de peso (histórico de peso do usuário)
CREATE TABLE IF NOT EXISTS peso (
    id BIGSERIAL PRIMARY KEY,
    device_id VARCHAR(255) NOT NULL REFERENCES usuarios(device_id) ON DELETE CASCADE,
    data DATE NOT NULL,
    peso DECIMAL(5, 2) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índice para peso
CREATE INDEX IF NOT EXISTS idx_peso_device_data ON peso(device_id, data);

-- Tabela de conquistas
CREATE TABLE IF NOT EXISTS conquistas (
    id BIGSERIAL PRIMARY KEY,
    device_id VARCHAR(255) NOT NULL REFERENCES usuarios(device_id) ON DELETE CASCADE,
    tipo VARCHAR(100) NOT NULL, -- tipo da conquista
    data_conquista DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índice para conquistas
CREATE INDEX IF NOT EXISTS idx_conquistas_device ON conquistas(device_id);

-- Tabela de streaks (sequências de dias)
CREATE TABLE IF NOT EXISTS streaks (
    device_id VARCHAR(255) PRIMARY KEY REFERENCES usuarios(device_id) ON DELETE CASCADE,
    calorias INTEGER DEFAULT 0,
    agua INTEGER DEFAULT 0,
    ambas INTEGER DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at (usando IF NOT EXISTS através de DO)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_alimentos_updated_at') THEN
        CREATE TRIGGER update_alimentos_updated_at BEFORE UPDATE ON alimentos
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_usuarios_updated_at') THEN
        CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_metas_updated_at') THEN
        CREATE TRIGGER update_metas_updated_at BEFORE UPDATE ON metas
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_templates_updated_at') THEN
        CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON templates
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_notas_updated_at') THEN
        CREATE TRIGGER update_notas_updated_at BEFORE UPDATE ON notas
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_perfil_updated_at') THEN
        CREATE TRIGGER update_perfil_updated_at BEFORE UPDATE ON perfil
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_streaks_updated_at') THEN
        CREATE TRIGGER update_streaks_updated_at BEFORE UPDATE ON streaks
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

