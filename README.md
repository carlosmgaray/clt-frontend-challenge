# CLT Frontend Challenge

Catálogo de productos construido con Next.js, TypeScript y Redux. 
Consume la API pública de DummyJSON.

## Cómo correr el proyecto

### Requisitos
- Node.js >= 20.9.0
- npm

### Instalación y desarrollo

git clone https://github.com/carlosmgaray/clt-frontend-challenge
cd clt-frontend-challenge
npm install
npm run dev

Abrí http://localhost:3000 en el browser.

---

## Generación del proyecto

El proyecto fue inicializado con:

npx create-next-app@latest . --typescript --app --tailwind --eslint --src-dir

Dependencias adicionales instaladas:

npm install @reduxjs/toolkit react-redux axios

---

## Decisiones técnicas

### App Router vs Pages Router
Se eligió App Router por ser el estándar actual de Next.js. Implica que 
todo componente que use hooks de Redux necesita "use client" explícitamente. 
El Provider de Redux vive en src/app/providers.tsx separado del layout raíz, 
para que este último pueda seguir siendo Server Component.

### Redux Toolkit con thunks manuales vs RTK Query
El brief pide estados explícitos (idle/loading/succeeded/failed), así que 
se usó createAsyncThunk + createSlice en vez de RTK Query, que los abstrae 
automáticamente. Esto da control total sobre el ciclo de vida de cada request.

### Paginación: botón "Cargar más"
Se eligió botón "Cargar más" sobre infinite scroll con IntersectionObserver 
por ser más simple y tener menos superficie de bugs.

### Favoritos: normalización y persistencia
Los favoritos se guardan como Record<string, Product> (clave: id como string), 
lo que permite acceso O(1) para verificar si un producto es favorito. 
La persistencia usa localStorage via middleware de Redux — no dentro del 
reducer, que tiene que ser puro. El brief menciona AsyncStorage pero eso 
es de React Native; en web se usa localStorage.

### Pull to refresh
El brief lo pide como requisito pero es un patrón nativo de mobile que no 
tiene equivalente directo en web. Se implementó como un botón "Actualizar" 
que resetea el slice a idle y recarga desde la página 0.

### Fetch en detalle vs buscar en el store
La pantalla de detalle hace fetch directo a /products/{id} en vez de buscar 
en el store, porque el producto puede no estar cargado si el usuario llega 
por URL directa (link compartido, etc.).

### React Strict Mode y productos duplicados
En dev, React Strict Mode monta los componentes dos veces, lo que puede 
disparar fetchProducts dos veces. Se resolvió con dos capas:
- Guard if (status === "idle") en el useEffect evita el segundo dispatch
- El reducer deduplica por id al concatenar (page > 0), y reemplaza 
  directamente para page === 0

### ESLint: react-hooks/set-state-in-effect
eslint-config-next trae esta regla que no permite setState síncrono dentro 
de useEffect. Se resolvió inicializando loading en true desde el useState 
y moviendo setError(null) al .then() en vez del inicio del fetch.

### next/image vs img
Las imágenes vienen de cdn.dummyjson.com y next/image requiere declarar 
ese dominio en next.config.ts con remotePatterns. Para no agregar config 
extra fuera del scope de la prueba, se usó img plano con eslint-disable-next-line 
donde el linter lo marcaba. En un proyecto real convendría usar next/image 
para optimización automática (WebP, lazy loading, etc.).
