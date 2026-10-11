const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const header = document.querySelector("#header");
const menu = document.querySelector("#primary-navigation");
const menuToggle = document.querySelector(".menu-toggle");
function closeMenu() {
  menu?.classList.remove("open");
  menuToggle?.setAttribute("aria-expanded", "false");
  menuToggle?.setAttribute("aria-label", "Abrir menu");
}
menuToggle?.addEventListener("click", () => {
  const open = menu?.classList.toggle("open") ?? false;
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
});
menu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});
document.addEventListener("click", (event) => {
  if (menu?.classList.contains("open") && !event.target.closest(".header")) closeMenu();
});

let scheduled = false;
const heroBg = document.querySelector(".hero-bg");
function updateScroll() {
  scheduled = false;
  header?.classList.toggle("scrolled", window.scrollY > 30);
  if (heroBg && !reducedMotion && window.innerWidth > 900 && window.scrollY < window.innerHeight * 1.3) {
    heroBg.style.transform = `scale(1.045) translate3d(0, ${window.scrollY * 0.04}px, 0)`;
  }
}
window.addEventListener("scroll", () => {
  if (scheduled) return;
  scheduled = true;
  window.requestAnimationFrame(updateScroll);
}, { passive: true });
updateScroll();

const revealItems = document.querySelectorAll(
  ".intro-copy, .projects-head, .project-card, .project-quote, .services-title, .service-entry, .manifesto-copy, .contact-copy, .brief-form, .wide-feature-content"
);
if (reducedMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((element) => element.classList.add("visible"));
} else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.06, rootMargin: "0px 0px -25px 0px" });
  revealItems.forEach((element) => {
    element.classList.add("reveal");
    observer.observe(element);
  });
}

const serviceSelect = document.querySelector("#brief-service");
document.querySelectorAll(".service-entry[data-service]").forEach((link) => {
  link.addEventListener("click", () => {
    if (serviceSelect) serviceSelect.value = link.dataset.service;
  });
});

const form = document.querySelector("#brief-form");
const dialog = document.querySelector("#brief-dialog");
const messagePreview = document.querySelector("#brief-preview");
const feedback = document.querySelector(".dialog-status");
form?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const name = String(data.get("name") || "").trim();
  if (!name) return;
  const service = String(data.get("service") || "").trim();
  const description = String(data.get("description") || "").trim();
  const message = [
    "Olá! Conheci a Ambiental Engenharia pelo site e gostaria de conversar sobre um projeto.",
    "",
    `Nome: ${name}`,
    `Serviço: ${service}`,
    `Demanda: ${description || "Gostaria de receber mais informações."}`
  ].join("\n");
  if (messagePreview) messagePreview.value = message;
  if (feedback) feedback.textContent = "";
  if (dialog?.showModal) dialog.showModal();
});
document.querySelector(".dialog-close")?.addEventListener("click", () => dialog?.close());
dialog?.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});
document.querySelector(".dialog-copy")?.addEventListener("click", async () => {
  const message = messagePreview?.value || "";
  if (!message) return;
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(message);
    } else {
      messagePreview.focus();
      messagePreview.select();
      if (!document.execCommand("copy")) throw new Error("Unavailable");
    }
    if (feedback) feedback.textContent = "Mensagem copiada. O contato comercial será configurado na versão final.";
  } catch {
    messagePreview.focus();
    messagePreview.select();
    if (feedback) feedback.textContent = "Selecione o texto acima para copiar manualmente.";
  }
});
