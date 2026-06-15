import { useEffect, useRef, useState } from "react";
import { supabase } from "../supabaseClient";
import "./MercadoPagoPayment.css";

function MercadoPagoPayment({ cartTotal, cart, customer, onSuccess, onError }) {
  const [brickLoaded, setBrickLoaded] = useState(false);
  const [error, setError] = useState("");
  const brickControllerRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    const loadBrick = async () => {
      if (!window.MercadoPago) {
        await new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://sdk.mercadopago.com/js/v2";
          script.async = true;
          script.onload = resolve;
          script.onerror = () => reject(new Error("Error cargando el SDK de Mercado Pago"));
          document.body.appendChild(script);
        });
      }

      const { data, error: fnError } = await supabase.functions.invoke("create-mp-preference", {
        body: { amount: cartTotal, items: cart, customer },
      });

      if (cancelled) return;

      if (fnError || !data?.preferenceId) {
        const detail = fnError?.message || data?.error || "sin detalles";
        console.error("create-mp-preference falló:", { fnError, data });
        setError(`Error al crear preferencia: ${detail}`);
        onError("Error al crear preferencia de pago");
        return;
      }

      const mp = new window.MercadoPago(import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY, {
        locale: "es-UY",
      });
      const bricksBuilder = mp.bricks();

      const settings = {
        initialization: {
          amount: cartTotal,
          preferenceId: data.preferenceId,
        },
        customization: {
          paymentMethods: {
            ticket: "all",
            bankTransfer: "all",
            creditCard: "all",
            debitCard: "all",
            mercadoPago: "all",
          },
          visual: {
            hideFormTitle: true,
            style: {
              theme: "default",
            },
          },
        },
        callbacks: {
          onReady: () => {
            if (!cancelled) setBrickLoaded(true);
          },
          onSubmit: async ({ formData }) => {
            const { data: paymentData, error: payError } = await supabase.functions.invoke(
              "process-mp-payment",
              { body: { formData, amount: cartTotal, customer } }
            );

            if (payError || !paymentData?.success) {
              const msg =
                paymentData?.detail ||
                "El pago no fue aprobado. Verificá los datos de tu tarjeta.";
              setError(msg);
              onError(msg);
              return;
            }

            onSuccess(paymentData.paymentId.toString());
          },
          onError: (err) => {
            console.error("Payment Brick error:", err);
            if (!cancelled) {
              setError("Error en el formulario de pago. Intentá de nuevo.");
            }
          },
        },
      };

      brickControllerRef.current = await bricksBuilder.create(
        "payment",
        "mp-payment-brick-container",
        settings
      );
    };

    loadBrick().catch((err) => {
      if (!cancelled) {
        setError(err.message || "Error al cargar el pago");
        onError(err.message);
      }
    });

    return () => {
      cancelled = true;
      if (brickControllerRef.current) {
        brickControllerRef.current.unmount();
        brickControllerRef.current = null;
      }
    };
  }, []);

  return (
    <div className="mp-brick-wrapper">
      {!brickLoaded && !error && (
        <div className="text-center py-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-2 text-muted">Cargando métodos de pago...</p>
        </div>
      )}
      {error && <div className="alert alert-danger">{error}</div>}
      <div id="mp-payment-brick-container" />
    </div>
  );
}

export default MercadoPagoPayment;
