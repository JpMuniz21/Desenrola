import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Usuario from "./pages/Usuario";
import Recuperar from "./components/Recuperar";
import Anuncio from "./components/Anuncio";
import ProdutoDetalhes from "./components/ProdutoDetalhes"; // Apontando exatamente para o arquivo com 's'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/usuario" element={<Usuario />} />
        <Route path="/recuperar" element={<Recuperar />} />
        <Route path="/anunciar" element={<Anuncio />} />
        <Route path="/produto/:id" element={<ProdutoDetalhes />} />
      </Routes>
    </Router>
  );
}