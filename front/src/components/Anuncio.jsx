import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import Toast from "../components/Toast";
import "../styles/anuncio.css";

export default function Anuncio() {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [tipoLocacao, setTipoLocacao] = useState("dia");
  const [descricao, setDescricao] = useState("");
  const [imagem, setImagem] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [toast, setToast] = useState(null);
  const [categoria, setCategoria] = useState("");
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    const usuarioLogado = localStorage.getItem("userId");
    if (!usuarioLogado) {
      setToast({ mensagem: "Você precisa estar logado para anunciar!", tipo: "erro" });
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    fetch("http://localhost:3001/categorias")
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setCategorias(data); })
      .catch(() => setCategorias([
        { id_categoria: 1, nome: "Fotografia" },
        { id_categoria: 2, nome: "Vídeo Games" },
      ]));
  }, [navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) { setImagem(file); setPreviewUrl(URL.createObjectURL(file)); }
  };

  const handleRemoveImage = (e) => {
    e.preventDefault();
    setImagem(null);
    setPreviewUrl(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId) {
      setToast({ mensagem: "Erro de autenticação. Faça login novamente.", tipo: "erro" });
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    if (!nome || !preco || !descricao || !imagem) {
      setToast({ mensagem: "Preencha todos os campos e adicione uma foto!", tipo: "erro" });
      return;
    }

    const toBase64 = (file) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

    const imagemBase64 = await toBase64(imagem);

    try {
      const response = await fetch("http://localhost:3001/itens", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({
          nome,
          preco: parseFloat(preco),
          periodo: tipoLocacao,
          descricao,
          imagem: imagemBase64,
          id_categoria: categoria || null,
        }),
      });

      if (response.ok) {
        setToast({ mensagem: "Anúncio criado com sucesso!", tipo: "sucesso" });
        setNome(""); setPreco(""); setDescricao(""); setCategoria("");
        setImagem(null); setPreviewUrl(null);
        setTimeout(() => navigate("/"), 1500);
      } else {
        const erroData = await response.json();
        setToast({ mensagem: `Erro: ${erroData.erro || erroData.message || "Erro no servidor."}`, tipo: "erro" });
      }
    } catch (error) {
      setToast({ mensagem: "Não foi possível conectar ao servidor.", tipo: "erro" });
    }
  };

  return (
    <div className="anuncio-page-bg">
      <Navbar />
      <main className="anuncio-main-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className="anuncio-content-wrapper" style={{ width: '100%', maxWidth: '900px', display: 'flex', flexDirection: 'column' }}>

          <button
            onClick={() => navigate(-1)}
            className="btn-voltar-passo"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: '#64748b', fontSize: '15px', fontWeight: '600', cursor: 'pointer', padding: '8px 0', marginBottom: '12px', transition: 'color 0.2s ease', alignSelf: 'flex-start' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#f97316'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Voltar
          </button>

          <form className="anuncio-card-container" onSubmit={handleSubmit} style={{ width: '100%', margin: 0 }}>

            <div className="anuncio-upload-side">
              {previewUrl ? (
                <div className="preview-container">
                  <img src={previewUrl} alt="Preview" className="anuncio-image-preview" />
                  <button className="btn-remove-image" onClick={handleRemoveImage} title="Remover imagem">✕</button>
                </div>
              ) : (
                <>
                  <label htmlFor="file-input" className="anuncio-upload-box">
                    <div className="anuncio-plus-circle"><span>+</span></div>
                  </label>
                  <input id="file-input" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
                </>
              )}
            </div>

            <div className="anuncio-form-side">
              <input type="text" placeholder="Nome do produto:" className="anuncio-field" value={nome} onChange={(e) => setNome(e.target.value)} />

              <div className="anuncio-price-group">
                <input type="number" step="0.01" placeholder="Valor (R$):" className="anuncio-field price-field" value={preco} onChange={(e) => setPreco(e.target.value)} />
                <select className="anuncio-field select-field" value={tipoLocacao} onChange={(e) => setTipoLocacao(e.target.value)}>
                  <option value="dia">Por Dia</option>
                  <option value="mes">Por Mês</option>
                </select>
              </div>

              <select className="anuncio-field" value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                <option value="">Selecione uma categoria</option>
                {categorias.map((cat) => (
                  <option key={cat.id_categoria} value={cat.id_categoria}>{cat.nome}</option>
                ))}
              </select>

              <textarea placeholder="Descrição:" className="anuncio-field anuncio-textarea" value={descricao} onChange={(e) => setDescricao(e.target.value)}></textarea>

              <button type="submit" className="anuncio-btn-submit">
                <div className="anuncio-btn-icon">+</div>
                Criar o anuncio!
              </button>
            </div>

          </form>
        </div>
      </main>

      {toast && <Toast mensagem={toast.mensagem} tipo={toast.tipo} onClose={() => setToast(null)} />}
    </div>
  );
}