import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import validator from 'validator';

export default function Register() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [serverErrors, setServerErrors] = useState(null);
    const [clientErrors, setClientErrors] = useState({});

    const errors = {};

    const runValidations = () => {
        if (username.trim().length === 0) {
            errors.username = 'Username is required';
        }
        if (email.trim().length === 0) {
            errors.email = 'Email is required';
        } else if (!validator.isEmail(email)) {
            errors.email = 'Invalid email format';
        }
        if (password.trim().length === 0) {
            errors.password = 'Password is required';
        } else if (password.trim().length < 8 || password.trim().length > 20) {
            errors.password = 'Password should be between 8-20 characters';
        }
        if (role.trim().length === 0) {
            errors.role = 'Role is required';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            username: username,
            email: email,
            password: password,
            role: role
        };

        runValidations();

        if (Object.keys(errors).length === 0) {
            try {
                const response = await axios.post('http://localhost:3060/api/users/register', formData);
                navigate('/Login-form');
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
                const response = await axios.get(`http://localhost:3060/api/users/checkemail?email=${email}`);
                if (response.data.is_email_registered) {
                    setClientErrors({ email: 'Email is already registered' });
                } else {
                    setClientErrors({});
                }
            } catch (err) {
                console.error('Error checking email:', err);
            }
        }
    };

    return (
        <div className='form-group'>
            <h2>Sign Up</h2>

            {serverErrors && (
                <div>
                    <h3>These errors prohibited the form from being saved:</h3>
                    <ul>
                        {serverErrors.map((ele, i) => {
                            return <li key={i}>{ele.msg}</li>;
                        })}
                    </ul>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <label htmlFor='username'>Enter Username</label><br/>
                <input
                    type='text'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    id='username'
                    className="form-control"
                />
                {clientErrors.username && <span>{clientErrors.username}</span>}
                <br/>

                <label htmlFor='email'>Enter Email</label><br/>
                <input
                    type='text'
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); handleCheckEmail(); }}
                    id='email'
                    className="form-control"
                />
                {clientErrors.email && <span>{clientErrors.email}</span>}
                <br/>

                <label htmlFor='password'>Enter Password</label><br/>
                <input
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    id='password'
                    className="form-control"
                />
                {clientErrors.password && <span>{clientErrors.password}</span>}
                <br/>

                <label>Role</label><br/>
                <select
                    value={role}
                    name="role"
                    onChange={(e) => setRole(e.target.value)}
                    className="form-control"
                >
                    <option value="">Select</option>
                    <option value="serviceProvider">Service Provider</option>
                    <option value="customer">Customer</option>
                </select>
                {clientErrors.role && <span>{clientErrors.role}</span>}
                <br/><br/>

                <input type='submit' value='Submit'/>
            </form>
        </div>
    );
}
