# Benchmark de sitios de alojamiento — para dimauro.cl

Fecha: 2026-11-18. Dueño y decisor: Mauro. Solo investigación, no se construyó nada.

**Cómo se hizo y límites (honestidad):** leí el texto público de cada página con una herramienta de lectura. No vi capturas, no probé el flujo con fechas reales y no pude confirmar si son "responsive". Lo que cada página NO muestra en su texto está marcado "no visible"; puede existir dentro del motor de reservas, que carga después de elegir fechas. Todo lo demás es **no verificado en vivo**. Los precios no los pude leer en ninguna.

## 1. Sitios revisados

### A. Hostal Compass del Sur — Puerto Varas (Chile, sur) — https://www.compassdelsur.cl/?lang=en
- **Reserva y pago:** menú "Reserve" y botones "Book" llevan a un motor externo (parece FrontDesk Master, por el dominio). Mensaje de venta directo: "mejor precio que en todos los canales". Por búsqueda aparte: acepta pesos chilenos y transferencia, y cobra 19 % de IVA a quien paga en dólares (fuente de buscador, no verificado en la página).
- **Habitaciones y precios:** agrupa por tipo de baño (privado/compartido) y luego por tamaño (single … sextuple, dormitorio mixto máx. 5, camping máx. 4). Precios: no visibles en la página.
- **Menú:** Inicio, Conocer el hostal, Contacto y mapa, Reservar, Excursiones (6 paseos), idiomas.
- **Copiar:** frase "reserva directa = mejor precio"; agrupar por tipo de baño (es lo que el huésped chileno/mochilero compara); excursiones como contenido que vende; WhatsApp y teléfono visibles.
- **Evitar:** motor en otro dominio (se pierde la marca y el pago queda fuera de tu control); no mostrar precio ni política antes del motor.

### B. Refugio Chaltén — El Chaltén (Argentina, Patagonia) — https://elchalten.com/refugiochalten/en/
- **Reserva y pago:** botón "Booking request" arriba que abre formulario (solicitud, no reserva instantánea), "Send a query", WhatsApp con mensaje prellenado y teléfono con clic para llamar. Texto: "pide directo, evita intermediarios y comisiones". Pago, depósito y cancelación: no visibles.
- **Habitaciones y precios:** solo 2 tipos (compartida de 4 con literas, privada de 2). Sin precios ("la tarifa más accesible"; consultar).
- **Estructura:** Bienvenida, Resumen, El hostal, Servicios, Opiniones, Reglas, Reserva, Ubicación, Cómo llegar, Información útil. Español/inglés.
- **Copiar:** una sola página larga y simple, reglas y cómo llegar dentro de la misma página, acciones móviles (llamar/WhatsApp), idioma ES/EN.
- **Evitar:** sin precios ni condiciones claras; el huésped tiene que preguntar. Reserva solo por solicitud = la mitad abandona.

### C. Viva Chile Hostal — Puerto Varas (Chile) — https://viva-chile-hostal.loslagoshoteles.com/en/
- **Reserva y pago:** widget "Book Your Stay": fechas, adultos (hasta 20), niños con edad, botón "Check rooms & rates". Antes de elegir fechas dice "selecciona fechas para ver habitaciones disponibles". Máximo 30 noches. Selector de moneda incluye CLP. Cancelación/cambios por formulario de contacto; depósito y medios de pago: no visibles.
- **Habitaciones y precios:** pocas habitaciones con nombre (King, Doble pequeña, Queen baño privado); precio recién aparece tras buscar fechas; la FAQ da un "desde $38" sin moneda ni unidad (ambiguo, **evitar**).
- **Datos útiles:** check-in 15:00–22:00, check-out 08:00–12:00, visibles en la página.
- **Copiar:** widget de fechas+personas arriba, mensaje de estado vacío claro, horarios de llegada visibles, moneda CLP.
- **Evitar:** precio sin moneda ni "por noche"; cancelar por formulario de contacto (no hay autoservicio).

### D. Generator (internacional, referencia) — https://staygenerator.com/
- **Reserva:** buscador "¿Dónde quieres quedarte?" + "Check availability", lema "Reserva directo, mejores precios", campaña (Black Friday: desayuno, late checkout, 15 % en comida), moneda y 7 idiomas, términos de reserva enlazados. En celular parece haber barra de reserva fija ("StickyFormGroup" en el código; comportamiento no verificado).
- **Habitaciones:** precios en la moneda elegida con aviso de tipo de cambio; no pude ver dormitorio vs privada en el texto.
- **Menú:** Destinos, Ofertas, Explorar, Grupos, Blog, FAQ, Gift vouchers.
- **Copiar:** beneficio concreto por reservar directo (no solo "mejor precio": desayuno/late checkout), selector de moneda con aviso, FAQ visible, términos enlazados desde la reserva.
- **Evitar:** nada de su escala (destinos múltiples, blog, vouchers) hace falta para una sola hostería.

### Descartados por no aportar: Hotel Licán Ray (https://hotellicanray.cl/)
Sin motor de reservas: teléfono, correo e Instagram; sin precios; "políticas internas" sin visibilidad. Sirve como **ejemplo de lo que evitar**: el huésped no puede reservar ni pagar a las 11 de la noche.

