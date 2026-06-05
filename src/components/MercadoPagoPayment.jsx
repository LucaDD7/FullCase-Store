import { useEffect, useRef, useState } from "react";
import "./MercadoPagoPayment.css";

function MercadoPagoPayment({ cartTotal, onSuccess, onError, loading }) {
  const [mp, setMp] = useState(null);
  const [error, setError] = useState("");
  const formRef = useRef(null);

  useEffect(() => {
    const initMercadoPago = async () => {
      try {
        const script = document.createElement("script");
        script.src = "https://sdk.mercadopago.com/js/v2";
        script.async = true;
        script.onload = () => {
          if (window.MercadoPago) {
            const mercadopago = new window.MercadoPago(
              import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY
            );
            setMp(mercadopago);
            createCardToken(mercadopago);
          }
        };
        script.onerror = () => {
          setError("Error cargando Mercado Pago");
          onError("Error cargando Mercado Pago");
        };
        document.body.appendChild(script);
      } catch (err) {
        setError(err.message);
        onError(err.message);
      }
    };

    initMercadoPago();
  }, [onError]);

  const createCardToken = (mercadopago) => {
    setTimeout(() => {
      mercadopago.cardToken.create({
        amount: cartTotal.toString(),
        autoMount: true,
        form: {
          id: "form-checkout",
          cardholderName: {
            id: "form-checkout_cardholderName",
          },
          cardholderEmail: {
            id: "form-checkout_cardholderEmail",
          },
          cardNumber: {
            id: "form-checkout_cardNumber",
          },
          cardExpirationMonth: {
            id: "form-checkout_cardExpirationMonth",
          },
          cardExpirationYear: {
            id: "form-checkout_cardExpirationYear",
          },
          cardSecurityCode: {
            id: "form-checkout_securityCode",
          },
        },
      });
    }, 100);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mp) {
      setError("Mercado Pago no está cargado");
      return;
    }

    try {
      const token = await mp.cardToken.create();
      if (token.id) {
        onSuccess(token.id);
      } else {
        setError("Error creando el token de pago");
        onError("Error creando el token de pago");
      }
    } catch (err) {
      setError(err.message || "Error procesando el pago");
      onError(err.message || "Error procesando el pago");
    }
  };

  return (
    <form id="form-checkout" onSubmit={handleSubmit} ref={formRef}>
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
          <label htmlFor="form-checkout_cardNumber" className="form-label">
            Número de tarjeta
          </label>
          <input
            id="form-checkout_cardNumber"
            type="text"
            className="form-control"
            placeholder="1234 5678 9012 3456"
            maxLength="19"
          />
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="form-checkout_cardExpirationMonth" className="form-label">
              Mes
            </label>
            <input
              id="form-checkout_cardExpirationMonth"
              type="text"
              className="form-control"
              placeholder="MM"
              maxLength="2"
            />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="form-checkout_cardExpirationYear" className="form-label">
              Año
            </label>
            <input
              id="form-checkout_cardExpirationYear"
              type="text"
              className="form-control"
              placeholder="YYYY"
              maxLength="4"
            />
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="form-checkout_securityCode" className="form-label">
            CVV
          </label>
          <input
            id="form-checkout_securityCode"
            type="text"
            className="form-control"
            placeholder="123"
            maxLength="4"
          />
        </div>

        {error && <div className="alert alert-danger mb-3">{error}</div>}

        <button
          type="submit"
          className="btn btn-success w-100"
          disabled={loading || !mp}
        >
          {loading ? "Procesando..." : `Pagar $${cartTotal.toLocaleString()}`}
        </button>
      </div>
    </form>
  );
}

export default MercadoPagoPayment;
