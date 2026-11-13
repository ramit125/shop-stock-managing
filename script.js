"use strict";

// CUSTOMIZE PHOTOS: Replace any src value with a path to your own photo.
// Photos stored beside index.html can use names such as "photos/our-trip.jpg".
const PHOTO_SOURCES = [
  { src: "photos/memory-01-collage.jpg", caption: "01  ·  THAT SUNSET", alt: "Jagruti and her partner in a seaside photo collage.", scene: ["#1d2347", "#8446a2", "#ed9e79"] },
  { src: "photos/memory-02-blue-flowers.jpg", caption: "02  ·  MY FAVORITE VIEW", alt: "Jagruti and her partner together among blue flowers.", scene: ["#173044", "#3289a2", "#c8a9e3"] },
  { src: "photos/memory-03-selfie.jpg", caption: "03  ·  US, ALWAYS", alt: "Jagruti and her partner taking a mirror selfie.", scene: ["#341c55", "#df7298", "#ffd1a0"] },
  { src: "photos/memory-04-red-saree.jpg", caption: "04  ·  MY PERSON", alt: "Jagruti and her partner together in traditional clothing.", scene: ["#19294c", "#536cc3", "#8edbe0"] },
  { src: "photos/memory-05-heritage.jpg", caption: "05  ·  CORE MEMORY", alt: "Jagruti and her partner sitting together at a heritage location.", scene: ["#35214d", "#b55f9d", "#f5bd95"] },
  { src: "photos/memory-06-flowers.jpg", caption: "06  ·  MORE DAYS LIKE THIS", alt: "Jagruti and her partner sharing a quiet moment with flowers.", scene: ["#172b3b", "#558e9c", "#eacb9d"] }
];

// CUSTOMIZE MUSIC: Add your own licensed copies at these paths.
const MUSIC_TRACKS = {
  gift: "music/gift-piano.mp3",
  reveal: "music/a-sky-full-of-stars.mp3",
  gallery: "music/the-nights.mp3",
  final: "music/final-piano.mp3"
};

const intro = document.querySelector("#intro");
const giftScreen = document.querySelector("#gift");
const startButton = document.querySelector(".start-button");
const giftButton = document.querySelector(".gift-button");
const countdown = document.querySelector(".countdown");
const birthdayContent = document.querySelector("#birthday-content");
const audio = document.querySelector(".birthday-audio");
const musicToggle = document.querySelector(".music-toggle");
const musicLabel = document.querySelector(".music-label");
const canvas = document.querySelector(".celebration-canvas");
const canvasContext = canvas.getContext("2d");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

let giftOpened = false;
let musicOn = false;
let currentMusicStage = "gift";
let typingStarted = false;
let activePhoto = 0;
let lastFocusedElement = null;
let particles = [];
let animationFrame = 0;
let celebrationUntil = 0;

function placeholderImage(colors, index) {
  const [first, middle, last] = colors;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="800" viewBox="0 0 1000 800"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${first}"/><stop offset=".52" stop-color="${middle}"/><stop offset="1" stop-color="${last}"/></linearGradient><radialGradient id="r"><stop stop-color="#fff" stop-opacity=".48"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient><filter id="b"><feGaussianBlur stdDeviation="30"/></filter></defs><rect width="1000" height="800" fill="url(#g)"/><circle cx="${160 + index * 80}" cy="180" r="220" fill="url(#r)"/><circle cx="740" cy="680" r="250" fill="#fff" opacity=".14" filter="url(#b)"/><path d="M0 620Q220 410 430 600T1000 500V800H0Z" fill="#0b0b1c" opacity=".38"/><path d="M0 695Q250 530 480 680T1000 610V800H0Z" fill="#080812" opacity=".34"/><circle cx="780" cy="180" r="3" fill="#fff" opacity=".85"/><circle cx="235" cy="390" r="4" fill="#fff" opacity=".7"/><circle cx="680" cy="440" r="2" fill="#fff" opacity=".8"/><text x="500" y="440" text-anchor="middle" fill="#fff" fill-opacity=".72" font-family="Arial,sans-serif" font-size="35" letter-spacing="12">YOUR PHOTO HERE</text><text x="500" y="485" text-anchor="middle" fill="#fff" fill-opacity=".56" font-family="Arial,sans-serif" font-size="17" letter-spacing="6">A MEMORY WORTH KEEPING</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function setPhoto(index) {
  activePhoto = (index + PHOTO_SOURCES.length) % PHOTO_SOURCES.length;
  const item = PHOTO_SOURCES[activePhoto];
  const card = document.querySelector(`[data-photo="${activePhoto}"]`);
  const image = card.querySelector("img");
  const lightboxImage = document.querySelector(".lightbox-image");
  image.src = item.src || placeholderImage(item.scene, activePhoto);
  image.alt = item.src ? item.alt : `Colorful placeholder for ${item.caption.toLowerCase()}`;
  lightboxImage.src = image.src;
  lightboxImage.alt = image.alt;
  document.querySelector(".lightbox-caption").textContent = item.caption;
  document.querySelector(".lightbox-counter").textContent = `${String(activePhoto + 1).padStart(2, "0")} / ${String(PHOTO_SOURCES.length).padStart(2, "0")}`;
}

