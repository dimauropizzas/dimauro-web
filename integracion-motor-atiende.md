# Integración del motor de reservas de Atiende con la web de Casa Di Mauro

Revisión hecha sobre `dimauropizzas/atiende-app` (commit 124a1b3), solo lectura. Un análisis automático leyó el código y yo comprobé a mano tres puntos clave: la API pública de cupos, la exclusión de choques en cupos y la exclusión de choques en alojamiento. Lo demás viene del análisis y de la documentación del repo; está marcado.

## En una frase
Atiende ya tiene dos motores que no se hablan entre sí: **alojamiento por unidades** y **reservas por cupos**. Las experiencias de 3 horas encajan casi directo en cupos y ya tienen API pública. El alojamiento está maduro por dentro, pero **no tiene API pública**. Lo más grande que falta es **combinar alojamiento y experiencia en una sola reserva** y un **calendario unificado**.

## Qué sirve para cada venta de la web

| Venta de la web | Motor de Atiende | Estado |
|---|---|---|
| Habitaciones por noche (temporadas, abono, devolución) | Alojamiento por unidades | Maduro. Estimado ~88 % construido, ~55 % probado, ~40 % validado en producción (`docs/ESTADO_PROYECTO.md`). Sin API pública. |
| Experiencias de 3 h, 15 a 60 personas, 2 bloques | Cupos (sesiones y recursos) | Calza bien. Tiene API pública `/api/turismo/v1`. |
| Grupos por pasajero/noche, 1 liberado por cada 10 | Ninguno | No hay modelo. Hay que construirlo. |
| Escapadas (Navidad y Año Nuevo 4 noches, romántica 2) | Ninguno | No existe la entidad "paquete". Hay que construirla. |
| Alojamiento + experiencia en una reserva | Ninguno | Son dos sistemas con tablas, pagos y estados distintos. |

## Cómo evita que se choquen las reservas (verificado)
- **Alojamiento:** una restricción de base de datos (`reservas_sin_solape`) impide dos reservas sobre la misma unidad en fechas que se cruzan. Reservar es atómico y tiene clave de idempotencia. Según el informe del repo, 50 reservas simultáneas sobre una unidad dan exactamente una exitosa.
- **Cupos:** la restricción `cupo_recurso_sin_solape` impide dos sesiones solapadas en el mismo recurso. Para nosotros, **cada sector sería un recurso**, así caben dos grupos a la vez en un mismo bloque. Hay una prueba de doble reserva entre WhatsApp y web.
- Bloqueos manuales: alojamiento tiene `unidad_cierres`; cupos tiene ausencias de recursos y temporadas. Sirven para cerrar 24, 25 y 31 de diciembre y 1 de enero. (No verifiqué que exista una pantalla para crearlos.)

## Pagos
- **Cupos:** el abono admite porcentaje, monto por persona o monto fijo, así que el 50 % de las experiencias se configura. Hay webhook de Flow idempotente. Viene **apagado por defecto** y se enciende con una variable de entorno.
- **Alojamiento:** el abono admite porcentaje o número de noches (uno u otro). Hay webhook que reconfirma el pago con Flow antes de registrarlo. La documentación dice que **falta la prueba real con el entorno de pruebas de Flow**.
- Los tramos de devolución por horas están como tabla en cupos. En alojamiento están en una configuración y en código; hay que verificar que calcen con 72 h, 48 h y 24 h.

## Cómo la web consume el motor
- **Cupos:** existe `/api/turismo/v1` con actividades, disponibilidad, cotizar, reservar, pagar, cancelar y reprogramar. Se autentica con una credencial por negocio; el negocio sale de la credencial y el sitio no puede fijar total ni anticipo. Está pensado para llamarse **desde el servidor de la web**, no desde el navegador (CORS cerrado por defecto).
- **Alojamiento:** solo hay rutas internas con secreto. No hay API pública ni widget para reservar desde otro dominio.

