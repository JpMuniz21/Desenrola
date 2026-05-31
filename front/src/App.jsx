import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

// Importação das Páginas
import Cadastro from "./pages/Cadastro";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Usuario from "./pages/Usuario";
import Recuperar from "./components/Recuperar";
import Anuncio from "./components/Anuncio";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/usuario" element={<Usuario />} />
        <Route path="/recuperar" element={<Recuperar />} />
        <Route path="/anunciar" element={<Anuncio />} />
      </Routes>
    </BrowserRouter>
  );
}