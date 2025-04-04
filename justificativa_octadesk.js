(function () {
    'use strict';

    function enviarJustificativa(nomeUsuario, justificativa) {
        fetch("https://servidor-ausencias.onrender.com/registrar_ausencia", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                usuario: nomeUsuario,
                justificativa: justificativa,
                timestamp: new Date().toISOString()
            })
        })
        .then(response => response.json())
        .then(data => console.log("✅ Justificativa enviada:", data))
        .catch(error => console.error("❌ Erro ao enviar justificativa:", error));
    }

    function capturarNomeUsuario() {
        let nomeDiv = document.querySelector("span._avatar-person-details__name_pn7wi_7 span");
        return nomeDiv ? nomeDiv.innerText.trim() : "Usuário Desconhecido";
    }

    function adicionarEventoAoBotao() {
        document.querySelectorAll("div._list-item-content_ufped_11").forEach(botao => {
            if (botao.innerText.includes("Ausente") && !botao.hasAttribute("data-justificativa-adicionada")) {
                botao.setAttribute("data-justificativa-adicionada", "true");

                botao.addEventListener("click", function () {
                    let justificativa = prompt("Digite sua justificativa para ficar ausente:");
                    if (justificativa) {
                        let nomeUsuario = capturarNomeUsuario();
                        enviarJustificativa(nomeUsuario, justificativa);
                        alert("Justificativa enviada com sucesso!");
                    }
                });
            }
        });
    }

    const observer = new MutationObserver(() => {
        adicionarEventoAoBotao();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Executa também após alguns segundos para garantir
    setTimeout(() => {
        adicionarEventoAoBotao();
    }, 3000);
})();
