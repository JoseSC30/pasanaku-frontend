// import React from 'react';
import './TaskList.css';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/context/AuthProvider';

const urlApi = 'http://localhost:4000';//URL base de la API

export default function TaskList() {
    
    const auth = useAuth();
    const navigate = useNavigate();

    const handleNavigation = () => {
        navigate('/crear-juego');
    };
    localStorage.removeItem("participante");
    const [juegos, setJuegos] = useState([]);
    //Usar el hook useEffect para cargar los juegos, con actualizacion cada vez que se cambie el estado de juegos
    useEffect(() => {
        const interval = setInterval(() => {
            fetch(`${urlApi}/juegos/especiales/${auth.user}`)
                .then(response => response.json())
                .then(data => {
                    console.log(data); // Imprime los datos en la consola
                    setJuegos(data);
                })
                .catch(error => console.error('Error:', error));
        }, 4000);
        return () => clearInterval(interval);
    }, [auth.user]);

    return (

        <div className="task-list" >
            <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'></link>
            <div className="sidebar">
                <div className="pasanaku-title">PASANAKU</div>
                <SidebarItem icon="bx bxs-bell" text="Notificaciones" marginTop="60px" />
                <SidebarItem icon="bx bx-search-alt-2" text="Buscar" />
            </div>
            <div className="header">
                <button className="crear-juego-button" onClick={handleNavigation}>
                    Crear Juego
                </button>
                <div className="user-info">
                    <p>Juan Gomez</p>
                </div>
            </div>
            <div className="tasks">
                {juegos.length > 0 ? (
                    juegos.map((juego) => (
                        <Task key={juego.id} juego={juego} />
                    ))
                ) : (
                    <div className="no-tasks">
                        <p>Cargando juegos...</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function SidebarItem({ icon, text, marginTop }) {
    return (
        <div className="sidebar-item" style={{ marginTop }}>
            <span className="icon">
                <i className={icon}></i>
            </span>
            <span>{text}</span>
        </div>
    );
}

function Task({ juego }) {
    const [estado, setEstado] = useState("");
    const navigate = useNavigate();
    useEffect(() => {
        fetch(`${urlApi}/estados/${juego.estadoId}`)
            .then(response => response.json())
            .then(data => {
                setEstado(data);
            })
            .catch(error => console.error('Error:', error));
    }, [juego]);
    const handleDetalles = (id) => {
        navigate(`/detalle-juego/${id}`);//Cambiar a la vista de detalles
    };
    return (
        <div className="task">
            <h2>{juego.nombreJuego}</h2>
            <div className="task-info">
                <p>Cantidad de Jugadores: {juego.cantidadJugadores}</p>
                <p>Periodo de Ronda: {juego.periodoRonda}</p>
                <p>Estado: {estado.nombre}</p>
            </div>
            <button onClick={() => handleDetalles(juego.id)} className="add-button">Detalles</button>
        </div>
    );
}
