import React, { useState } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import validator from "validator";

export default function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [serverErrors, setServerErrors] = useState(null);
  const [clientErrors, setClientErrors] = useState({});

  const errors = {};

  const runValidations = () => {
    if (username.trim().length === 0) errors.username = "Username is required";
    if (email.trim().length === 0) {
      errors.email = "Email is required";
    } else if (!validator.isEmail(email)) {
      errors.email = "Invalid email format";
    }
    if (password.trim().length === 0) {
      errors.password = "Password is required";
    } else if (password.trim().length < 8 || password.trim().length > 20) {
      errors.password = "Password should be between 8-20 characters";
    }
    if (role.trim().length === 0) errors.role = "Role is required";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = { username, email, password, role };
    runValidations();

    if (Object.keys(errors).length === 0) {
      try {
        const response = await axios.post(
          "http://localhost:3060/api/users/register",
          formData
        );
        navigate("/Login-form");
        console.log(response.data);
      } catch (err) {
        console.log(err);
        setServerErrors(err.response.data.errors);
      }
    } else {
      setClientErrors(errors);
    }
  };

  const handleCheckEmail = async () => {
    if (validator.isEmail(email)) {
      try {
        const response = await axios.get(
          `http://localhost:3060/api/users/checkemail?email=${email}`
        );
        if (response.data.is_email_registered) {
          setClientErrors({ email: "Email is already registered" });
        } else {
          setClientErrors({});
        }
      } catch (err) {
        console.error("Error checking email:", err);
      }
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh", backgroundColor: "#fff8dc" }}
    >
      <Form
        onSubmit={handleSubmit}
        className="p-4 border rounded shadow-lg"
        style={{ width: "320px", backgroundColor: "#fff", borderColor: "#f4c542" }}
      >
        <h2 className="text-center mb-3" style={{ color: "#333" }}>
          Sign Up
        </h2>

        {serverErrors && (
          <Alert variant="danger">
            <h4>Errors:</h4>
            <ul>
              {serverErrors.map((ele, i) => (
                <li key={i}>{ele.msg}</li>
              ))}
            </ul>
          </Alert>
        )}

        <Form.Group className="mb-2">
          <Form.Label>Enter Username</Form.Label>
          <Form.Control
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            isInvalid={!!clientErrors.username}
          />
          <Form.Control.Feedback type="invalid">
            {clientErrors.username}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Enter Email</Form.Label>
          <Form.Control
            type="text"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              handleCheckEmail();
            }}
            isInvalid={!!clientErrors.email}
          />
          <Form.Control.Feedback type="invalid">
            {clientErrors.email}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Enter Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            isInvalid={!!clientErrors.password}
          />
          <Form.Control.Feedback type="invalid">
            {clientErrors.password}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Role</Form.Label>
          <Form.Select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            isInvalid={!!clientErrors.role}
          >
            <option value="">Select</option>
            <option value="serviceProvider">Service Provider</option>
            <option value="customer">Customer</option>
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            {clientErrors.role}
          </Form.Control.Feedback>
        </Form.Group>

        <Button
          type="submit"
          className="w-100 mt-2"
          style={{ backgroundColor: "#f4c542", borderColor: "#f4c542", color: "#333" }}
        >
          Submit
        </Button>
      </Form>
    </Container>
  );
}
