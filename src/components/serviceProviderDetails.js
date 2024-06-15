import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ServiceProviderDetails = ({ match }) => {
    const [serviceProvider, setServiceProvider] = useState(null);
    const [error, setError] = useState(null);
    const {id} = useParams()
    useEffect(() => {
        const fetchServiceProvider = async () => {
            try {
                const response = await axios.get(`http://localhost:3060/api/serviceProvider/${id}`, {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                });

                setServiceProvider(response.data);
                console.log(response.data)
            } catch (err) {
                console.error("Error fetching service provider details:", err);
                setError("Failed to fetch service provider details. Please try again.");
            }
        };

        fetchServiceProvider();
    }, [id]);

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    if (!serviceProvider) {
        return <p>Loading...</p>;
    }

    
        return (
            <div>
                {serviceProvider.map((ele, idx) => (
                    <div key={idx} className="service-provider-details">
                        <h1> Service provider details</h1>
                        <h3>{ele?.name}</h3>
                        <p>Mobile: {ele?.mobile}</p>
                        <p>Service Type: {ele?.serviceType.join(', ')}</p>
                        <p>Social Links: {ele?.socialLinks}</p>
                        <p>Location: {ele?.location}</p>
                        {/* <h4>Categories:</h4> */}
                        {/* <ul>
                            {ele?.categories.map((category, index) => (
                                <li key={index}>{category?.name}: ${category?.amount}</li>
                            ))}
                        </ul> */}
                        {/* <h4>Gallery:</h4>
                        <div className="gallery">
                            {serviceProvider?.galleries.map((item, index) => (
                                <div key={index} className="gallery-item">
                                    <p>{item.title}</p>
                                    {item?.galleryImg && <img src={item?.galleryImg} alt={item?.title} />}
                                    {item?.galleryVideo && <video src={item?.galleryVideo} controls />}
                                </div>
                            ))}
                        </div> */}
                    </div>
                ))}
            </div>
        );
    };

    export default ServiceProviderDetails;

