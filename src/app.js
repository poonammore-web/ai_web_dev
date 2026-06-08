document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("demoBtn");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const count = Number(btn.dataset.count || 0) + 1;
    btn.dataset.count = count;
    btn.textContent = `Clicked ${count} ${count === 1 ? "time" : "times"}`;
  });
});
