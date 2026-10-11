// PRUMO — interações locais de uma demonstração. Nenhum formulário é enviado à rede.
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const sidebar = document.querySelector("#side-navigation");
const menuButton = document.querySelector(".menu-toggle");
const navLinks = [...document.querySelectorAll("#main-nav a")];
const sidebarCollapse = document.querySelector("#sidebar-collapse");
const railPreferenceKey = "prumo-sidebar-collapsed";

function setSidebarCollapsed(collapsed) {
  document.body.classList.toggle("is-rail-collapsed", collapsed);
  sidebarCollapse?.setAttribute("aria-expanded", String(!collapsed));
  const label = collapsed ? "Expandir barra lateral" : "Recolher barra lateral";
  sidebarCollapse?.setAttribute("aria-label", label);
  sidebarCollapse?.setAttribute("title", label);
}
try {
  setSidebarCollapsed(localStorage.getItem(railPreferenceKey) === "true");
} catch {
  setSidebarCollapsed(false);
}
sidebarCollapse?.addEventListener("click", () => {
  const collapsed = !document.body.classList.contains("is-rail-collapsed");
  setSidebarCollapsed(collapsed);
  try { localStorage.setItem(railPreferenceKey, String(collapsed)); } catch { /* modo privado */ }
});

function closeMenu() {
  sidebar?.classList.remove("is-open");
  menuButton?.setAttribute("aria-expanded", "false");
  menuButton?.setAttribute("aria-label", "Abrir menu");
}
menuButton?.addEventListener("click", () => {
  const open = sidebar?.classList.toggle("is-open") ?? false;
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
});
sidebar?.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
document.addEventListener("click", event => {
  if (sidebar?.classList.contains("is-open") && !sidebar.contains(event.target) && !menuButton?.contains(event.target)) closeMenu();
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeMenu();
});
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      navLinks.forEach(link => {
        const selected = link.getAttribute("href") === "#" + entry.target.id;
        link.classList.toggle("is-active", selected);
        if (selected) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    }
  }, { threshold: 0, rootMargin: "-15% 0px -65% 0px" });
  ["visao", "planejar", "solucoes", "metodo", "cenarios"].forEach(id => {
    const section = document.getElementById(id);
    if (section) observer.observe(section);
  });
}

const contextButtons = [...document.querySelectorAll("[data-project-type]")];
const phaseButtons = [...document.querySelectorAll("[data-phase]")];
const service = document.querySelector("#service-choice");
const plannerForm = document.querySelector("#project-form");
const formAlert = document.querySelector("#form-alert");
const summaryContext = document.querySelector("#summary-context");
const summaryService = document.querySelector("#summary-service");
const summaryPhase = document.querySelector("#summary-phase");
let selectedContext = "";
let selectedPhase = "";
function chooseContext(value) {
  selectedContext = value;
  contextButtons.forEach(button => {
    button.setAttribute("aria-pressed", String(button.dataset.projectType === value));
  });
  if (summaryContext) summaryContext.textContent = value;
  if (formAlert) formAlert.textContent = "";
}
function choosePhase(value) {
  selectedPhase = value;
  phaseButtons.forEach(button => {
    button.setAttribute("aria-pressed", String(button.dataset.phase === value));
  });
  if (summaryPhase) summaryPhase.textContent = value;
  if (formAlert) formAlert.textContent = "";
}
function chooseService(value) {
  if (!service) return;
  service.value = value;
  if (summaryService) summaryService.textContent = value || "A definir";
}
contextButtons.forEach(button => button.addEventListener("click", () => chooseContext(button.dataset.projectType)));
phaseButtons.forEach(button => button.addEventListener("click", () => choosePhase(button.dataset.phase)));
service?.addEventListener("change", () => chooseService(service.value));

document.querySelectorAll("[data-context]").forEach(link => {
  link.addEventListener("click", () => chooseContext(link.dataset.context));
});
document.querySelectorAll("[data-choose-service]").forEach(button => {
  button.addEventListener("click", () => {
    chooseService(button.dataset.chooseService);
    const target = document.querySelector("#planejar");
    if (target) target.scrollIntoView({ behavior: reducedMotion ? "instant" : "smooth" });
  });
});

