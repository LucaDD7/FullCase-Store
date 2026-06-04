# Configuración de Mercado Pago - Guía de implementación

## ✅ Pasos completados:
1. ✓ Instalada librería de Mercado Pago (@mercadopago/sdk-js)
2. ✓ Creado componente MercadoPagoPayment con formulario de tarjeta
3. ✓ Integrado en página de Checkout con flujo de dos pasos
4. ✓ Agregado resumen de orden

## 📝 Pasos que debes completar:

### 1. Crear cuenta en Mercado Pago (si no la tienes)
- Ve a: https://www.mercadopago.com.uy
- Haz click en "Crear cuenta"
- Completa el registro (necesitas documento de identidad)

### 2. Obtener tu clave pública
- Ve a: https://www.mercadopago.com.uy/developers/panel/credentials
- Copia tu "Clave Pública" (comienza con `APP_USR_`)
- Actualiza el archivo `.env`:
```
VITE_MERCADOPAGO_PUBLIC_KEY=APP_USR_xxxxxxxxxxxxxxxx
```

### 3. Actualizar tabla en Supabase
Ve a tu proyecto de Supabase y asegúrate que la tabla `orders` tenga estas columnas:
- customer_name (text)
- customer_email (text)
- customer_address (text)
- total (numeric)
- items (jsonb)
- payment_id (text) - para guardar el ID del método de pago
- payment_status (text) - estado del pago
- created_at (timestamp with timezone)

Puedes ejecutar esto en el SQL Editor de Supabase:
```sql
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_id text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status text;
```

### 4. Probar con tarjetas de prueba
Usa estas tarjetas en modo test:
- **Visa válida**: 4111 1111 1111 1111
- **Mastercard válida**: 5500 0555 0000 0004
- Mes/Año: Cualquier fecha futura
- CVC: Cualquier número de 3 dígitos

### 5. Reiniciar el servidor
```bash
npm run dev
```

### 6. Flujo de prueba
1. Agrega un producto al carrito
2. Ve a carrito y haz click en "Finalizar compra"
3. Completa: Nombre, Email, Dirección
4. Haz click en "Continuar con el pago"
5. Rellena los datos de la tarjeta de prueba
6. Haz click en "Pagar"

## 🚀 Para producción
Para procesar pagos reales en Uruguay:
1. Verifica tu cuenta en Mercado Pago (documentación, datos bancarios)
2. Cambia de modo "test" a "producción" en el panel
3. Usa tu clave pública de producción en `.env`
4. Implementa webhooks para confirmaciones de pago
5. Activa métodos de pago locales (débito, tarjetas, efectivo)

## 📚 Documentación
- Docs de Mercado Pago: https://www.mercadopago.com.uy/developers/es/docs
- Panel de Mercado Pago: https://www.mercadopago.com.uy/developers/panel

