const root = document.documentElement;
const menuToggle = document.getElementById("menu-toggle");
const nav = document.getElementById("nav");
const navLinks = document.querySelectorAll(".nav a");
const topProgress = document.getElementById("top-progress");
const roleType = document.getElementById("role-type");
const year = document.getElementById("year");
const revealItems = document.querySelectorAll(".reveal");
const meters = document.querySelectorAll(".skill-meter");
const skillsSection = document.getElementById("skills");
const skillChips = document.querySelectorAll(".skills-cloud span");
const tiltCards = document.querySelectorAll(".tilt");
const sections = document.querySelectorAll("main section[id]");

const roles = [
  "Data Science",
  "Machine Learning",
  "NLP",
  "Python Analytics"
];

menuToggle.addEventListener("click", () => {
  const opened = nav.classList.toggle("open");
  menuToggle.classList.toggle("active", opened);
  menuToggle.setAttribute("aria-expanded", String(opened));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (window.innerWidth < 900) {
      nav.classList.remove("open");
      menuToggle.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
});

let roleIndex = 0;
let charIndex = 0;
let deleting = false;

function typeRole() {
  const text = roles[roleIndex];

  if (!deleting) {
    charIndex += 1;
    roleType.textContent = text.slice(0, charIndex);
    if (charIndex === text.length) {
      deleting = true;
      setTimeout(typeRole, 900);
      return;
    }
  } else {
    charIndex -= 1;
    roleType.textContent = text.slice(0, charIndex);
    if (charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }

  setTimeout(typeRole, deleting ? 45 : 90);
}

typeRole();

if (year) {
  year.textContent = new Date().getFullYear().toString();
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.15 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const meterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const fill = entry.target.querySelector("i");
      fill.style.width = `${entry.target.dataset.fill || 0}%`;
      meterObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.5 }
);

meters.forEach((meter) => meterObserver.observe(meter));

skillChips.forEach((chip, index) => {
  chip.style.setProperty("--i", index.toString());
});

if (skillsSection) {
  const skillsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("skills-live");
          skillsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.35 }
  );

  skillsObserver.observe(skillsSection);
}

window.addEventListener(
  "scroll",
  () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const val = max > 0 ? (window.scrollY / max) * 100 : 0;
    topProgress.style.width = `${val}%`;
  },
  { passive: true }
);

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: "-42% 0px -46% 0px", threshold: 0 }
);

sections.forEach((section) => sectionObserver.observe(section));

tiltCards.forEach((card) => {
  card.addEventListener("mousemove", (event) => {
    if (window.innerWidth < 900) return;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rx = (y - rect.height / 2) / 22;
    const ry = (rect.width / 2 - x) / 22;
    card.style.transform = `perspective(850px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "perspective(850px) rotateX(0) rotateY(0)";
  });
});
