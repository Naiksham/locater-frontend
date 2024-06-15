import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const GalleryForm = () => {
    const navigate = useNavigate()
    const [form, setForm] = useState({
        title: '',
        galleryImg: null,
        galleryVideo: null
    });
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, type, files, value } = e.target;
        const newValue = type === 'file' ? files[0] : value;
        setForm({ ...form, [name]: newValue });
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
 console.log (token)
            const config = {
                headers: {
                    Authorization:  token,
                   //Authorization : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NTQyMmZkNDM2YzkwZWUxYWRlM2M1NCIsInJvbGUiOiJzZXJ2aWNlUHJvdmlkZXIiLCJpYXQiOjE3MTY5MjA1MTcsImV4cCI6MTcxNzUyNTMxN30.IVXHggbAepRnJqzS3-AZBBqHbgAXO8Kexq01X-0HnG8",
                    'Content-Type': 'multipart/form-data'
                }
            };

            const response = await axios.post('http://localhost:3060/api/galleries', formData, config);
           navigate(`/service-provider-details/${response.data.serviceProviderId}`)

            console.log("Upload successful:", response.data);
            setForm({
                title: '',
                galleryImg: null,
                galleryVideo: null
            });
            setError(null); // Reset any previous errors
        } catch (err) {
            console.error("Error uploading media:", err);
            setError("Failed to upload media. Please try again.");
        }
    };

    return (
        <div className="form-group">
            <h3>Gallery Form</h3>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <label htmlFor="title"><b>Add Title</b></label><br />
                <input
                    type="text"
                    value={form.title}
                    className="form-control"
                    name="title"
                    id="title"
                    onChange={handleChange}
                />
                <br />

                <label htmlFor="galleryImg"><b>Add Images</b></label><br />
                <input
                    type="file"
                    accept="image/jpeg, image/png"
                    className="form-control"
                    id="galleryImg"
                    name="galleryImg"
                    onChange={handleChange}
                />
                <br />

                <label htmlFor="galleryVideo"><b>Add Video</b></label><br />
                <input
                    type="file"
                    accept="video/mp4"
                    className="form-control"
                    id="galleryVideo"
                    name="galleryVideo"
                    onChange={handleChange}
                />
                <br />

                <input type="submit" value="Submit" />
            </form>
        </div>
    );
};

export default GalleryForm;
