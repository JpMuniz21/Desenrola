const connection = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

connection.query('SELECT NOW()')
    .then(() => console.log('✅ Banco PostgreSQL conectado'))
    .catch(err => console.error('❌ Erro no banco:', err));

// TODO: Migrar esta array para uma tabela 'item' no PostgreSQL para persistência real
let anuncios = [];
