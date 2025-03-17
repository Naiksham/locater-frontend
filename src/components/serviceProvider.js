import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Select from "react-select";
import { Container, Form, Button, Row, Col } from "react-bootstrap";

export default function ServiceProviderForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    mobile: "",
    serviceType: [""],
    categories: [],
    socialLinks: "",
    location: "",
    name: "",
    amount: "",
  });

  const errors = {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      mobile: form.mobile,
      serviceType: form.serviceType,
      categories: [{ name: form.categories[0]?.name, amount: Number(form.categories[1]?.amount) }],
      socialLinks: form.socialLinks,
      location: form.location,
    };

    if (Object.keys(errors).length === 0) {
      console.log("formdata", formData);
      try {
        const response = await axios.post("http://localhost:3060/api/serviceProvider", formData, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        });
        console.log(response.data);
        navigate("/gallery");
      } catch (err) {
        console.log(err);
      }
    } else {
      setForm({ ...form });
    }
  };

  const serviceTypeOptions = [
    { value: "photography", label: "Photography" },
    { value: "videography", label: "Videography" },
  ];

  const handleServiceType = (selectedOptions) => {
    const values = selectedOptions ? selectedOptions.map((option) => option.value) : [];
    setForm({ ...form, serviceType: values });
  };

  const nameOptions = [
    { value: "wedding", label: "Wedding" },
    { value: "babyphots", label: "Baby Photos" },
    { value: "events", label: "Events" },
    { value: "nature", label: "Nature" },
    { value: "travel", label: "Travel" },
    { value: "drone", label: "Drone" },
  ];

  const addCategory = () => {
    const categoryObj = {
      tempId: Number(new Date()),
      name: form.name,
      amount: form.amount,
    };
    setForm({ ...form, categories: [...form.categories, categoryObj], name: "", amount: "" });
  };

  const handleRemoveCategory = (tempId) => {
    setForm({ ...form, categories: form.categories.filter((ele) => ele.tempId !== tempId) });
  };

  const handleChange = (e) => {
    const { value, name } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSelectedCategoryChange = (e) => {
    const { name, value, id } = e.target;
    setForm({
      ...form,
      categories: form.categories.map((ele) => (ele.tempId === Number(id) ? { ...ele, [name]: value } : ele)),
    });
  };

  // 🎨 Improved UI Layout
  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="shadow-lg p-4 rounded bg-white w-100" style={{ maxWidth: "600px" }}>
        <h3 className="text-center mb-4">Service Provider Form</h3>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Add Mobile Number</Form.Label>
            <Form.Control type="text" value={form.mobile} onChange={handleChange} name="mobile" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Service Type</Form.Label>
            <Select
              value={serviceTypeOptions.filter((option) => form.serviceType.includes(option.value))}
              options={serviceTypeOptions}
              isMulti
              onChange={handleServiceType}
              className="form-control"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Categories</Form.Label>
            {form.categories.map((category) => (
              <Row key={category.tempId} className="mb-2 align-items-center">
                <Col>
                  <Form.Select value={category.name} onChange={handleSelectedCategoryChange} name="name" id={category.tempId}>
                    {nameOptions.map((ele) => (
                      <option key={ele.value} value={ele.value}>
                        {ele.label}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col>
                  <Form.Control type="text" value={category.amount} onChange={handleSelectedCategoryChange} name="amount" id={category.tempId} />
                </Col>
                <Col xs="auto">
                  <Button variant="danger" onClick={() => handleRemoveCategory(category.tempId)}>
                    Remove
                  </Button>
                </Col>
              </Row>
            ))}
          </Form.Group>

          <Row className="mb-3">
            <Col>
              <Form.Select value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}>
                <option value="">Select</option>
                {nameOptions.map((ele) => (
                  <option key={ele.value} value={ele.value}>
                    {ele.label}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col>
              <Form.Control type="text" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
            </Col>
            <Col xs="auto">
              <Button variant="info" onClick={addCategory}>
                Add Category
              </Button>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Social Media Links</Form.Label>
            <Form.Control type="text" value={form.socialLinks} onChange={handleChange} name="socialLinks" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Add Location</Form.Label>
            <Form.Control type="text" value={form.location} onChange={handleChange} name="location" />
          </Form.Group>

          <div className="text-center">
            <Button variant="primary" type="submit" className="w-100">
              Submit
            </Button>
          </div>
        </Form>
      </div>
    </Container>
  );
}
