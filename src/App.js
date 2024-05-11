import { BrowserRouter, Routes, Route } from "react-router-dom"
import CrearForm from "./components/CrearForm"
import TaskList from "./components/TaskList"
import DetalleJuego from "./components/DetalleJuego"
import Login from "./components/Login"
import Hola from "./components/Hola"
import AuthProvider from "./auth/context/AuthProvider"
import { PrivateRoute, PublicRoute} from "./auth/router/route"


export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* RUTAS PUBLICAS */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/hola" element={<Hola />} />
          </Route>
          {/* RUTAS PRIVADAS */}
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<TaskList />} />
            <Route path="/crear-juego" element={<CrearForm />} />
            <Route path="/detalle-juego/:id" element={<DetalleJuego />} />
            <Route path="/taskForm/:id/edit" element={<CrearForm />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}