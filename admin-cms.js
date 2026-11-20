(function() {
  const OWNER = "SuperrrG", REPO = "toko-kripik", PIN_ADMIN = "1234";
  const sl = String.fromCharCode(58,47,47);
  const API_BASE = "https" + sl + "api." + "github" + ".com/repos/" + OWNER + "/" + REPO + "/contents/";
  let daftarProduk = [];

  const params = new URLSearchParams(window.location.search);
  const tokBaru = params.get("aktivasi");
  if (tokBaru) {
    localStorage.setItem("gh_token_creaz", tokBaru.trim());
    window.history.replaceState({}, document.title, window.location.pathname);
    alert("✅ Akses Admin berhasil diaktifkan! Ketuk 5x tulisan credits di bawah untuk mulai mengedit.");
  }

  async function muatKatalog() {
    try {
      const res = await fetch("products.json?t=" + Date.now());
      daftarProduk = await res.json();
      renderKatalog(daftarProduk);
    } catch (e) { console.error(e); }
  }

  function renderKatalog(list) {
    const grid = document.querySelector(".product-grid");
    if (!grid) return;
    const katBar = document.querySelector(".kategori-bar");
    if (katBar) {
      const unikKat = [...new Set(list.map(x => x.kategori))];
      katBar.style.cssText += ";display:flex;align-items:center;gap:6px;overflow-x:auto;scroll-behavior:smooth;cursor:grab;padding-bottom:6px;";
      if (!document.getElementById("kat-nav-wrap")) {
        const wrap = document.createElement("div");
        wrap.id = "kat-nav-wrap";
        wrap.style.cssText = "position:relative;display:flex;align-items:center;gap:4px;margin-bottom:10px;";
        katBar.parentNode.insertBefore(wrap, katBar);
        const btnL = document.createElement("button");
        btnL.type = "button"; btnL.innerText = "‹";
        btnL.style.cssText = "background:#fef7dc;border:1.5px solid #5a2d0c;color:#5a2d0c;border-radius:8px;width:28px;height:32px;font-weight:900;font-size:16px;cursor:pointer;flex-shrink:0;";
        const btnR = document.createElement("button");
        btnR.type = "button"; btnR.innerText = "›";
        btnR.style.cssText = btnL.style.cssText;
        wrap.appendChild(btnL); wrap.appendChild(katBar); wrap.appendChild(btnR);
        katBar.style.marginBottom = "0"; katBar.style.flex = "1";
        btnL.onclick = () => katBar.scrollBy({ left: -140, behavior: "smooth" });
        btnR.onclick = () => katBar.scrollBy({ left: 140, behavior: "smooth" });

        let isDown = false, startX, scrollLeft;
        katBar.addEventListener("mousedown", e => { isDown = true; katBar.style.cursor = "grabbing"; startX = e.pageX - katBar.offsetLeft; scrollLeft = katBar.scrollLeft; });
        katBar.addEventListener("mouseleave", () => { isDown = false; katBar.style.cursor = "grab"; });
        katBar.addEventListener("mouseup", () => { isDown = false; katBar.style.cursor = "grab"; });
        katBar.addEventListener("mousemove", e => { if (!isDown) return; e.preventDefault(); const x = e.pageX - katBar.offsetLeft; katBar.scrollLeft = scrollLeft - (x - startX) * 1.5; });
      }
      katBar.innerHTML = `<button class="kat-btn active" data-kategori="semua">Semua</button>` +
        unikKat.map(k => `<button class="kat-btn" data-kategori="${k}">${k.charAt(0).toUpperCase() + k.slice(1)}</button>`).join("");
      katBar.querySelectorAll(".kat-btn").forEach(b => {
        b.onclick = () => {
          katBar.querySelectorAll(".kat-btn").forEach(x => x.classList.remove("active"));
          b.classList.add("active");
          const pilih = b.dataset.kategori;
          document.querySelectorAll(".product-card").forEach(c => {
            c.style.display = (pilih === "semua" || c.dataset.kategori.toLowerCase() === pilih.toLowerCase()) ? "flex" : "none";
          });
        };
      });
    }

    grid.innerHTML = list.map((p, idx) => `
      <div class="product-card" data-kategori="${p.kategori}" data-nama="${p.nama}">
        <div class="img-box">
          <span class="promo-tag">${p.tag || p.kategori}</span>
          ${!p.stok ? '<div class="stok-habis-badge">STOK HABIS</div>' : ''}
          <img src="${p.img}" alt="${p.nama}">
        </div>
        <div class="card-body">
          <div class="rating">⭐ 4.9 • ${p.stok ? 'Tersedia' : 'Habis'}</div>
          <h3>${p.nama}</h3>
          <div class="price-wrap">
            ${p.oldHarga ? `<span class="old-price">Rp ${Number(p.oldHarga).toLocaleString("id-ID")}</span>` : ''}
            <span class="new-price">Rp ${Number(p.harga).toLocaleString("id-ID")}</span>
            ${p.diskon ? `<span class="disc-badge">${p.diskon}</span>` : ''}
          </div>
          <div style="font-size:10.5px;font-weight:800;color:#b91c1c;background:#fef2f2;border:1px solid #fecaca;border-radius:6px;padding:3px 6px;margin-bottom:8px;text-align:center;">🎉 Beli 10+ pcs Diskon 20%</div>
          <div class="card-actions">
            <button class="btn-detail" data-idx="${idx}">Detail</button>
            <button class="btn-add" data-idx="${idx}" ${!p.stok ? 'disabled' : ''}>${p.stok ? '+ Keranjang' : 'Habis'}</button>
          </div>
        </div>
      </div>`).join("");

    grid.querySelectorAll(".btn-detail").forEach(btn => {
      btn.onclick = () => {
        const p = daftarProduk[btn.dataset.idx];
        document.getElementById("modal-img").src = p.img;
        document.getElementById("modal-title").innerText = p.nama;
        document.getElementById("modal-price").innerText = "Rp " + Number(p.harga).toLocaleString("id-ID");
        document.getElementById("modal-desc").innerText = p.desk;
        const mAdd = document.getElementById("modal-add-btn");
        mAdd.disabled = !p.stok; mAdd.innerText = p.stok ? "+ Tambah ke Keranjang" : "Stok Habis";
        mAdd.onclick = () => { if (p.stok) { tambahKeKeranjangGlobal(p); document.getElementById("close-modal").click(); } };
        document.getElementById("detail-modal").classList.add("active");
        document.getElementById("overlay").classList.add("active");
      };
    });

    grid.querySelectorAll(".btn-add").forEach(btn => {
      btn.onclick = () => { const p = daftarProduk[btn.dataset.idx]; if (p && p.stok) tambahKeKeranjangGlobal(p); };
    });
  }

  function tambahKeKeranjangGlobal(p) { if (window.CREAZ_STORE) window.CREAZ_STORE.tambahProduk(p); }

  let ketukan = 0, timerKetuk = null, timerTahan = null;
  const creditEl = document.querySelector(".credits-tag");
  if (creditEl) {
    creditEl.style.cssText += ";cursor:pointer;user-select:none;-webkit-user-select:none;-webkit-touch-callout:none;padding:8px 12px;display:inline-block;";

    function panggilPinAdmin() {
      if (!localStorage.getItem("gh_token_creaz")) return;
      const jalankanPrompt = () => {
        const pin = prompt("Masukkan PIN Admin Crea'z:");
        if (pin === PIN_ADMIN) {
          if (window.tampilLoadingAksi) window.tampilLoadingAksi("⚙️ Memuat Panel Admin Crea'z...", 1500, bukaPanelAdmin);
          else bukaPanelAdmin();
        } else if (pin !== null) alert("PIN salah!");
      };
      if (window.tampilLoadingAksi) window.tampilLoadingAksi("🔐 Membuka gerbang PIN Admin...", 1500, jalankanPrompt);
      else jalankanPrompt();
    }

    creditEl.addEventListener("click", (e) => {
      e.preventDefault();
      ketukan++;
      clearTimeout(timerKetuk);
      timerKetuk = setTimeout(() => ketukan = 0, 2500);
      if (ketukan >= 5) {
        ketukan = 0;
        panggilPinAdmin();
      }
    });

    creditEl.addEventListener("touchstart", () => {
      timerTahan = setTimeout(() => { ketukan = 0; panggilPinAdmin(); }, 1500);
    }, { passive: true });
    creditEl.addEventListener("touchend", () => clearTimeout(timerTahan));
    creditEl.addEventListener("touchmove", () => clearTimeout(timerTahan));
  }

  function bukaPanelAdmin() {
    let modal = document.getElementById("admin-modal");
    if (!modal) { modal = document.createElement("div"); modal.id = "admin-modal"; modal.className = "modal"; document.body.appendChild(modal); }
    const tokenTersimpan = localStorage.getItem("gh_token_creaz") || "";
    modal.innerHTML = `
      <div class="modal-box admin-modal-box">
        <button id="tutup-admin" class="close-btn">✕</button>
        <div style="background:#fef7dc;border:1.5px solid #5a2d0c;border-radius:12px;padding:10px 12px;margin-bottom:14px;text-align:center;">
          <h3 style="margin:0;font-size:17px;color:#5a2d0c;">⚙️ Kelola Produk Crea'z</h3>
          <small style="display:block;margin-top:3px;font-size:11px;font-weight:800;color:#8c5228;">Created by SuperG &bull; Designed by M.A.Y</small>
        </div>
        <div class="admin-field" style="display:${tokenTersimpan ? 'none' : 'block'};">
          <label>Kunci Token GitHub</label>
          <input type="password" id="adm-token" value="${tokenTersimpan}" placeholder="Tempel token di sini">
        </div>
        <h4 id="adm-form-judul" style="margin-bottom:8px;">+ Tambah / Edit Produk</h4>
        <input type="hidden" id="adm-edit-idx" value="-1">
        <div class="admin-field"><label>Nama Produk</label><input type="text" id="adm-nama" placeholder="Contoh: Keripik Talas — Rasa Keju"></div>
        <div style="display:flex; gap:8px;">
          <div class="admin-field" style="flex:1;"><label>Harga Jual</label><input type="number" id="adm-harga" placeholder="10000"></div>
          <div class="admin-field" style="flex:1;"><label>Harga Coret</label><input type="number" id="adm-old" placeholder="12000"></div>
        </div>
        <div class="admin-field">
          <label>Kategori Produk (Pencet cepat atau ketik manual)</label>
          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:6px;">
            <button type="button" class="admin-mini-btn" style="background:#fef7dc;" onclick="document.getElementById('adm-kat').value='Keripik Talas'">🥔 Keripik Talas</button>
            <button type="button" class="admin-mini-btn" style="background:#fef7dc;" onclick="document.getElementById('adm-kat').value='Keripik Singkong'">🌿 Keripik Singkong</button>
          </div>
          <input type="text" id="adm-kat" placeholder="Pilih di atas atau ketik kategori baru...">
        </div>
        <div class="admin-field">
          <label>Label Promo (Pencet cepat atau ketik manual)</label>
          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:6px;">
            <button type="button" class="admin-mini-btn" style="background:#dcfce7;" onclick="document.getElementById('adm-tag').value='Terlaris'">🔥 Terlaris</button>
            <button type="button" class="admin-mini-btn" style="background:#fee2e2;" onclick="document.getElementById('adm-tag').value='Baru'">✨ Baru</button>
            <button type="button" class="admin-mini-btn" style="background:#fef7dc;" onclick="document.getElementById('adm-tag').value='Promo'">🏷️ Promo</button>
            <button type="button" class="admin-mini-btn" style="background:#e0e7ff;" onclick="document.getElementById('adm-tag').value='Best Seller'">⭐ Best Seller</button>
          </div>
          <input type="text" id="adm-tag" placeholder="Pilih di atas atau ketik label sendiri...">
        </div>
        <div class="admin-field"><label>Foto Produk (Galeri HP)</label><input type="file" id="adm-file" accept="image/*"></div>
        <div class="admin-field"><label>Deskripsi</label><textarea id="adm-desk" rows="2">Halal, tanpa pengawet, dan tanpa pewarna buatan.</textarea></div>
        <button id="adm-simpan" class="btn-primary full-width" style="margin-bottom:16px;">💾 Simpan ke Website</button>
        <h4 style="margin-bottom:8px;">Daftar Produk & Stok Saat Ini</h4>
        <div id="adm-list"></div>
      </div>`;
    modal.classList.add("active"); document.getElementById("overlay").classList.add("active");
    document.getElementById("tutup-admin").onclick = () => { modal.classList.remove("active"); document.getElementById("overlay").classList.remove("active"); };
    renderDaftarAdmin();

    document.getElementById("adm-simpan").onclick = async () => {
      const token = document.getElementById("adm-token").value.trim();
      if (!token) return alert("Token belum aktif! Buka link aktivasi dulu.");
      localStorage.setItem("gh_token_creaz", token);

      const idx = parseInt(document.getElementById("adm-edit-idx").value);
      const nama = document.getElementById("adm-nama").value.trim();
      const harga = parseInt(document.getElementById("adm-harga").value) || 10000;
      const oldHarga = parseInt(document.getElementById("adm-old").value) || 0;
      const kategori = document.getElementById("adm-kat").value.trim() || "Keripik Talas";
      const tag = document.getElementById("adm-tag").value.trim() || "Favorit";
      const desk = document.getElementById("adm-desk").value.trim();
      const fileInput = document.getElementById("adm-file");
      if (!nama) return alert("Nama produk wajib diisi!");

      const btnSimpan = document.getElementById("adm-simpan");
      btnSimpan.innerText = "⏳ Menyimpan..."; btnSimpan.disabled = true;

      try {
        let namaFileGambar = idx >= 0 ? daftarProduk[idx].img : "produk1.png";
        if (fileInput.files.length > 0) {
          namaFileGambar = "produk_" + Date.now() + ".jpg";
          const base64Img = await kompresGambar(fileInput.files.item(0));
          await uploadKeGitHub(token, namaFileGambar, base64Img, "Upload foto " + namaFileGambar);
        }
        const itemBaru = { id: "p" + Date.now(), kategori, tag, nama, harga, oldHarga, diskon: oldHarga > harga ? "Promo" : "", stok: idx >= 0 ? daftarProduk[idx].stok : true, img: namaFileGambar, desk };
        if (idx >= 0) daftarProduk[idx] = itemBaru; else daftarProduk.push(itemBaru);

        const jsonStr = btoa(unescape(encodeURIComponent(JSON.stringify(daftarProduk, null, 2))));
        await uploadKeGitHub(token, "products.json", jsonStr, "Update katalog produk dari Admin");
        alert("✅ Tersimpan! Perubahan akan muncul di website dalam ~45 detik.");
        renderDaftarAdmin(); renderKatalog(daftarProduk);
      } catch (err) { alert("Gagal: " + err.message); }
      btnSimpan.innerText = "💾 Simpan ke Website"; btnSimpan.disabled = false;
    };
  }

  function renderDaftarAdmin() {
    const wadah = document.getElementById("adm-list");
    if (!wadah) return;
    wadah.innerHTML = daftarProduk.map((p, i) => `
      <div class="admin-item-row">
        <div style="flex:1;">
          <strong style="font-size:12px; display:block;">${p.nama}</strong>
          <small style="color:#8c5228;">Rp ${Number(p.harga).toLocaleString("id-ID")} • <b>${p.stok ? '🟢 Tersedia' : '🔴 Habis'}</b></small>
        </div>
        <div style="display:flex; gap:4px; flex-wrap:wrap;">
          <button class="admin-mini-btn" style="background:${p.stok ? '#fee2e2' : '#dcfce7'};" onclick="toggleStokAdmin(${i})">${p.stok ? 'Set Habis' : 'Set Ada'}</button>
          <button class="admin-mini-btn" style="background:#fef7dc;" onclick="editProdukAdmin(${i})">Edit</button>
          <button class="admin-mini-btn" style="background:#fecaca;" onclick="hapusProdukAdmin(${i})">Hapus</button>
        </div>
      </div>`).join("");
  }

  window.toggleStokAdmin = async (i) => {
    const token = document.getElementById("adm-token").value.trim();
    if (!token) return alert("Token belum aktif!");
    daftarProduk[i].stok = !daftarProduk[i].stok;
    renderDaftarAdmin(); renderKatalog(daftarProduk);
    const jsonStr = btoa(unescape(encodeURIComponent(JSON.stringify(daftarProduk, null, 2))));
    await uploadKeGitHub(token, "products.json", jsonStr, "Ubah stok " + daftarProduk[i].nama);
  };

  window.editProdukAdmin = (i) => {
    const p = daftarProduk[i];
    document.getElementById("adm-edit-idx").value = i; document.getElementById("adm-nama").value = p.nama;
    document.getElementById("adm-harga").value = p.harga; document.getElementById("adm-old").value = p.oldHarga || "";
    document.getElementById("adm-kat").value = p.kategori; document.getElementById("adm-tag").value = p.tag;
    document.getElementById("adm-desk").value = p.desk; document.getElementById("adm-form-judul").innerText = "✏️ Edit: " + p.nama;
    document.querySelector(".admin-modal-box").scrollTop = 0;
  };

  window.hapusProdukAdmin = async (i) => {
    if (!confirm("Hapus produk " + daftarProduk[i].nama + "?")) return;
    const token = document.getElementById("adm-token").value.trim();
    if (!token) return alert("Token belum aktif!");
    daftarProduk.splice(i, 1);
    renderDaftarAdmin(); renderKatalog(daftarProduk);
    const jsonStr = btoa(unescape(encodeURIComponent(JSON.stringify(daftarProduk, null, 2))));
    await uploadKeGitHub(token, "products.json", jsonStr, "Hapus produk");
  };

  function kompresGambar(file) {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = e => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const maxW = 800, scale = maxW / img.width;
          canvas.width = img.width > maxW ? maxW : img.width;
          canvas.height = img.width > maxW ? img.height * scale : img.height;
          canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/jpeg", 0.82).split(",").pop());
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  async function uploadKeGitHub(token, path, base64Content, message) {
    let sha = null;
    const cek = await fetch(API_BASE + path, { headers: { Authorization: "token " + token } });
    if (cek.ok) { const data = await cek.json(); sha = data.sha; }
    const body = { message, content: base64Content };
    if (sha) body.sha = sha;
    const res = await fetch(API_BASE + path, {
      method: "PUT",
      headers: { Authorization: "token " + token, "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error("Token tidak valid atau gagal koneksi");
  }

  muatKatalog();
})();
