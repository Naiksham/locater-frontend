import React, { useState } from 'react';
import axios from 'axios';
import _ from 'lodash'

export default function ServiceProviderForm(){
  const [form, setForm] = useState({
    mobile: '',
    serviceType: [''],
    categories: [''],
    socialLinks: '',
    location: '',
    title: '',
    galleryImg: null,
    galleryVideo: null,
    serverErrors: null,
    clientErrors: {},
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'galleryImg' || name === 'galleryVideo') {
      setForm({
        ...form,
        [name]: files[0],
      });
    } else if (name === 'serviceType' || name === 'categories') {
      setForm({
        ...form,
        [name]: value.split(',').map((item) => item.trim()),
      });
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }
  };

  const runValidations = () => {
    const errors = {};

    if (form.mobile.trim().length === 0) {
      errors.mobile = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(form.mobile.trim())) {
      errors.mobile = 'Mobile number should consist of 10 numbers';
    }

    if (!form.serviceType.length) {
      errors.serviceType = 'Service type is required';
    }

    if (!form.categories.length) {
      errors.categories = 'Categories are required';
    }

    if (!form.title.trim().length) {
      errors.title = 'Title is required';
    }

    if (!form.galleryImg) {
      errors.galleryImg = 'Gallery image is required';
    }

    if (!form.galleryVideo) {
      errors.galleryVideo = 'Gallery video is required';
    }

    setForm({
      ...form,
      clientErrors: errors,
    });

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = _.pick(form, ['mobile', 'serviceType', 'categories', 'location', 'tiitle', 'galleryImg', 'galleryVideo'])

    const isValid = runValidations();

    if (!isValid) {
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('mobile', form.mobile);
    formDataToSend.append('serviceType', JSON.stringify(form.serviceType));
    formDataToSend.append('categories', JSON.stringify(form.categories));
    formDataToSend.append('socialLinks', form.socialLinks);
    formDataToSend.append('location', form.location);
    formDataToSend.append('title', form.title);
    formDataToSend.append('galleryImg', form.galleryImg);
    formDataToSend.append('galleryVideo', form.galleryVideo);

    try {
        const response = await axios.post('http://localhost:3060/serviceProvider', formData)
        console.log(response.data);
      // Handle success
    } catch (error) {
      if (error.response && error.response.data) {
        setForm({
          ...form,
          serverErrors: error.response.data,
        });
      } else {
        console.error('Error uploading data:', error);
      }
    }
  };

  return (
    <div>
      <h2>Service Provider Details</h2>
      <form onSubmit={handleSubmit}>
        {/* Mobile */}
        <div>
          <label>Mobile:</label>
          <input
            type="text"
            name="mobile"
            value={form.mobile}
            onChange={handleChange}
          />
          {form.clientErrors.mobile && <p className="error">{form.clientErrors.mobile}</p>}
        </div>

        {/* Service Type */}
        <div>
          <label>Service Type:</label>
          <select>
            type="text"
            name="serviceType"
            value={form.serviceType.join(', ')}
            onChange={handleChange}
          </select>
          {form.clientErrors.serviceType && <p className="error">{form.clientErrors.serviceType}</p>}
        </div>

        {/* Categories */}
        <div>
          <label>Categories:</label>
          <select>
            type="text"
            name="categories"
            value={form.categories.join(', ')}
            onChange={handleChange}
          </select>
          {form.clientErrors.categories && <p className="error">{form.clientErrors.categories}</p>}
        </div>

        {/* Title */}
        <div>
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
          />
          {form.clientErrors.title && <p className="error">{form.clientErrors.title}</p>}
        </div>

        {/* Gallery Image */}
        <div>
          <label>Gallery Image:</label>
          <input
            type="file"
            name="galleryImg"
            onChange={handleChange}
          />
          {form.clientErrors.galleryImg && <p className="error">{form.clientErrors.galleryImg}</p>}
        </div>

        {/* Gallery Video */}
        <div>
          <label>Gallery Video:</label>
          <input
            type="file"
            name="galleryVideo"
            onChange={handleChange}
          />
          {form.clientErrors.galleryVideo && <p className="error">{form.clientErrors.galleryVideo}</p>}
        </div>

        {/* Social Links */}
        <div>
          <label>Social Links:</label>
          <input
            type="text"
            name="socialLinks"
            value={form.socialLinks}
            onChange={handleChange}
          />
        </div>

        {/* Location */}
        <div>
          <label>Location:</label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};
