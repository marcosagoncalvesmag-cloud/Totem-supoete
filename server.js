const express = require('express');
const app = express();

app.use(express.json());

// Aqui vamos armazenar os pagamentos recebidos
let pagamentos = {};

// 🔹 WEBHOOK (o banco chama aqui)
app.post('/webhook', (req, res) => {
    console.log('Webhook recebido:', req.body);

    // Ajuste isso conforme o padrão do EFI depois
    const id = req.body.txid || req.body.id || "sem_id";

    pagamentos[id] = "pago";

    console.log(`Pagamento confirmado para: ${id}`);

    res.sendStatus(200);
});

// 🔹 ESP32 consulta aqui
app.get('/status', (req, res) => {
    const id = req.query.id;

    if (!id) {
        return res.json({ status: "erro", mensagem: "id não enviado" });
    }

    const status = pagamentos[id] || "aguardando";

    res.json({ status: status });
});

// 🔹 rota teste
app.get('/', (req, res) => {
    res.send("Servidor rodando 🚀");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
