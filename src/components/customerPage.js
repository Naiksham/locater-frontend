import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function CustomerPage() {
    const { id } = useParams();
    const navigate = useNavigate(); // Use navigation hook
    const [serviceProvider, setServiceProvider] = useState(null);
    const [error, setError] = useState(null);

    // Fetch service provider data
    useEffect(() => {
        const fetchServiceProvider = async () => {
            console.log("Captured ID:", id);
            try {
                const response = await axios.get(`http://localhost:3060/api/serviceProvider/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                if (response.status === 200) {
                    setServiceProvider(response.data);
                } else {
                    setError("Service provider not found.");
                }
            } catch (err) {
                console.error("Error fetching details:", err);
                setError(err.response?.data?.message || "Failed to fetch details.");
            }
        };

        if (id) fetchServiceProvider();
        else setError("Invalid Service Provider ID.");
    }, [id]);

    // Navigate to Invoice Page on Button Click
    const handleInvoice = () => {
        navigate(`/invoice/${id}`);
    };

    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!serviceProvider) return <p>Loading...</p>;

    return (
        <div style={{ padding: "20px", backgroundColor: "#f9f9f9", borderRadius: "10px", boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" }}>
            <h3 style={{ color: "#333" }}>Customer Page</h3>
            <h1 style={{ color: "#444" }}>Service Provider Details</h1>

            <h3>{serviceProvider.name || "No name provided"}</h3>
            <p><b>Mobile:</b> {serviceProvider.mobile || "Not provided"}</p>

            {/* ✅ Safely render Service Type */}
            <p>
                <b>Service Type:</b>{" "}
                {Array.isArray(serviceProvider?.serviceType) && serviceProvider.serviceType.length > 0
                    ? serviceProvider.serviceType.join(", ")
                    : "No services available"}
            </p>

            <p><b>Social Links:</b> {serviceProvider.socialLinks || "No social links provided"}</p>
            <p><b>Location:</b> {serviceProvider.location || "Location not provided"}</p>

            {/* 🎯 Display Gallery Images/Videos */}
            {serviceProvider.gallery && serviceProvider.gallery.length > 0 ? (
                <div>
                    <h3 style={{ color: "#555", marginTop: "20px" }}>Gallery</h3>
                    {serviceProvider.gallery.map((item, index) => (
                        <div key={index} style={{ marginBottom: "10px" }}>
                            <h4 style={{ color: "#666" }}>{item.title || "Untitled"}</h4>

                            {item.galleryImg && (
                                <img
                                    src={`http://localhost:3060/${item.galleryImg}`}
                                    alt={item.title || "Gallery Image"}
                                    style={{ width: "300px", height: "200px", margin: "10px", borderRadius: "8px" }}
                                />
                            )}

                            {item.galleryVideo && (
                                <video controls width="300" height="200" src={`http://localhost:3060/${item.galleryVideo}`} />
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p>No gallery items available</p>
            )}

            {/* ✅ Invoice Button */}
            <button onClick={handleInvoice} className="btn btn-success" style={{ marginTop: "10px" }}>
                Generate Invoice
            </button>
        </div>
    );
}
