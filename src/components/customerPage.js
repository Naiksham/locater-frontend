import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function CustomerPage() {
    const { id } = useParams();
    const navigate = useNavigate(); // Use navigation hook
    const [serviceProvider, setServiceProvider] = useState(null);
    const [error, setError] = useState(null);

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
        <div>
            <h3>Customer Page</h3>
            <h1>Service Provider Details</h1>
            <h3>{serviceProvider.name}</h3>
            <p>Mobile: {serviceProvider.mobile}</p>
            <p>Service Type: {serviceProvider.serviceType.join(", ")}</p>
            <p>Social Links: {serviceProvider.socialLinks}</p>
            <p>Location: {serviceProvider.location}</p>

            {/* Display Gallery Images */}
            {serviceProvider.gallery && (
                <div>
                    <h3>Gallery</h3>
                    {serviceProvider.gallery.map((item, index) => (
                        <div key={index}>
                            <h4>{item.title}</h4>
                            {item.galleryImg && (
                                <img
                                    src={`http://localhost:3060/${item.galleryImg}`}
                                    alt={item.title}
                                    style={{ width: "300px", height: "200px", margin: "10px" }}
                                />
                            )}
                            {item.galleryVideo && (
                                <video controls width="300" height="200" src={`http://localhost:3060/${item.galleryVideo}`} />
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Invoice Button */}
            <button onClick={handleInvoice} className="btn btn-success" style={{ marginTop: "10px" }}>
                Generate Invoice
            </button>
        </div>
    );
}