## Dashboard
- Alojamiento: calendario, lista de reservas, pre-reservas por vencer, propuestas de cancelación, paneles de iCal y de pagos, creación manual con idempotencia.
- Cupos: agenda por día, carga rápida, cierre de día, calendario del mes, pagos.
- **No hay un calendario unificado** de habitaciones y experiencias. Hoy son dos módulos separados. Este es el dashboard que Mauro pide para que no se choquen.

## Brechas frente a lo que ya dejamos definido en la web
1. Mínimo 15 y máximo 60 por grupo, y que cada grupo ocupe un sector entero: por verificar en cupos.
2. Personas liberadas (1 por cada 10 pagadas): no existe. Los descuentos de cupos son porcentajes, no personas gratis. Hay que agregar la regla a la cotización.
3. Paquetes de noches fijas con fechas y comidas incluidas: no existen.
4. Grupos que pagan por pasajero y por noche: no existen.
5. Reserva combinada alojamiento + experiencia con un solo pago: no existe, es lo más pesado.
6. API pública de alojamiento: no existe.

## Propuesta en pasos
1. **Dar de alta Casa Di Mauro como negocio** en Atiende. Hoy no hay motor conectado: el tenant 45 es la pizzería y el alojamiento de prueba es el tenant 4. Existen además dos tenants de Casa Di Mauro (uno inactivo) sin auditar (`docs/PENDIENTES_ATIENDE.md`, TEN-01): no reutilizarlos ni tocarlos sin esa auditoría. Primero en staging.
2. **Experiencias primero** (camino más corto): dar de alta el negocio en cupos con 2 sectores como recursos, los 4 productos, el abono del 50 % y las fechas cerradas. La web llama a la API desde su servidor.
3. **Alojamiento:** construir una API pública equivalente (cotizar, disponibilidad, reservar, link de pago) sobre las funciones que ya existen, copiando el patrón de cupos.
4. **Paquetes y liberados:** tabla de paquetes y regla de liberados en la cotización de grupos.
5. **Unificar:** vista de calendario que lea ambos modelos y, después, la reserva combinada.
6. **Probar Flow real** en el entorno de pruebas, con el webhook, antes de abrir el 2 de diciembre.

## Riesgos
- Es producción de un cliente real sin prueba de punta a punta.
- Dos sistemas de pago y estados en paralelo.
- Queda abierto un hallazgo de seguridad documentado como S02 (lectura sin filtro con la credencial de servicio).
- La reapertura es el 2 de diciembre. **Decisión de Mauro: no se usa WhatsApp como respaldo del alojamiento; todo debe funcionar en la web.** Eso exige la API de alojamiento, los paquetes y la prueba real de Flow antes de esa fecha.

## Qué no hice
No modifiqué `atiende-app`. Solo lo clone para leerlo. Tampoco conecté la web con ninguna API.

## Decisiones de Mauro (19-nov)
- **Choques de fechas:** una estadía no puede cruzar las fechas de las escapadas de Navidad (noches 23 a 26 dic) ni de Año Nuevo (30 dic a 2 ene) salvo comprando la escapada. Ya funciona así en el prototipo.
- **Personas liberadas (1 por cada 10 pagados):** no entran al motor. Se cobra a todo el grupo y se descuentan del saldo al recibir a la delegación, en el local. En el prototipo ya figura como acotación con el monto.
- **Experiencias:** abono 50 % online y 50 % el día del evento en el local; bloques 13:00-16:00 y 18:00-21:00; 2 grupos por bloque; sin eventos 24, 25 y 31 dic y 1 ene.
- **Orden de construcción:** experiencias primero, luego API pública de alojamiento, paquetes de noches fijas, calendario unificado y prueba real de Flow antes del 2 de diciembre.
- **Regla de devolución (resuelto 19-nov):** se adopta la que Atiende ya tiene programada para Casa Di Mauro: abono de una noche; con 15 días o más de aviso se devuelve el 100 % del abono; con menos, o si no llega, no se devuelve; la dueña puede hacer una excepción si la fecha se revende. La web ya dice esto. Queda pendiente definir la devolución de las experiencias (hoy muestran la misma regla).
- **Pasarela de pago:** se probará con Flow o con Kipu, según lo que Mauro decida; Mauro tiene Kipu funcionando en otra página.

