import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import Usuario from "./pages/usuario";
import Cadastro from "./pages/cadastro";
import Recuperar from "./components/Recuperar";
import Anuncio from "./components/Anuncio";
import ProdutoDetalhes from "./components/ProdutoDetalhes";
import Aluguel from "./pages/aluguel";
import ConfirmarAluguel from "./pages/confirmar_aluguel";
import Pagamento from "./pages/pagamento";
import Confirmacao from "./pages/confirmacao";
import Favoritos from "./pages/favoritos";
import Chat from "./components/chat";
import EditarItem from "./pages/editar_itens";
import Admin from "./pages/admin";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/usuario" element={<Usuario />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/recuperar" element={<Recuperar />} />
        <Route path="/anunciar" element={<Anuncio />} />
        <Route path="/produto/:id" element={<ProdutoDetalhes />} />
        <Route path="/aluguel/:id" element={<Aluguel />} />
        <Route path="/confirmar-aluguel" element={<ConfirmarAluguel />} />
        <Route path="/pagamento" element={<Pagamento />} />
        <Route path="/confirmacao" element={<Confirmacao />} />
        <Route path="/favoritos" element={<Favoritos />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/editar-item/:id" element={<EditarItem />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}