import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/context/AuthProvider';

const urlApi = 'http://localhost:4000';//URL base de la API

export default function CrearForm() {
    const [formState, setFormState] = useState({
        nombreJuego: '',
        cantidadJugadores: '',
        moneda: '',
        montoPago: '',
        periodoRonda: '',
        estadoId: 1,
    });

    const handleChange = (e) => {
        setFormState({
            ...formState,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <div className="task-list">
            <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'></link>
            <div className="sidebar">
                <div className="pasanaku-title">PASANAKU</div>
                <SidebarItem icon="bx bxs-bell" text="Notificaciones" marginTop="60px" />
                <SidebarItem icon="bx bx-search-alt-2" text="Buscar" />
            </div>
            <div className="header">
                <h2>Configuracion del nuevo juego</h2>
                <div className="user-info">
                    <p>Juan Gomez</p>
                </div>
            </div>
            <div className="tasks">
                <Form
                    formState={formState}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit} />
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
function Form({ formState, handleChange, handleSubmit }) {

    const auth = useAuth();

    const navigate = useNavigate();

    const handleCancel = () => {
        navigate('/');
    }

    const handleCrearJuego = () => {
        // Enviar los datos del formulario a la base de datos mediante una peticion POST(lo siguiente es un ejemplo).
        fetch(urlApi + '/juegos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formState),
        }).then(response => response.json())
            .then(data => {
                fetch(urlApi + '/participantes', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        jugadorId: auth.jugador.id,
                        juegoId: data.id,
                        estadoId: 5,
                        rolId: 1,
                    }
                    ),
                }).then(() => {
                    navigate('/');
                }).catch(error => console.error('Error creando participante:', error));
            })
            .catch(error => console.error('Error creando juego:', error));

        //--- CREAR PARTICIPANTE POR DEFECTO ---

        //----------------------------------------
    }

    return (
        <form onSubmit={handleSubmit} className="form">
            <FormGroup label="Nombre del Grupo:" name="nombreJuego" value={formState.nombreJuego} handleChange={handleChange} />
            <FormGroup label="Monto de Pago Por Turno:" name="montoPago" value={formState.montoPago} handleChange={handleChange} type="number" />
            <div>
                <label>Moneda:</label>
                <div>
                    <input type="radio" id="bolivianos" name="moneda" value="Bolivianos" onChange={handleChange} />
                    <label htmlFor="bolivianos">Bolivianos</label>
                </div>
                <div>
                    <input type="radio" id="dolares" name="moneda" value="Dolares" onChange={handleChange} />
                    <label htmlFor="dolares">Dolares</label>
                </div>
            </div>
            <div>
                <label>Duracion del Turno:</label>
                <div>
                    <input type="radio" id="2semanas" name="periodoRonda" value="2 semanas" onChange={handleChange} />
                    <label htmlFor="2semanas">2 semanas</label>
                </div>
                <div>
                    <input type="radio" id="1mes" name="periodoRonda" value="1 mes" onChange={handleChange} />
                    <label htmlFor="1mes">1 mes</label>
                </div>
                <div>
                    <input type="radio" id="1mes" name="periodoRonda" value="1 mes" onChange={handleChange} />
                    <label htmlFor="1mes">1 minuto</label>
                </div>
            </div>
            <FormGroup label="Cantidad de Jugadores:" name="cantidadJugadores" value={formState.cantidadJugadores} handleChange={handleChange} type="number" />

            <button type="submit" onClick={handleCrearJuego} className="add-button">Crear Grupo</button>
            <button type="button" onClick={handleCancel} className="cancel-button">Cancelar</button>
        </form>
    );
}

function FormGroup({ label, name, value, handleChange, type = "text" }) {
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