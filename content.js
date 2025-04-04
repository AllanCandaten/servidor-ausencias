(function () {
    const SERVIDOR = "https://servidor-ausencias.onrender.com";
    let timerInterval;
    let tempoInicial;

    function capturarNomeUsuario() {
        const nomeSpan = document.querySelector("span._avatar-person-details__name_pn7wi_7 span");
        return nomeSpan ? nomeSpan.innerText.trim() : "Usuário Desconhecido";
    }

    function enviarJustificativa(usuario, justificativa, hora_entrada, hora_saida = null) {
        const dados = {
            usuario,
            justificativa,
            hora_entrada
        };

        if (hora_saida) {
            dados.hora_saida = hora_saida;
        }

        fetch(`${SERVIDOR}/registrar_ausencia`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)
        })
        .then(res => res.json())
        .then(data => console.log("✅ Justificativa enviada:", data))
        .catch(err => console.error("❌ Erro ao enviar justificativa:", err));
    }

    function iniciarTimer(modal, justificativa, usuario, botaoOriginal) {
        tempoInicial = new Date();
        const hora_entrada = tempoInicial.toISOString();

        enviarJustificativa(usuario, justificativa, hora_entrada); // <- Envia hora_entrada

        modal.innerHTML = `
            <h3 style="margin-bottom: 10px;">Ausente por: ${justificativa}</h3>
            <div id="timer" style="font-size: 24px; margin-bottom: 15px;">00:00</div>
        `;

        const botaoVoltar = document.createElement("button");
        botaoVoltar.textContent = "Ficar Online";
        Object.assign(botaoVoltar.style, {
            padding: "10px 20px", backgroundColor: "#fff",
            color: "#000", border: "2px solid #02fea9", borderRadius: "10px",
            fontWeight: "bold", cursor: "pointer"
        });

        modal.appendChild(botaoVoltar);

        botaoVoltar.addEventListener("click", () => {
            clearInterval(timerInterval);
            const hora_saida = new Date().toISOString();

            enviarJustificativa(usuario, justificativa, hora_entrada, hora_saida); // <- Envia hora_saida também

            alert("✅ Tempo registrado com sucesso!");
            document.getElementById("justificativa-overlay").remove();
            botaoOriginal.textContent = "Justificar Ausência";
            botaoOriginal.disabled = false;
        });

        timerInterval = setInterval(() => {
            const agora = new Date();
            const diff = Math.floor((agora - tempoInicial) / 1000);
            const minutos = String(Math.floor(diff / 60)).padStart(2, '0');
            const segundos = String(diff % 60).padStart(2, '0');
            modal.querySelector("#timer").textContent = `${minutos}:${segundos}`;
        }, 1000);
    }

    function criarModal(botaoOriginal, usuario) {
        const opcoes = ["Banheiro", "Lanche", "Telefone", "Reunião"];

        const fundo = document.createElement("div");
        fundo.id = "justificativa-overlay";
        Object.assign(fundo.style, {
            position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)", display: "flex",
            alignItems: "center", justifyContent: "center", zIndex: 9999
        });

        const modal = document.createElement("div");
        modal.style.background = "#fff";
        modal.style.padding = "20px";
        modal.style.borderRadius = "12px";
        modal.style.minWidth = "250px";
        modal.style.textAlign = "center";
        modal.innerHTML = "<h3>Escolha a justificativa:</h3>";

        opcoes.forEach(justificativa => {
            const btn = document.createElement("button");
            btn.textContent = justificativa;
            Object.assign(btn.style, {
                margin: "10px", padding: "10px 20px",
                backgroundColor: "#02fea9", border: "none",
                borderRadius: "6px", cursor: "pointer", fontWeight: "bold"
            });
            btn.onclick = () => {
                iniciarTimer(modal, justificativa, usuario, botaoOriginal);
            };
            modal.appendChild(btn);
        });

        fundo.appendChild(modal);
        document.body.appendChild(fundo);
    }

    function criarBotao() {
        if (document.getElementById("botao-justificar-ausencia")) return;

        const botao = document.createElement("button");
        botao.id = "botao-justificar-ausencia";
        botao.textContent = "Justificar Ausência";
        Object.assign(botao.style, {
            position: "fixed", bottom: "20px", right: "20px",
            padding: "10px 20px", backgroundColor: "#02fea9",
            color: "#000", border: "none", borderRadius: "10px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.2)", zIndex: "9999",
            cursor: "pointer", fontWeight: "bold"
        });

        botao.addEventListener("click", () => {
            const usuario = capturarNomeUsuario();
            criarModal(botao, usuario);
        });

        document.body.appendChild(botao);
    }

    setTimeout(criarBotao, 2000);
})();
