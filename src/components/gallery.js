import { useState } from "react"
import axios from "axios"

export default function GalleryForm() {
    const [form, setForm] = useState({
        title: '',
        galleryImg: null,
        galleryVideo: null
    })

    const errors = {}

    const handleSubmit = async (e) => {
        e.preventDefault()
        const formData = {
            title: form.title,
            galleryImg: form.galleryImg,
            galleryVideo: form.galleryVideo
        }

        if (Object.keys(errors).length === 0) {
            try {
                const response = await axios.post('http://localhost:3060/api/galleries', formData, {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                })
                console.log(response.data)
            } catch (err) {
                console.log(err)
            }
        } else {
            setForm({ ...form })
        }
    }

    const handleChange = async (e) => {
        const { name, value, type } = e.target;
        const newValue = type === 'file' ? e.target.files[0] : value;
        setForm({ ...form, [name]: newValue });
    }

    return (
        <div className="from-group">
            <h3>Gallery Form</h3>

            <br/>
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

                <br/>
                <label htmlFor="galleryImg"><b>Add Images</b></label><br/>
                <input
                    type="file"
                    placeholder='ex:jpeg/jpg/png'
                    className="form-control"
                    id="galleryImg"
                    name="galleryImg"
                    onChange={handleChange}
                />
                <br/>

                <br/>
                <label htmlFor="galleryVideo"><b>Add Video</b></label><br/>
                <input
                    type="file"
                    placeholder='ex:mp4'
                    className="form-control"
                    id="galleryVideo"
                    name="galleryVideo"
                    onChange={handleChange}
                />
                <br/>

                <br/>
                <input type="Submit"/>
            </form>
        </div>

    )
}