## Corrección
La primera versión de este informe decía que el tenant 45 era Casa Di Mauro alojamiento. Es la pizzería. Corregido arriba.

## Devolución de las experiencias (Mauro, 19-nov)
Con 72 horas o más de aviso se devuelve el 50 % del abono; con menos de 72 horas, el 25 %; sin aviso (menos de 1 hora antes) o si no llega, nada. Configurado en producción (negocio 50) y staging con `cupo_bo_politica_tramos_guardar` (tramos 72 h y 1 h). La web ya lo muestra. Interpretación mía: «hasta el día del evento» = hasta 1 hora antes del evento.

## Holgura (Mauro, 19-nov)
El 25 % de las experiencias rige hasta 30 minutos después de la hora de inicio; después, no show: no se devuelve. Aplicado en producción solo para el negocio 50 (columna `cancelacion_holgura_min`). Probado en staging: 80 h antes 50 %, 5 h antes 25 %, 20 min después 25 %, 40 min después 0.

## Experiencias en días distintos (Mauro, 19-nov)
Una delegación puede comprar 2 o más experiencias en días distintos dentro de su estadía: cada experiencia pide su propio día y horario (13:00-16:00 o 18:00-21:00). Dos experiencias del mismo grupo no pueden compartir día y horario. El día de salida está permitido (pendiente de confirmar con Mauro). La API combinada ya acepta una fecha y hora por experiencia.

## Capacidad de las experiencias (Mauro, 19-nov)
Casino Party 80, Pizza Libre 100, Pizza Party 100, Parrillada Party 50, Pizza Libre + Casino 80 (confirmado), todo por bloque. Varios grupos comparten el bloque mientras no superen la capacidad; la disponibilidad del sitio depende de cuántas personas ya hay y de si cabe el grupo. Un grupo sin alojamiento también puede reservar. Aplicado en producción como configuración.

## Entrada «solo experiencias» en Grupos y delegaciones (Mauro, 19-nov)
La pantalla de Grupos tiene un selector al inicio: «Alojamiento y experiencias» (grupos de 15 a 24, la capacidad de la casa) o «Solo experiencias, sin alojamiento» (de 15 hasta el máximo de cada experiencia: Casino 80, Pizza Libre 100, Pizza Party 100, Pizza Libre + Casino 80, Parrillada 50). Cada experiencia se apaga si el grupo la supera. Sin alojamiento el día puede ser cualquiera de la temporada (4-dic al 31-mar, salvo 24/25-dic, 31-dic y 1-ene). Pendiente: conectar esta pantalla a la API real de experiencias y a su cobro.

## Orden del flujo de experiencias (Mauro, 19-nov)
Cantidad de personas (se puede escribir a mano, de 15 al tope) -> día -> disponibilidad de cada experiencia y bloque para ESE grupo -> elegir. Si el bloque no alcanza para el grupo, el sitio dice «Hay lugar para hasta N personas» (si N >= 15) o «Sin cupo para tu grupo», y siempre ofrece escribir por WhatsApp (a veces se puede acomodar un grupo más pequeño). Varias experiencias en días distintos: se cambia el día y se elige otra. Nota: el sitio muestra cuántas personas caben cuando el bloque está parcialmente lleno; la API real oculta los cupos (`mostrar_cupos` = false), así que al conectar hay que decidir si se muestran.

## Cantidad primero (Mauro, 19-nov)
El campo «Personas del grupo» parte vacío y sin texto debajo. Si escriben una cifra mayor a lo que recibimos, el sitio muestra las capacidades por evento (y la de alojamiento) con enlace a WhatsApp; menos de 15: «Atendemos grupos desde 15 personas». Sin número no se ve el calendario de alojamiento ni la disponibilidad de experiencias ni se puede reservar. Si ese día ningún bloque alcanza para el grupo: «No tenemos cupo… escríbenos por WhatsApp».

