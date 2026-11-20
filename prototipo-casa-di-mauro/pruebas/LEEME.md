# Pruebas de idiomas y moneda (Playwright)

Se corren desde esta carpeta con `node <archivo>`; necesitan `playwright` con Chromium instalado.

- `run_scen.cjs <ancho> <salida.json> [shots]` recorre Inicio, Alojamiento, Escapadas, Grupos, Pizzería, modales y Rayén en es, en y pt; guarda cadenas visibles, montos, errores de consola y desborde horizontal. Con `shots` toma capturas en `CDM_CAPS` (por defecto `./capturas/`, debe existir).
- `analyze.cjs <salida.json>` busca palabras españolas en en/pt y compara los montos entre idiomas.
- `t_usd.cjs` prueba la referencia en dólares, el tipo de cambio (mindicador.cl simulado, caché de 6 h, timeout, `CDM_CONFIG.usdClp`).
- `t_state.cjs` prueba que cambiar de idioma no pierde el estado y el orden `?lang=` > localStorage > navigator.language.
- `humo_t.cjs`, `humo_t8.cjs`, `humo_g1.cjs`, `e4b.cjs`: pruebas de humo anteriores, forzadas a `?lang=es`. `e4b.cjs` reemplaza a `e4.js`, que usaba selectores de una pantalla de comidas anterior.
