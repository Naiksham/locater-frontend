import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const GalleryForm = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        title: '',
        galleryImg: null,
        galleryVideo: null
    });
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, type, files, value } = e.target;
        const newValue = type === 'file' ? files[0] : value;
        setForm(prevForm => ({ ...prevForm, [name]: newValue }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', form.title);
        formData.append('galleryImg', form.galleryImg);
        formData.append('galleryVideo', form.galleryVideo);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("Token not found in local storage");
            }

            console.log(token);
            const config = {
                headers: {
                    Authorization: token,
                    'Content-Type': 'multipart/form-data'
                }
            };

            const response = await axios.post('http://localhost:3060/api/galleries', formData, config);
            console.log("Upload successful:", response.data);

            // Navigate to the service provider details page
            navigate(`/service-provider-details/${response.data.serviceProviderId}`);

            // Reset form and error state
            setForm({
                title: '',
                galleryImg: null,
                galleryVideo: null
            });
            setError(null);
        } catch (err) {
            console.error("Error uploading media:", err.response?.data?.error || err.message, err);
            setError("Failed to upload media. Please try again.");
        }
    };

    // 🎨 Inline Styles
    const containerStyle = {
        background: "linear-gradient(135deg, #f0f4f8, #d9e2ec)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px"
    };

    const formStyle = {
        backgroundColor: "#fff",
        borderRadius: "12px",
        boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)",
        padding: "1.8rem",
        width: "100%",
        maxWidth: "480px",
        animation: "fadeIn 0.8s ease-in-out"
    };

    const buttonStyle = {
        backgroundColor: "#4a90e2",
        borderColor: "#4a90e2",
        width: "100%",
        padding: "10px",
        fontSize: "1rem",
        borderRadius: "8px",
        transition: "0.3s ease"
    };

    const buttonHoverStyle = {
        backgroundColor: "#357ABD",
        borderColor: "#357ABD"
    };

    const inputStyle = {
        borderRadius: "8px",
        marginBottom: "1rem",
        padding: "10px",
        border: "1px solid #ddd"
    };

    return (
        <div style={containerStyle}>
            <div className="form-group" style={formStyle}>
                <h3 style={{ fontSize: "1.8rem", fontWeight: "bold", color: "#4a4a4a", textAlign: "center", marginBottom: "1rem" }}>
                    Gallery Form
                </h3>

                {error && <p style={{ color: "red", fontWeight: "bold", textAlign: "center" }}>{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title"><b>Add Title</b></label><br />
                        <input
                            type="text"
                            value={form.title}
                            className="form-control"
                            name="title"
                            id="title"
                            onChange={handleChange}
                            style={inputStyle}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="galleryImg"><b>Add Images</b></label><br />
                        <input
                            type="file"
                            accept="image/jpeg, image/png"
                            className="form-control"
                            id="galleryImg"
                            name="galleryImg"
                            onChange={handleChange}
                            style={inputStyle}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="galleryVideo"><b>Add Video</b></label><br />
                        <input
                            type="file"
                            accept="video/mp4"
                            className="form-control"
                            id="galleryVideo"
                            name="galleryVideo"
                            onChange={handleChange}
                            style={inputStyle}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={buttonStyle}
                        onMouseOver={(e) => e.target.style.backgroundColor = buttonHoverStyle.backgroundColor}
                        onMouseOut={(e) => e.target.style.backgroundColor = buttonStyle.backgroundColor}
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

export default GalleryForm;
