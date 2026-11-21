(function(){
  if (window._creazDialogReady) return;
  window._creazDialogReady = true;
  function buatModal() {
    let m = document.getElementById("creaz-custom-dialog");
    if (!m) {
      m = document.createElement("div");
      m.id = "creaz-custom-dialog";
      m.style.cssText = "position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(45,22,6,0.65);backdrop-filter:blur(4px);display:none;align-items:center;justify-content:center;z-index:2147483647;padding:20px;box-sizing:border-box;";
      document.body.appendChild(m);
    }
    return m;
  }
  window.creazAlert = function(pesan, judul, ikon) {
    return new Promise((resolve) => {
      const m = buatModal();
      const teks = String(pesan || "").replace(/^[✅❌⚠️🔐🧾]+\s*/, "");
      const ico = ikon || (String(pesan).includes("❌") || String(pesan).includes("salah") || String(pesan).includes("Gagal") ? "⚠️" : (String(pesan).includes("✅") ? "✅" : "🥔"));
      const ttl = judul || (ico === "⚠️" ? "Perhatian" : (ico === "✅" ? "Berhasil" : "Info Keripik Crea'z"));
      m.innerHTML = `<div style="background:#fef7dc;border:2.5px solid #5a2d0c;border-radius:22px;padding:22px 20px;max-width:320px;width:100%;text-align:center;box-shadow:0 10px 28px rgba(0,0,0,0.35);">
        <img src="logo.jpg" alt="Crea'Z" style="width:54px;height:54px;border-radius:50%;object-fit:cover;border:2.5px solid #5a2d0c;margin:0 auto 6px;display:block;" onerror="this.style.display='none'">
        <div style="font-size:13px;font-weight:900;color:#5a2d0c;margin-bottom:8px;">Keripik Crea'z</div>
        <div style="font-size:28px;margin-bottom:4px;">${ico}</div>
        <h3 style="font-size:16px;font-weight:900;color:#5a2d0c;margin:0 0 6px;">${ttl}</h3>
        <p style="font-size:13px;font-weight:700;color:#8c5228;line-height:1.45;margin:0 0 14px;">${teks}</p>
        <button type="button" id="creaz-dlg-ok" style="width:100%;background:#f4be2c;color:#5a2d0c;border:2px solid #5a2d0c;border-radius:12px;padding:10px;font-size:13.5px;font-weight:900;cursor:pointer;box-shadow:0 3px 0 #5a2d0c;">Oke, Mengerti</button>
        <small style="margin-top:10px;font-size:10px;font-weight:800;color:#8c5228;display:block;">Created by SuperG &bull; Designed by M.A.Y</small>
      </div>`;
      m.style.display = "flex";
      document.getElementById("creaz-dlg-ok").onclick = () => { m.style.display = "none"; resolve(true); };
    });
  };
  window.creazPrompt = function(judul, placeholder) {
    return new Promise((resolve) => {
      const m = buatModal();
      m.innerHTML = `<div style="background:#fef7dc;border:2.5px solid #5a2d0c;border-radius:22px;padding:22px 20px;max-width:320px;width:100%;text-align:center;box-shadow:0 10px 28px rgba(0,0,0,0.35);">
        <img src="logo.jpg" alt="Crea'Z" style="width:58px;height:58px;border-radius:50%;object-fit:cover;border:2.5px solid #5a2d0c;margin:0 auto 6px;display:block;" onerror="this.style.display='none'">
        <div style="font-size:13.5px;font-weight:900;color:#5a2d0c;margin-bottom:8px;">Keripik Crea'z</div>
        <h3 style="font-size:16px;font-weight:900;color:#5a2d0c;margin:0 0 4px;">🔐 ${judul || "Gerbang Admin"}</h3>
        <p style="font-size:12px;font-weight:700;color:#8c5228;margin:0 0 12px;">Masukkan kode PIN rahasia:</p>
        <input type="password" inputmode="numeric" id="creaz-prm-inp" placeholder="${placeholder || "••••"}" style="width:100%;box-sizing:border-box;text-align:center;font-size:20px;letter-spacing:6px;font-weight:900;padding:10px;border:2px solid #5a2d0c;border-radius:12px;background:#fff;color:#5a2d0c;margin-bottom:14px;outline:none;">
        <div style="display:flex;gap:8px;">
          <button type="button" id="creaz-prm-batal" style="flex:1;background:#fff;color:#5a2d0c;border:2px solid #5a2d0c;border-radius:12px;padding:10px;font-size:13px;font-weight:800;cursor:pointer;">Batal</button>
          <button type="button" id="creaz-prm-ok" style="flex:1;background:#f4be2c;color:#5a2d0c;border:2px solid #5a2d0c;border-radius:12px;padding:10px;font-size:13px;font-weight:900;cursor:pointer;box-shadow:0 3px 0 #5a2d0c;">Masuk</button>
        </div>
        <small style="margin-top:10px;font-size:10px;font-weight:800;color:#8c5228;display:block;">Created by SuperG &bull; Designed by M.A.Y</small>
      </div>`;
      m.style.display = "flex";
      const inp = document.getElementById("creaz-prm-inp");
      setTimeout(() => inp.focus(), 80);
      inp.onkeydown = (e) => { if (e.key === "Enter") document.getElementById("creaz-prm-ok").click(); };
      document.getElementById("creaz-prm-batal").onclick = () => { m.style.display = "none"; resolve(null); };
      document.getElementById("creaz-prm-ok").onclick = () => { const v = inp.value; m.style.display = "none"; resolve(v); };
    });
  };
  window.alert = function(p) { return window.creazAlert(p); };
})();
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
    window.creazAlert("✅ Akses Admin berhasil diaktifkan! Ketuk 5x tulisan credits di bawah untuk mulai mengedit.");
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

    async function panggilPinAdmin() {
      if (!localStorage.getItem("gh_token_creaz")) return;
      const jalankanPrompt = async () => {
        const pin = await window.creazPrompt("Gerbang Admin Crea'z", "••••");
        if (pin === PIN_ADMIN) {
          if (window.tampilLoadingAksi) window.tampilLoadingAksi("⚙️ Memuat Panel Admin Crea'z...", 1600, bukaPanelAdmin);
          else bukaPanelAdmin();
        } else if (pin !== null) window.creazAlert("PIN salah!");
      };
      if (window.tampilLoadingAksi) window.tampilLoadingAksi("🔐 Membuka gerbang PIN Admin...", 1600, jalankanPrompt);
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
          <div class="admin-field" style="flex:1;"><label>Harga Coret</label><input type="number" id="adm-old" placeholder="16000"></div>
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
    document.getElementById("tutup-admin").onclick = () => {
      modal.classList.remove("active");
      document.getElementById("overlay").classList.remove("active");
      if (window.tampilLoadingAksi) window.tampilLoadingAksi("👋 Menutup Panel Admin...", 1600);
    };
    renderDaftarAdmin();

    function setLoadingUploadAdmin(aktif, pesan) {
      let box = document.getElementById("aksi-loader-box");
      if (!box) {
        box = document.createElement("div");
        box.id = "aksi-loader-box";
        box.style.cssText = "position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(45,22,6,0.58);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);display:none;flex-direction:column;align-items:center;justify-content:center;z-index:2147483647;text-align:center;padding:24px;box-sizing:border-box;";
        box.innerHTML = `<div style="background:rgba(254,247,220,0.96);border:2.5px solid #5a2d0c;border-radius:22px;padding:22px 24px;box-shadow:0 10px 28px rgba(0,0,0,0.35);max-width:290px;width:100%;">
          <img src="logo.jpg" alt="Crea'Z" class="spinner-logo" style="width:76px;height:76px;border-radius:50%;object-fit:cover;border:3px solid #5a2d0c;margin:0 auto 10px;display:block;" onerror="this.style.display='none'">
          <strong style="font-size:19px;font-weight:900;color:#5a2d0c;margin-bottom:4px;display:block;">Keripik Crea'z</strong>
          <p id="aksi-loader-teks" style="font-size:13.5px;font-weight:800;color:#8c5228;margin:0;line-height:1.4;">Memproses...</p>
          <small style="margin-top:10px;font-size:10.5px;font-weight:800;color:#8c5228;display:block;">Created by SuperG &bull; Designed by M.A.Y</small>
        </div>`;
        document.body.appendChild(box);
      }
      const pEl = document.getElementById("aksi-loader-teks");
      if (pEl && pesan) pEl.innerText = pesan;
      box.style.display = aktif ? "flex" : "none";
    }

    function notifSuksesCountdown() {
      let sisa = 10;
      let m = document.getElementById("creaz-custom-dialog");
      if (!m) {
        m = document.createElement("div");
        m.id = "creaz-custom-dialog";
        m.style.cssText = "position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(45,22,6,0.65);backdrop-filter:blur(4px);display:none;align-items:center;justify-content:center;z-index:2147483647;padding:20px;box-sizing:border-box;";
        document.body.appendChild(m);
      }
      m.style.display = "flex";
      const gambarNotif = () => {
        m.innerHTML = `<div style="background:#fef7dc;border:2.5px solid #5a2d0c;border-radius:22px;padding:22px 20px;max-width:320px;width:100%;text-align:center;box-shadow:0 10px 28px rgba(0,0,0,0.35);">
          <img src="logo.jpg" alt="Crea'Z" style="width:54px;height:54px;border-radius:50%;object-fit:cover;border:2.5px solid #5a2d0c;margin:0 auto 6px;display:block;" onerror="this.style.display='none'">
          <div style="font-size:13px;font-weight:900;color:#5a2d0c;margin-bottom:6px;">Keripik Crea'z</div>
          <div style="font-size:30px;margin-bottom:4px;">✅</div>
          <h3 style="font-size:16px;font-weight:900;color:#15803d;margin:0 0 6px;">Produk Berhasil Disimpan!</h3>
          <p style="font-size:12.5px;font-weight:700;color:#8c5228;line-height:1.45;margin:0 0 14px;">Perubahan sudah terkirim ke server.<br>Tunggu sekitar <b>${sisa} detik</b> agar tampil di katalog utama...</p>
          <button type="button" id="creaz-cd-ok" style="width:100%;background:#f4be2c;color:#5a2d0c;border:2px solid #5a2d0c;border-radius:12px;padding:10px;font-size:13.5px;font-weight:900;cursor:pointer;box-shadow:0 3px 0 #5a2d0c;">Oke, Mengerti</button>
          <small style="margin-top:10px;font-size:10px;font-weight:800;color:#8c5228;display:block;">Created by SuperG &bull; Designed by M.A.Y</small>
        </div>`;
        document.getElementById("creaz-cd-ok").onclick = () => { clearInterval(tmr); m.style.display = "none"; };
      };
      gambarNotif();
      const tmr = setInterval(() => {
        sisa -= 1;
        if (sisa <= 0) { clearInterval(tmr); m.style.display = "none"; }
        else gambarNotif();
      }, 1000);
    }

    document.getElementById("adm-simpan").onclick = async () => {
      const token = document.getElementById("adm-token").value.trim();
      if (!token) return window.creazAlert("Token belum aktif! Buka link aktivasi dulu.");
      localStorage.setItem("gh_token_creaz", token);

      const idx = parseInt(document.getElementById("adm-edit-idx").value);
      const nama = document.getElementById("adm-nama").value.trim();
      const harga = parseInt(document.getElementById("adm-harga").value) || 10000;
      const oldHarga = parseInt(document.getElementById("adm-old").value) || 0;
      const kategori = document.getElementById("adm-kat").value.trim() || "Keripik Talas";
      const tag = document.getElementById("adm-tag").value.trim() || "Favorit";
      const desk = document.getElementById("adm-desk").value.trim();
      const fileInput = document.getElementById("adm-file");
      if (!nama) return window.creazAlert("Nama produk wajib diisi!");

      const btnSimpan = document.getElementById("adm-simpan");
      btnSimpan.innerText = "⏳ Menyimpan..."; btnSimpan.disabled = true;

      try {
        let namaFileGambar = idx >= 0 ? daftarProduk[idx].img : "produk1.png";
        if (fileInput.files.length > 0) {
          setLoadingUploadAdmin(true, "📤 Mengunggah foto produk...");
          namaFileGambar = "produk_" + Date.now() + ".jpg";
          const base64Img = await kompresGambar(fileInput.files.item(0));
          await uploadKeGitHub(token, namaFileGambar, base64Img, "Upload foto " + namaFileGambar);
        }
        setLoadingUploadAdmin(true, "💾 Menyimpan katalog ke website...");
        const itemBaru = { id: "p" + Date.now(), kategori, tag, nama, harga, oldHarga, diskon: oldHarga > harga ? "Promo" : "", stok: idx >= 0 ? daftarProduk[idx].stok : true, img: namaFileGambar, desk };
        if (idx >= 0) daftarProduk[idx] = itemBaru; else daftarProduk.push(itemBaru);

        const jsonStr = btoa(unescape(encodeURIComponent(JSON.stringify(daftarProduk, null, 2))));
        await uploadKeGitHub(token, "products.json", jsonStr, "Update katalog produk dari Admin");
        setLoadingUploadAdmin(false);
        notifSuksesCountdown();
        renderDaftarAdmin(); renderKatalog(daftarProduk);
      } catch (err) {
        setLoadingUploadAdmin(false);
        window.creazAlert("Gagal: " + err.message);
      }
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
    const p = daftarProduk[i];
    const statusBaru = !p.stok ? "TERSEDIA" : "HABIS";
    const yakin = await window.creazConfirm(`Ubah status stok "${p.nama}" menjadi ${statusBaru}?`, "Konfirmasi Ubah Stok", "Ya, Ubah");
    if (!yakin) return;
    const token = document.getElementById("adm-token").value.trim();
    if (!token) return window.creazAlert("Token belum aktif!");
    p.stok = !p.stok;
    renderDaftarAdmin(); renderKatalog(daftarProduk);
    const jsonStr = btoa(unescape(encodeURIComponent(JSON.stringify(daftarProduk, null, 2))));
    await uploadKeGitHub(token, "products.json", jsonStr, "Ubah stok " + p.nama);
    window.creazAlert(`Status stok "${p.nama}" berhasil diubah menjadi ${statusBaru}!`, "Stok Diperbarui", "✅");
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
    if (!(await window.creazConfirm(`Hapus produk "${daftarProduk[i].nama}" secara permanen?`, "Konfirmasi Hapus", "Ya, Hapus"))) return;
    const token = document.getElementById("adm-token").value.trim();
    if (!token) return window.creazAlert("Token belum aktif!");
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