const tabs = [...document.querySelectorAll(".specialty-tabs [role=tab]")];
const panels = [...document.querySelectorAll(".specialty-view [role=tabpanel]")];
function activateTab(index, focus = false) {
  if (index < 0 || index >= tabs.length) return;
  tabs.forEach((tab, i) => {
    const active = i === index;
    tab.setAttribute("aria-selected", String(active));
    tab.tabIndex = active ? 0 : -1;
    tab.classList.toggle("is-selected", active);
  });
  panels.forEach(panel => { panel.hidden = panel.id !== tabs[index].getAttribute("aria-controls"); });
  if (focus) tabs[index].focus();
}
tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => activateTab(index));
  tab.addEventListener("keydown", event => {
    let next;
    if (event.key === "ArrowDown" || event.key === "ArrowRight") next = (index + 1) % tabs.length;
    else if (event.key === "ArrowUp" || event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = tabs.length - 1;
    else return;
    event.preventDefault();
    activateTab(next, true);
  });
});

const messageDialog = document.querySelector("#message-dialog");
const messagePreview = document.querySelector("#message-preview");
const copyStatus = document.querySelector(".copy-status");
plannerForm?.addEventListener("submit", event => {
  event.preventDefault();
  if (!selectedContext) {
    formAlert.textContent = "Escolha o tipo de projeto para continuar.";
    contextButtons[0]?.focus();
    return;
  }
  if (!service?.value) {
    formAlert.textContent = "Selecione o serviço de interesse.";
    service?.focus();
    return;
  }
  if (!selectedPhase) {
    formAlert.textContent = "Marque a etapa atual do projeto.";
    phaseButtons[0]?.focus();
    return;
  }
  if (!plannerForm.reportValidity()) return;
  const data = new FormData(plannerForm);
  const name = String(data.get("name") || "").trim();
  if (!name) {
    formAlert.textContent = "Informe seu nome.";
    document.querySelector("#client-name")?.focus();
    return;
  }
  const city = String(data.get("city") || "").trim();
  const notes = String(data.get("notes") || "").trim();
  const text = [
    "Olá! Conheci a PRUMO Engenharia Civil pela demonstração e gostaria de conversar sobre um projeto.",
    "",
    `Nome: ${name}`,
    `Tipo de projeto: ${selectedContext}`,
    `Serviço de interesse: ${service.value}`,
    `Etapa atual: ${selectedPhase}`,
    `Localização: ${city || "A informar"}`,
    `Descrição: ${notes || "Gostaria de receber orientações."}`
  ].join("\n");
  if (messagePreview) messagePreview.value = text;
  const whatsappLink = document.querySelector("#whatsapp-action");
  if (whatsappLink) whatsappLink.href = "https://api.whatsapp.com/send?text=" + encodeURIComponent(text);
  if (formAlert) formAlert.textContent = "";
  if (copyStatus) copyStatus.textContent = "";
  messageDialog?.showModal();
});
document.querySelector(".dialog-close")?.addEventListener("click", () => messageDialog?.close());
messageDialog?.addEventListener("click", event => {
  if (event.target === messageDialog) messageDialog.close();
});
document.querySelector(".copy-action")?.addEventListener("click", async () => {
  const text = messagePreview?.value ?? "";
  if (!text) return;
  try {
    if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(text);
    else {
      messagePreview.focus();
      messagePreview.select();
      if (!document.execCommand("copy")) throw new Error("Cópia indisponível");
    }
    if (copyStatus) copyStatus.textContent = "Copiado! O contato comercial poderá ser configurado quando a demo for personalizada.";
  } catch {
    messagePreview.focus();
    messagePreview.select();
    if (copyStatus) copyStatus.textContent = "Selecione a mensagem acima e copie manualmente.";
  }
});
