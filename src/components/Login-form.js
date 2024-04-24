import { useState } from "react"
import validator from "validator"
import { useNavigate } from "react-router-dom"
import axios from "axios"   
import _ from "lodash"
import { useAuth } from "../context/AuthContext"

export default function LoginForm(){
    const {handleLogin} = useAuth()
    const navigate = useNavigate()
    
    const [form, setForm] = useState({
        email : '',
        password : '',
        serverErrors : null,
        clientErrors : {}
    })

    const errors = {}
    
    const runValidations = ()=>{
        if(form.email.trim().length === 0){
            errors.email = 'Email is required'
        } else if(!validator.isEmail(form.email)){
            errors.email = 'Invalid Email Format'
        }

        if(form.password.trim().length<8 || form.password.trim().length>20){
            errors.password = 'Invalid Password Length'
        }
    }

    const handleSubmit = async(e)=>{
        e.preventDefault()
        const formData = _.pick(form, ['email', 'password'])

        runValidations()

        if(Object.keys(errors).length === 0){
            try{
                const response = await axios.post('http://localhost:3060/api/users/login', formData)
                localStorage.setItem('token', response.data.token)
                const account = await axios.get('http://localhost:3060/api/users/account', {
                    headers: {
                        Authorization : localStorage.getItem('token')
                    }
                })
                console.log(account)
                handleLogin(account.data)
                // navigate('/serviceProvice')
                console.log(response.data)
            } catch(err){
                console.log(err)
                setForm({...form, clientErrors: errors})
            }
        }
    }

    const handleChange = (e)=>{
        const {value, name} = e.target
        setForm({...form, [name]:value})
    }

    const displayErrors = ()=>{
        let result
        if(typeof form.serverErrors === 'string'){
            result = <p> {form.serverErrors} </p>
        } else{
            result = (
                <div>
                    <h3>These errors prohibited the form from being saved : </h3>
                    <ul>
                        {form.serverErrors.map((ele, i)=>{
                            return <li key={i}>{ele.msg}</li>
                        })}
                    </ul>
                </div>
            )
        }
        return result
    }

    return(
        <div>
            <h2>Login</h2>
            {form.serverErrors && displayErrors()}
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Enter Email</label><br/>
                <input 
                    type="text"
                    value={form.email}
                    onChange={handleChange}
                    name="email"
                    id="email"
                />
                {form.clientErrors.email && <span>{form.clientErrors.email}</span>}
                <br/>

                <label htmlFor="password">Enter Password</label><br/>
                <input 
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    name="password"
                    id="password"
                />
                {form.clientErrors.password && <span>{form.clientErrors.password}</span>}
                <br/>

                <input  type="submit"/>
            </form>
        </div>
    )
}