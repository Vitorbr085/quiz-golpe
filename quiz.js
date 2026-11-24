/* Quiz "É golpe ou não?" — FB Negócios
   Versão independente (extraída de assets/js/main.js e assets/js/data.js). */
(() => {
  "use strict";
  const D = {
  quizGolpe: [
    { texto: "Pediram um depósito ou uma “taxa de liberação” antes de o dinheiro cair na minha conta.", resposta: "golpe",
      explicacao: "Nenhuma empresa séria cobra valor antecipado para liberar empréstimo. Correspondentes bancários não podem nem receber depósitos." },
    { texto: "Antes de assinar, recebi a proposta com o valor das parcelas, a taxa de juros e o CET para conferir.", resposta: "seguro",
      explicacao: "É assim que deve ser: você tem o direito de ver o Custo Efetivo Total (CET) e todas as condições antes de contratar." },
    { texto: "Uma pessoa ligou dizendo ser do INSS e oferecendo um empréstimo com condições especiais.", resposta: "golpe",
      explicacao: "O INSS não liga oferecendo empréstimo e não vende crédito. Desconfie de quem usa o nome do órgão." },
    { texto: "Caiu um dinheiro que eu não contratei e me pediram para devolver por PIX para outra conta.", resposta: "golpe",
      explicacao: "A devolução de um crédito não contratado é feita com o próprio banco, pelos canais oficiais. Nunca para a conta de terceiros." },
    { texto: "Pediram a senha do meu banco ou do Meu INSS para “agilizar” a proposta.", resposta: "golpe",
      explicacao: "Ninguém precisa da sua senha para fazer uma proposta. Senha é pessoal: não passe para ninguém, nem para o atendente." },
    { texto: "Na portabilidade do benefício do INSS, precisei confirmar o pedido no aplicativo Meu INSS.", resposta: "seguro",
      explicacao: "A confirmação pelo Meu INSS é uma etapa de segurança da portabilidade: garante que foi você quem pediu a troca de banco." },
    { texto: "A empresa me informou o CNPJ, se apresentou como correspondente bancário e eu conferi os dados.", resposta: "seguro",
      explicacao: "Ótima atitude! Conferir CNPJ e canais oficiais é o primeiro passo para contratar com segurança." },
    { texto: "Recebi um link no WhatsApp para “atualizar o cadastro do benefício” e evitar o bloqueio.", resposta: "golpe",
      explicacao: "Links com ameaça de bloqueio são uma armadilha clássica para roubar dados. Acesse sempre os sites e apps oficiais por conta própria." },
  ],
  };
  const E = { whatsapp: { numero: "5585996732850" } };

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esc = (s = "") => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const icon = (id, cls = "i") => `<svg viewBox="0 0 24 24" class="${cls}"><use href="#i-${id}"/></svg>`;
  const waLink = (num, text) => `https://wa.me/${num}?text=${encodeURIComponent(text)}`;
  let toastT;
  function toast(msg) {
    const t = $("#toast"); t.textContent = msg; t.classList.add("is-visible");
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("is-visible"), 3800);
  }

  // Quiz "É golpe ou não?"
  function quizGolpe() {
    const Q = D.quizGolpe, root = $("#quiz"); if (!Q || !root) return;
    const stage = $("#quizStage"), actions = $("#quizActions");
    const bar = $("#quizBar"), count = $("#quizCount"), score = $("#quizScore"), top = $("#quizTop");
    let ordem = [], i = 0, acertos = 0, travado = false;

    const embaralhar = (a) => a.map((v) => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map((v) => v[1]);
    const placar = () => {
      count.textContent = `${Math.min(i + 1, Q.length)} / ${Q.length}`;
      score.textContent = `${acertos} ${acertos === 1 ? "acerto" : "acertos"}`;
      bar.style.width = `${(i / Q.length) * 100}%`;
    };

    function telaInicial() {
      travado = true; root.classList.add("is-idle"); top.hidden = true; actions.hidden = true;
      stage.innerHTML = `
        <div class="qstart">
          <div class="qstart__icon" aria-hidden="true">${icon("shield")}</div>
          <h3 class="qstart__title">Você sabe reconhecer um golpe?</h3>
          <p class="qstart__txt">${Q.length} situações do dia a dia do consignado. Leva menos de 1 minuto e você pode sair quando quiser.</p>
          <button type="button" class="btn btn--primary btn--lg magnetic" data-start>Começar o teste →</button>
        </div>`;
    }

    function carta() {
      travado = false; root.classList.remove("is-idle"); top.hidden = false; actions.hidden = false; placar();
      const q = ordem[i];
      stage.innerHTML = `
        <div class="qcard" tabindex="0" role="group" aria-label="Situação ${i + 1} de ${Q.length}">
          <span class="qcard__stamp qcard__stamp--golpe" aria-hidden="true">GOLPE</span>
          <span class="qcard__stamp qcard__stamp--seguro" aria-hidden="true">SEGURO</span>
          <span class="qcard__n">Situação ${i + 1}</span>
          <p class="qcard__txt">${esc(q.texto)}</p>
          <span class="qcard__hint" aria-hidden="true">← arraste →</span>
        </div>
        <div class="qcard qcard--back" aria-hidden="true"></div>`;
      arrastar($(".qcard", stage));
    }

    function responder(ans, dir) {
      if (travado) return; travado = true;
      const q = ordem[i], ok = ans === q.resposta, card = $(".qcard", stage);
      if (ok) acertos++;
      card.style.transition = "transform .5s cubic-bezier(.22,1,.36,1), opacity .5s";
      card.style.transform = `translateX(${(dir || (ans === "golpe" ? -1 : 1)) * 140}%) rotate(${(dir || (ans === "golpe" ? -1 : 1)) * 18}deg)`;
      card.style.opacity = "0";
      actions.hidden = true;
      setTimeout(() => {
        score.textContent = `${acertos} ${acertos === 1 ? "acerto" : "acertos"}`;
        stage.innerHTML = `
          <div class="qfeed ${ok ? "is-ok" : "is-err"}">
            <div class="qfeed__icon" aria-hidden="true">${ok ? "✓" : "✕"}</div>
            <h3 class="qfeed__title">${ok ? "Acertou!" : "Quase!"} Isso é <b>${q.resposta === "golpe" ? "golpe" : "seguro"}</b>.</h3>
            <p class="qfeed__txt">${esc(q.explicacao)}</p>
            <button type="button" class="btn btn--primary magnetic" data-next>${i + 1 < Q.length ? "Próxima situação →" : "Ver meu resultado"}</button>
          </div>`;
        $("[data-next]", stage).focus({ preventScroll: true });
      }, 380);
    }

    function resultado() {
      bar.style.width = "100%"; actions.hidden = true;
      count.textContent = `${Q.length} / ${Q.length}`;
      const pct = acertos / Q.length;
      const [titulo, txt] = pct === 1 ? ["Expert em segurança!", "Você reconheceu todos os sinais. Compartilhe com quem precisa ficar atento."]
        : pct >= 0.6 ? ["Mandou bem!", "Você está atento, mas alguns golpes são bem convincentes. Na dúvida, fale com quem é autorizado."]
        : ["Atenção redobrada!", "Os golpistas são criativos. Antes de contratar, sempre confira quem está do outro lado."];
      stage.innerHTML = `
        <div class="qres">
          <div class="qres__ring" style="--p:${pct}"><span><b>${acertos}</b>/${Q.length}</span></div>
          <h3 class="qres__title">${titulo}</h3>
          <p class="qres__txt">${txt}</p>
          <div class="qres__actions">
            <a class="btn btn--primary magnetic" href="${waLink(E.whatsapp.numero, "Olá FB Negócios! Fiz o teste de golpes no site e quero contratar com segurança.")}" target="_blank" rel="noopener">${icon("whatsapp")} Falar com a FB</a>
            <button type="button" class="btn btn--ghost" data-restart>Refazer o teste</button>
            <button type="button" class="link-btn" data-home>Voltar ao início</button>
          </div>
          <p class="qres__note">A FB Negócios é correspondente bancária (Res. 3.954 BACEN) e <b>nunca</b> pede depósito antecipado, senha ou pagamento para liberar crédito.</p>
        </div>`;
      if (acertos === Q.length) confete();
    }

    function confete() {
      if (reduceMotion) return;
      const cores = ["#1c2a4b", "#8ea6da", "#ffffff", "#4a6399", "#c3d0ec"];
      const wrap = document.createElement("div"); wrap.className = "confetti"; wrap.setAttribute("aria-hidden", "true");
      for (let k = 0; k < 60; k++) {
        const c = document.createElement("i");
        c.style.cssText = `left:${Math.random() * 100}%;background:${cores[k % cores.length]};animation-delay:${Math.random() * 0.4}s;--x:${(Math.random() - 0.5) * 200}px;--r:${Math.random() * 720}deg`;
        wrap.append(c);
      }
      root.append(wrap); setTimeout(() => wrap.remove(), 2600);
    }

    function arrastar(card) {
      let x0 = 0, y0 = 0, dx = 0, ativo = false;
      const golpe = $(".qcard__stamp--golpe", card), seguro = $(".qcard__stamp--seguro", card);
      const pintar = () => {
        card.style.transform = `translateX(${dx}px) rotate(${dx / 18}deg)`;
        golpe.style.opacity = Math.min(1, Math.max(0, -dx / 110));
        seguro.style.opacity = Math.min(1, Math.max(0, dx / 110));
      };
      card.addEventListener("pointerdown", (e) => {
        if (travado) return;
        ativo = true; x0 = e.clientX; y0 = e.clientY; dx = 0;
        card.setPointerCapture(e.pointerId); card.style.transition = "none"; card.classList.add("is-drag");
      });
      card.addEventListener("pointermove", (e) => {
        if (!ativo) return;
        dx = e.clientX - x0;
        if (Math.abs(e.clientY - y0) > Math.abs(dx) * 1.5 && Math.abs(dx) < 10) return;
        pintar();
      });
      const soltar = () => {
        if (!ativo) return; ativo = false; card.classList.remove("is-drag");
        if (Math.abs(dx) > 110) responder(dx < 0 ? "golpe" : "seguro", dx < 0 ? -1 : 1);
        else { card.style.transition = "transform .5s cubic-bezier(.34,1.56,.64,1)"; dx = 0; pintar(); }
      };
      card.addEventListener("pointerup", soltar);
      card.addEventListener("pointercancel", soltar);
      card.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") { e.preventDefault(); responder("golpe", -1); }
        if (e.key === "ArrowRight") { e.preventDefault(); responder("seguro", 1); }
      });
    }

    actions.addEventListener("click", (e) => { const b = e.target.closest("[data-ans]"); if (b) responder(b.dataset.ans); });
    stage.addEventListener("click", (e) => {
      if (e.target.closest("[data-next]")) { i++; i < Q.length ? carta() : resultado(); }
      if (e.target.closest("[data-restart]") || e.target.closest("[data-start]")) iniciar();
      if (e.target.closest("[data-home]")) telaInicial();
    });
    $("#quizExit").addEventListener("click", () => {
      const meio = i < Q.length;
      telaInicial();
      if (meio) toast("Teste encerrado. Você pode recomeçar quando quiser.");
      $("[data-start]", stage).focus({ preventScroll: true });
    });
    root.addEventListener("keydown", (e) => { if (e.key === "Escape" && !root.classList.contains("is-idle")) $("#quizExit").click(); });
    function iniciar() { ordem = embaralhar(Q); i = 0; acertos = 0; carta(); $(".qcard", stage).focus({ preventScroll: true }); }
    telaInicial();
  }

  quizGolpe();
})();
