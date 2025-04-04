(function () {
    const SERVIDOR = "https://10.1.2.155:5000";

    function capturarNomeUsuario() {
        const nomeSpan = document.querySelector("span._avatar-person-details__name_pn7wi_7 span");
        return nomeSpan ? nomeSpan.innerText.trim() : "Usuário Desconhecido";
    }

    function enviarJustificativa(usuario, justificativa) {
        fetch(`${SERVIDOR}/registrar_ausencia`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                usuario,
                justificativa,
                status: "Ausente",
                timestamp: new Date().toISOString()
            })
        })
        .then(res => res.json())
        .then(data => console.log("✅ Justificativa enviada:", data))
        .catch(err => console.error("❌ Erro ao enviar justificativa:", err));
    }

    function criarBotao() {
        if (document.getElementById("botao-justificar-ausencia")) return;

        const botao = document.createElement("button");
        botao.id = "botao-justificar-ausencia";
        botao.textContent = "Justificar Ausência";
        botao.style.position = "fixed";
        botao.style.bottom = "20px";
        botao.style.right = "20px";
        botao.style.padding = "10px 20px";
        botao.style.backgroundColor = "#02fea9";
        botao.style.color = "#000";
        botao.style.border = "none";
        botao.style.borderRadius = "10px";
        botao.style.boxShadow = "0 4px 6px rgba(0,0,0,0.2)";
        botao.style.zIndex = "9999";
        botao.style.cursor = "pointer";
        botao.style.fontWeight = "bold";

        botao.addEventListener("click", () => {
            const usuario = capturarNomeUsuario();
            const justificativa = prompt("Digite sua justificativa de ausência:");
            if (justificativa) {
                enviarJustificativa(usuario, justificativa);
                alert("✅ Justificativa registrada!");
            } else {
                alert("❌ Justificativa cancelada.");
            }
        });

        document.body.appendChild(botao);
    }

    setTimeout(criarBotao, 2000);
})();