## Menos de 15 y textos mínimos (Mauro, 19-nov)
Botón «Solo experiencias». Un grupo de menos de 15 solo puede reservar en un día y horario donde ya haya otro grupo confirmado de la MISMA experiencia (regla aplicada en el motor). El sitio muestra texto solo cuando hace falta: el campo del día está apagado hasta escribir el número, y los avisos (cupo parcial, sin cupo, WhatsApp) aparecen solo si corresponden.

## Días para grupos de menos de 15 (Mauro, 19-nov)
Con menos de 15 personas el sitio dice que solo se puede reservar los días en que ya hay otro grupo de esa experiencia, y lista esos días (con experiencia y horario) como botones tocables; muchas veces vienen 4 o 5 días y se pueden adaptar. Si no hay ninguno, manda a WhatsApp. Al conectar con la base real, esos días salen de las sesiones con reservas confirmadas que suman 15 o más y a las que el grupo todavía le cabe.

## Flujo final de experiencias en Grupos (Mauro, 19-nov)
Cantidad de personas -> experiencia -> día/disponibilidad. Sin explicar la regla de menos de 15: el grupo chico solo ve, para la experiencia elegida, los días en que puede sumarse (botones) y, al tocar uno, los horarios disponibles; si no hay fechas, aviso corto con WhatsApp. Para 15 o más: calendario del día con los dos horarios, capacidad y cupos restantes. Se pueden elegir varias experiencias en días distintos.

## Experiencias de grupo conectadas a los cupos reales (19/11/2026)
- El sitio (`index.html`) trae el modo en vivo de experiencias: con `CDM_CONFIG.keyExp` (la credencial `web` de EXPERIENCIAS, distinta de la de alojamiento) consulta `GET /api/turismo/v1/disponibilidad` (una llamada por experiencia y tamaño de grupo, ventana de 120 días), reserva con `POST /reservas` (una línea por experiencia, categoría `persona`, `Idempotency-Key`) y pide el pago del abono con `POST /reservas/:id/pago` (`{email, urlRetorno}` → `{urlPago}`), igual que alojamiento. Con `keyExp` vacío todo sigue en demostración.
- La disponibilidad ya respeta el mínimo por evento: `docs/cdm_exp_06_disponibilidad_minimo.sql` (staging y producción). Un grupo de menos de 15 ve `hay` solo en las sesiones con 15 o más personas confirmadas; la respuesta trae `confirmados`.
- Solo el modo «Solo experiencias» reserva y cobra en vivo. En «Alojamiento y experiencias» el alojamiento de delegaciones (por pasajero y noche, habitación compartida) aún no existe en el motor: con la llave puesta, el botón envía la solicitud por WhatsApp.
- Al volver del pago (`?pago=exp`) el sitio consulta la reserva y muestra confirmada o «estamos confirmando tu pago».

