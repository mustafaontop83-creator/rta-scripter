const grid = document.getElementById("grid");
const search = document.getElementById("search");
const categories = document.getElementById("categories");
const count = document.getElementById("count");
const empty = document.getElementById("empty");

let activeCategory = "الكل";

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[c]));
}

function renderCategories() {
  const games = [...new Set(scripts.map(s => s.game))];
  categories.innerHTML = ["الكل", ...games].map(game =>
    `<button class="cat ${game === activeCategory ? "active" : ""}" data-game="${esc(game)}">${esc(game)}</button>`
  ).join("");

  categories.querySelectorAll(".cat").forEach(btn => {
    btn.onclick = () => {
      activeCategory = btn.dataset.game;
      renderCategories();
      render();
    };
  });
}

function render() {
  const q = search.value.trim().toLowerCase();
  const filtered = scripts.filter(s => {
    const matchesCategory = activeCategory === "الكل" || s.game === activeCategory;
    const matchesSearch = !q || `${s.name} ${s.game} ${s.description}`.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  count.textContent = filtered.length;
  empty.classList.toggle("hidden", filtered.length !== 0);

  grid.innerHTML = filtered.map((s, i) => `
    <article class="card">
      <div class="thumb">
        ${s.image ? `<img src="${esc(s.image)}" alt="">` : `<div class="game-icon">◈</div>`}
      </div>
      <div class="card-body">
        <div class="card-title">
          <h3>${esc(s.name)}</h3>
          <span class="tag">${esc(s.game)}</span>
        </div>
        <p>${esc(s.description)}</p>
        <div class="meta">
          <span>تحديث: ${esc(s.updated)}</span>
          <span>${Number(s.uses || 0).toLocaleString()} استخدام</span>
        </div>
        <div class="buttons">
          <button class="copy" data-index="${i}">نسخ السكربت</button>
          <button class="open" data-index="${i}">فتح</button>
        </div>
      </div>
    </article>
  `).join("");

  grid.querySelectorAll(".copy").forEach(btn => {
    btn.onclick = async () => {
      const s = filtered[Number(btn.dataset.index)];
      try {
        await navigator.clipboard.writeText(s.script);
        btn.textContent = "تم النسخ ✓";
        setTimeout(() => btn.textContent = "نسخ السكربت", 1300);
      } catch {
        alert("المتصفح منع النسخ التلقائي.");
      }
    };
  });

  grid.querySelectorAll(".open").forEach(btn => {
    btn.onclick = () => {
      const s = filtered[Number(btn.dataset.index)];
      const win = window.open("", "_blank");
      win.document.write(`<pre style="white-space:pre-wrap;background:#080b11;color:#b9d4ff;padding:30px;font-family:monospace">${esc(s.script)}</pre>`);
      win.document.close();
    };
  });
}

search.addEventListener("input", render);
renderCategories();
render();
