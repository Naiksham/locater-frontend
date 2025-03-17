import { useState } from "react";
import validator from "validator";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import _ from "lodash";
import { useAuth } from "../context/AuthContext";
import { Form, Button, Container, Row, Col, Alert, Card } from "react-bootstrap";

export default function LoginForm() {
  const { handleLogin } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    serverErrors: null,
    clientErrors: {},
  });

  const errors = {};

  const runValidations = () => {
    if (form.email.trim().length === 0) {
      errors.email = "Email is required";
    } else if (!validator.isEmail(form.email)) {
      errors.email = "Invalid Email Format";
    }

    if (form.password.trim().length < 8 || form.password.trim().length > 20) {
      errors.password = "Password must be 8-20 characters";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = _.pick(form, ["email", "password"]);

    runValidations();

    if (Object.keys(errors).length === 0) {
      try {
        const response = await axios.post("http://localhost:3060/api/users/login", formData);
        localStorage.setItem("token", response.data.token);
        const account = await axios.get("http://localhost:3060/api/users/account", {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        });
        handleLogin(account.data);
        navigate(account.data.role === "serviceProvider" ? `/serviceProvider` : "/customer");
      } catch (err) {
        console.log(err);
        setForm({ ...form, serverErrors: "Invalid login credentials" });
      }
    } else {
      setForm({ ...form, clientErrors: errors });
    }
  };

  const handleChange = (e) => {
    const { value, name } = e.target;
    setForm({ ...form, [name]: value });
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <Row>
        <Col md={12}>
          <Card style={{ padding: "20px", width: "400px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
            <h2 className="text-center mb-4">Login</h2>

            {form.serverErrors && <Alert variant="danger">{form.serverErrors}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="text"
                  value={form.email}
                  onChange={handleChange}
                  name="email"
                  placeholder="Enter your email"
                  isInvalid={!!form.clientErrors.email}
                />
                <Form.Control.Feedback type="invalid">{form.clientErrors.email}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  name="password"
                  placeholder="Enter your password"
                  isInvalid={!!form.clientErrors.password}
                />
                <Form.Control.Feedback type="invalid">{form.clientErrors.password}</Form.Control.Feedback>
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100">
                Log In
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