## Idiomas y moneda (20/11/2026)
- **Idiomas del sitio:** español (por defecto), inglés y portugués de Brasil, con selector `ES · EN · PT` arriba a la derecha. Idioma inicial: `?lang=` en la URL, luego `localStorage` (`cdm_lang`), luego `navigator.language`, y si no es es/en/pt, español. Cambiar de idioma re-dibuja todo sin recargar y no pierde la reserva en curso (habitaciones elegidas, fechas, comidas, grupo, experiencias, lo escrito en los formularios). Actualiza `<html lang>`, `<title>`, `<meta name="description">` y la URL (`?lang=`).
- **Cómo está hecho:** un solo `index.html`. Diccionario `D.es / D.en / D.pt` (453 claves) y `t(clave, vars)`; el HTML estático usa `data-i18n`, `data-i18n-html` y `data-i18n-attr`; los textos generados por JS usan `t()`. Fechas con `Intl.DateTimeFormat` (horarios en zona `America/Santiago`) y números con el separador del idioma. En es se ve `$28.000`; en en/pt se antepone `CLP` (`CLP $28.000`) para que no se confunda con dólares o reales. Un texto nuevo se agrega con `K('clave', es, en, pt)` y se usa con `t('clave')`.
- **Glosario fijo** (en / pt): media pensión = half board / meia pensão; pensión completa = full board / pensão completa; escapada = getaway / escapada; box lunch = packed lunch (box lunch) / lanche para levar (box lunch); alojamiento con desayuno = bed & breakfast / hospedagem com café da manhã; delegaciones = groups and delegations / grupos e delegações; experiencias = experiences / experiências. Casino Party, Pizza Libre, Pizza Party, Parrillada Party y «Rayén» no se traducen; cada experiencia lleva una descripción breve traducida (copia nueva, también en español: Mauro debe aprobarla).
- **Moneda:** el precio es siempre en CLP y se cobra en CLP. Selector `CLP | USD`: en USD cada monto muestra al lado `≈ US$ 52` y una nota («Se cobra en pesos chilenos (CLP); el valor en dólares es referencial») con el tipo de cambio y su fuente en la franja superior, en cada resumen y en el pago de demostración. Tipo de cambio: `CDM_CONFIG.usdClp` (por defecto 950, configurable); con USD activo consulta `https://mindicador.cl/api/dolar` (`serie[0].valor`) con timeout de 3,5 s, cachea 6 h en `localStorage` (`cdm_fx`) y, si falla, usa la constante. Redondeo: dólares enteros; con 2 decimales bajo US$ 10.
- **Políticas y errores:** las traducciones (política de cancelación y devolución del abono, devolución de experiencias, persona liberada, retención de la reserva de 90 minutos, no show y los mensajes de error de las APIs de alojamiento y experiencias) llevan en en/pt la nota «Traducción informativa; en caso de diferencia prevalece el texto en español.». Están marcadas `REVISIÓN LEGAL PENDIENTE` en el HTML y en el diccionario: las debe revisar Mauro (o su asesor legal) antes de publicar.
- **Mensajes de WhatsApp:** los textos prellenados de los enlaces `wa.me` salen en el idioma del visitante, con el nombre de la experiencia, las fechas y el tamaño del grupo. Ojo: el equipo que los lee debe poder entender inglés y portugués.
- **Rayén:** se traducen el botón, el saludo y las 5 preguntas frecuentes. El idioma elegido viaja en `#chat[data-lang]`, en `window.CDM_LANG` y en el evento `cdm:lang`, y el enlace a WhatsApp del asistente abre con un mensaje inicial que dice el idioma. No se cambió el backend de Rayén: queda pendiente que el widget real lea `CDM_LANG`.
- **Imágenes:** los afiches siguen en español; en en/pt la ficha agrega «Includes / Inclui» en texto traducido y una nota de que el afiche está en español. La ventana de reinauguración suma su detalle traducido bajo la imagen.
- **SEO:** `<link rel="alternate" hreflang>` para `es`, `en`, `pt-BR` y `x-default`, y `<meta name="description">` por idioma. Las URLs son relativas (`./?lang=en`) porque el dominio definitivo (dimauro.cl o dimauropizzas.cl) aún no está definido: al publicar hay que reemplazarlas por URLs absolutas.
- **Pendientes:** revisión legal de las traducciones; qué IVA/exención corresponde a turistas extranjeros que pagan en CLP (hoy no se calcula ni se muestra); confirmar con Mauro que mindicador.cl es una fuente aceptable para el tipo de cambio referencial y qué valor fijo (`usdClp`) conviene dejar de respaldo; los afiches (imágenes) en inglés y portugués; el selector de fecha nativo (`<input type="date">`) se muestra en el idioma del navegador, no en el del sitio.
- **Ojo (ya existía):** la nota de la Escapada romántica dice viernes y sábado $180.000, domingo a jueves $170.000 y +$18.000 en temporada alta, pero el cálculo cobra $205.000, $195.000 y +$24.000 por habitación. No se tocó; Mauro debe confirmar cuál es la correcta.
- **Pruebas y capturas:** las pruebas de Playwright quedaron en `prototipo-casa-di-mauro/pruebas/` (ver `LEEME.md`): recorrido en es/en/pt a 360 y 390 px, búsqueda de palabras españolas en en/pt, montos idénticos entre idiomas, USD y tipo de cambio, y que cambiar de idioma no pierde el estado. Capturas móviles en `informes/capturas-idiomas-2026-11-20/`.
