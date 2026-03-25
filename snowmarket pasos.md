# SnowMarket - Documento unico de ejecucion para agente de IA

## Objetivo general
Implementar de punta a punta la infraestructura backend y la logica de negocio de SnowMarket (marketplace de productos de esqui y arriendo de departamentos), usando Next.js App Router + Supabase PostgreSQL + RLS + Server Actions, manteniendo el frontend existente.

## Alcance funcional obligatorio
- Dominio 1: `Departamentos` (publicacion y mutacion solo admin).
- Dominio 2: `Productos de esqui` (publicacion por usuarios autenticados y admin).
- Subdominio: `Productos verificados` (solo admin).
- Contacto comercial via enlaces `wa.me` con logica contextual por tipo de entidad.
- Autorizacion robusta por RBAC + RLS a nivel de base de datos.

## Restricciones obligatorias del agente (no negociables)
- No inventar ni simular secretos.
- Solicitar explicitamente variables de entorno antes de cualquier implementacion funcional:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (solo si aplica por fase administrativa)
- No hardcodear claves ni escribir secretos en logs.
- No tocar el frontend existente salvo integracion estrictamente necesaria con backend.
- Usar esquema declarativo para base de datos en `supabase/schemas/`.
- Generar migraciones con `supabase db diff` (sin mutaciones ad-hoc no versionadas).
- RLS obligatorio en tablas publicas.
- Validar payloads de mutacion con esquemas (Zod) antes de escribir en DB.
- No crear `api/` REST tradicional si la arquitectura puede resolverse con RSC + Server Actions.

## Orden de ejecucion estricto y dependencias
1. **Fase 0 - Preparacion y validacion de entorno** (bloqueante para todo).
2. **Fase 1 - Modelo de datos declarativo** (depende de Fase 0).
3. **Fase 2 - Seguridad RLS/RBAC** (depende de Fase 1).
4. **Fase 3 - Capa de acceso a datos y Server Actions** (depende de Fase 2).
5. **Fase 4 - Motor de enlaces WhatsApp** (depende de Fase 3).
6. **Fase 5 - Panel admin y proteccion de rutas** (depende de Fase 3 y Fase 4).
7. **Fase 6 - Validacion final y checklist de cumplimiento** (depende de todas las fases previas).

No se permite saltar fases ni mezclar entregables fuera de orden.

---

## Fase 0 - Preparacion y validacion de entorno
### Objetivo
Confirmar precondiciones tecnicas y obtener credenciales reales antes de codificar.

### Tareas concretas
- Revisar estructura actual del repo y detectar puntos de integracion con frontend existente.
- Solicitar variables de entorno requeridas (sin inventarlas).
- Confirmar stack activo (Next.js App Router, TypeScript, Supabase).
- Proponer plan de archivos y esperar aprobacion humana.

### Criterios de aceptacion
- El operador entrega variables reales o confirma cuales faltan.
- El agente presenta plan de implementacion por archivos y dependencias.
- Existe aprobacion explicita del plan antes de modificar codigo funcional.

### Salida esperada
- Documento/respuesta con plan de ejecucion aprobado.
- Lista de archivos objetivo por fase.
- Estado de variables de entorno confirmado.

---

## Fase 1 - Base de datos y esquemas declarativos
### Objetivo
Definir el estado deseado de base de datos en forma declarativa y versionable.

### Tareas concretas
- Crear/actualizar esquemas SQL declarativos en `supabase/schemas/`.
- Modelar tabla `public.users`:
  - `id` UUID FK a `auth.users(id)` con `ON DELETE CASCADE`.
  - `email`.
  - `role` (default `user`).
- Implementar funcion + trigger PL/pgSQL para sincronizar inserciones de `auth.users` hacia `public.users`.
- Modelar tabla `public.products`:
  - UUID, title, description, price `NUMERIC(10,2)` con `CHECK price >= 0`.
  - `category` con `ENUM` taxonomico.
  - `images` (`TEXT[]` o equivalente definido).
  - `owner_id` FK a `public.users(id)`.
  - `whatsapp_number`.
  - `is_verified BOOLEAN DEFAULT false`.
  - indices en `owner_id` e `is_verified`.
