 <div className="left">
    <input
      value={titulo}
      onChange={(e) => setTitulo(e.target.value)}
      placeholder="Nome do produto"
    />

    <input
      type="number"
      value={preco}
      onChange={(e) => setPreco(e.target.value)}
      placeholder="Preço"
    />
    {/*<input
      value={descricao}
      onChange={(e) => setDescricao(e.target.value)}
      placeholder="Descrição"
    />}*/}

    <select value={periodo} onChange={(e) => setPeriodo(e.target.value)}>
      <option value="dia">por dia</option>
      <option value="mês">por mês</option>
    </select>

    <button className="btn-cadastro" onClick={adicionar}>
      Adicionar
    </button>
  </div>