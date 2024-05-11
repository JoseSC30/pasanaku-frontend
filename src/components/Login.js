import React, { useState } from 'react';
import { useAuth } from '../auth/context/AuthProvider'

export default function Login() {
    
    const auth = useAuth();

    const [formStateLogin, setFormStateLogin] = useState({
        email:'',
        contrasena:''
    });

    const handleChangeLogin = (e) => {
        setFormStateLogin({
            ...formStateLogin,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        auth.login(formStateLogin)
    }

    return (
        <div className="login">
            <header className="login-header">
                <div className="header-content">
                    <h1>Login</h1>
                    <p>Por favor, inicie sesión.</p>
                </div>
            </header>
            <main className="main-content">
                <FormLogin
                    formState={formStateLogin}
                    handleChangeLogin={handleChangeLogin}
                    handleSubmit={handleSubmit}
                />
            </main>
            <footer className="login-footer">
                <p>© 2024 Mi Aplicación. Todos los derechos reservados.</p>
            </footer>
        </div>
    )
}

function FormLogin({ formState, handleChangeLogin, handleSubmit }) {

    return (
        <form onSubmit={handleSubmit}>
            <FormGroup label="Email:" name="email" value={formState.email} handleChange={handleChangeLogin} type="email" />
            <FormGroup label="ContrseNa:" name="contrasena" value={formState.contrasena} handleChange={handleChangeLogin} type="password"/>
            <button type="submit" >Iniciar sesión</button>
        </form>
    );
}

function FormGroup({ label, name, value, handleChange, type='text' }) {
    return (
        <div className="form-group">
            <label>{label}</label>
            <input 
                type={type}
                name={name}
                value={value}
                onChange={handleChange}
                required
                />
        </div>
    );
}