const { Pool } = require('pg');

const connection = new Pool({
  user: 'postgres.qavddyjminvytewbfqju', 
  host: 'aws-1-us-east-2.pooler.supabase.com',
  database: 'postgres',
  password: 'desenrolabatejogadeladinho1234',
  port: 5432,
  ssl: {
    rejectUnauthorized: false
  }
});

connection.query('SELECT NOW()')
  .then(() => console.log('✅ Banco PostgreSQL conectado com sucesso no Supabase!'))
  .catch(err => console.error('❌ Erro no banco:', err));

// Mantém o array temporário que estava no arquivo original para não quebrar as rotas
let anuncios = [];

module.exports = connection;