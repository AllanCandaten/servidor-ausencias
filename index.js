const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const banco = "ausencias.json";

app.post('/registrar_ausencia', (req, res) => {
    const { usuario, justificativa, hora_entrada, hora_saida } = req.body;

    console.log({ usuario, justificativa, hora_entrada, hora_saida });

    let dados = [];
    if (fs.existsSync(banco)) {
        dados = JSON.parse(fs.readFileSync(banco));
    }

    dados.push({ usuario, justificativa, status, timestamp });

    fs.writeFileSync(banco, JSON.stringify(dados, null, 2));
    res.json({ ok: true, msg: "Justificativa registrada" });
});

app.get("/relatorio", (req, res) => {
    if (!fs.existsSync(banco)) return res.json([]);
    const dados = JSON.parse(fs.readFileSync(banco));
    res.json(dados);
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
