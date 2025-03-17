// src/components/InvoicePage.js
import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { jsPDF } from "jspdf";

// Load Stripe Public Key
const stripePromise = loadStripe("your_stripe_public_key");

const CheckoutForm = ({ serviceProvider }) => {
    const stripe = useStripe();
    const elements = useElements();

    // State to track customer details
    const [customer, setCustomer] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
    });

    const [isProcessing, setIsProcessing] = useState(false);

    // Handle input changes for customer details
    const handleInputChange = (e) => {
        setCustomer({ ...customer, [e.target.name]: e.target.value });
    };

    // Generate Invoice PDF
    const generateInvoicePDF = () => {
        const doc = new jsPDF();
        const date = new Date().toLocaleDateString();

        doc.setFontSize(18);
        doc.text("Lens Locater Photography", 20, 20);
        doc.setFontSize(12);
        doc.text(`Invoice Date: ${date}`, 20, 30);
        doc.text(`Customer Name: ${customer.name}`, 20, 40);
        doc.text(`Email: ${customer.email}`, 20, 50);
        doc.text(`Phone: ${customer.phone || "N/A"}`, 20, 60);
        doc.text(`Address: ${customer.address}`, 20, 70);
        doc.text(`Service: ${serviceProvider.name}`, 20, 80);
        doc.text(`Total Amount: ₹${serviceProvider.price}`, 20, 90);
        doc.text("Payment Status: ✅ Paid", 20, 100);

        doc.save(`Invoice_${customer.name}_${date}.pdf`);
    };

    // Simulated Payment Success
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);

        if (!stripe || !elements) return;

        try {
            const card = elements.getElement(CardElement);
            console.log("Card details (simulated):", card);

            // Simulate Success without Stripe API call
            setTimeout(() => {
                alert("✅ Payment successful! 🎉 Invoice has been generated.");
                console.log("✅ Simulated payment success!");
                setIsProcessing(false);

                // Generate the invoice PDF after payment success
                generateInvoicePDF();
            }, 1000);
        } catch (err) {
            console.error("Error processing payment:", err);
            alert("Payment failed. Please try again.");
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="invoice-form">
            <h3>Invoice Details</h3>

            {/* Customer Information */}
            <input type="text" name="name" placeholder="Full Name" value={customer.name} onChange={handleInputChange} required />
            <input type="email" name="email" placeholder="Email Address" value={customer.email} onChange={handleInputChange} required />
            <input type="tel" name="phone" placeholder="Phone (Optional)" value={customer.phone} onChange={handleInputChange} />
            <input type="text" name="address" placeholder="Billing Address" value={customer.address} onChange={handleInputChange} required />

            {/* Service Provider Info */}
            <h4>Service Provider: {serviceProvider.name}</h4>
            <h4>Total: ₹{serviceProvider.price}</h4>

            {/* Card Element */}
            <h4>Payment Details</h4>
            <CardElement options={{ hidePostalCode: true }} />

            {/* Pay Button */}
            <button type="submit" disabled={isProcessing || !stripe} className="btn btn-success" style={{ marginTop: "10px" }}>
                {isProcessing ? "Processing..." : "Pay Invoice"}
            </button>
        </form>
    );
};

// Invoice Page Component Wrapper
const InvoicePage = () => {
    const serviceProvider = {
        name: "Lens Locater Photography",
        price: 5000, // ₹5000
    };

    return (
        <div>
            <h3>Invoice Payment</h3>
            <Elements stripe={stripePromise}>
                <CheckoutForm serviceProvider={serviceProvider} />
            </Elements>
        </div>
    );
};

export default InvoicePage;
