import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { amount, items, customer } = await req.json();
    const accessToken = Deno.env.get("MERCADOPAGO_ACCESS_TOKEN");

    if (!accessToken) {
      throw new Error("MERCADOPAGO_ACCESS_TOKEN no configurado");
    }

    const preferenceBody = {
      items: items.map((item: any) => ({
        id: item.id?.toString() ?? "item",
        title: item.name || item.title || "Producto",
        quantity: item.quantity || 1,
        unit_price: Number(item.price),
        currency_id: "UYU",
      })),
      payer: {
        name: customer.name,
        email: customer.email,
        address: { street_name: customer.address },
      },
      back_urls: {
        success: `${req.headers.get("origin") ?? ""}/checkout?status=success`,
        failure: `${req.headers.get("origin") ?? ""}/checkout?status=failure`,
        pending: `${req.headers.get("origin") ?? ""}/checkout?status=pending`,
      },
      auto_return: "approved",
    };

    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(preferenceBody),
    });

    const preference = await response.json();

    if (!preference.id) {
      throw new Error(preference.message ?? "Error creando preferencia");
    }

    return new Response(
      JSON.stringify({ preferenceId: preference.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
