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
document.addEventListener("DOMContentLoaded", () => {
  const splash = document.getElementById("loading-screen") || document.getElementById("splash-screen");
  if (splash) setTimeout(() => { splash.classList.add("hidden"); splash.style.opacity = "0"; setTimeout(() => splash.remove(), 450); }, 6000);

  const overlay = document.getElementById("overlay");
  const cartDrawer = document.getElementById("cart-drawer");
  const detailModal = document.getElementById("detail-modal");
  const searchBar = document.getElementById("search-bar");
  const searchInput = document.getElementById("search-input");

  function bukaOverlay() { if (overlay) overlay.classList.add("active"); document.body.classList.add("no-scroll"); }
  function tutupSemua() {
    if (overlay) overlay.classList.remove("active");
    if (cartDrawer) cartDrawer.classList.remove("active");
    if (detailModal) detailModal.classList.remove("active");
    const adm = document.getElementById("admin-modal"); if (adm) adm.classList.remove("active");
    const bMod = document.getElementById("brand-modal"); if (bMod) { bMod.classList.remove("active"); bMod.style.display = "none"; }
    const verif = document.getElementById("modal-verif-wa"); if (verif) verif.classList.remove("active");
    document.body.classList.remove("no-scroll");
  }

  if (overlay) overlay.onclick = tutupSemua;
  const closeCart = document.getElementById("close-cart"); if (closeCart) closeCart.onclick = tutupSemua;
  const closeModal = document.getElementById("close-modal"); if (closeModal) closeModal.onclick = tutupSemua;

  const btnSearch = document.getElementById("btn-search");
  if (btnSearch && searchBar) {
    btnSearch.onclick = () => {
      const akanBuka = !searchBar.classList.contains("active");
      if (akanBuka && window.tampilLoadingAksi) {
        window.tampilLoadingAksi("🔍 Menyiapkan pencarian produk...", 1600, () => {
          searchBar.classList.add("active");
          if (searchInput) searchInput.focus();
        });
      } else {
        searchBar.classList.toggle("active");
        if (searchBar.classList.contains("active") && searchInput) searchInput.focus();
      }
    };
  }
  const closeSearch = document.getElementById("close-search");
  if (closeSearch && searchBar) {
    closeSearch.onclick = () => { searchBar.classList.remove("active"); if (searchInput) { searchInput.value = ""; filterPencarian(""); } };
  }
  function filterPencarian(q) {
    const kata = q.toLowerCase().trim();
    document.querySelectorAll(".product-card").forEach(c => {
      const nama = (c.dataset.nama || c.innerText).toLowerCase();
      c.style.display = nama.includes(kata) ? "flex" : "none";
    });
  }
  if (searchInput) searchInput.oninput = (e) => filterPencarian(e.target.value);

      window.alert = function(pesan) {
    if (typeof window.creazAlert === "function") return window.creazAlert(pesan);
  };

  window.tampilLoadingAksi = function(pesan, durasi, callback) {
    let box = document.getElementById("aksi-loader-box");
    if (!box) {
      box = document.createElement("div");
      box.id = "aksi-loader-box";
      box.style.cssText = "position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(45,22,6,0.52);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);display:none;flex-direction:column;align-items:center;justify-content:center;z-index:999999;text-align:center;padding:24px;box-sizing:border-box;transition:opacity 0.25s ease;";
      box.innerHTML = `
        <div style="background:rgba(254,247,220,0.95);border:2.5px solid #5a2d0c;border-radius:22px;padding:22px 24px;box-shadow:0 10px 28px rgba(0,0,0,0.3);max-width:290px;width:100%;">
          <img src="logo.jpg" alt="Crea'Z" class="spinner-logo" style="width:76px;height:76px;border-radius:50%;object-fit:cover;border:3px solid #5a2d0c;margin:0 auto 10px;display:block;box-shadow:0 4px 12px rgba(90,45,12,0.2);" onerror="this.style.display='none'">
          <strong style="font-size:19px;font-weight:900;color:#5a2d0c;margin-bottom:4px;display:block;">Keripik Crea'z</strong>
          <p id="aksi-loader-teks" style="font-size:13.5px;font-weight:800;color:#8c5228;margin:0;line-height:1.4;">Menyiapkan Keripik Crea'z...</p>
          <small style="margin-top:10px;font-size:10.5px;font-weight:800;color:#8c5228;letter-spacing:0.5px;display:block;">Created by SuperG &bull; Designed by M.A.Y</small>
        </div>
      `;
      document.body.appendChild(box);
    }
    document.getElementById("aksi-loader-teks").innerText = pesan || "Menyiapkan Keripik Crea'z...";
    box.style.display = "flex";
    setTimeout(() => {
      box.style.display = "none";
      if (typeof callback === "function") callback();
    }, durasi || 1600);
  };

  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[href]");
    if (!a) return;
    const url = a.getAttribute("href") || "";
    if (url.startsWith("http")) {
      e.preventDefault();
      let msg = "Membuka tautan...";
      const uLow = url.toLowerCase();
      if (uLow.includes("maps") || uLow.includes("goo.gl") || uLow.includes("-7.583705")) msg = "📍 Membuka lokasi Google Maps...";
      else if (uLow.includes("wa.me") || uLow.includes("whatsapp")) msg = "💬 Menghubungkan ke WhatsApp...";
      else if (uLow.includes("instagram.com")) msg = "📸 Membuka Instagram Crea'z...";
      else if (uLow.includes("shopee.co.id")) msg = "🛍️ Membuka toko Shopee...";
      window.tampilLoadingAksi(msg, 1600, () => window.open(url, "_blank"));
    }
  });

  window.CREAZ_STORE = {
    KEY_KERANJANG: "keranjangCreaz",
    MIN_GROSIR: 10,
    DISKON_GROSIR: 0.20,

    ambilKeranjang() {
      try { return JSON.parse(localStorage.getItem(this.KEY_KERANJANG)) || []; } catch (e) { return []; }
    },

    simpanKeranjang(data) {
      localStorage.setItem(this.KEY_KERANJANG, JSON.stringify(data));
      this.renderKeranjang();
    },

    tambahProduk(p) {
      const data = this.ambilKeranjang();
      const ada = data.find(i => i.nama === p.nama);
      let qtyItem = 1;
      if (ada) {
        ada.qty += 1; ada.img = p.img; ada.harga = Number(p.harga); qtyItem = ada.qty;
      } else {
        data.push({ nama: p.nama, harga: Number(p.harga), img: p.img || "produk1.png", qty: 1 });
      }
      this.simpanKeranjang(data);

      const totalQty = data.reduce((a, b) => a + b.qty, 0);
      const badge = document.getElementById("cart-badge");
      if (badge) {
        badge.style.transform = "scale(1.35)";
        badge.style.transition = "transform 0.15s ease";
        setTimeout(() => badge.style.transform = "scale(1)", 160);
      }

      let toast = document.querySelector(".toast-notif");
      if (!toast) {
        toast = document.createElement("div");
        toast.className = "toast-notif";
        toast.style.cssText = "position:fixed;bottom:24px;left:50%;transform:translateX(-50%) scale(0.95);background:#5a2d0c;color:#fef7dc;padding:10px 18px;border-radius:99px;font-size:12.5px;font-weight:800;z-index:9999;box-shadow:0 4px 14px rgba(0,0,0,0.3);transition:transform 0.14s ease, opacity 0.2s ease;white-space:nowrap;";
        document.body.appendChild(toast);
      }
      toast.innerText = `✅ +1 Masuk keranjang (${qtyItem}x • Total ${totalQty} pcs)`;
      toast.style.opacity = "1"; toast.style.display = "block";
      toast.style.transform = "translateX(-50%) scale(1.08)";
      setTimeout(() => toast.style.transform = "translateX(-50%) scale(1)", 130);
      clearTimeout(window._toastTimer);
      window._toastTimer = setTimeout(() => { toast.style.opacity = "0"; setTimeout(() => toast.style.display = "none", 200); }, 6000);
    },

    renderKeranjang() {
      const data = this.ambilKeranjang();
      const wadah = document.getElementById("cart-items");
      const badge = document.getElementById("cart-badge");
      if (!wadah) return;

      let totalHarga = 0, totalQty = 0;
      if (data.length === 0) {
        wadah.innerHTML = `<p style="text-align:center;color:#8c5228;padding:30px 10px;font-weight:700;">Keranjang masih kosong nih.<br>Yuk pilih keripik favoritmu!</p>`;
      } else {
        let html = `<div style="text-align:right;margin-bottom:8px;"><button type="button" id="btn-kosong-cart" style="background:#fee2e2;color:#b91c1c;border:1px solid #fca5a5;border-radius:6px;padding:4px 10px;font-size:11px;font-weight:800;cursor:pointer;">🗑️ Kosongkan Keranjang</button></div>`;
        data.forEach((item, i) => {
          const sub = Number(item.harga) * Number(item.qty);
          totalHarga += sub; totalQty += Number(item.qty);
          html += `
            <div class="cart-item" style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid #e6dec8;">
              <img src="${item.img || "produk1.png"}" alt="${item.nama}" style="width:52px;height:52px;object-fit:cover;border-radius:8px;border:1.5px solid #5a2d0c;flex-shrink:0;">
              <div style="flex:1;min-width:0;">
                <h4 style="font-size:12.5px;margin:0 0 2px;color:#5a2d0c;">${item.nama}</h4>
                <div style="font-size:11.5px;color:#8c5228;">${item.qty}x @ Rp ${Number(item.harga).toLocaleString("id-ID")}</div>
                <div style="font-size:12px;font-weight:800;color:#5a2d0c;">Rp ${sub.toLocaleString("id-ID")}</div>
              </div>
              <div style="display:flex;align-items:center;gap:6px;">
                <button type="button" class="c-min" data-i="${i}" style="width:26px;height:26px;border-radius:6px;border:1.5px solid #5a2d0c;background:#fef7dc;font-weight:900;cursor:pointer;">-</button>
                <span style="font-weight:800;font-size:13px;min-width:16px;text-align:center;">${item.qty}</span>
                <button type="button" class="c-plus" data-i="${i}" style="width:26px;height:26px;border-radius:6px;border:1.5px solid #5a2d0c;background:#f4be2c;font-weight:900;cursor:pointer;">+</button>
              </div>
            </div>`;
        });
        wadah.innerHTML = html;

        document.getElementById("btn-kosong-cart").onclick = () => this.simpanKeranjang([]);
        wadah.querySelectorAll(".c-min").forEach(b => b.onclick = () => {
          const i = b.dataset.i;
          if (data[i].qty > 1) data[i].qty -= 1; else data.splice(i, 1);
          this.simpanKeranjang(data);
        });
        wadah.querySelectorAll(".c-plus").forEach(b => b.onclick = () => {
          data[b.dataset.i].qty += 1;
          this.simpanKeranjang(data);
        });
      }

      const diskon = totalQty >= this.MIN_GROSIR ? Math.round(totalHarga * this.DISKON_GROSIR) : 0;
      const totalAkhir = totalHarga - diskon;
      if (badge) badge.innerText = totalQty;

      const totalRow = document.querySelector(".total-row");
      if (totalRow) {
        const info = totalQty > 0 && totalQty < this.MIN_GROSIR
          ? `<div style="width:100%;font-size:11.5px;color:#8c5228;background:#fef7dc;border:1px dashed #5a2d0c;border-radius:8px;padding:6px 8px;margin-bottom:8px;text-align:center;font-weight:700;">💡 Tambah <b>${this.MIN_GROSIR - totalQty} pcs lagi</b> untuk otomatis dapat <b>Diskon 20%</b>!</div>`
          : (totalQty >= this.MIN_GROSIR ? `<div style="width:100%;font-size:11.5px;color:#15803d;background:#dcfce7;border:1px solid #86efac;border-radius:8px;padding:6px 8px;margin-bottom:8px;text-align:center;font-weight:800;">🎉 Diskon Grosir 20% (-Rp ${diskon.toLocaleString("id-ID")}) aktif!</div>` : "");
        totalRow.style.display = "block";
        totalRow.innerHTML = info + (diskon > 0
          ? `<div style="display:flex;justify-content:space-between;font-size:12px;color:#8c5228;margin-bottom:2px;"><span>Subtotal (${totalQty} pcs):</span><span style="text-decoration:line-through;">Rp ${totalHarga.toLocaleString("id-ID")}</span></div>
             <div style="display:flex;justify-content:space-between;font-weight:900;font-size:15px;color:#5a2d0c;"><span>Total Akhir (-20%):</span><strong id="cart-total">Rp ${totalAkhir.toLocaleString("id-ID")}</strong></div>`
          : `<div style="display:flex;justify-content:space-between;font-weight:900;font-size:15px;color:#5a2d0c;"><span>Total:</span><strong id="cart-total">Rp ${totalHarga.toLocaleString("id-ID")}</strong></div>`);
      }
    }
  };

  window.sinkronKeranjangUI = () => window.CREAZ_STORE.renderKeranjang();
  window.CREAZ_STORE.renderKeranjang();

  const btnCartEl = document.getElementById("btn-cart");
  if (btnCartEl && cartDrawer) {
    btnCartEl.onclick = () => {
      window.CREAZ_STORE.renderKeranjang();
      cartDrawer.classList.add("active");
      bukaOverlay();
    };
  }

  const btnCheckoutEl = document.getElementById("checkout-wa");
  if (btnCheckoutEl) {
    btnCheckoutEl.onclick = () => {
      const keranjang = window.CREAZ_STORE.ambilKeranjang();
      if (keranjang.length === 0) return alert("Pilih produk Crea'z dulu ya!");
      const nama = document.getElementById("nama-pemesan").value.trim();
      const alamat = document.getElementById("alamat-pemesan").value.trim();
      if (!nama || !alamat) return alert("Mohon isi Nama dan Alamat pengiriman dulu ya!");

      let subAll = 0, qtyAll = 0, listHTML = "";
      let teksWA = `Halo Kak, saya mau pesan *Keripik Crea'z*:\n\n`;

      keranjang.forEach((item, idx) => {
        const sub = item.harga * item.qty;
        subAll += sub; qtyAll += item.qty;
        listHTML += `<div style="display:flex;justify-content:space-between;font-size:12.5px;padding:4px 0;border-bottom:1px dashed #e6dec8;">
          <span>${idx + 1}. <b>${item.nama}</b> (${item.qty}x)</span>
          <span style="font-weight:700;">Rp ${sub.toLocaleString("id-ID")}</span>
        </div>`;
        teksWA += `${idx + 1}. *${item.nama}* (${item.qty}x @ Rp ${item.harga.toLocaleString("id-ID")}) = Rp ${sub.toLocaleString("id-ID")}\n`;
      });

      const pot = qtyAll >= window.CREAZ_STORE.MIN_GROSIR ? Math.round(subAll * window.CREAZ_STORE.DISKON_GROSIR) : 0;
      const totalAkhir = subAll - pot;

      let ringkasanHTML = `<div style="display:flex;justify-content:space-between;font-size:12.5px;margin-top:8px;"><span>Total Barang (${qtyAll} pcs):</span><span>Rp ${subAll.toLocaleString("id-ID")}</span></div>`;
      if (pot > 0) {
        ringkasanHTML += `<div style="display:flex;justify-content:space-between;font-size:12.5px;color:#15803d;font-weight:800;"><span>🎉 Diskon Grosir 20%:</span><span>-Rp ${pot.toLocaleString("id-ID")}</span></div>`;
        teksWA += `\nSubtotal (${qtyAll} pcs): Rp ${subAll.toLocaleString("id-ID")}`;
        teksWA += `\n🎉 *Diskon Grosir 20% (≥10 pcs): -Rp ${pot.toLocaleString("id-ID")}*`;
        teksWA += `\n*Total Bayar: Rp ${totalAkhir.toLocaleString("id-ID")}*\n\n`;
      } else {
        teksWA += `\n*Total Belanja (${qtyAll} pcs): Rp ${subAll.toLocaleString("id-ID")}*\n\n`;
      }
      ringkasanHTML += `<div style="display:flex;justify-content:space-between;font-size:15px;font-weight:900;color:#5a2d0c;margin-top:6px;padding-top:6px;border-top:2px solid #5a2d0c;"><span>Total Bayar:</span><span>Rp ${totalAkhir.toLocaleString("id-ID")}</span></div>`;

      teksWA += `*Data Penerima:*\nNama: ${nama}\nAlamat: ${alamat}`;

      let modalVerif = document.getElementById("modal-verif-wa");
      if (!modalVerif) {
        modalVerif = document.createElement("div");
        modalVerif.id = "modal-verif-wa";
        modalVerif.className = "modal";
        modalVerif.style.zIndex = "1500";
        document.body.appendChild(modalVerif);
      }

      modalVerif.innerHTML = `
        <div class="modal-box" style="max-width:390px;text-align:left;padding:18px;">
          <button id="tutup-verif-wa" class="close-btn">✕</button>
          <h3 style="font-size:17px;margin-bottom:4px;color:#5a2d0c;">🧾 Konfirmasi Pesanan</h3>
          <p style="font-size:12px;color:#8c5228;margin-bottom:10px;">Periksa kembali detail pesananmu sebelum dikirim ke WhatsApp:</p>
          <div style="background:#fef7dc;border:1.5px solid #5a2d0c;border-radius:10px;padding:10px;margin-bottom:10px;max-height:170px;overflow-y:auto;">
            ${listHTML}
          </div>
          ${ringkasanHTML}
          <div style="background:#fff;border:1px solid #e6dec8;border-radius:8px;padding:8px;margin:10px 0 14px;font-size:12px;color:#5a2d0c;">
            <div><b>Penerima:</b> ${nama}</div>
            <div><b>Alamat:</b> ${alamat}</div>
          </div>
          <button id="btn-lanjut-wa" class="btn-primary full-width" style="background:#16a34a;color:#fff;border-color:#5a2d0c;font-size:14px;">✅ Lanjutkan ke WhatsApp</button>
        </div>`;

      modalVerif.classList.add("active");
      document.getElementById("tutup-verif-wa").onclick = () => modalVerif.classList.remove("active");

      const waLink = "https" + String.fromCharCode(58,47,47) + "wa." + "me/6285185056083";
      document.getElementById("btn-lanjut-wa").onclick = function() {
        modalVerif.classList.remove("active");
        window.tampilLoadingAksi("💬 Memproses pesanan ke WhatsApp...", 1600, () => {
          window.open(`${waLink}?text=${encodeURIComponent(teksWA)}`, "_blank");
        });
      };
    };
  }
  const navBrandEl = document.querySelector(".nav-brand");
  if (navBrandEl) {
    navBrandEl.addEventListener("click", (e) => {
      e.preventDefault();
      let bModal = document.getElementById("brand-modal");
      if (!bModal) {
        const st = document.createElement("style");
        st.innerHTML = `@keyframes hujanJatuh { 0% { transform: translateY(-20px) rotate(0deg); opacity: 0.9; } 100% { transform: translateY(390px) rotate(320deg); opacity: 0; } } .partikel-hujan { position: absolute; top: -20px; pointer-events: none; font-size: 15px; animation: hujanJatuh linear infinite; z-index: 1; }`;
        document.head.appendChild(st);

        bModal = document.createElement("div");
        bModal.id = "brand-modal";
        bModal.className = "modal";
        bModal.innerHTML = `
          <div class="modal-box" style="position:relative;overflow:hidden;max-width:365px;text-align:center;padding:22px 18px;border:2.5px solid #5a2d0c;border-radius:20px;background:linear-gradient(180deg,#fef7dc 0%,#fffdf7 100%);box-shadow:0 10px 0 rgba(90,45,12,0.2);">
            <div id="wadah-hujan" style="position:absolute;inset:0;overflow:hidden;pointer-events:none;"></div>
            <button id="tutup-brand" class="close-btn" style="position:relative;z-index:3;">✕</button>
            <div style="position:relative;z-index:2;">
              <img src="logo.jpg" alt="Logo Crea'Z" style="width:94px;height:94px;border-radius:50%;object-fit:cover;border:3px solid #5a2d0c;box-shadow:0 4px 10px rgba(90,45,12,0.2);margin:0 auto 10px;">
              <h3 style="font-size:20px;font-weight:900;margin-bottom:2px;color:#5a2d0c;">Keripik Crea'z</h3>
              <p style="font-size:10.5px;font-weight:800;color:#8c5228;letter-spacing:1.2px;margin-bottom:10px;">NIKMAT SETIAP GIGITAN</p>
              <div style="display:flex;justify-content:center;gap:5px;flex-wrap:wrap;margin-bottom:10px;">
                <span style="background:#5a2d0c;color:#fef7dc;font-size:10px;font-weight:800;padding:3px 9px;border-radius:99px;">✅ 100% Halal</span>
                <span style="background:#f4be2c;color:#5a2d0c;border:1px solid #5a2d0c;font-size:10px;font-weight:800;padding:3px 9px;border-radius:99px;">🌿 Tanpa Pengawet</span>
              </div>
              <div style="background:#fff;border:1.5px solid #e6dec8;border-radius:12px;padding:10px;margin-bottom:12px;text-align:left;font-size:12px;color:#5a2d0c;line-height:1.55;">
                <div style="margin-bottom:4px;">🥔 <b>Produk:</b> Aneka keripik &amp; camilan renyah pilihan alami.</div>
                <div style="margin-bottom:4px;">📍 <b>Produksi:</b> Desa Kaligending, Kec. Karangsambung, Kab. Kebumen.</div>
                <div>⏰ <b>Layanan Order:</b> Setiap hari (08.00 – 21.00 WIB)</div>
              </div>
              <div style="display:flex;flex-direction:column;gap:8px;">
                <button type="button" id="btn-lihat-produk-brand" style="width:100%;background:#5a2d0c;color:#fef7dc;font-weight:800;font-size:13px;padding:10px;border-radius:10px;border:1.5px solid #5a2d0c;cursor:pointer;">🛍️ Lihat Semua Produk</button>
                <a href="https://wa.me/6285185056083" target="_blank" style="display:flex;align-items:center;justify-content:center;gap:8px;background:#22c55e;color:#fff;font-weight:800;font-size:13px;padding:10px;border-radius:10px;border:1.5px solid #5a2d0c;text-decoration:none;"><svg width="18" height="18" style="width:18px;height:18px;flex-shrink:0;fill:currentColor;" viewBox="0 0 24 24"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm5.82 14.01c-.25.7-1.44 1.34-2.01 1.42-.52.08-1.18.11-1.9-.12-.44-.14-1-.33-1.72-.64-3.03-1.31-5.01-4.36-5.16-4.56-.15-.2-1.23-1.64-1.23-3.13 0-1.49.78-2.22 1.06-2.52.28-.3.61-.38.81-.38.2 0 .41.01.58.01.19 0 .44-.07.69.53.25.61.86 2.1.94 2.25.08.15.13.33.03.53-.1.2-.15.33-.3.51-.15.18-.32.4-.45.53-.15.15-.31.31-.13.61.18.3.79 1.3 1.7 2.11 1.17 1.04 2.15 1.36 2.45 1.51.3.15.48.13.66-.08.18-.2.76-.88.96-1.18.2-.3.4-.25.68-.15.28.1 1.77.83 2.07.98.3.15.51.23.58.35.08.13.08.73-.17 1.43z"/></svg> <span>Chat WhatsApp: 0851-8505-6083</span></a>
                <a href="https://instagram.com/creaz_snack" target="_blank" style="display:flex;align-items:center;justify-content:center;gap:8px;background:#f4be2c;color:#5a2d0c;font-weight:800;font-size:13px;padding:10px;border-radius:10px;border:1.5px solid #5a2d0c;text-decoration:none;"><svg width="18" height="18" style="width:18px;height:18px;flex-shrink:0;fill:currentColor;" viewBox="0 0 24 24"><path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2zm-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25zM12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/></svg> <span>Follow Instagram: @creaz_snack</span></a>
                <a href="https://shopee.co.id/creaz_kripiksnack" target="_blank" style="display:flex;align-items:center;justify-content:center;gap:8px;background:#ee4d2d;color:#fff;font-weight:800;font-size:13px;padding:10px;border-radius:10px;border:1.5px solid #5a2d0c;text-decoration:none;"><svg width="18" height="18" style="width:18px;height:18px;flex-shrink:0;fill:currentColor;" viewBox="0 0 24 24"><path d="M18 6h-2c0-2.21-1.79-4-4-4S8 3.79 8 6H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6-2c1.1 0 2 .9 2 2h-4c0-1.1.9-2 2-2zm1.5 11.5c0 1.38-1.12 2.5-2.5 2.5-1.08 0-2.01-.69-2.36-1.66l1.39-.51c.15.41.54.67.97.67.55 0 1-.45 1-1 0-.45-.3-.83-.74-.96l-1.18-.35C9.04 13.86 8.5 13.02 8.5 12c0-1.38 1.12-2.5 2.5-2.5 1.04 0 1.94.64 2.31 1.56l-1.37.54c-.16-.37-.52-.6-.94-.6-.55 0-1 .45-1 1 0 .43.28.8.7.93l1.18.36c.96.29 1.62 1.18 1.62 2.21z"/></svg> <span>Shopee: creaz_kripiksnack</span></a>
              </div>
            </div>
          </div>`;
        document.body.appendChild(bModal);

        const wadahHujan = document.getElementById("wadah-hujan");
        const ikonHujan = ["🍠", "🌽", "🌶️", "🥔", "🍘"];
        for (let i = 0; i < 16; i++) {
          const p = document.createElement("span");
          p.className = "partikel-hujan";
          p.innerText = ikonHujan[i % ikonHujan.length];
          p.style.left = (Math.random() * 94) + "%";
          p.style.animationDuration = (2.8 + Math.random() * 2.5) + "s";
          p.style.animationDelay = (Math.random() * 2.5) + "s";
          wadahHujan.appendChild(p);
        }

        document.getElementById("tutup-brand").onclick = () => {
          bModal.classList.remove("active"); bModal.style.display = "none"; tutupSemua();
          if (window.tampilLoadingAksi) window.tampilLoadingAksi("👋 Menutup profil Keripik Crea'z...", 1600);
        };
        document.getElementById("btn-lihat-produk-brand").onclick = () => {
          bModal.classList.remove("active"); bModal.style.display = "none"; tutupSemua();
          if (window.tampilLoadingAksi) {
            window.tampilLoadingAksi("🛍️ Menyiapkan katalog produk...", 1600, () => {
              const kat = document.getElementById("katalog"); if (kat) kat.scrollIntoView({ behavior: "smooth" });
            });
          } else {
            const kat = document.getElementById("katalog"); if (kat) kat.scrollIntoView({ behavior: "smooth" });
          }
        };
      }
      window.tampilLoadingAksi("✨ Membuka profil Keripik Crea'z...", 1600, () => { bModal.classList.add("active"); bModal.style.display = "flex"; bModal.style.opacity = "1"; bModal.style.pointerEvents = "auto"; bukaOverlay(); });
    });
  }
});
window.scrollTo(0, 0);
