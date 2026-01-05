// Scroll suave para âncoras
document.querySelectorAll("a[href^='#']").forEach((link) => {
  link.addEventListener("click", (e) => {
    const href = link.getAttribute("href");
    if (href.length > 1) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 70,
          behavior: "smooth",
        });
      }
    }
  });
});

// Revealing on scroll (animações simples)
const animated = document.querySelectorAll(".nc-animate, .nc-animate-delay");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("nc-animate-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

animated.forEach((el) => observer.observe(el));

// Header dark/light conforme scroll
const header = document.querySelector(".nc-header");
const hero = document.querySelector(".nc-hero");

if (header && hero) {
  const heroHeight = hero.offsetHeight;
  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY || window.pageYOffset;

    if (scrollY > heroHeight - 80) {
      header.classList.remove("nc-header-dark");
      header.classList.add("nc-header-light");
    } else {
      header.classList.add("nc-header-dark");
      header.classList.remove("nc-header-light");
    }
  });
}

// Cursor trail
const trailContainer = document.querySelector(".nc-cursor-trail");
const dots = [];
const DOT_COUNT = 6;

if (trailContainer) {
  for (let i = 0; i < DOT_COUNT; i++) {
    const dot = document.createElement("div");
    dot.classList.add("nc-cursor-dot");
    trailContainer.appendChild(dot);
    dots.push({ el: dot, x: 0, y: 0 });
  }

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animate() {
    let x = mouseX;
    let y = mouseY;

    dots.forEach((dot, index) => {
      const delay = (index + 2) * 0.18;
      const dx = (dot.x - x) * delay;
      const dy = (dot.y - y) * delay;

      dot.x = x + dx;
      dot.y = y + dy;

      dot.el.style.left = `${dot.x}px`;
      dot.el.style.top = `${dot.y}px`;
      dot.el.style.opacity = 0.95 - index * 0.15;
      dot.el.style.transform = `translate(-50%, -50%) scale(${1.05 - index * 0.12})`;

      x = dot.x;
      y = dot.y;
    });

    requestAnimationFrame(animate);
  }

  animate();
}

// Conversa WhatsApp da landing
const chatEl = document.getElementById("ncChat");
const typingEl = document.getElementById("ncTyping");
const flowBtn = document.querySelector(".nc-suite-flow-btn");
const note1 = document.querySelector(".nc-suite-note-1");
const note2 = document.querySelector(".nc-suite-note-2");
const note3 = document.querySelector(".nc-suite-note-3");

const scriptMessages = [
  { from: "user", text: "Oi, estou com uma dor forte na lombar desde ontem." },
  { from: "bot", text: "Entendi! Essa dor começou depois de algum esforço físico ou queda?" },
  { from: "user", text: "Começou depois de carregar umas caixas pesadas." },
  { from: "bot", text: "Parece uma contratura muscular na região lombar." },
  {
    from: "bot",
    text: "Agora é importante evitar esforço, usar compressa morna e, se precisar, analgésico comum com orientação médica.",
  },
  {
    from: "bot",
    text: "Vou agendar uma consulta para te avaliar melhor e já te enviar o pagamento via Pix.",
  },
  {
    from: "bot",
    text: "Aqui está o QR Code para confirmar sua consulta de avaliação lombar.",
    qr: true,
  },
];

function showTyping(sideOrShow) {
  if (!typingEl) return;
  if (sideOrShow === "left") {
    typingEl.classList.add("left");
    typingEl.classList.remove("right");
    typingEl.style.display = "inline-flex";
  } else if (sideOrShow === "right") {
    typingEl.classList.add("right");
    typingEl.classList.remove("left");
    typingEl.style.display = "inline-flex";
  } else {
    typingEl.style.display = "none";
  }
}

function createQrPlaceholder() {
  const wrapper = document.createElement("div");
  wrapper.className = "nc-whatsapp-qr";

  const qr = document.createElement("div");
  qr.className = "nc-qr-placeholder";
  wrapper.appendChild(qr);

  const corners = [
    { left: 6, top: 6 },
    { right: 6, top: 6 },
    { left: 6, bottom: 6 },
  ];

  corners.forEach((pos) => {
    const c = document.createElement("div");
    c.className = "nc-qr-block corner";
    Object.assign(c.style, {
      ...(pos.left !== undefined ? { left: `${pos.left}px` } : {}),
      ...(pos.right !== undefined ? { right: `${pos.right}px` } : {}),
      ...(pos.top !== undefined ? { top: `${pos.top}px` } : {}),
      ...(pos.bottom !== undefined ? { bottom: `${pos.bottom}px` } : {}),
    });
    qr.appendChild(c);
  });

  const blocks = [
    { left: 42, top: 10, w: 10, h: 10 },
    { left: 60, top: 24, w: 8, h: 8 },
    { left: 44, top: 36, w: 14, h: 14 },
    { left: 64, top: 46, w: 10, h: 10 },
    { left: 36, top: 60, w: 8, h: 8 },
    { left: 54, top: 70, w: 12, h: 12 },
  ];

  blocks.forEach((b) => {
    const d = document.createElement("div");
    d.className = "nc-qr-block";
    d.style.left = `${b.left}px`;
    d.style.top = `${b.top}px`;
    d.style.width = `${b.w}px`;
    d.style.height = `${b.h}px`;
    qr.appendChild(d);
  });

  return wrapper;
}