- Modelar tabla `public.properties`:
  - UUID, title, description, price, images, created_at.
  - `location`.
  - `created_by` FK a `public.users(id)`.
  - `whatsapp_contact` del admin.
- Generar diff de migracion con `supabase db diff` (ejecutado por operador si corresponde al flujo local).

### Criterios de aceptacion
- Esquema declarativo completo y coherente con reglas de negocio.
- Integridad referencial validada (FKs, cascadas, constraints).
- Migracion incremental generada sin SQL manual fuera de control de versiones.

### Salida esperada
- Archivos SQL en `supabase/schemas/`.
- Archivo de migracion generado por `supabase db diff`.
- Evidencia de tablas: `users`, `products`, `properties`.

---

## Fase 2 - Seguridad: RLS + RBAC
### Objetivo
Blindar operaciones de lectura/mutacion desde la base de datos con politicas criptograficas.

### Tareas concretas
- Habilitar RLS en:
  - `public.users`
  - `public.products`
  - `public.properties`
- Definir politicas RLS con SQL puro:
  - `users`: lectura publica, update solo propietario.
  - `products`: lectura publica.
  - Insercion usuario normal: `owner_id = (SELECT auth.uid())` y `is_verified = false`.
  - Insercion/edicion admin: claim JWT `app_metadata.role = admin`.
  - Mutaciones `products`: propietario o admin.
  - `properties`: mutaciones solo admin.
- Usar `app_metadata` (no `user_metadata`) para rol admin.
- Optimizar `auth.uid()` y claims con subconsultas tipo `(SELECT auth.uid())`.

### Criterios de aceptacion
- Todas las tablas publicas tienen RLS activo.
- Usuario anonimo o normal no puede mutar `properties`.
- Usuario normal no puede publicar `products` con `is_verified = true`.
- Admin puede operar productos verificados y propiedades segun reglas.

### Salida esperada
- SQL de politicas RLS versionado.
- Matriz de autorizacion verificada (tabla x operacion x actor).
- Pruebas manuales o automatizadas de casos permitidos/denegados.

---

## Fase 3 - Capa de acceso a datos (Server Actions)
### Objetivo
Implementar lectura y mutacion backend sin exponer API REST innecesaria.

### Tareas concretas
- Configurar cliente Supabase SSR con `@supabase/ssr` y cookies de servidor.
- Crear utilidades de cliente de servidor en `lib/` o `utils/`.
- Crear `actions/` con `"use server"` para:
  - crear/editar/eliminar productos (segun rol/permisos).
  - crear/editar/eliminar propiedades (solo admin).
- Integrar validaciones Zod en payloads antes de mutar DB.
- Estandarizar respuestas de error tipificadas para UI.

### Criterios de aceptacion
- Las mutaciones solo ocurren via Server Actions tipadas.
- Validacion rechaza payloads invalidos sin golpear DB cuando corresponda.
- RLS aplica correctamente al contexto de sesion (cookies/JWT).

### Salida esperada
- Archivos en `actions/` y utilidades Supabase SSR.
- Esquemas Zod para payloads criticos.
- Casos de prueba o validacion de errores tipificados.

---

## Fase 4 - Sistema de enrutamiento WhatsApp
### Objetivo
Generar enlaces de contacto robustos, sanitizados y contextuales.

### Tareas concretas
- Implementar modulo utilitario (`lib/` o `utils/`) para WhatsApp.
- Validar telefonos chilenos con regex:
  - `^(\\+?56)?\\s?0?9\\s?\\d{8}$`
- Sanitizar telefono con `str.replace(/\\D/g, '')`.
- Implementar `generateWhatsAppLink(...)` con:
  - telefono limpio
  - nombre articulo
  - precio
  - tipologia (`product_user`, `product_verified`, `property`)
- Construir mensaje contextual por tipologia y codificar con `encodeURIComponent`.
- Regla de enrutamiento:
  - producto usuario -> numero del vendedor.
  - producto verificado/departamento -> numero oficial admin.
