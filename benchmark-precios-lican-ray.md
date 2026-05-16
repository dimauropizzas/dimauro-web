# Benchmark de precios de alojamiento — Licán Ray (para Casa Di Mauro)

Fecha: 2026-11-18. Decide Mauro. Solo investigación; no se cambió ningún precio en la web.

## Límites (léelos primero)
- No encontré NINGUNA tarifa publicada en pesos de un hostal de Licán Ray con desayuno para verano 2026-2027. Los portales (Booking, Atrápalo, Kayak, ReservarHotel) muestran "desde" en euros o dólares, sin fechas, de 1 noche para 2 adultos, casi sin decir si incluye desayuno.
- La mayoría de lo que sale son **cabañas con cocina**, no hostales con desayuno. Se comparan mal.
- Conversión a pesos con un cambio que supuse (≈ $950 por US$ y ≈ $1.080 por €). **No verificado**: cámbialo si el real es otro.
- Un portal de prueba de Booking (`app-aws-test`) fue bloqueado por el sistema de permisos; no lo usé.
- Todo es **no verificado en vivo**. Para cifras firmes hay que llamar o pedir cotización en las fechas exactas (ver "Qué hacer").

## Lo que encontré
| Alojamiento | Tipo | Precio fuente | ≈ en pesos/noche (2 pers.) | Desayuno |
|---|---|---|---|---|
| Hostal Eluney | hostal | desde €30 | ≈ $32.000 | no se indica |
| Cabañas Villangel | cabaña | US$36 | ≈ $34.000 | no se indica |
| Cabañas Mi Familia: loft 2 pers. | loft | $45.000 baja / $50.000 alta (CLP, sitio propio) | $45.000–50.000 | no se menciona |
| Cabañas Rapallo (9,7 en Booking) | cabaña | US$50 / €80 | ≈ $48.000–86.000 | no se indica |
| Hotel Licán Ray | hotel | desde €57 | ≈ $62.000 | no se indica |
| Cabañas Los Castaños | cabaña | US$60 / €50 | ≈ $54.000–57.000 | no se indica |
| Hostal Hofmann | hostal | desde €70 / US$60–75 | ≈ $57.000–76.000 | no se indica |
| Cabañas Puerta del Lago | cabaña | US$70–83 | ≈ $67.000–79.000 | no se indica |
| Cabañas Mi Familia: cabaña 4 pers. | cabaña | $60.000 baja / $100.000 alta (CLP) | $60.000–100.000 | no se menciona |
| Hostal Playa Grande, Cabañas Carolina | hostal/cabaña | sin precio | — | sí (desayuno diario / americano) |

Dato útil: el único precio en pesos que confirma estacionalidad (Mi Familia) sube **+11 %** en el loft (45→50) y **+67 %** en cabañas de 4 (60→100) de temporada baja a alta. Mínimo de estadía: 2 noches en baja y 5 en alta.

## Conclusión sobre los $35.000
- **$35.000 con desayuno queda en el piso del mercado**: al nivel del hostal más barato (Eluney, ≈ $32.000, sin desayuno declarado) y por debajo de casi todo lo demás (≈ $45.000–$75.000 por habitación o cabaña para 2). No es "valor de mercado": es agresivo.
- **$43.000 (35 + $8.000 de desayuno) sí se sostiene**: queda en la banda baja-media, en línea con el loft de $45.000–50.000 y bajo hostal Hofmann y hotel. Con baño privado, desayuno incluido y a pasos del lago, vendería bien.
- Temporada alta (a contar del 3 de enero): hoy matrimonial $45.000. Si la baja pasa a $43.000, la alta debería subir proporcionalmente (≈ $53.000 con los mismos +$8.000; el mercado sube entre +11 % y +67 %). La romántica ($180.000 / $170.000) y las escapadas de Navidad y Año Nuevo se calculan sobre estas tarifas.

## Inconsistencia que hay que resolver (importante)
- Grupos: **$28.000 por pasajero con desayuno** = $56.000 por habitación doble.
- Individual: matrimonial **$35.000 por habitación** (≈ $17.500 por persona).
- O sea, la misma pieza para 2 sale $56.000 si va en grupo y $35.000 si reserva solo. Subir la individual a $43.000 reduce la brecha, pero queda grande. Ojo: el descuento por volumen suele ser al revés.

## DECISIÓN DE MAURO (2026-11-18) — aplicada en el prototipo
- Piso $48.000 con desayuno (matrimonial, baja). Resto proporcional (×48/35, a miles): alta/año nuevo matrimonial $62.000/$82.000; twin $48.000/$62.000/$82.000 (igual a matrimonial); triple $70.000/$90.000/$120.000 (baja/alta/año nuevo).
- Pendiente: romántica ($180.000/$170.000) y tarifas de grupo ($28.000/$43.000/$56.000 por persona; 56.000 por doble ya incluye 2 desayunos). Los números de «Qué hacer» arriba quedaron superados por esto.

## Qué hacer (propuesta, nada aplicado)
1. Aprobar si baja pasa de $35.000 a $43.000 y cuánto sube alta/año nuevo (¿$53.000 y $68.000 con los mismos +$8.000?). Twin y triple también deberían ajustarse por el desayuno (+$8.000 por persona: twin +$16.000, triple +$24.000).
2. Decidir si la tarifa de grupo se mantiene en $28.000 por persona.
3. Para cifras firmes: pedir cotización por WhatsApp como cliente a 3–4 hostales (Eluney, Hofmann, Playa Grande, Hotel Licán Ray) para las fechas 10–12 de diciembre y 10–12 de enero, o revisar Booking con fechas reales y moneda CLP. Eso lo haces tú o me lo ordenas; no envío nada a nadie.

## Fuentes
- https://www.booking.com/city/cl/licanray.html (precios en US$ para 1 noche, 2 adultos, sin fechas)
- https://www.reservarhotel.com/chile/hoteles-en-lican-ray/ (precios "desde" en €)
- https://cabanasmifamilia.cl/ (CLP, baja/alta)
- https://www.atrapalo.cl/hoteles/america/chile/araucania/lican-ray/ (lista, sin precios)
- Búsquedas: Hostal Hofmann (planetofhotels, kayak), Hostal Eluney (kayak), momondo, expedia.
