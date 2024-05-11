import { useContext, createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

var urlBaseApi = "http://localhost:4000";//URL base de la API

const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token") || "");
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || "");
    const [jugador, setJugador] = useState(JSON.parse(localStorage.getItem("jugador")) || "");
    const [participante, setParticipante] = useState(JSON.parse(localStorage.getItem("participante")) || "");
    //
    
    const navigate = useNavigate();

    const login = async (data) => {
        try {
            const response = await fetch(urlBaseApi + "/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    //Enviar el token en el header
                    // Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });
            const res = await response.json();

            localStorage.setItem("token", res.accessToken);
            const user = JSON.parse(atob(res.accessToken.split(".")[1]));
            localStorage.setItem("user", JSON.stringify(user.usuarioId));

            setToken(res.accessToken);
            setUser(user.usuarioId);
            setParticipante("");
            console.log(res)

            console.log("ID Usuario: "+user.usuarioId)
            navigate("/");
        } catch (error) {
            console.error("Error:", error);
        }

        await fetch(`${urlBaseApi}/jugadores/otro/${JSON.parse(localStorage.getItem("user"))}`)
        .then(response => response.json())
                .then(data => {
                    setJugador(data);
                    console.log(data);
                    localStorage.setItem("jugador", JSON.stringify(data));
                })
                .catch(error => console.error('Error:', error)); 
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("jugador");
        localStorage.removeItem("participante");
        setToken("");
        setUser("");
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{
            jugador,
            user,
            token,
            participante,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

export const useAuth = () => {
    return useContext(AuthContext);
}