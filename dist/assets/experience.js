(function () {
  "use strict";
  const modes = [
    { id: "tickets", name: "AssetTrack TI", title: "Do problema à solução. Em três movimentos.", description: "Um equipamento parou. Assuma o chamado e acompanhe como cada etapa dá visibilidade ao atendimento.", principle: "Cada mudança de status conta uma história.", hint: "Avance o chamado para experimentar.", project: "AssetTrack TI" },
    { id: "queue", name: "Restaurant Queue", title: "A mesa está pronta. O cliente também.", description: "Libere uma mesa, chame o próximo cliente e veja uma prévia da mensagem. Um fluxo simples para organizar o salão.", principle: "A informação certa, no momento certo.", hint: "Libere a mesa 04 para começar.", project: "Restaurant Queue" },
    { id: "habits", name: "HabitFlow", title: "Pequenas ações. Progresso que aparece.", description: "Marque as atividades do dia e veja o progresso ganhar forma. Toque novamente para desfazer uma conclusão.", principle: "Feedback imediato torna o progresso visível.", hint: "Escolha um hábito para concluir.", project: "HabitFlow" },
    { id: "tv", name: "LocalTV", title: "Uma escolha aqui. Uma nova mensagem na tela.", description: "Selecione uma peça da playlist e alterne a faixa de avisos. Experimente o controle do conteúdo em uma tela de demonstração.", principle: "Uma interface de controle, muitas possibilidades.", hint: "Escolha um conteúdo da playlist.", project: "LocalTV" }
  ];
  const people = ["Ana", "Bruno", "Carla"];
  const slides = [
    ["BEM-VINDO", "Sua próxima ideia começa aqui.", "Tecnologia feita para aproximar pessoas.", "Recepção"],
    ["AGENDA", "Boas conversas. Grandes ideias.", "Encontro de inovação · Hoje, às 15h.", "Evento"],
    ["CAFÉ", "Uma pausa faz toda a diferença.", "Conheça o nosso espaço de convivência.", "Café"]
  ];
  const initial = () => ({ ticket: 0, called: 0, free: false, habits: [false, false, false], slide: 0, overlay: true });
  function update(state, action) {
    const next = { ...state, habits: [...state.habits] };
    if (action === "ticket") next.ticket = Math.min(2, next.ticket + 1);
    if (action === "free" && next.called < people.length) next.free = true;
    if (action === "call" && next.free && next.called < people.length) { next.called++; next.free = false; }
    if (/^habit:[0-2]$/.test(action)) { const i = Number(action.split(":")[1]); next.habits[i] = !next.habits[i]; }
    if (/^slide:[0-2]$/.test(action)) next.slide = Number(action.split(":")[1]);
    if (action === "overlay") next.overlay = !next.overlay;
    return next;
  }
  function resetMode(state, mode) {
    const defaults = initial();
    const keys = { tickets: ["ticket"], queue: ["called", "free"], habits: ["habits"], tv: ["slide", "overlay"] };
    const result = { ...state };
    for (const key of keys[mode]) result[key] = defaults[key];
    return result;
  }
  const actionButton = (action, label, disabled = false) => '<button type="button" class="demo-btn" data-action="' + action + '"' + (disabled ? " disabled" : "") + ">" + label + "</button>";
  function content(mode, state) {
    if (mode === "tickets") {
      const labels = ["Aberto", "Em atendimento", "Resolvido"];
      return '<div class="demo-subhead"><h4>Central de chamados</h4><span class="demo-pill">TI · Prioridade alta</span></div>' +
        '<div class="ticket-lanes">' + labels.map((label, i) => '<div class="ticket-lane ' + (state.ticket === i ? "active" : "") + '"><span>' + label +
        (state.ticket === i ? " · 1" : " · 0") + '</span>' + (state.ticket === i ? '<div class="ticket-mini"><small>#DEMO-042</small><strong>Projetor sem imagem</strong></div>' : '<span class="empty-slot" aria-hidden="true">—</span>') + '</div>').join("") +
        '</div><div class="demo-actionbar"><span class="demo-counter">Etapa ' + (state.ticket + 1) + ' de 3</span>' +
        actionButton("ticket", ["Assumir chamado", "Marcar como resolvido", "Chamado resolvido ✓"][state.ticket], state.ticket === 2) + "</div>";
    }
    if (mode === "queue") {
      const finished = state.called === people.length;
      const message = state.called ? "Olá, " + people[state.called - 1] + "! Sua mesa 04 está pronta. Pode vir para a recepção." : "A prévia da mensagem aparecerá aqui quando você chamar um cliente.";
      return '<div class="demo-subhead"><h4>Recepção do restaurante</h4><span class="demo-pill">' + (3 - state.called) + ' na fila</span></div><div class="queue-layout"><ol class="queue-list">' +
        people.map((name, i) => '<li class="queue-person ' + (i < state.called ? "queue-done" : "") + '"><span class="person-avatar" aria-hidden="true">' + name[0] + '</span><div><strong>' + name + '</strong><small>' + (i < state.called ? "Chamado na simulação" : "2 pessoas · aguardando") + '</small></div></li>').join("") +
        '</ol><div class="message-preview"><small>PRÉVIA · NÃO ENVIADA</small><p>' + message + '</p></div></div><div class="demo-actionbar"><span class="demo-counter">Mesa 04 · ' + (state.free ? "Livre" : "Ocupada") +
        '</span>' + actionButton(state.free ? "call" : "free", finished ? "Fila concluída ✓" : state.free ? "Chamar " + people[state.called] : "Liberar mesa 04", finished) + "</div>";
    }
    if (mode === "habits") {
      const done = state.habits.filter(Boolean).length, percent = Math.round(done / 3 * 100);
      return '<div class="demo-subhead"><h4>Seu progresso de hoje</h4><span class="demo-pill">' + (done * 20) + ' XP de demonstração</span></div><div class="habit-layout">' +
        '<div class="habit-progress" style="--progress:' + percent + '%" role="progressbar" aria-label="Hábitos concluídos" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + percent + '"><div><strong>' + percent + '%</strong><small>' + done + ' de 3 hábitos</small></div></div>' +
        '<div class="habit-list">' + ["Ler por 15 minutos", "Caminhar por 20 minutos", "Estudar algo novo"].map((name, i) => '<button type="button" class="habit-item" aria-pressed="' + state.habits[i] + '" data-action="habit:' + i + '"><span>' + name + '</span><span class="habit-check" aria-hidden="true">' + (state.habits[i] ? "✓" : "") + '</span></button>').join("") +
        '</div></div><div class="demo-actionbar"><span class="demo-counter">' + (done === 3 ? "Dia completo. Cada pequena ação fez diferença." : "Uma ação de cada vez. O progresso é seu.") + "</span></div>";
    }
    const slide = slides[state.slide];
    return '<div class="demo-subhead"><h4>Player · Recepção</h4><span class="demo-pill">Prévia local</span></div><div class="tv-stage"><div class="tv-content" data-slide="' + state.slide + '"><small>' + slide[0] + '</small><strong>' + slide[1] + '</strong><p>' + slide[2] + '</p></div>' +
      (state.overlay ? '<div class="tv-overlay">AVISO · Conteúdo demonstrativo do portfólio</div>' : "") +
      '</div><div class="playlist-buttons" role="group" aria-label="Conteúdo da playlist">' + slides.map((s, i) => '<button type="button" aria-pressed="' + (state.slide === i) + '" data-action="slide:' + i + '">' + String(i + 1).padStart(2, "0") + ' · ' + s[3] + '</button>').join("") +
      '</div><div class="demo-actionbar">' + actionButton("overlay", state.overlay ? "Ocultar faixa de avisos" : "Exibir faixa de avisos") + "</div>";
  }
  // Pure state functions support regression checks without a browser or network.
  if (typeof module !== "undefined" && module.exports) { module.exports = { modes, initial, update, resetMode, content }; return; }
  const section = document.createElement("section");
  section.id = "experiencia";
  section.className = "experience shell";
  section.dataset.mode = "tickets";
  section.setAttribute("aria-labelledby", "experienceTitle");
  section.innerHTML = '<div class="experience-heading"><span class="demo-label">Test drive · Sem cadastro</span><h2 id="experienceTitle">Não apenas veja.<br><span>Experimente.</span></h2><p>Toque, escolha, transforme. Descubra o que acontece quando o design encontra uma operação real.</p></div>' +
    '<div class="demo-tabs" role="tablist" aria-label="Escolha uma simulação">' + modes.map((mode, i) => '<button type="button" class="demo-tab" role="tab" id="tab-' + mode.id + '" aria-controls="demoPanel" aria-selected="' + (i === 0) + '" tabindex="' + (i === 0 ? 0 : -1) + '" data-mode="' + mode.id + '">' + mode.name + '</button>').join("") +
    '</div><div class="demo-layout" id="demoPanel" role="tabpanel" aria-labelledby="tab-tickets"><div class="demo-story" id="demoStory"></div><div class="demo-workspace"><div class="demo-toolbar"><strong id="demoApp"></strong><span>Simulação interativa</span></div><div class="demo-surface" id="demoSurface"></div><div class="demo-footer"><p class="demo-feedback" id="demoFeedback" role="status" aria-live="polite" aria-atomic="true"></p><button class="demo-reset" type="button" id="demoReset">Reiniciar ↺</button></div></div></div>' +
    '<p class="experience-note">Dados fictícios. Nenhuma mensagem é enviada e nenhum sistema real é alterado.</p>';
  document.querySelector("#projetos").before(section);
  const navLink = document.createElement("a");
  navLink.href = "#experiencia"; navLink.textContent = "Experimente";
  document.querySelector(".nav-links").prepend(navLink);
  const heroLink = document.createElement("a");
  heroLink.href = "#experiencia"; heroLink.className = "button button-primary"; heroLink.textContent = "Experimentar agora";
  document.querySelector(".hero .actions .button-primary").className = "button button-secondary";
  document.querySelector(".hero .actions").prepend(heroLink);
  document.body.classList.add("portfolio-protected");
  document.addEventListener("contextmenu", (event) => event.preventDefault());
  document.addEventListener("copy", (event) => event.preventDefault());
  document.addEventListener("cut", (event) => event.preventDefault());
  document.addEventListener("dragstart", (event) => {
    if (event.target instanceof HTMLImageElement) event.preventDefault();
  });
  document.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();
    const primary = event.ctrlKey || event.metaKey;
    const devShortcut = primary && event.shiftKey && ["i", "j", "c"].includes(key);
    if (event.key === "F12" || devShortcut || (primary && ["c", "s", "u", "p"].includes(key))) event.preventDefault();
  });
  const tabs = [...section.querySelectorAll('[role="tab"]')];
  const surface = section.querySelector("#demoSurface");
  const feedback = section.querySelector("#demoFeedback");
  let state = initial(), active = "tickets";
  function render() { surface.innerHTML = content(active, state); }
  function select(id, focusTab = false) {
    const mode = modes.find(m => m.id === id); if (!mode) return;
    active = id; section.dataset.mode = id;
    tabs.forEach(tab => { const selected = tab.dataset.mode === id; tab.setAttribute("aria-selected", String(selected)); tab.tabIndex = selected ? 0 : -1; if (selected && focusTab) tab.focus(); });
    section.querySelector("#demoPanel").setAttribute("aria-labelledby", "tab-" + id);
    section.querySelector("#demoApp").textContent = mode.name;
    section.querySelector("#demoStory").innerHTML = '<small>Explore o produto</small><h3>' + mode.title + '</h3><p>' + mode.description + '</p><div class="demo-principle"><strong>DESIGN EM AÇÃO</strong>' + mode.principle + '</div><button type="button" class="demo-details">Conhecer o projeto ↗</button>';
    section.querySelector(".demo-details").addEventListener("click", () => { const index = projects.findIndex(p => p.name === mode.project); if (index >= 0) openProject(index); });
    feedback.textContent = mode.hint; render();
  }
  tabs.forEach(tab => {
    tab.addEventListener("click", () => select(tab.dataset.mode));
    tab.addEventListener("keydown", event => {
      const index = tabs.indexOf(tab), keys = ["ArrowRight", "ArrowLeft", "Home", "End"];
      if (!keys.includes(event.key)) return;
      event.preventDefault();
      const target = event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : (index + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
      select(tabs[target].dataset.mode, true);
    });
  });
  surface.addEventListener("click", event => {
    const button = event.target.closest("[data-action]"); if (!button || button.disabled) return;
    const action = button.dataset.action;
    state = update(state, action); render();
    const messages = {
      ticket: state.ticket === 2 ? "Chamado resolvido. Histórico de atendimento atualizado nesta simulação." : "Chamado assumido. A equipe agora acompanha o atendimento.",
      free: "Mesa 04 liberada. Agora você pode chamar o próximo cliente.",
      call: "Chamada simulada. A mensagem não foi enviada.",
      overlay: state.overlay ? "Faixa de avisos visível no player." : "Faixa de avisos oculta."
    };
    feedback.textContent = action.startsWith("habit:") ? state.habits.filter(Boolean).length + " de 3 hábitos concluídos · " + state.habits.filter(Boolean).length * 20 + " XP."
      : action.startsWith("slide:") ? 'Conteúdo "' + slides[state.slide][3] + '" selecionado no player de demonstração.' : messages[action];
    const replacement = surface.querySelector('[data-action="' + action + '"]:not(:disabled)') || surface.querySelector("[data-action]:not(:disabled)") || section.querySelector("#demoReset");
    replacement.focus({ preventScroll: true });
  });
  section.querySelector("#demoReset").addEventListener("click", () => { state = resetMode(state, active); render(); feedback.textContent = "Simulação reiniciada. Experimente outra vez."; });
  select("tickets");

  // Connect selected project sheets to their demonstrations; preserve every project.
  const modal = document.querySelector("#projectModal");
  const demoLink = document.createElement("button");
  demoLink.type = "button"; demoLink.className = "modal-link primary modal-demo";
  demoLink.textContent = "Experimentar simulação";
  document.querySelector(".modal-links").prepend(demoLink);
  let modalMode, wasOpen = false;
  function syncModal() {
    const opened = modal.classList.contains("open");
    document.body.classList.toggle("modal-active", opened);
    [document.querySelector("header"), document.querySelector("main"), document.querySelector("footer"), document.querySelector(".whatsapp")].forEach(el => { el.inert = opened; });
    if (!opened && wasOpen) previous?.focus({ preventScroll: true });
    wasOpen = opened;
    const mode = modes.find(m => m.project === document.querySelector("#modalTitle").textContent);
    modalMode = mode?.id;
    demoLink.hidden = !mode;
    if (opened) document.querySelector(".dialog").scrollTop = 0;
  }
  new MutationObserver(syncModal).observe(modal, { attributes: true, attributeFilter: ["class"] });
  demoLink.addEventListener("click", () => {
    closeProject(); syncModal(); select(modalMode, true);
    section.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
  });
  modal.addEventListener("keydown", event => {
    if (event.key !== "Tab" || !modal.classList.contains("open")) return;
    const focusable = [...modal.querySelectorAll('button:not(:disabled):not([hidden]), a[href]')];
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
})();
