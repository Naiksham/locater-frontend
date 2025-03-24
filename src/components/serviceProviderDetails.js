import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function ServiceProviderDetails() {
  const { id } = useParams();
  const [serviceProvider, setServiceProvider] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3060/api/serviceProvider/${id}`, {
          headers: { Authorization: localStorage.getItem("token") },
        });
        setServiceProvider(response.data);
      } catch (error) {
        console.log("Error fetching details:", error);
      }
    };
    fetchDetails();
  }, [id]);

  if (!serviceProvider) return <p>Loading...</p>;

  return (
    <div className="service-provider-details">
      <h2>{serviceProvider.name || "Service provider Details"}</h2>

      <p><b>📲 Mobile:</b> {serviceProvider.mobile || "N/A"}</p>

      <p><b>📍 Location:</b> {serviceProvider.location || "N/A"}</p>

      <p>
        <b>🔗 Social Links:</b>{" "}
        {serviceProvider.socialLinks ? (
          <a href={serviceProvider.socialLinks} target="_blank" rel="noopener noreferrer">
            {serviceProvider.socialLinks}
          </a>
        ) : (
          "N/A"
        )}
      </p>

      <p><b>🔧 Service Type:</b> {serviceProvider.serviceType?.join(", ") || "N/A"}</p>

      <p><b>📸 Categories:</b></p>
      {serviceProvider.categories?.length > 0 ? (
        <ul>
          {serviceProvider.categories.map((cat, index) => (
            <li key={index}>
              {cat.name} — ₹{cat.amount}
            </li>
          ))}
        </ul>
      ) : (
        <p>No categories added.</p>
      )}

      <p><b>💰 Price Range:</b> {serviceProvider.amount ? `₹${serviceProvider.amount}` : "N/A"}</p>
    </div>
  );
}
