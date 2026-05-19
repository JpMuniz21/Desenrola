import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./navbar";
import "../styles/login.css"; 


import iconMail from "../assets/mail.svg"; 
import iconCheck from "../assets/check_circle.svg"; 

const Recuperar = () => {
    const [etapa, setEtapa] = useState("email");
    const navigate = useNavigate();

    const handleProximaEtapa = (e) => {
        e.preventDefault();
        if (etapa === "email") setEtapa("codigo");
        else if (etapa === "codigo") setEtapa("sucesso");
    };

    return (
        <>
            <Navbar isLogin={true} />

            <div className="login-page-wrapper">
                <div className="login-card">
                    <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>
                        {etapa === "email" && "Recuperar Senha"}
                        {etapa === "codigo" && "Verificar Código"}
                        {etapa === "sucesso" && "Tudo Pronto!"}
                    </h2>
                    
                    <p className="subtitle" style={{ textAlign: 'center' }}>
                        {etapa === "email" && "Digite seu e-mail para receber o código de acesso."}
                        {etapa === "codigo" && "Insira o código de 6 dígitos enviado para o seu e-mail."}
                        {etapa === "sucesso" && "Sua identidade foi confirmada com segurança."}
                    </p>

                    {/* ETAPA 1: SOLICITAR EMAIL */}
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <img src={iconMail} alt="E-mail" style={{ width: '50px' }} />
                    </div>

                    {etapa === "email" && (
                        <form className="login-form" onSubmit={handleProximaEtapa}>
                            <div className="input-group">
                                <label>E-mail</label>
                                <input type="email" placeholder="seu@email.com" required />
                            </div>
                            <button type="submit" className="btn-primary">ENVIAR CÓDIGO</button>
                            <p className="signup-link">
                                Lembrou a senha? <Link to='/login'>Fazer Login</Link>
                            </p>
                        </form>
                    )}

                    {/* ETAPA 2: VALIDAR CÓDIGO */}
                    {etapa === "codigo" && (
                        <form className="login-form" onSubmit={handleProximaEtapa}>
                            <div className="input-group">
                                <label>Código de Verificação</label>
                                <input 
                                    type="text" 
                                    placeholder="000000" 
                                    maxLength={6} 
                                    required 
                                    style={{ 
                                        textAlign: 'center', 
                                        letterSpacing: '8px', 
                                        fontSize: '22px', 
                                        fontWeight: 'bold' 
                                    }}
                                />
                            </div>
                            <button type="submit" className="btn-primary">VALIDAR CÓDIGO</button>
                            <button 
                                type="button" 
                                className="guest-link" 
                                onClick={() => setEtapa("email")}
                                style={{ background: 'none', border: 'none', color: '#f26522', cursor: 'pointer', marginTop: '15px', width: '100%' }}
                            >
                                Reenviar e-mail
                            </button>
                        </form>
                    )}

                    {/* ETAPA 3: SUCESSO */}
                    {etapa === "sucesso" && (
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ margin: '20px 0' }}>
                                <img src={iconCheck} alt="Sucesso" style={{ width: '60px' }} />
                            </div>
                            <p style={{ marginBottom: '25px', color: '#666' }}>
                                Senha recuperada! Agora você pode voltar a desenrolar e alugar itens.
                            </p>
                            <button 
                                className="btn-primary" 
                                onClick={() => navigate("/")}
                            >
                                VOLTAR PARA O LOGIN
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default Recuperar;