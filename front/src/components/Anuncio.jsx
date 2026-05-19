import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./navbar";
import "../styles/anuncio.css";

export default function Anuncio() {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [tipoLocacao, setTipoLocacao] = useState("dia");
  const [descricao, setDescricao] = useState("");
  const [imagem, setImagem] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  useEffect(() => {
    const usuarioLogado = localStorage.getItem("userId");
    if (!usuarioLogado) {
      alert("Você precisa estar logado para anunciar um item! 🛡️");
      navigate("/login");
    }
  }, [navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagem(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = (e) => {
    e.preventDefault();
    setImagem(null);
    setPreviewUrl(null);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem("userId");

    if (!userId) {
      alert("Erro de autenticação. Faça login novamente.");
      navigate("/login");
      return;
    }

    if (!nome || !preco || !descricao || !imagem) {
      alert("Por favor, preencha todos os campos e adicione uma foto do seu produto!");
      return;
    }

    const formData = new FormData();
    formData.append("nome", nome);
    formData.append("preco", parseFloat(preco));
    formData.append("tipoLocacao", tipoLocacao);
    formData.append("descricao", descricao);
    formData.append("imagem", imagem);
    formData.append("usuarioId", userId);

    try {
      const response = await fetch("http://localhost:3001/api/produtos", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Anúncio criado com absoluto sucesso!");
        setNome("");
        setPreco("");
        setDescricao("");
        setImagem(null);
        setPreviewUrl(null);
        navigate("/");
      } else {
        const erroData = await response.json();
        alert(`Erro ao criar anúncio: ${erroData.message || "Erro no servidor."}`);
      }
    } catch (error) {
      console.error("Erro na requisição de upload:", error);
      alert("Não foi possível conectar ao servidor do back-end.");
    }
  };

  return (
    <div className="anuncio-page-bg">
      <Navbar />
      <main className="anuncio-main-content">
        <form className="anuncio-card-container" onSubmit={handleSubmit}>
          
          {/* LADO ESQUERDO: UPLOAD */}
          <div className="anuncio-upload-side">
            {previewUrl ? (
              <div className="preview-container">
                <img src={previewUrl} alt="Preview" className="anuncio-image-preview" />
                <button className="btn-remove-image" onClick={handleRemoveImage} title="Remover imagem">
                  ✕
                </button>
              </div>
            ) : (
              <>
                <label htmlFor="file-input" className="anuncio-upload-box">
                  <div className="anuncio-plus-circle">
                    <span>+</span>
                  </div>
                </label>
                <input 
                  id="file-input" 
                  type="file" 
                  accept="image/*"
                  style={{ display: 'none' }} 
                  onChange={handleImageChange}
                />
              </>
            )}
          </div>

          {/* LADO DIREITO: CAMPOS */}
          <div className="anuncio-form-side">
            <input 
              type="text" 
              placeholder="Nome do produto:" 
              className="anuncio-field"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
            
            <div className="anuncio-price-group">
              <input 
                type="number" 
                step="0.01"
                placeholder="Valor (R$):" 
                className="anuncio-field price-field"
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
              />
              
              <select 
                className="anuncio-field select-field"
                value={tipoLocacao}
                onChange={(e) => setTipoLocacao(e.target.value)}
              >
                <option value="dia">Por Dia</option>
                <option value="mes">Por Mês</option>
              </select>
            </div>
            
            <textarea 
              placeholder="Descrição:" 
              className="anuncio-field anuncio-textarea"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            ></textarea>
            
            <button type="submit" className="anuncio-btn-submit">
              <div className="anuncio-btn-icon">+</div>
              Criar o anuncio!
            </button>
          </div>

        </form>
      </main>
    </div>
  );
}