function addMessage(msg) {
  if (!chatEl) return;
  const bubble = document.createElement("div");
  bubble.className = `nc-whatsapp-bubble ${msg.from === "user" ? "user" : "bot"}`;
  bubble.textContent = msg.text;

  if (msg.qr) {
    const qr = createQrPlaceholder();
    bubble.appendChild(document.createElement("br"));
    bubble.appendChild(qr);
  }

  chatEl.appendChild(bubble);
}

function playConversation() {
  if (!chatEl || !typingEl) return;
  chatEl.innerHTML = "";
  let step = 0;

  function next() {
    if (step >= scriptMessages.length) {
      setTimeout(playConversation, 5000);
      return;
    }

    const msg = scriptMessages[step];
    const side = msg.from === "user" ? "left" : "right";

    showTyping(side);

    const typingDelay = 1500;
    const afterSendDelay = 1200;

    setTimeout(() => {
      showTyping(false);
      addMessage(msg);

      if (flowBtn && step === scriptMessages.length - 2) {
        flowBtn.style.display = "inline-flex";
        if (note1) setTimeout(() => (note1.style.display = "flex"), 2800);
        if (note2) setTimeout(() => (note2.style.display = "flex"), 5700);
        if (note3) setTimeout(() => (note3.style.display = "flex"), 8000);
      }

      step++;
      setTimeout(next, afterSendDelay);
    }, typingDelay);
  }

  next();
}

playConversation();

// Lottie resultados
function initResultsLottie() {
  if (typeof lottie === "undefined") return;

  const lottieContainers = Array.from(
    document.querySelectorAll(".nc-results-lottie")
  );
  if (lottieContainers.length === 0) return;

  const animationsByContainer = new Map();

  function getOrCreateAnimation(container) {
    if (animationsByContainer.has(container)) {
      return animationsByContainer.get(container);
    }
    const anim = lottie.loadAnimation({
      container,
      renderer: "svg",
      loop: false,
      autoplay: false,
      path: "animacaografico.json",
    });
    animationsByContainer.set(container, anim);
    return anim;
  }

  function playForCenterSlide(centerSlide) {
    if (!centerSlide) return;
    const container = centerSlide.querySelector(".nc-results-lottie");
    if (!container) return;
    const anim = getOrCreateAnimation(container);
    anim.stop();
    anim.play();
  }

  document.addEventListener("nc-results-change", (e) => {
    const centerSlide =
      e.detail && e.detail.centerSlide
        ? e.detail.centerSlide
        : document.querySelector(".nc-results-slide--center");
    playForCenterSlide(centerSlide);
  });

  window.addEventListener("load", () => {
    const centerSlide = document.querySelector(".nc-results-slide--center");
    playForCenterSlide(centerSlide);
  });
}

initResultsLottie();

// Carrossel de resultados
function initResultsCarousel() {
  const track = document.querySelector(".nc-results-track");
  const slides = track ? Array.from(track.querySelectorAll(".nc-results-slide")) : [];
  const arrowLeft = document.querySelector(".nc-results-arrow-left");
  const arrowRight = document.querySelector(".nc-results-arrow-right");

  if (!track || slides.length === 0 || !arrowLeft || !arrowRight) return;

  let currentIndex = 0;
  const total = slides.length;

  function applyPositions() {
    slides.forEach((slide) => {
      slide.classList.remove(
        "nc-results-slide--left",
        "nc-results-slide--center",
        "nc-results-slide--right"
      );
    });

    const center = currentIndex;
    const left = (currentIndex - 1 + total) % total;
    const right = (currentIndex + 1) % total;

    slides[left].classList.add("nc-results-slide--left");
    slides[center].classList.add("nc-results-slide--center");
    slides[right].classList.add("nc-results-slide--right");
  }

  function notifyCenterChanged() {
    const centerSlide = document.querySelector(".nc-results-slide--center");
    if (!centerSlide) return;
    const event = new CustomEvent("nc-results-change", {
      detail: { centerSlide },
    });
    document.dispatchEvent(event);
  }

  function goNext() {
    currentIndex = (currentIndex + 1) % total;
    applyPositions();
    notifyCenterChanged();
  }

  function goPrev() {
    currentIndex = (currentIndex - 1 + total) % total;
    applyPositions();
    notifyCenterChanged();
  }

  applyPositions();
  notifyCenterChanged();

  arrowRight.addEventListener("click", goNext);
  arrowLeft.addEventListener("click", goPrev);

  // Swipe
  let isDown = false;
  let startX = 0;
  let deltaX = 0;

  function startDrag(clientX) {
    isDown = true;
    startX = clientX;
    deltaX = 0;
  }

  function moveDrag(clientX) {
    if (!isDown) return;
    deltaX = clientX - startX;
  }

  function endDrag() {
    if (!isDown) return;
    isDown = false;
    const threshold = 60;
    if (deltaX > threshold) goPrev();
    else if (deltaX < -threshold) goNext();
  }

  track.addEventListener("mousedown", (e) => startDrag(e.clientX));
  track.addEventListener("mousemove", (e) => moveDrag(e.clientX));
  track.addEventListener("mouseup", endDrag);
  track.addEventListener("mouseleave", endDrag);

  track.addEventListener(
    "touchstart",
    (e) => startDrag(e.touches[0].clientX),
    { passive: true }
  );
  track.addEventListener(
    "touchmove",
    (e) => moveDrag(e.touches[0].clientX),
    { passive: true }
  );
  track.addEventListener("touchend", endDrag);
}

