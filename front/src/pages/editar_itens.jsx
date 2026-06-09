import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import Toast from "../components/Toast";
import "../styles/anuncio.css";

export default function EditarItem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [tipoLocacao, setTipoLocacao] = useState("dia");
  const [descricao, setDescricao] = useState("");
  const [imagem, setImagem] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [confirmarExclusao, setConfirmarExclusao] = useState(false);

  useEffect(() => {
    async function carregarItem() {
      try {
        const res = await fetch(`http://localhost:3001/itens/${id}`);
        const data = await res.json();
        setNome(data.nome || "");
        setPreco(data.preco || "");
        setTipoLocacao(data.periodo || "dia");
        setDescricao(data.descricao || "");
        setPreviewUrl(data.imagem || null);
      } catch (err) {
        console.error("Erro ao carregar item:", err);
      } finally {
        setLoading(false);
      }
    }
    carregarItem();
  }, [id]);

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
    const token = localStorage.getItem("token");

    if (!nome || !preco || !descricao) {
      setToast({ mensagem: "Preencha todos os campos!", tipo: "erro" });
      return;
    }

    let imagemFinal = previewUrl;
    if (imagem) {
      const toBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
      });
      imagemFinal = await toBase64(imagem);
    }

    try {
      const response = await fetch(`http://localhost:3001/itens/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ nome, preco: parseFloat(preco), periodo: tipoLocacao, descricao, imagem: imagemFinal }),
      });

      if (response.ok) {
        setToast({ mensagem: "Item atualizado com sucesso!", tipo: "sucesso" });
        setTimeout(() => navigate(`/produto/${id}`), 1500);
      } else {
        const erro = await response.json();
        setToast({ mensagem: `Erro: ${erro.erro || "Erro no servidor"}`, tipo: "erro" });
      }
    } catch (err) {
      setToast({ mensagem: "Não foi possível conectar ao servidor.", tipo: "erro" });
    }
  };

  const handleExcluir = async () => {
    const token = localStorage.getItem("token");
    try {
      await fetch(`http://localhost:3001/itens/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      setToast({ mensagem: "Item excluído com sucesso!", tipo: "sucesso" });
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setToast({ mensagem: "Erro ao excluir item.", tipo: "erro" });
    }
  };

  if (loading) return <p style={{ textAlign: "center", marginTop: "50px" }}>Carregando...</p>;

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

              <textarea placeholder="Descrição:" className="anuncio-field anuncio-textarea" value={descricao} onChange={(e) => setDescricao(e.target.value)} />

              <button type="submit" className="anuncio-btn-submit">
                <div className="anuncio-btn-icon">✓</div>
                Salvar alterações
              </button>

              <button
                type="button"
                onClick={() => setConfirmarExclusao(true)}
                style={{ width: '100%', marginTop: '10px', padding: '14px', background: 'none', border: '2px solid #e53e3e', color: '#e53e3e', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', transition: '0.2s' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#e53e3e'; e.currentTarget.style.color = 'white'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#e53e3e'; }}
              >
                Excluir item
              </button>
            </div>

          </form>
        </div>
      </main>

      {/* MODAL CONFIRMAR EXCLUSÃO */}
      {confirmarExclusao && (
        <div className="modal-overlay">
          <div className="modal-perfil-card" style={{ maxWidth: "420px" }}>
            <div className="modal-perfil-header">
              <h3>Excluir item</h3>
              <button className="btn-modal-fechar" onClick={() => setConfirmarExclusao(false)}>&times;</button>
            </div>
            <p style={{ padding: "0 4px 16px", color: "#555" }}>
              Tem certeza que deseja excluir <strong>"{nome}"</strong>? Essa ação não pode ser desfeita.
            </p>
            <div className="modal-perfil-footer">
              <button className="btn-cancelar-modal" onClick={() => setConfirmarExclusao(false)}>Cancelar</button>
              <button
                style={{ flex: 1, padding: "12px", borderRadius: "10px", cursor: "pointer", background: "#e53e3e", color: "white", border: "none", fontWeight: "600", fontSize: "15px" }}
                onClick={handleExcluir}
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast mensagem={toast.mensagem} tipo={toast.tipo} onClose={() => setToast(null)} />}
    </div>
  );
}