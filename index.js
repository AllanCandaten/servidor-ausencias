const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const banco = "ausencias.json";

app.post('/registrar_ausencia', (req, res) => {
    const { usuario, justificativa, hora_entrada, hora_saida } = req.body;

    let dados = [];
    if (fs.existsSync(banco)) {
        dados = JSON.parse(fs.readFileSync(banco));
    }

    // Se já existe um registro com mesma hora_entrada e sem hora_saida, atualiza
    const registroAberto = dados.find(r =>
        r.usuario === usuario &&
        r.hora_entrada === hora_entrada &&
        !r.hora_saida
    );

    if (registroAberto && hora_saida) {
        registroAberto.hora_saida = hora_saida;
    } else {
        dados.push({ usuario, justificativa, hora_entrada });
    }

    fs.writeFileSync(banco, JSON.stringify(dados, null, 2));
    res.json({ ok: true, msg: "Registro salvo/atualizado com sucesso" });
});

app.get("/relatorio", (req, res) => {
    if (!fs.existsSync(banco)) return res.json([]);
    const dados = JSON.parse(fs.readFileSync(banco));
    res.json(dados);
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