initResultsCarousel();

// Lottie - Sobre a Nexus Lab
function initAboutLottie() {
  if (typeof lottie === "undefined") return;
  const containers = Array.from(document.querySelectorAll(".nc-about-lottie"));
  if (containers.length === 0) return;

  containers.forEach((container) => {
    const key = container.dataset.about;
    if (!key) return;
    lottie.loadAnimation({
      container,
      renderer: "svg",
      loop: true,
      autoplay: true,
      path: `${key}.json`,
    });
  });
}

initAboutLottie();

// Toast
function showToast(message, type = "success") {
  const toast = document.getElementById("nc-toast");
  const textEl = document.getElementById("nc-toast-text");
  const iconEl = document.getElementById("nc-toast-icon");

  if (!toast || !textEl || !iconEl) return;

  toast.classList.remove("nc-toast--success", "nc-toast--error", "nc-toast--show");

  if (type === "error") {
    toast.classList.add("nc-toast--error");
    iconEl.textContent = "!";
  } else {
    toast.classList.add("nc-toast--success");
    iconEl.textContent = "✓";
  }

  textEl.textContent = message;

  // força reflow pra reiniciar animação
  void toast.offsetWidth;

  toast.classList.add("nc-toast--show");

  setTimeout(() => {
    toast.classList.remove("nc-toast--show");
  }, 3800);
}

// Formulário de contato (Netlify + validação de e-mail)
function initContactForm() {
  const form = document.getElementById("nc-contact-form");
  if (!form) return;

  const email = document.getElementById("email");
  const emailConfirm = document.getElementById("emailConfirmacao");
  const errorEl = document.getElementById("nc-email-error");
  const successEl = document.getElementById("nc-contact-success");

  function clearMessages() {
    if (errorEl) errorEl.style.display = "none";
    if (successEl) successEl.style.display = "none";
  }

  function emailsIguais() {
    return (
      email &&
      emailConfirm &&
      email.value.trim() !== "" &&
      email.value.trim() === emailConfirm.value.trim()
    );
  }

  if (email && emailConfirm && errorEl) {
    email.addEventListener("input", () => {
      if (!emailsIguais()) {
        errorEl.style.display = "block";
      } else {
        errorEl.style.display = "none";
      }
    });

    emailConfirm.addEventListener("input", () => {
      if (!emailsIguais()) {
        errorEl.style.display = "block";
      } else {
        errorEl.style.display = "none";
      }
    });
  }

  // Opção A: submissão normal (Netlify Forms + redirect)
  form.addEventListener("submit", (e) => {
    clearMessages();

    if (!emailsIguais()) {
      e.preventDefault();
      if (errorEl) errorEl.style.display = "block";
      if (emailConfirm) emailConfirm.focus();
      showToast("Os e-mails não coincidem. Verifique e tente novamente.", "error");
      return;
    }

    // deixa o submit seguir normalmente para o Netlify
    showToast("Enviando sua solicitação...", "success");
  });

  /*
  // Opção B: se quiser enviar via fetch (AJAX) ao invés de redirect:
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearMessages();

    if (!emailsIguais()) {
      if (errorEl) errorEl.style.display = "block";
      if (emailConfirm) emailConfirm.focus();
      showToast("Os e-mails não coincidem. Verifique e tente novamente.", "error");
      return;
    }

    const formData = new FormData(form);

    try {
      await fetch("/", {
        method: "POST",
        body: formData,
      });

      if (successEl) successEl.style.display = "block";
      showToast(
        "Recebemos sua solicitação. Em breve você receberá um e-mail da Nexus Lab.",
        "success"
      );
      form.reset();
    } catch (err) {
      showToast("Erro ao enviar. Tente novamente em instantes.", "error");
    }
  });
  */
}

initContactForm();