## 2. Patrón común (lo que el mercado hace)
1. "Reserva directo" como promesa, pero casi nadie muestra precio ni política antes del motor.
2. Nadie visible cobra por su propio canal: motor externo o formulario manual. **Pago inmediato propio con Flow sería diferenciador** en la zona.
3. Tipos de habitación agrupados claro (privada/compartida/baño) y WhatsApp siempre a mano.

## 3. Lo que ya existe y se reutiliza (verificado en el repositorio atiende-app, 18-nov)
- Pagos Flow: rama `claude/turismo-pagos-flow-69be4e` y `pagos-t24-merge`. Archivos: `lib/pagos/flowPasarela.ts`, `pagosOnlineService.ts`, `pasarela.ts`, `credencialesPasarela.ts`, página `app/pago/[ref]/page.tsx`, rutas `api/pagos/flow/[clienteId]/confirmacion` y `retorno`, `lib/flow/flowClient.ts` y `firma.ts`. Commits recientes: cuenta Flow sandbox para pruebas, nunca con `FLOW_ENV=production`.
- Motor de alojamiento: `docs/arquitectura_unidades_alojamiento.md` (modelo de "unidades": cabañas, habitaciones, domos; tarifas por temporada, fotos, amenities). **Ojo:** ese documento dice "diseño pendiente de aprobación"; ESTADO.md dice alojamiento ~88 % código / ~40 % producción. Cuál rige: no verificado, hay que leer el código antes de construir.
- Decisiones abiertas de ESTADO_PROYECTO (ESTADO §4 punto 5): correo del huésped antes del link, pre-reserva 24→48 h. Ahora Mauro quiere pago por Flow desde la pre-reserva: eso cierra la discusión de "transferencia + link manual".

## 4. Recomendación única para dimauro.cl

### Estructura (una sola página larga + 2 páginas, pensada para celular)
1. **Inicio (una página con scroll):** foto grande + barra fija de reserva (llegada, salida, personas → "Ver disponibilidad"); promesa "reserva directo: mejor precio + [beneficio concreto que defina Mauro]"; tarjetas de habitaciones con foto, capacidad, **precio "desde $X por noche" en CLP**; servicios; ubicación y cómo llegar; opiniones; reglas y horarios (check-in/out); preguntas frecuentes; WhatsApp y llamar fijos abajo.
2. **Habitación (/habitaciones/[nombre]):** galería, camas, baño privado/compartido, amenities, precio por temporada, calendario de disponibilidad, botón "Reservar".
3. **Reserva (/reservar):** el flujo de abajo.
4. Footer con políticas (cancelación, términos), contacto, idiomas ES (EN después).

### Flujo de reserva con Flow (uno solo, sin menús A/B)
1. Elige fechas y personas → ve solo habitaciones disponibles con **total en CLP** (noches × tarifa de temporada) y las condiciones a la vista.
2. Elige habitación → datos del huésped (nombre, correo, WhatsApp, hora de llegada).
3. **Pre-reserva:** la unidad queda bloqueada **un tiempo corto (propuesta: 30 min mientras paga)** y se crea el cobro.
4. **Paga con Flow ahí mismo** (monto a definir: anticipo o total; ver preguntas). Retorno a una página de confirmación.
5. Confirmación automática por correo y WhatsApp con código de reserva, política de cancelación y cómo llegar; la reserva queda "confirmada" solo cuando Flow confirma por callback.
6. Si no paga a tiempo, se libera la unidad y se envía un recordatorio con el link.
7. El panel de Mauro ve la reserva y el estado de pago; cancelación y devolución al inicio manual por Mauro.

### Qué copiar y qué evitar en una línea
- **Copiar:** barra de reserva fija, precio total CLP visible desde la tarjeta, horarios y políticas visibles, WhatsApp, "reserva directo = beneficio".
- **Evitar:** motor en otro dominio, precio ambiguo, reserva "por solicitud" sin pago, políticas escondidas.

### Qué se reutiliza
Motor de unidades y tarifas de atiende-app y el núcleo de pagos Flow; el sitio de dimauro.cl sería el front público que los consume. Falta confirmar en el código si el motor ya expone disponibilidad y precio públicos (no verificado).

## 5. Preguntas para Mauro antes de construir (solo las que cambian el plan)
1. ¿Cobrar **total** o **anticipo** (p. ej. 30–50 %) con Flow al reservar?
2. ¿Política de cancelación y devolución (plazos)? Hoy sería manual.
3. ¿Cuántas habitaciones, fotos y precios por temporada hay ya cargados, y quién los entrega?
4. ¿El sitio vive solo en dimauro.cl con su propia base o consume el backoffice de Atiende? (Recomiendo consumir Atiende para no duplicar.)
5. ¿Beneficio concreto por reservar directo (desayuno, descuento)?

## 6. Dominio (solo anotado, no se tocó)
Cuando se publique: Mauro apunta dimauro.cl al hosting que se elija (registro A/CNAME que entregue el proveedor). No verificado dónde está hoy el DNS ni quién lo administra.

## 7. Reglas que se respetan
Flow solo en sandbox hasta orden de Mauro; sin SQL en producción; sin claves ni tokens en archivos; sin envíos a terceros.
