import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ServiceProviderDetails = () => {
    const [serviceProvider, setServiceProvider] = useState(null);
    const [error, setError] = useState(null);
    const { id } = useParams(); // Get 'id' from URL

    useEffect(() => {
        const fetchServiceProvider = async () => {
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
                console.error("Error fetching service provider details:", err);
                setError(err.response?.data?.message || "Failed to fetch service provider details. Please try again.");
            }
        };

        fetchServiceProvider();
    }, [id]);

    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!serviceProvider) return <p>Loading...</p>;

    console.log(serviceProvider);

    // Helper function to build full file URLs
    const getFullFileUrl = (path) => `http://localhost:3060/${path.replace("app/", "")}`;

    return (
        <div style={{ padding: "20px", backgroundColor: "#f4f4f4", borderRadius: "10px", boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" }}>
            <h1 style={{ color: "#333" }}>Service Provider Details</h1>
            <h3>{serviceProvider.name}</h3>

            <p><b>Mobile:</b> {serviceProvider.mobile}</p>
            <p><b>Service Type:</b> {serviceProvider.serviceType.join(", ")}</p>
            <p><b>Social Links:</b> {serviceProvider.socialLinks}</p>
            <p><b>Location:</b> {serviceProvider.location}</p>

            {/* 🎯 Gallery Section */}
            {serviceProvider.gallery && (
                <div>
                    <h3 style={{ color: "#555", marginTop: "20px" }}>Gallery</h3>

                    {/* Display Image */}
                    {serviceProvider.gallery.galleryImg && (
                        <img
                            src={getFullFileUrl(serviceProvider.gallery.galleryImg)}
                            alt="Gallery"
                            style={{
                                width: "300px",
                                borderRadius: "8px",
                                marginBottom: "10px",
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                            }}
                        />
                    )}

                    {/* Display Video */}
                    {serviceProvider.gallery.galleryVideo && (
                        <div>
                            <h4 style={{ marginTop: "10px", color: "#555" }}>Video</h4>
                            <video
                                controls
                                style={{ width: "300px", borderRadius: "8px" }}
                            >
                                <source
                                    src={getFullFileUrl(serviceProvider.gallery.galleryVideo)}
                                    type="video/mp4"
                                />
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ServiceProviderDetails;
