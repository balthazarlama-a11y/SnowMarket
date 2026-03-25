-- SnowMarket: Tipos enumerados
-- Categorias taxativas de productos de esqui

DO $$ BEGIN
  CREATE TYPE product_category AS ENUM (
    'esquis',
    'botas',
    'ropa_de_esqui',
    'cascos',
    'antiparras',
    'otros_accesorios'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('user', 'admin');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
