// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const { order, items, customer } = await req.json();
  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

  const itemsHtml = items
    .map(
      (item: { name: string; model: string; quantity: number; price: number }) =>
        `<tr>
          <td style="padding:8px;border:1px solid #ddd">${item.name}</td>
          <td style="padding:8px;border:1px solid #ddd">${item.model}</td>
          <td style="padding:8px;border:1px solid #ddd;text-align:center">${item.quantity}</td>
          <td style="padding:8px;border:1px solid #ddd">$${item.price}</td>
        </tr>`
    )
    .join("");

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
      <div style="background:#111;padding:20px;text-align:center">
        <h1 style="color:#fff;margin:0">FullCase</h1>
      </div>
      <div style="padding:32px">
        <h2>¡Gracias por tu compra, ${customer.name}!</h2>
        <p>Tu pedido fue recibido y está siendo procesado.</p>
        <table style="width:100%;border-collapse:collapse;margin:20px 0">
          <thead>
            <tr style="background:#f5f5f5">
              <th style="padding:8px;border:1px solid #ddd;text-align:left">Producto</th>
              <th style="padding:8px;border:1px solid #ddd;text-align:left">Modelo</th>
              <th style="padding:8px;border:1px solid #ddd;text-align:center">Cantidad</th>
              <th style="padding:8px;border:1px solid #ddd;text-align:left">Precio</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
        </table>
        <p style="font-size:1.2rem"><strong>Total pagado: $${order.total}</strong></p>
        <p style="color:#666">Se enviará a: ${customer.address}</p>
        <p>Ante cualquier consulta escribinos por <a href="https://wa.me/59891902046">WhatsApp</a>.</p>
      </div>
      <div style="background:#f5f5f5;padding:16px;text-align:center;color:#999;font-size:0.8rem">
        © 2026 FullCase Store — Uruguay
      </div>
    </div>
  `;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "FullCase <noreply@fullcase.uy>",
      to: customer.email,
      subject: "✅ Confirmación de tu pedido - FullCase",
      html,
    }),
  });

  return new Response(JSON.stringify({ ok: res.ok }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
