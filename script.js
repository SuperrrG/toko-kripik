document.addEventListener("DOMContentLoaded", () => {
  const nomorWA = "6287882468521";
  let keranjang = JSON.parse(localStorage.getItem("keranjangCreaz")) || [];
  let produkAktif = null;

  const loader = document.getElementById("loading-screen");
  const loaderText = document.getElementById("loading-text");
  setTimeout(() => loader.classList.add("hide"), 1500);

  function tampilkanLoading(teks, aksi) {
    loaderText.innerText = teks;
    loader.classList.remove("hide");
    setTimeout(() => { aksi(); loader.classList.add("hide"); }, 1000);
  }

  const searchBar = document.getElementById("search-bar");
  const searchInput = document.getElementById("search-input");
  const cartDrawer = document.getElementById("cart-drawer");
  const detailModal = document.getElementById("detail-modal");
  const overlay = document.getElementById("overlay");

  document.getElementById("btn-search").onclick = () => {
    searchBar.classList.toggle("active");
    if (searchBar.classList.contains("active")) searchInput.focus();
  };

  function jalankanPencarian() {
    const kata = searchInput.value.toLowerCase();
    tampilkanLoading("Mencari produk...", () => {
      document.querySelectorAll(".product-card").forEach(card => {
        card.style.display = card.dataset.nama.toLowerCase().includes(kata) ? "flex" : "none";
      });
    });
  }
  document.getElementById("btn-cari-aksi").onclick = jalankanPencarian;
  searchInput.addEventListener("keypress", e => { if (e.key === "Enter") jalankanPencarian(); });

  const brandModal = document.createElement("div");
  brandModal.id = "brand-modal";
  brandModal.className = "modal";
  brandModal.innerHTML = `
    <div class="modal-box">
      <button id="close-brand-modal" class="close-btn">✕</button>
      <img src="logo.jpg" alt="Keripik Crea'z" class="brand-modal-logo" onerror="this.style.display='none'">
      <h2 style="font-size:20px; font-weight:900;">Keripik Crea'z</h2>
      <p style="font-size:12px; font-weight:800; color:#8c5228; margin-top:2px;">• NIKMAT SETIAP GIGITAN •</p>
      <div class="brand-badges"><span>✅ Halal</span><span>🌿 Tanpa Pengawet</span><span>🎨 Tanpa Pewarna</span></div>
      <p class="modal-desc" style="margin-bottom:10px;">Keripik talas & singkong renyah khas Desa Kaligending, Karangsambung, Kebumen.</p>
      <div class="brand-kontak-grup">
        <a href="https://wa.me/6287882468521" target="_blank" class="brand-kontak-btn btn-wa-brand"><svg width="18" height="18" style="width:18px;height:18px;flex-shrink:0;fill:currentColor;" viewBox="0 0 24 24"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm5.82 14.01c-.25.7-1.44 1.34-2.01 1.42-.52.08-1.18.11-1.9-.12-.44-.14-1-.33-1.72-.64-3.03-1.31-5.01-4.36-5.16-4.56-.15-.2-1.23-1.64-1.23-3.13 0-1.49.78-2.22 1.06-2.52.28-.3.61-.38.81-.38.2 0 .41.01.58.01.19 0 .44-.07.69.53.25.61.86 2.1.94 2.25.08.15.13.33.03.53-.1.2-.15.33-.3.51-.15.18-.32.4-.45.53-.15.15-.31.31-.13.61.18.3.79 1.3 1.7 2.11 1.17 1.04 2.15 1.36 2.45 1.51.3.15.48.13.66-.08.18-.2.76-.88.96-1.18.2-.3.4-.25.68-.15.28.1 1.77.83 2.07.98.3.15.51.23.58.35.08.13.08.73-.17 1.43z"/></svg> <span>Chat WhatsApp: 0878-8246-8521</span></a>
        <a href="https://www.instagram.com/creaz_snack?evlk=MWltOGdiaXM1djBvag==" target="_blank" class="brand-kontak-btn btn-ig-brand"><svg width="18" height="18" style="width:18px;height:18px;flex-shrink:0;fill:currentColor;" viewBox="0 0 24 24"><path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2zm-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25zM12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/></svg> <span>Follow Instagram: @creaz_snack</span></a>
      </div>
      <button id="btn-lanjut-brand" class="btn-primary full-width">Lanjut Lihat Produk</button>
    </div>`;
  document.body.appendChild(brandModal);

  function bukaOverlay() { overlay.classList.add("active"); document.documentElement.classList.add("no-scroll"); document.body.classList.add("no-scroll"); }
  function tutupSemua() {
    cartDrawer.classList.remove("active"); detailModal.classList.remove("active"); brandModal.classList.remove("active");
    overlay.classList.remove("active"); document.documentElement.classList.remove("no-scroll"); document.body.classList.remove("no-scroll");
  }

  document.getElementById("btn-cart").onclick = () => { if (typeof window.sinkronKeranjangUI = function() {
    let data = JSON.parse(localStorage.getItem("keranjangCreaz")) || [];
    const wadah = document.getElementById("cart-items");
    const badge = document.getElementById("cart-badge");
    const totalEl = document.getElementById("cart-total");
    if (!wadah) return;

    let totalHarga = 0, totalQty = 0;
    if (data.length === 0) {
      wadah.innerHTML = `<p style="text-align:center;color:#8c5228;padding:30px 10px;font-weight:700;">Keranjang masih kosong nih.<br>Yuk pilih keripik favoritmu!</p>`;
    } else {
      let html = `<div style="text-align:right;margin-bottom:8px;"><button type="button" id="btn-kosong-cart" style="background:#fee2e2;color:#b91c1c;border:1px solid #fca5a5;border-radius:6px;padding:4px 10px;font-size:11px;font-weight:800;cursor:pointer;">🗑️ Kosongkan Keranjang</button></div>`;
      data.forEach((item, i) => {
        const sub = item.harga * item.qty;
        totalHarga += sub; totalQty += item.qty;
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

      document.getElementById("btn-kosong-cart").onclick = () => {
        localStorage.setItem("keranjangCreaz", "[]");
        window.sinkronKeranjangUI();
      };
      wadah.querySelectorAll(".c-min").forEach(b => b.onclick = () => {
        const i = b.dataset.i;
        if (data[i].qty > 1) data[i].qty -= 1; else data.splice(i, 1);
        localStorage.setItem("keranjangCreaz", JSON.stringify(data));
        window.sinkronKeranjangUI();
      });
      wadah.querySelectorAll(".c-plus").forEach(b => b.onclick = () => {
        data[b.dataset.i].qty += 1;
        localStorage.setItem("keranjangCreaz", JSON.stringify(data));
        window.sinkronKeranjangUI();
      });
    }

    const diskon = totalQty >= 10 ? Math.round(totalHarga * 0.2) : 0;
    const totalAkhir = totalHarga - diskon;
    if (badge) badge.innerText = totalQty;

    const totalRow = document.querySelector(".total-row");
    if (totalRow) {
      const info = totalQty > 0 && totalQty < 10
        ? `<div style="width:100%;font-size:11.5px;color:#8c5228;background:#fef7dc;border:1px dashed #5a2d0c;border-radius:8px;padding:6px 8px;margin-bottom:8px;text-align:center;font-weight:700;">💡 Tambah <b>${10 - totalQty} pcs lagi</b> untuk otomatis dapat <b>Diskon 20%</b>!</div>`
        : (totalQty >= 10 ? `<div style="width:100%;font-size:11.5px;color:#15803d;background:#dcfce7;border:1px solid #86efac;border-radius:8px;padding:6px 8px;margin-bottom:8px;text-align:center;font-weight:800;">🎉 Diskon Grosir 20% (-Rp ${diskon.toLocaleString("id-ID")}) aktif!</div>` : "");
      totalRow.style.display = "block";
      totalRow.innerHTML = info + (diskon > 0
        ? `<div style="display:flex;justify-content:space-between;font-size:12px;color:#8c5228;margin-bottom:2px;"><span>Subtotal (${totalQty} pcs):</span><span style="text-decoration:line-through;">Rp ${totalHarga.toLocaleString("id-ID")}</span></div>
           <div style="display:flex;justify-content:space-between;font-weight:900;font-size:15px;color:#5a2d0c;"><span>Total Akhir (-20%):</span><strong id="cart-total">Rp ${totalAkhir.toLocaleString("id-ID")}</strong></div>`
        : `<div style="display:flex;justify-content:space-between;font-weight:900;font-size:15px;color:#5a2d0c;"><span>Total:</span><strong id="cart-total">Rp ${totalHarga.toLocaleString("id-ID")}</strong></div>`);
    }
  };
  window.sinkronKeranjangUI();
  const btnCartEl = document.getElementById("btn-cart");
  if (btnCartEl) btnCartEl.addEventListener("click", () => window.sinkronKeranjangUI());
});
window.scrollTo(0, 0);