document.querySelectorAll(".photo-card").forEach((card, index) => {
  const item = PHOTO_SOURCES[index];
  const image = card.querySelector("img");
  image.src = item.src || placeholderImage(item.scene, index);
  image.alt = item.src ? item.alt : `Colorful placeholder for ${item.caption.toLowerCase()}`;
  card.addEventListener("click", () => openLightbox(index));
});

startButton.addEventListener("click", () => {
  intro.classList.remove("active");
  intro.hidden = true;
  giftScreen.hidden = false;
  giftScreen.classList.add("active");
  setMusicStage("gift");
  if (!musicOn) startMusicTrack();
  giftScreen.scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth", block: "start" });
});

giftButton.addEventListener("click", async () => {
  if (giftOpened) return;
  giftOpened = true;
  giftButton.disabled = true;
  giftButton.classList.add("is-opening");
  await wait(650);
  for (const number of ["3", "2", "1"]) {
    countdown.textContent = number;
    countdown.hidden = false;
    countdown.classList.remove("is-counting");
    void countdown.offsetWidth;
    countdown.classList.add("is-counting");
    launchConfetti(number === "3" ? 48 : 25);
    await wait(760);
  }
  countdown.hidden = true;
  giftScreen.hidden = true;
  birthdayContent.hidden = false;
  setMusicStage("reveal");
  window.scrollTo({ top: 0, behavior: reducedMotion.matches ? "auto" : "smooth" });
  launchCelebration();
  startTyping();
});

function wait(duration) {
  return new Promise(resolve => window.setTimeout(resolve, reducedMotion.matches ? 100 : duration));
}

function openLightbox(index) {
  lastFocusedElement = document.activeElement;
  setPhoto(index);
  const lightbox = document.querySelector(".lightbox");
  lightbox.hidden = false;
  document.body.classList.add("modal-open");
  document.querySelector(".lightbox-close").focus();
}

function closeLightbox() {
  const lightbox = document.querySelector(".lightbox");
  if (lightbox.hidden) return;
  lightbox.hidden = true;
  document.body.classList.remove("modal-open");
  if (lastFocusedElement) lastFocusedElement.focus();
}

document.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
document.querySelector(".lightbox-prev").addEventListener("click", () => setPhoto(activePhoto - 1));
document.querySelector(".lightbox-next").addEventListener("click", () => setPhoto(activePhoto + 1));
document.querySelector(".lightbox").addEventListener("click", event => {
  if (event.target === event.currentTarget) closeLightbox();
});

