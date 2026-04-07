-- SnowMarket: Tipos enumerados
-- Categorias taxativas de productos de esqui y snowboard

DO $$ BEGIN
  CREATE TYPE product_category AS ENUM (
    'esquis',
    'botas',
    'ropa_de_esqui',
    'cascos',
    'antiparras',
    'otros_accesorios',
    'snowboard',
    'botas_snowboard'
    'bastones'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Bases que ya tenían el enum sin snowboard (PG 15+: IF NOT EXISTS)
ALTER TYPE product_category ADD VALUE IF NOT EXISTS 'snowboard';
ALTER TYPE product_category ADD VALUE IF NOT EXISTS 'botas_snowboard';
ALTER TYPE product_category ADD VALUE IF NOT EXISTS 'bastones';

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('user', 'admin');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;