document.addEventListener("DOMContentLoaded", () => {

  // Text Analyzer
  document.getElementById("analyzeBtn").addEventListener("click", () => {
    const text = document.getElementById("analyzeInput").value.trim();
    if (!text) return;

    const words = text.match(/\b\w+\b/g) || [];
    const positive = ["great","good","amazing","love","happy","excellent","awesome","fantastic"];
    const negative = ["bad","terrible","awful","hate","worst","horrible","poor","sad"];
    const wl = words.map(w => w.toLowerCase());
    const pos = wl.filter(w => positive.includes(w)).length;
    const neg = wl.filter(w => negative.includes(w)).length;

    const stopWords = new Set(["the","a","an","and","or","but","in","on","at","to","for","of","with","is","are","was","it","this","that","i","you","we"]);
    const freq = {};
    wl.filter(w => w.length > 3 && !stopWords.has(w)).forEach(w => freq[w] = (freq[w] || 0) + 1);
    const keywords = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([w]) => w);

    document.getElementById("wordCount").textContent = words.length;
    document.getElementById("charCount").textContent = text.length;
    document.getElementById("sentiment").textContent = pos > neg ? "😊 Positive" : neg > pos ? "😞 Negative" : "😐 Neutral";
    document.getElementById("keywords").innerHTML = keywords.map(k =>
      `<span class="badge bg-light text-dark border me-1">${k}</span>`
    ).join("") || "<span class='text-muted'>N/A</span>";

    document.getElementById("analyzeResult").classList.remove("d-none");
  });

  // Color Palette Generator
  const palettes = {
    ocean:   ["#0077b6","#0096c7","#00b4d8","#48cae4","#90e0ef"],
    forest:  ["#1b4332","#2d6a4f","#40916c","#74c69d","#b7e4c7"],
    sunset:  ["#ff4d00","#ff6b35","#ff8c42","#ffa552","#ffd166"],
    minimal: ["#212529","#495057","#6c757d","#adb5bd","#f8f9fa"],
    purple:  ["#10002b","#3c096c","#7b2d8b","#c77dff","#e0aaff"],
  };

  document.getElementById("paletteBtn").addEventListener("click", () => {
    const keyword = document.getElementById("paletteInput").value.trim().toLowerCase();
    const key = Object.keys(palettes).find(k => keyword.includes(k)) || "ocean";
    const colors = palettes[key];

    document.getElementById("colorSwatches").innerHTML = colors.map(c =>
      `<div title="${c}" onclick="navigator.clipboard.writeText('${c}')" style="width:48px;height:48px;border-radius:8px;background:${c};cursor:pointer" ></div>`
    ).join("");

    document.getElementById("colorCodes").innerHTML = colors.map(c =>
      `<span class="badge border" style="background:${c};color:#fff;cursor:pointer;font-size:0.75rem" onclick="navigator.clipboard.writeText('${c}')">${c}</span>`
    ).join("");

    document.getElementById("paletteResult").classList.remove("d-none");
  });

  // Contact Form
  document.getElementById("contactForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.target;
    if (!form.checkValidity()) { form.classList.add("was-validated"); return; }
    form.reset();
    form.classList.remove("was-validated");
    const msg = document.getElementById("formSuccess");
    msg.classList.remove("d-none");
    setTimeout(() => msg.classList.add("d-none"), 4000);
  });

});
