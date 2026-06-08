import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Usuario from "./pages/Usuario";
import Recuperar from "./components/Recuperar";
import Anuncio from "./components/Anuncio";
import ProdutoDetalhes from "./components/ProdutoDetalhes"; 
import Aluguel from "./pages/Aluguel";
import ConfirmarAluguel from "./pages/confirmar_aluguel";
import Pagamento from "./pages/pagamento";
import Confirmacao from "./pages/Confirmacao";
import Favoritos from "./pages/Favoritos";

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
        <Route path="/aluguel/:id" element={<Aluguel />} />
        <Route path="/confirmar-aluguel" element={<ConfirmarAluguel />} />
        <Route path="/pagamento" element={<Pagamento />} />
        <Route path="/confirmacao" element={<Confirmacao />} />
        <Route path="/favoritos" element={<Favoritos />} />
      </Routes>
    </Router>
  );
}