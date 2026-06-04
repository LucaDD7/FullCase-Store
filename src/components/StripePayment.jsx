import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import "./StripePayment.css";

function StripePayment({ cartTotal, onSuccess, onError, loading }) {
  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setCardError] = useState("");

  const handleCardChange = (e) => {
    setCardError(e.error?.message || "");
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setCardError("Stripe no está cargado");
      return;
    }

    const cardElement = elements.getElement(CardElement);

    try {
      // Crear un token del método de pago
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      if (error) {
        setCardError(error.message);
        onError(error.message);
        return;
      }

      // Simular pago exitoso (en producción, esto se haría en el backend)
      onSuccess(paymentMethod.id);
    } catch (error) {
      setCardError(error.message);
      onError(error.message);
    }
  };

  return (
    <form onSubmit={handlePayment}>
      <div className="stripe-card-container">
        <label>Información de la tarjeta</label>
        <CardElement
          onChange={handleCardChange}
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
              invalid: {
                color: "#fa755a",
              },
            },
          }}
        />
      </div>

      {cardError && <div className="alert alert-danger mt-2">{cardError}</div>}

      <button
        type="submit"
        className="btn btn-success w-100 mt-3"
        disabled={loading || !stripe}
      >
        {loading ? "Procesando..." : `Pagar $${cartTotal.toLocaleString()}`}
      </button>
    </form>
  );
}

export default StripePayment;
