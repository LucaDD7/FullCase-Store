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
    const { formData, amount, customer } = await req.json();
    const accessToken = Deno.env.get("MERCADOPAGO_ACCESS_TOKEN");

    if (!accessToken) {
      throw new Error("MERCADOPAGO_ACCESS_TOKEN no configurado");
    }

    const paymentBody: Record<string, unknown> = {
      transaction_amount: Number(amount),
      token: formData.token,
      installments: Number(formData.installments ?? 1),
      payment_method_id: formData.paymentMethodId,
      payer: {
        email: formData.payerEmail || customer.email,
        identification: {
          type: formData.identificationType,
          number: formData.identificationNumber,
        },
      },
    };

    if (formData.issuerId) {
      paymentBody.issuer_id = Number(formData.issuerId);
    }

    const response = await fetch("https://api.mercadopago.com/v1/payments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-Idempotency-Key": crypto.randomUUID(),
      },
      body: JSON.stringify(paymentBody),
    });

    const payment = await response.json();

    if (payment.status === "approved") {
      return new Response(
        JSON.stringify({ success: true, paymentId: payment.id }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        success: false,
        status: payment.status,
        detail: payment.status_detail ?? "Pago no aprobado",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
