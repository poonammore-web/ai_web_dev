document.addEventListener("DOMContentLoaded", () => {

  // --- Navbar scroll effect ---
  const nav = document.getElementById("mainNav");
  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 50);
    scrollTopBtn.classList.toggle("show", window.scrollY > 300);
  });

  // --- Scroll to top ---
  const scrollTopBtn = document.createElement("button");
  scrollTopBtn.id = "scrollTop";
  scrollTopBtn.innerHTML = '<i class="bi bi-arrow-up"></i>';
  document.body.appendChild(scrollTopBtn);
  scrollTopBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  // --- Animate stats counter ---
  function animateCounter(el) {
    const target = +el.dataset.target;
    const duration = 1500;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = Math.floor(current);
      if (current >= target) clearInterval(timer);
    }, 16);
  }

  // --- Intersection Observer for fade-in & counters ---
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(el => {
      if (el.isIntersecting) {
        el.target.classList.add("visible");
        observer.unobserve(el.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll(".feature-card, .pricing-card, .testimonial-card, .demo-card").forEach(el => {
    el.classList.add("fade-in");
    observer.observe(el);
  });

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(el => {
      if (el.isIntersecting) {
        animateCounter(el.target);
        counterObserver.unobserve(el.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll(".stat-number").forEach(el => counterObserver.observe(el));

  // --- Smooth scroll for nav links ---
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", e => {
      const target = document.querySelector(a.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        document.querySelector("#navMenu")?.classList.remove("show");
      }
    });
  });

  // --- Text Analyzer ---
  document.getElementById("analyzeBtn").addEventListener("click", () => {
    const text = document.getElementById("analyzeInput").value.trim();
    if (!text) return;

    const words = text.match(/\b\w+\b/g) || [];
    const sentences = text.split(/[.!?]+/).filter(s => s.trim());
    const avgWordLen = words.reduce((s, w) => s + w.length, 0) / (words.length || 1);
    const readability = Math.min(100, Math.round(100 - (avgWordLen * 5) + (sentences.length * 2)));

    const positive = ["great","good","amazing","excellent","love","happy","wonderful","best","fantastic","awesome"];
    const negative = ["bad","terrible","awful","hate","worst","horrible","poor","sad","fail","wrong"];
    const wordLower = words.map(w => w.toLowerCase());
    const posCount = wordLower.filter(w => positive.includes(w)).length;
    const negCount = wordLower.filter(w => negative.includes(w)).length;
    const sentiment = posCount > negCount ? "Positive" : negCount > posCount ? "Negative" : "Neutral";
    const sentimentColors = { Positive: "success", Negative: "danger", Neutral: "secondary" };

    // Top keywords (exclude stop words)
    const stopWords = new Set(["the","a","an","and","or","but","in","on","at","to","for","of","with","is","are","was","were","it","this","that","i","you","we","he","she","they"]);
    const freq = {};
    wordLower.filter(w => w.length > 3 && !stopWords.has(w)).forEach(w => freq[w] = (freq[w] || 0) + 1);
    const topKeywords = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([w]) => w);

    document.getElementById("wordCount").textContent = words.length;
    document.getElementById("charCount").textContent = text.length;
    document.getElementById("sentenceCount").textContent = sentences.length;
    document.getElementById("readScore").textContent = readability;

    const sentimentEl = document.getElementById("sentiment");
    sentimentEl.textContent = sentiment;
    sentimentEl.className = `badge bg-${sentimentColors[sentiment]} ms-1`;

    document.getElementById("keywords").innerHTML = topKeywords.map(k =>
      `<span class="badge bg-light text-dark border me-1">${k}</span>`
    ).join("") || '<span class="text-muted">Not enough text</span>';

    document.getElementById("analyzeResult").classList.remove("d-none");
  });

  // --- AI Color Palette Generator ---
  const palettes = {
    ocean:   ["#0077b6","#0096c7","#00b4d8","#48cae4","#90e0ef"],
    forest:  ["#1b4332","#2d6a4f","#40916c","#74c69d","#b7e4c7"],
    sunset:  ["#ff4d00","#ff6b35","#ff8c42","#ffa552","#ffd166"],
    minimal: ["#f8f9fa","#e9ecef","#dee2e6","#6c757d","#212529"],
    purple:  ["#10002b","#3c096c","#7b2d8b","#c77dff","#e0aaff"],
    fire:    ["#d00000","#e85d04","#f48c06","#faa307","#ffba08"],
    night:   ["#03045e","#023e8a","#0077b6","#0096c7","#48cae4"],
    rose:    ["#590d22","#800f2f","#c9184a","#ff4d6d","#ffb3c1"],
    default: ["#6366f1","#8b5cf6","#a78bfa","#c4b5fd","#ddd6fe"],
  };

  document.getElementById("paletteBtn").addEventListener("click", () => {
    const keyword = document.getElementById("paletteInput").value.trim().toLowerCase();
    const key = Object.keys(palettes).find(k => keyword.includes(k)) || "default";
    const colors = palettes[key];

    document.getElementById("colorSwatches").innerHTML = colors.map(c =>
      `<div style="width:52px;height:52px;border-radius:10px;background:${c};cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,0.15);transition:transform 0.2s" 
        title="${c}" onclick="navigator.clipboard.writeText('${c}')" 
        onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'"></div>`
    ).join("");

    document.getElementById("colorCodes").innerHTML = colors.map(c =>
      `<span class="badge" style="background:${c};color:${isLight(c)?'#000':'#fff'};cursor:pointer;font-size:0.75rem" 
        onclick="navigator.clipboard.writeText('${c}')" title="Click to copy">${c}</span>`
    ).join("");

    document.getElementById("paletteResult").classList.remove("d-none");
  });

  function isLight(hex) {
    const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 128;
  }

  // --- AI Component Generator ---
  const components = {
    card: `<div class="card" style="max-width:300px">
  <div class="card-body text-center">
    <div class="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center mb-3" style="width:64px;height:64px;font-size:1.5rem">JD</div>
    <h5 class="card-title mb-1">Jane Doe</h5>
    <p class="text-muted small mb-2">Frontend Developer</p>
    <p class="card-text small">Passionate about building beautiful web experiences with modern technologies.</p>
    <button class="btn btn-primary btn-sm px-4">Follow</button>
  </div>
</div>`,
    form: `<form style="max-width:400px">
  <div class="mb-3">
    <label class="form-label">Your Name</label>
    <input type="text" class="form-control" placeholder="John Doe" />
  </div>
  <div class="mb-3">
    <label class="form-label">Email Address</label>
    <input type="email" class="form-control" placeholder="john@example.com" />
  </div>
  <div class="mb-3">
    <label class="form-label">Message</label>
    <textarea class="form-control" rows="3" placeholder="Your message..."></textarea>
  </div>
  <button type="submit" class="btn btn-primary w-100">Send Message</button>
</form>`,
    alert: `<div class="alert alert-success alert-dismissible fade show" role="alert">
  <strong>🎉 Success!</strong> Your changes have been saved successfully.
  <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
</div>
<div class="alert alert-warning alert-dismissible fade show" role="alert">
  <strong>⚠️ Warning!</strong> Please review your settings before continuing.
  <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
</div>`,
    table: `<table class="table table-striped table-hover">
  <thead class="table-dark">
    <tr><th>#</th><th>Name</th><th>Role</th><th>Status</th></tr>
  </thead>
  <tbody>
    <tr><td>1</td><td>Alice Johnson</td><td>Designer</td><td><span class="badge bg-success">Active</span></td></tr>
    <tr><td>2</td><td>Bob Smith</td><td>Developer</td><td><span class="badge bg-success">Active</span></td></tr>
    <tr><td>3</td><td>Carol White</td><td>Manager</td><td><span class="badge bg-warning">Away</span></td></tr>
  </tbody>
</table>`,
    modal: `<!-- Trigger -->
<button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#myModal">
  Open Modal
</button>
<!-- Modal -->
<div class="modal fade" id="myModal" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Confirm Action</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">Are you sure you want to proceed with this action?</div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
        <button type="button" class="btn btn-primary">Confirm</button>
      </div>
    </div>
  </div>
</div>`,
  };

  document.getElementById("generateBtn").addEventListener("click", () => {
    const val = document.getElementById("componentSelect").value;
    if (!val) return;
    const code = components[val];
    document.getElementById("codeBlock").textContent = code;
    document.getElementById("codePreview").innerHTML = code;
    document.getElementById("codeOutput").classList.remove("d-none");
  });

  document.getElementById("copyBtn").addEventListener("click", () => {
    const text = document.getElementById("codeBlock").textContent;
    navigator.clipboard.writeText(text).then(() => {
      const btn = document.getElementById("copyBtn");
      btn.innerHTML = '<i class="bi bi-check me-1"></i>Copied!';
      btn.classList.replace("btn-outline-secondary", "btn-success");
      setTimeout(() => {
        btn.innerHTML = '<i class="bi bi-clipboard me-1"></i>Copy';
        btn.classList.replace("btn-success", "btn-outline-secondary");
      }, 2000);
    });
  });

  // --- Contact Form ---
  document.getElementById("contactForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.target;
    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }
    form.classList.add("was-validated");
    setTimeout(() => {
      form.reset();
      form.classList.remove("was-validated");
      document.getElementById("formSuccess").classList.remove("d-none");
      setTimeout(() => document.getElementById("formSuccess").classList.add("d-none"), 4000);
    }, 500);
  });

  // --- Newsletter ---
  document.getElementById("newsletterBtn").addEventListener("click", () => {
    const email = document.getElementById("newsletterEmail").value.trim();
    if (!email || !email.includes("@")) return;
    document.getElementById("newsletterEmail").value = "";
    const msg = document.getElementById("newsletterMsg");
    msg.classList.remove("d-none");
    setTimeout(() => msg.classList.add("d-none"), 3000);
  });

});