- Crear pruebas unitarias para casos validos e invalidos.

### Criterios de aceptacion
- Enlace final cumple formato `https://wa.me/<numero>?text=<mensaje_codificado>`.
- Entradas maliciosas o invalidas fallan de forma controlada.
- No se filtran numeros o secretos fuera del flujo autorizado.

### Salida esperada
- Modulo de WhatsApp y funciones de validacion/sanitizacion.
- Tests unitarios del generador de links.
- Ejemplos de salida por cada tipologia.

---

## Fase 5 - Panel admin y control de rutas protegidas
### Objetivo
Habilitar operacion administrativa segura para activos de alto valor.

### Tareas concretas
- Crear ruta protegida tipo `(admin)/dashboard`.
- Implementar middleware que valide sesion y claim admin en `app_metadata`.
- Redireccionar no-admin a `/` con respuesta adecuada (por ejemplo 307).
- Implementar formularios admin para:
  - alta/edicion de `properties`.
  - alta/edicion de `products` verificados.
- Integrar subida de imagenes a Supabase Storage antes de persistir filas.
- Encapsular flujos de subida + mutacion en bloques `try/catch`.

### Criterios de aceptacion
- Usuario no admin no accede al panel ni muta inventario admin.
- Flujo de subida de imagen + persistencia funciona de extremo a extremo.
- Errores de red/Storage no rompen aplicacion y muestran estado controlado.

### Salida esperada
- Middleware de autorizacion.
- Rutas/segmentos admin protegidos.
- Formularios conectados a Server Actions.
- Integracion de Storage para imagenes.

---

## Fase 6 - Cierre tecnico y checklist de cumplimiento
### Objetivo
Verificar cumplimiento total del documento y dejar evidencia de estado final.

### Tareas concretas
- Ejecutar checklist fase por fase contra este documento.
- Confirmar que no hubo violaciones de restricciones.
- Validar casos clave de negocio:
  - usuario normal no publica propiedades.
  - usuario normal no verifica productos.
  - admin controla productos verificados y propiedades.
  - enlaces WhatsApp enrutan segun tipologia.
- Documentar pendientes, riesgos y mejoras futuras.

### Criterios de aceptacion
- Checklist 100% trazable contra fases y restricciones.
- Sin secretos expuestos ni hardcodeados.
- Sin cambios destructivos sobre frontend no autorizados.

### Salida esperada
- Reporte final de cumplimiento.
- Lista de pendientes no bloqueantes.
- Recomendaciones para siguiente iteracion.

---

## Reglas de negocio resumidas (fuente de verdad operativa)
- **Departamentos**: escritura solo admin; contacto siempre al WhatsApp admin.
- **Productos no verificados**: usuario autenticado gestiona solo los suyos.
- **Productos verificados**: gestion admin; contacto al WhatsApp admin.
- **RBAC**: roles inmutables (`user`, `admin`) evaluados con `app_metadata`.
- **RLS**: seguridad obligatoria en capa DB para toda mutacion.

## Matriz minima de autorizacion (referencia)
| Tabla | Operacion | Actor | Condicion |
|---|---|---|---|
| `public.users` | SELECT | Publico | `true` |
| `public.users` | UPDATE | Propietario | `(SELECT auth.uid()) = id` |
| `public.products` | INSERT | User | `owner_id = (SELECT auth.uid()) AND is_verified = false` |
| `public.products` | INSERT/UPDATE/DELETE | Admin | `(SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'` |
| `public.properties` | INSERT/UPDATE/DELETE | Admin | `(SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'` |

## Anexo: fuentes de referencia
- https://vercel.com/templates/supabase
- https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs
- https://supabase.com/features/declarative-schemas
- https://supabase.com/docs/guides/local-development/declarative-database-schemas
- https://supabase.com/docs/guides/database/postgres/row-level-security
- https://supabase.com/features/role-based-access-control
- https://supabase.com/docs/guides/auth/managing-user-data
- https://faq.whatsapp.com/5913398998672934