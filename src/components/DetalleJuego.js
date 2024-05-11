import './TaskList.css';
import { useNavigate, useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/context/AuthProvider';
import Modal from 'react-modal';

const urlApi = 'http://localhost:4000';//URL base de la API
Modal.setAppElement('#root');

export default function DetalleJuego() {

    const auth = useAuth();
    const idJuego = useParams().id;

    const navigate = useNavigate();

    const handleNavigation = () => {
        navigate('/');
    };

    const [juego, setJuego] = useState(null);
    const [invitacion, setInvitados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [participante, setParticipante] = useState(null);

    const [modalIsOpen, setModalIsOpen] = useState(false);

    useEffect(() => {
        if (!idJuego) {
            setError('No se proporcionó un ID de juego válido');
            setLoading(false);
            return;
        }
        //---------------------
        fetch(urlApi + `/participantes`)
            .then(response => response.json())
            .then(data => {
                for (let i = 0; i < data.length; i++) {
                    if (data[i].juegoId == idJuego && data[i].jugadorId == auth.jugador.id) {
                        localStorage.setItem("participante", JSON.stringify(data[i].id));
                        setParticipante(data[i].id);
                    }
                }
            })
            .catch(error => console.error('Error:', error));
        //---------------------
        fetch(urlApi + `/juegos/${idJuego}`) // Asegúrate de tener la URL correcta aquí
            .then(response => {
                if (!response.ok) {
                    throw new Error('La respuesta de la red no fue ok');
                }
                return response.json();
            })
            .then(data => {
                setJuego(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error:', error);
                setError(error.message);
                setLoading(false);
            });

        fetch(urlApi + `/invitaciones`) // Asegúrate de tener la URL correcta aquí
            .then(response => response.json())
            .then(data => {
                setInvitados(data.filter(inv => inv.participanteId == participante));
                setLoading(false);
            })
            .catch(error => {
                console.error('Error:', error);
                setError(error.message);
                setLoading(false);
            });
    }, [idJuego, participante, auth.jugador.id]);

    if (loading) {
        return <div>Cargando detalles del juego...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!juego) {
        return <div>No se encontraron detalles del juego</div>;
    }


    const handleModal = () => {
        setModalIsOpen(true);
    };

    const handleModalClose = () => {
        setModalIsOpen(false);
    };

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
                    Vista Principal
                </button>
                <button className="crear-juego-button" onClick={handleModal}>
                    Invitar
                </button>
                <div className="user-info">
                    <p>Juan Gomez</p>
                </div>
            </div>
            <div className="tasks">
                <div className="task-info">
                    <p>Nombre del Juego: {juego.nombreJuego}</p>
                    <p>Cantidad de Jugadores: {juego.cantidadJugadores}</p>
                    <p>Periodo de Ronda: {juego.periodoRonda}</p>
                    <p>Monto de Pago: {juego.montoPago}</p>
                    <p>Moneda: {juego.moneda}</p>
                    <p>Estado: {"Pendiente"}</p>
                </div>
            </div>
            <div className="tasks">
                {invitacion.length > 0 ? (
                    invitacion.map((inv) => (
                        <Task key={inv.id} inv={inv} />
                    ))
                ) : (
                    <div className="no-tasks">
                        <p>No se realizaron Invitaciones.</p>
                    </div>
                )}
            </div>
            <VistaModal isOpen={modalIsOpen} onClose={handleModalClose} />
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

function Task({ inv }) {

    const handleInvitar = () => {
        const reenvio =
        {
            email: inv.email,
            telefono: inv.telefono,
            nombre: inv.nombre,
            participanteId: inv.participanteId,
            estado: 1,
        }


        fetch(urlApi + '/invitaciones/reenvio', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reenvio),
        })
            .then(response => response.json())
            .then(data => {
                console.log("Invitación reenviada con éxito:", data);
            })
            .catch(error => {
                console.error("Error al reenviar invitación:", error);
            });
    };

    return (
        <div className="task">
            <h2>{inv.nombreJuego}</h2>
            <div className="task-info">
                <p>Correo Electronico: {inv.email}</p>
                <p>Telefono: {inv.telefono}</p>
                <p>Estado: {"Pendiente"}</p>
                <p>Fecha - Hora: {inv.fechaHoraInvitacion}</p>
            </div>
            <button onClick={handleInvitar} className="add-button">Reenviar Invitacion</button>
        </div>
    );
}

function VistaModal({ isOpen, onClose }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    function handleSubmit(e) {
        e.preventDefault();
        //---------------------
        fetch(urlApi + '/invitaciones', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nombre: name,
                participanteId: JSON.parse(localStorage.getItem("participante")),
                email: email,
                telefono: phone,
                estadoId: 1,
            }
            ),
        }).then(() => {
            onClose();
        }).catch(error => console.error('Error creando participante:', error));
        //---------------------
        console.log(name, email, phone);
    }

    function handleClose(e) {
        e.preventDefault();
        console.log("cerrar");
        onClose();
    }

    return (
        <Modal isOpen={isOpen} onRequestClose={onClose}>
            <h2>Formulario de Contacto</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nombre"
                    required
                />
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                />
                <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Teléfono"
                    required
                />
                <button type="submit">Enviar</button>
            </form>
            <button onClick={handleClose}>Cerrar</button>
        </Modal>
    );
}