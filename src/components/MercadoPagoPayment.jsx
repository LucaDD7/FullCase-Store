import { useEffect, useRef, useState } from "react";
import "./MercadoPagoPayment.css";

function MercadoPagoPayment({ cartTotal, onSuccess, onError, loading }) {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState("");
  const cardFormRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    const initMercadoPago = () => {
      if (!window.MercadoPago) return;

      const mp = new window.MercadoPago(import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY);

      const cardForm = mp.cardForm({
        amount: cartTotal.toString(),
        autoMount: true,
        form: {
          id: "form-checkout",
          cardholderName: { id: "form-checkout_cardholderName" },
          cardholderEmail: { id: "form-checkout_cardholderEmail" },
          cardNumber: { id: "form-checkout_cardNumber", placeholder: "1234 5678 9012 3456" },
          expirationDate: { id: "form-checkout_expirationDate", placeholder: "MM/YY" },
          securityCode: { id: "form-checkout_securityCode", placeholder: "CVV" },
          installments: { id: "form-checkout_installments" },
          identificationType: { id: "form-checkout_identificationType" },
          identificationNumber: { id: "form-checkout_identificationNumber" },
          issuer: { id: "form-checkout_issuer" },
        },
        callbacks: {
          onFormMounted: (err) => {
            if (!mounted) return;
            if (err) {
              console.warn("Error montando el formulario:", err);
            } else {
              setIsReady(true);
            }
          },
          onSubmit: (event) => {
            event.preventDefault();
            const { token } = cardForm.getCardFormData();
            if (token) {
              onSuccess(token);
            } else {
              setError("No se pudo obtener el token de pago. Verificá los datos.");
              onError("Error al obtener token de pago");
            }
          },
          onError: (errors) => {
            if (!mounted) return;
            const msg = errors.map((e) => e.message).join(", ");
            setError(msg);
          },
        },
      });

      cardFormRef.current = cardForm;
    };

    if (window.MercadoPago) {
      initMercadoPago();
    } else {
      const script = document.createElement("script");
      script.src = "https://sdk.mercadopago.com/js/v2";
      script.async = true;
      script.onload = initMercadoPago;
      script.onerror = () => {
        if (!mounted) return;
        setError("Error cargando Mercado Pago");
        onError("Error cargando Mercado Pago");
      };
      document.body.appendChild(script);
    }

    return () => {
      mounted = false;
      if (cardFormRef.current) {
        cardFormRef.current.unmount();
        cardFormRef.current = null;
      }
    };
  }, []);

  return (
    <form id="form-checkout">
      <div className="mp-container">

        <div className="mb-3">
          <label htmlFor="form-checkout_cardholderName" className="form-label">
            Titular de la tarjeta
          </label>
          <input
            id="form-checkout_cardholderName"
            type="text"
            className="form-control"
            placeholder="Nombre completo"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="form-checkout_cardholderEmail" className="form-label">
            Email
          </label>
          <input
            id="form-checkout_cardholderEmail"
            type="email"
            className="form-control"
            placeholder="ejemplo@correo.com"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Número de tarjeta</label>
          <div id="form-checkout_cardNumber" className="form-control mp-iframe-field" />
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Vencimiento</label>
            <div id="form-checkout_expirationDate" className="form-control mp-iframe-field" />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">CVV</label>
            <div id="form-checkout_securityCode" className="form-control mp-iframe-field" />
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="form-checkout_identificationType" className="form-label">
            Tipo de documento
          </label>
          <select id="form-checkout_identificationType" className="form-select" />
        </div>

        <div className="mb-3">
          <label htmlFor="form-checkout_identificationNumber" className="form-label">
            Número de documento
          </label>
          <input
            id="form-checkout_identificationNumber"
            type="text"
            className="form-control"
            placeholder="Número de documento"
          />
        </div>

        {/* Campos ocultos requeridos por el SDK */}
        <select id="form-checkout_issuer" style={{ display: "none" }} />
        <select id="form-checkout_installments" style={{ display: "none" }} />

        {error && <div className="alert alert-danger mb-3">{error}</div>}

        <button
          type="submit"
          className="btn btn-success w-100"
          disabled={loading || !isReady}
        >
          {loading ? "Procesando..." : `Pagar $${cartTotal.toLocaleString()}`}
        </button>
      </div>
    </form>
  );
}

export default MercadoPagoPayment;