document.addEventListener("keydown", event => {
  const lightbox = document.querySelector(".lightbox");
  if (lightbox.hidden) return;
  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") setPhoto(activePhoto - 1);
  if (event.key === "ArrowRight") setPhoto(activePhoto + 1);
  if (event.key === "Tab") {
    const controls = [...lightbox.querySelectorAll("button")];
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});

document.querySelector(".wish-button").addEventListener("click", event => {
  const button = event.currentTarget;
  const cake = document.querySelector(".cake-scene");
  if (button.disabled) return;
  button.disabled = true;
  button.querySelector("span:first-child").textContent = "Wish sent!";
  cake.classList.add("wished");
  document.querySelector(".wish-message").hidden = false;
  launchConfetti(65);
});

const messageElement = document.querySelector("#typed-message");
const fullMessage = messageElement.dataset.message.trim();
const cursor = messageElement.querySelector(".typing-cursor");

const sectionObserver = new IntersectionObserver(entries => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      sectionObserver.unobserve(entry.target);
    }
  }
}, { threshold: .12, rootMargin: "0px 0px -8% 0px" });
document.querySelectorAll(".birthday-content > .section").forEach(section => {
  section.classList.add("reveal-section");
  sectionObserver.observe(section);
});

const musicStages = {
  birthday: "reveal",
  memories: "gallery"
};
const musicStageObserver = new IntersectionObserver(entries => {
  const activeSection = entries
    .filter(entry => entry.isIntersecting)
    .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];
  if (activeSection) setMusicStage(musicStages[activeSection.target.id]);
}, { threshold: .35 });
Object.keys(musicStages).forEach(id => musicStageObserver.observe(document.getElementById(id)));

const photoObserver = new IntersectionObserver(entries => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      entry.target.classList.add("photo-visible");
      photoObserver.unobserve(entry.target);
    }
  }
}, { threshold: .2 });
document.querySelectorAll(".photo-card").forEach((photo, index) => {
  photo.style.setProperty("--photo-delay", `${index * 90}ms`);
  photoObserver.observe(photo);
});

function startTyping() {
  if (typingStarted) return;
  typingStarted = true;
  messageElement.textContent = "";
  messageElement.append(cursor);
  let position = 0;
  const typeNext = () => {
    if (position >= fullMessage.length) {
      cursor.classList.add("done");
      return;
    }
    messageElement.insertBefore(document.createTextNode(fullMessage[position]), cursor);
    position += 1;
    window.setTimeout(typeNext, fullMessage[position - 1] === "." ? 160 : 28);
  };
  typeNext();
}

const messageObserver = new IntersectionObserver(entries => {
  if (entries.some(entry => entry.isIntersecting)) {
    startTyping();
    messageObserver.disconnect();
  }
}, { threshold: .35 });
messageObserver.observe(document.querySelector(".message-card"));

document.querySelector(".last-surprise-button").addEventListener("click", event => {
  const secret = document.querySelector(".secret-message");
  secret.hidden = false;
  event.currentTarget.hidden = true;
  setMusicStage("final");
  launchConfetti(105);
  secret.scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth", block: "center" });
});

musicToggle.addEventListener("click", () => {
  if (musicOn) {
    audio.pause();
    musicOn = false;
    updateMusicControl(false);
    musicToggle.title = "";
    return;
  }
  startMusicTrack();
});

function startMusicTrack() {
  audio.src = MUSIC_TRACKS[currentMusicStage];
  audio.play().then(() => {
    musicOn = true;
    updateMusicControl(true);
  }).catch(() => {
    showMusicUnavailable();
  });
}

audio.addEventListener("error", showMusicUnavailable);

audio.addEventListener("ended", () => {
  musicOn = false;
  updateMusicControl(false);
});

function showMusicUnavailable() {
  musicOn = false;
  updateMusicControl(false);
  musicLabel.textContent = "ADD YOUR MUSIC";
  musicToggle.setAttribute("aria-label", "Music file unavailable. Add the licensed tracks listed in script.js");
  musicToggle.title = "Add your licensed audio files to the music folder, using the paths listed in script.js.";
}

function setMusicStage(stage) {
  if (stage === currentMusicStage) return;
  currentMusicStage = stage;
  if (!musicOn) return;
  audio.pause();
  audio.src = MUSIC_TRACKS[stage];
  audio.play().then(() => {
    updateMusicControl(true);
  }).catch(() => {
    showMusicUnavailable();
  });
}

function updateMusicControl(isOn) {
  musicToggle.setAttribute("aria-pressed", String(isOn));
  musicToggle.setAttribute("aria-label", isOn ? "Turn background music off" : "Turn background music on");
  musicLabel.textContent = isOn ? "SOUND ON" : "SOUND OFF";
}

