document.addEventListener("DOMContentLoaded", () => {

  // --- Navbar scroll ---
  const nav = document.getElementById("mainNav");
  const scrollTopBtn = document.getElementById("scrollTop");
  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 60);
    scrollTopBtn.classList.toggle("show", window.scrollY > 300);
  });
  scrollTopBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  // --- Dark/Light mode ---
  const themeToggle = document.getElementById("themeToggle");
  const html = document.documentElement;
  themeToggle.addEventListener("click", () => {
    const isDark = html.getAttribute("data-theme") === "dark";
    html.setAttribute("data-theme", isDark ? "light" : "dark");
    themeToggle.innerHTML = isDark ? '<i class="bi bi-moon-fill"></i>' : '<i class="bi bi-sun-fill"></i>';
  });

  // --- Animate stat counters ---
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (!isIntersecting) return;
      const end = +target.dataset.target;
      let current = 0;
      const step = end / 80;
      const timer = setInterval(() => {
        current = Math.min(current + step, end);
        target.textContent = Math.floor(current).toLocaleString();
        if (current >= end) clearInterval(timer);
      }, 16);
      counterObserver.unobserve(target);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll(".stat-num").forEach(el => counterObserver.observe(el));

  // --- Fade-up on scroll ---
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) { target.classList.add("visible"); fadeObserver.unobserve(target); }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll(".feature-card, .demo-card, .testimonial-card, .faq-item, .contact-card").forEach(el => {
    el.classList.add("fade-up");
    fadeObserver.observe(el);
  });

  // --- Smooth scroll nav ---
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", e => {
      const target = document.querySelector(a.getAttribute("href"));
      if (target) {
        e.preventDefault();
        const offset = target.getBoundingClientRect().top + window.scrollY - 72;
        window.scrollTo({ top: offset, behavior: "smooth" });
        document.getElementById("navMenu")?.classList.remove("show");
      }
    });
  });

  // --- Text Analyzer ---
  document.getElementById("analyzeBtn").addEventListener("click", () => {
    const text = document.getElementById("analyzeInput").value.trim();
    if (!text) return;

    const words = text.match(/\b\w+\b/g) || [];
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgWordLen = words.reduce((s, w) => s + w.length, 0) / (words.length || 1);
    const readScore = Math.max(0, Math.min(100, Math.round(206.835 - 1.015 * (words.length / (sentences.length || 1)) - 84.6 * (avgWordLen / 5))));

    const positive = ["great","good","amazing","love","happy","excellent","awesome","fantastic","wonderful","best"];
    const negative = ["bad","terrible","awful","hate","worst","horrible","poor","sad","wrong","fail"];
    const wl = words.map(w => w.toLowerCase());
    const pos = wl.filter(w => positive.includes(w)).length;
    const neg = wl.filter(w => negative.includes(w)).length;
    const sentimentMap = { pos: ["😊 Positive","success"], neg: ["😞 Negative","danger"], neu: ["😐 Neutral","secondary"] };
    const [sLabel, sColor] = pos > neg ? sentimentMap.pos : neg > pos ? sentimentMap.neg : sentimentMap.neu;

    const stopWords = new Set(["the","a","an","and","or","but","in","on","at","to","for","of","with","is","are","was","were","it","this","that","i","you","we","he","she","they","be","have","do","not"]);
    const freq = {};
    wl.filter(w => w.length > 3 && !stopWords.has(w)).forEach(w => freq[w] = (freq[w] || 0) + 1);
    const keywords = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([w]) => w);

    document.getElementById("wordCount").textContent = words.length;
    document.getElementById("charCount").textContent = text.length;
    document.getElementById("sentenceCount").textContent = sentences.length;
    document.getElementById("readability").textContent = readScore;

    const sentEl = document.getElementById("sentiment");
    sentEl.textContent = sLabel;
    sentEl.className = `badge bg-${sColor} ms-1`;

    document.getElementById("keywords").innerHTML = keywords.length
      ? keywords.map(k => `<span class="badge bg-light text-dark border me-1 mb-1">${k}</span>`).join("")
      : `<span class="text-muted">Not enough text</span>`;

    document.getElementById("analyzeResult").classList.remove("d-none");
  });

  // --- Color Palette Generator ---
  const palettes = {
    ocean:   ["#03045e","#0077b6","#00b4d8","#48cae4","#90e0ef"],
    forest:  ["#1b4332","#2d6a4f","#40916c","#74c69d","#b7e4c7"],
    sunset:  ["#9b2226","#ae2012","#e85d04","#f48c06","#ffd166"],
    minimal: ["#212529","#495057","#6c757d","#adb5bd","#f8f9fa"],
    purple:  ["#10002b","#3c096c","#7b2d8b","#c77dff","#e0aaff"],
    fire:    ["#6a040f","#d00000","#e85d04","#f48c06","#ffba08"],
    rose:    ["#590d22","#800f2f","#c9184a","#ff4d6d","#ffb3c1"],
    night:   ["#03045e","#023e8a","#0077b6","#0096c7","#00b4d8"],
  };

  function isLight(hex) {
    const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
    return (r*299 + g*587 + b*114)/1000 > 128;
  }

  document.getElementById("paletteBtn").addEventListener("click", () => {
    const kw = document.getElementById("paletteInput").value.trim().toLowerCase();
    const key = Object.keys(palettes).find(k => kw.includes(k)) || Object.keys(palettes)[Math.floor(Math.random() * Object.keys(palettes).length)];
    const colors = palettes[key];

    document.getElementById("colorSwatches").innerHTML = colors.map(c =>
      `<div title="Click to copy ${c}" onclick="navigator.clipboard.writeText('${c}');this.style.outline='3px solid #0d6efd'"
        style="width:52px;height:52px;border-radius:10px;background:${c};cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,0.2);transition:transform 0.2s"
        onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'"></div>`
    ).join("");

    document.getElementById("colorCodes").innerHTML = colors.map(c =>
      `<span class="badge" style="background:${c};color:${isLight(c)?'#000':'#fff'};cursor:pointer;padding:6px 10px;font-size:0.75rem;border-radius:6px"
        onclick="navigator.clipboard.writeText('${c}')" title="Copy">${c}</span>`
    ).join("");

    document.getElementById("paletteResult").classList.remove("d-none");
  });

  // --- Password Generator ---
  const pwLength = document.getElementById("pwLength");
  const pwLenLabel = document.getElementById("pwLenLabel");
  pwLength.addEventListener("input", () => pwLenLabel.textContent = pwLength.value);

  document.getElementById("pwGenBtn").addEventListener("click", () => {
    const len = +pwLength.value;
    const upper = document.getElementById("pwUpper").checked;
    const nums = document.getElementById("pwNumbers").checked;
    const syms = document.getElementById("pwSymbols").checked;

    let chars = "abcdefghijklmnopqrstuvwxyz";
    if (upper) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (nums) chars += "0123456789";
    if (syms) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";

    const pw = Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    document.getElementById("pwOutput").value = pw;

    // Strength
    let strength = 0;
    if (len >= 12) strength++;
    if (len >= 16) strength++;
    if (upper) strength++;
    if (nums) strength++;
    if (syms) strength++;

    const levels = [
      ["Very Weak","danger",20], ["Weak","warning",40], ["Fair","info",60],
      ["Strong","primary",80], ["Very Strong","success",100]
    ];
    const [label, color, width] = levels[Math.min(strength, levels.length - 1)];
    const bar = document.getElementById("pwStrengthBar");
    bar.style.width = width + "%";
    bar.className = `progress-bar bg-${color}`;
    document.getElementById("pwStrengthLabel").textContent = label;
    document.getElementById("pwResult").classList.remove("d-none");
  });

  document.getElementById("pwCopyBtn").addEventListener("click", () => {
    navigator.clipboard.writeText(document.getElementById("pwOutput").value);
    const btn = document.getElementById("pwCopyBtn");
    btn.innerHTML = '<i class="bi bi-check"></i>';
    setTimeout(() => btn.innerHTML = '<i class="bi bi-clipboard"></i>', 2000);
  });

  // --- Text Converter ---
  const convertInput = document.getElementById("convertInput");

  convertInput.addEventListener("input", () => {
    const t = convertInput.value;
    document.getElementById("cvWords").textContent = t.trim() ? t.trim().split(/\s+/).length : 0;
    document.getElementById("cvChars").textContent = t.length;
    document.getElementById("cvLines").textContent = t ? t.split("\n").length : 0;
  });

  document.querySelectorAll(".convert-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const t = convertInput.value;
      const type = btn.dataset.type;
      const transforms = {
        upper: t => t.toUpperCase(),
        lower: t => t.toLowerCase(),
        title: t => t.replace(/\b\w/g, c => c.toUpperCase()),
        reverse: t => t.split("").reverse().join(""),
      };
      convertInput.value = transforms[type](t);
      convertInput.dispatchEvent(new Event("input"));
    });
  });

  document.getElementById("convertCopy").addEventListener("click", () => {
    navigator.clipboard.writeText(convertInput.value);
    const btn = document.getElementById("convertCopy");
    btn.innerHTML = '<i class="bi bi-check me-1"></i>Copied!';
    setTimeout(() => btn.innerHTML = '<i class="bi bi-clipboard me-1"></i>Copy', 2000);
  });

  // --- Contact Form ---
  document.getElementById("contactForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.target;
    if (!form.checkValidity()) { form.classList.add("was-validated"); return; }
    form.reset();
    form.classList.remove("was-validated");
    const msg = document.getElementById("formSuccess");
    msg.classList.remove("d-none");
    setTimeout(() => msg.classList.add("d-none"), 5000);
  });

});
