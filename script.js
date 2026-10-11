const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const nav = document.querySelector("#main-nav");
const toggle = document.querySelector(".menu-toggle");
function closeMenu() {
  nav?.classList.remove("open");
  toggle?.setAttribute("aria-expanded", "false");
  toggle?.setAttribute("aria-label", "Abrir menu");
}
toggle?.addEventListener("click", () => {
  const open = nav?.classList.toggle("open") ?? false;
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
});
nav?.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
document.addEventListener("click", event => {
  if (nav?.classList.contains("open") && !event.target.closest(".site-header")) closeMenu();
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeMenu();
});

const allDetails = [...document.querySelectorAll(".service-detail")];
allDetails.forEach(detail => {
  detail.addEventListener("toggle", () => {
    if (!detail.open) return;
    allDetails.forEach(other => {
      if (other !== detail) other.open = false;
    });
  });
});

const serviceSelect = document.querySelector("#brief-service");
document.querySelectorAll("[data-service], [data-interest]").forEach(link => {
  link.addEventListener("click", () => {
    const service = link.dataset.service ?? link.dataset.interest;
    if (serviceSelect && service) serviceSelect.value = service;
  });
});

const revealTargets = document.querySelectorAll(
  ".pillars-lead, .pillars-items article, .process-intro, .process-steps article, .services-intro, .services-accordion, .contexts-heading, .context-card, .values-body, .contact-copy, .brief-form"
);
if (prefersReducedMotion || !("IntersectionObserver" in window)) {
  revealTargets.forEach(el => el.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05, rootMargin: "0px 0px -20px 0px" });
  revealTargets.forEach(el => {
    el.classList.add("reveal");
    observer.observe(el);
  });
}

const form = document.querySelector("#brief-form");
const dialog = document.querySelector("#brief-dialog");
const preview = document.querySelector("#brief-preview");
const status = document.querySelector(".copy-feedback");
form?.addEventListener("submit", event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const name = String(data.get("name") ?? "").trim();
  if (!name) return;
  const message = [
    "Olá! Conheci a PRUMO Engenharia Civil pelo site e gostaria de conversar sobre um projeto.",
    "",
    `Nome: ${name}`,
    `Área: ${String(data.get("service") ?? "Ainda não sei")}`,
    `Localização: ${String(data.get("city") ?? "").trim() || "A informar"}`,
    `Descrição: ${String(data.get("description") ?? "").trim() || "Gostaria de receber orientações."}`
  ].join("\n");
  if (preview) preview.value = message;
  if (status) status.textContent = "";
  dialog?.showModal();
});
document.querySelector(".close-dialog")?.addEventListener("click", () => dialog?.close());
dialog?.addEventListener("click", event => {
  if (event.target === dialog) dialog.close();
});
document.querySelector(".copy-message")?.addEventListener("click", async () => {
  const message = preview?.value ?? "";
  if (!message) return;
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(message);
    } else {
      preview.focus();
      preview.select();
      if (!document.execCommand("copy")) throw new Error("Não disponível");
    }
    if (status) status.textContent = "Mensagem copiada. O contato comercial será configurado quando a demo for personalizada.";
  } catch {
    preview.focus();
    preview.select();
    if (status) status.textContent = "Selecione a mensagem e copie manualmente.";
  }
});