function resizeCanvas() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(window.innerWidth * ratio);
  canvas.height = Math.floor(window.innerHeight * ratio);
  canvasContext.setTransform(ratio, 0, 0, ratio, 0, 0);
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function launchCelebration() {
  if (reducedMotion.matches) return;
  const now = performance.now();
  celebrationUntil = Math.max(celebrationUntil, now + 5800);
  launchConfetti(170);
  launchFireworks();
  window.setTimeout(() => launchConfetti(95), 850);
  window.setTimeout(() => launchConfetti(75), 1900);
  window.setTimeout(launchFireworks, 1300);
  window.setTimeout(launchFireworks, 2800);
  if (!animationFrame) animationFrame = requestAnimationFrame(drawParticles);
}

function launchFireworks() {
  const colors = ["#d9a6ff", "#83d5ff", "#ff9ae6", "#fff0a8"];
  const centers = [
    [window.innerWidth * .2, window.innerHeight * .3],
    [window.innerWidth * .8, window.innerHeight * .24],
    [window.innerWidth * (.35 + Math.random() * .3), window.innerHeight * .4]
  ];
  for (const [centerX, centerY] of centers) {
    const color = colors[Math.floor(Math.random() * colors.length)];
    const count = 34;
    for (let index = 0; index < count; index += 1) {
      const angle = (Math.PI * 2 * index) / count;
      const speed = 1.2 + Math.random() * 2.6;
      particles.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 1.5 + Math.random() * 2,
        life: 45 + Math.random() * 26,
        age: 0,
        spin: 0,
        spinSpeed: 0,
        color,
        shape: "circle",
        kind: "spark"
      });
    }
  }
  particles = particles.slice(-750);
}

function launchConfetti(amount) {
  if (reducedMotion.matches) return;
  const colors = ["#bf8aff", "#69bfff", "#ff8ae2", "#f8db88", "#ffffff", "#7ee5d0"];
  for (let index = 0; index < amount; index += 1) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: -15 - Math.random() * window.innerHeight * .42,
      vx: (Math.random() - .5) * 3.2,
      vy: 1.4 + Math.random() * 3.4,
      size: 2 + Math.random() * 4,
      life: 130 + Math.random() * 100,
      age: 0,
      spin: Math.random() * Math.PI,
      spinSpeed: (Math.random() - .5) * .16,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: Math.random() > .5 ? "rect" : "circle",
      kind: "confetti"
    });
  }
  particles = particles.slice(-750);
  if (!animationFrame) animationFrame = requestAnimationFrame(drawParticles);
}

function drawParticles(timestamp) {
  const width = window.innerWidth;
  const height = window.innerHeight;
  canvasContext.clearRect(0, 0, width, height);
  particles = particles.filter(particle => particle.age < particle.life && particle.y < height + 20);
  for (const particle of particles) {
    particle.age += 1;
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.vy += .018;
    particle.spin += particle.spinSpeed;
    const alpha = Math.min(1, (particle.life - particle.age) / 22);
    canvasContext.globalAlpha = Math.max(0, alpha);
    canvasContext.fillStyle = particle.color;
    canvasContext.shadowColor = particle.kind === "spark" ? particle.color : "transparent";
    canvasContext.shadowBlur = particle.kind === "spark" ? 9 : 0;
    canvasContext.beginPath();
    if (particle.shape === "rect") {
      canvasContext.save();
      canvasContext.translate(particle.x, particle.y);
      canvasContext.rotate(particle.spin);
      canvasContext.fillRect(-particle.size / 2, -particle.size / 2, particle.size * 1.9, particle.size * .85);
      canvasContext.restore();
    } else {
      canvasContext.arc(particle.x, particle.y, particle.size * .6, 0, Math.PI * 2);
      canvasContext.fill();
    }
  }
  canvasContext.globalAlpha = 1;
  canvasContext.shadowBlur = 0;
  if (particles.length || timestamp < celebrationUntil) {
    animationFrame = requestAnimationFrame(drawParticles);
  } else {
    animationFrame = 0;
    canvasContext.clearRect(0, 0, width, height);
  }
}
