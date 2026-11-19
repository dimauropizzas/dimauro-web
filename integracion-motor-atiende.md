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
