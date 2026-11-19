document.addEventListener("DOMContentLoaded", () => {
  const nomorWA = "6287882468521";
  let keranjang = JSON.parse(localStorage.getItem("keranjangCreaz")) || [];
  let produkAktif = null;

  const loader = document.getElementById("loading-screen");
  const loaderText = document.getElementById("loading-text");
  setTimeout(() => loader.classList.add("hide"), 1600);

  function tampilkanLoading(teks, aksi) {
    loaderText.innerText = teks;
    loader.classList.remove("hide");
    setTimeout(() => { aksi(); loader.classList.add("hide"); }, 1100);
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
      document.getElementById("katalog").scrollIntoView({ behavior: "smooth" });
    });
  }
  document.getElementById("btn-cari-aksi").onclick = jalankanPencarian;
  searchInput.addEventListener("keypress", e => { if (e.key === "Enter") jalankanPencarian(); });

  document.getElementById("btn-cart").onclick = () => {
    cartDrawer.classList.add("active"); overlay.classList.add("active");
    document.documentElement.classList.add("no-scroll"); document.body.classList.add("no-scroll");
  };

  function tutupSemua() {
    cartDrawer.classList.remove("active"); detailModal.classList.remove("active");
    overlay.classList.remove("active"); document.documentElement.classList.remove("no-scroll");
    document.body.classList.remove("no-scroll");
  }
  document.getElementById("close-cart").onclick = tutupSemua;
  document.getElementById("close-modal").onclick = tutupSemua;
  overlay.onclick = tutupSemua;
  overlay.addEventListener("touchmove", e => e.preventDefault(), { passive: false });

  const katBtns = document.querySelectorAll(".kat-btn");
  const cards = document.querySelectorAll(".product-card");
  katBtns.forEach(btn => {
    btn.onclick = () => {
      katBtns.forEach(b => b.classList.remove("active")); btn.classList.add("active");
      const kat = btn.dataset.kategori;
      cards.forEach(card => card.style.display = (kat === "semua" || card.dataset.kategori === kat) ? "flex" : "none");
    };
  });

  const toastEl = document.createElement("div");
  toastEl.className = "toast-notif";
  document.body.appendChild(toastEl);
  let toastTimer = null;
  function munculToast(pesan) {
    toastEl.innerText = pesan; toastEl.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => toastEl.classList.remove("show"), 1800);
  }

  cards.forEach(card => {
    const nama = card.dataset.nama, harga = parseInt(card.dataset.harga), desk = card.dataset.desk, img = card.dataset.img;
    card.querySelector(".btn-detail").onclick = () => {
      produkAktif = { nama, harga, img };
      document.getElementById("modal-img").src = img;
      document.getElementById("modal-title").innerText = nama;
      document.getElementById("modal-price").innerText = "Rp " + harga.toLocaleString("id-ID");
      document.getElementById("modal-desc").innerText = desk;
      detailModal.classList.add("active"); overlay.classList.add("active");
      document.documentElement.classList.add("no-scroll"); document.body.classList.add("no-scroll");
    };
    card.querySelector(".btn-add").onclick = () => { tambahItem(nama, harga, img); munculToast("✅ Masuk ke keranjang!"); };
  });

  document.getElementById("modal-add-btn").onclick = () => {
    if (produkAktif) { tambahItem(produkAktif.nama, produkAktif.harga, produkAktif.img); munculToast("✅ Masuk ke keranjang!"); tutupSemua(); }
  };
  function tambahItem(nama, harga, img) {
    const ada = keranjang.find(i => i.nama === nama);
    if (ada) { ada.qty += 1; ada.img = img; }
    else keranjang.push({ nama, harga, img: img || "produk1.png", qty: 1 });
    renderKeranjang();
  }

  window.ubahQty = (index, delta) => {
    keranjang[index].qty += delta;
    if (keranjang[index].qty <= 0) keranjang.splice(index, 1);
    renderKeranjang();
  };

  function renderKeranjang() {
    localStorage.setItem("keranjangCreaz", JSON.stringify(keranjang));
    const wadah = document.getElementById("cart-items");
    let totalItem = 0, totalHarga = 0; wadah.innerHTML = "";
    if (keranjang.length === 0) {
      wadah.innerHTML = '<p class="empty-msg">Keranjang masih kosong nih.</p>';
    } else {
      keranjang.forEach((item, i) => {
        totalItem += item.qty; totalHarga += item.harga * item.qty;
        const fotoItem = item.img || "produk1.png";
        wadah.innerHTML += `
          <div style="display:flex; align-items:center; gap:10px; padding:10px 0; border-bottom:1px solid #e6dec8;">
            <img src="${fotoItem}" alt="${item.nama}" style="width:48px; height:48px; object-fit:contain; background:#fff; border:1.5px solid #e6dec8; border-radius:10px; flex-shrink:0;">
            <div style="flex:1; text-align:left;">
              <strong style="font-size:12.5px; display:block; line-height:1.25;">${item.nama}</strong>
              <small style="color:#78716c; display:block; font-size:11px;">Rp ${item.harga.toLocaleString("id-ID")} x ${item.qty}</small>
              <small style="color:#8c5228; font-weight:800;">Subtotal: Rp ${(item.harga * item.qty).toLocaleString("id-ID")}</small>
            </div>
            <div style="display:flex; align-items:center; gap:6px;">
              <button onclick="ubahQty(${i}, -1)" style="width:24px; height:24px; border-radius:6px; border:1.5px solid #5a2d0c; background:white; font-weight:bold;">-</button>
              <span style="font-size:13px; font-weight:bold;">${item.qty}</span>
              <button onclick="ubahQty(${i}, 1)" style="width:24px; height:24px; border-radius:6px; border:1.5px solid #5a2d0c; background:#f4be2c; font-weight:bold;">+</button>
            </div>
          </div>`;
      });
    }
    document.getElementById("cart-badge").innerText = totalItem;
    document.getElementById("cart-total").innerText = "Rp " + totalHarga.toLocaleString("id-ID");
  }

  document.getElementById("checkout-wa").onclick = () => {
    if (keranjang.length === 0) return alert("Pilih produk Crea'z dulu ya!");
    const namaPembeli = document.getElementById("nama-pemesan").value.trim();
    const alamatPembeli = document.getElementById("alamat-pemesan").value.trim();
    if (!namaPembeli || !alamatPembeli) return alert("Mohon isi Nama dan Alamat pengiriman dulu ya!");

    let teks = `Halo Kak, saya mau pesan *Keripik Crea'z*:\n\n`;
    let total = 0;
    keranjang.forEach((item, idx) => {
      const sub = item.harga * item.qty; total += sub;
      teks += `${idx + 1}. *${item.nama}* (${item.qty}x @ Rp ${item.harga.toLocaleString("id-ID")}) = Rp ${sub.toLocaleString("id-ID")}\n`;
    });
    teks += `\n*Total Belanja: Rp ${total.toLocaleString("id-ID")}*\n`;
    teks += `\n*Data Penerima:*\nNama: ${namaPembeli}\nAlamat: ${alamatPembeli}`;
    const url = ["https", "://wa.me/", nomorWA, "?text=", encodeURIComponent(teks)].join("");
    window.open(url, "_blank");
  };

  const linkWA = document.getElementById("link-wa-footer");
  if (linkWA) linkWA.href = ["https", "://wa.me/", nomorWA].join("");

  const linkIG = document.getElementById("link-ig-footer");
  if (linkIG) linkIG.href = ["https", "://://instagram.com"].join("");

  const kotakPeta = document.querySelector(".map-box");
  if (kotakPeta) {
    const urlOSM = ["https", "://www.openstreetmap.org/export/embed.html?bbox=109.6650%2C-7.5780%2C109.7050%2C-7.5450&layer=mapnik&marker=-7.5615%2C109.6850"].join("");
    const urlGMaps = ["https", "://maps.app.goo.gl/J2hJMG5b7BiXreuh6"].join("");
    kotakPeta.style.height = "auto";
    kotakPeta.innerHTML = `
      <iframe src="${urlOSM}" style="width:100%; height:175px; border:0; display:block;"></iframe>
      <a href="${urlGMaps}" target="_blank" style="display:block; background:#f4be2c; color:#5a2d0c; text-align:center; padding:8px; font-size:12px; font-weight:800; text-decoration:none;">📍 Buka Rute di Google Maps</a>
    `;
  }

  renderKeranjang();
});

// Ubah teks kontak di footer menjadi tombol berikon logo WA & IG
document.querySelectorAll(".footer-info p").forEach(p => {
  if (p.innerHTML.includes("Kontak Kami:")) {
    const urlWA = ["https", "://wa.me/6287882468521"].join("");
    const urlIG = ["https", "://://instagram.com"].join("");
    p.outerHTML = `
      <div style="display:flex;flex-direction:column;gap:10px;margin:14px 0;">
        <a href="${urlWA}" target="_blank" style="display:inline-flex;align-items:center;gap:10px;background:#16a34a;color:#ffffff;text-decoration:none;padding:10px 16px;border-radius:12px;font-size:13px;font-weight:800;border:2px solid #f4be2c;width:fit-content;box-shadow:0 4px 10px rgba(0,0,0,0.2);">
          <svg width="18" height="18" style="width:18px;height:18px;flex-shrink:0;fill:currentColor;" viewBox="0 0 24 24"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm5.82 14.01c-.25.7-1.44 1.34-2.01 1.42-.52.08-1.18.11-1.9-.12-.44-.14-1-.33-1.72-.64-3.03-1.31-5.01-4.36-5.16-4.56-.15-.2-1.23-1.64-1.23-3.13 0-1.49.78-2.22 1.06-2.52.28-.3.61-.38.81-.38.2 0 .41.01.58.01.19 0 .44-.07.69.53.25.61.86 2.1.94 2.25.08.15.13.33.03.53-.1.2-.15.33-.3.51-.15.18-.32.4-.45.53-.15.15-.31.31-.13.61.18.3.79 1.3 1.7 2.11 1.17 1.04 2.15 1.36 2.45 1.51.3.15.48.13.66-.08.18-.2.76-.88.96-1.18.2-.3.4-.25.68-.15.28.1 1.77.83 2.07.98.3.15.51.23.58.35.08.13.08.73-.17 1.43z"/></svg>
          <span>WhatsApp: 0878-8246-8521</span>
        </a>
        <a href="${urlIG}" target="_blank" style="display:inline-flex;align-items:center;gap:10px;background:#f4be2c;color:#5a2d0c;text-decoration:none;padding:10px 16px;border-radius:12px;font-size:13px;font-weight:800;border:2px solid #fef7dc;width:fit-content;box-shadow:0 4px 10px rgba(0,0,0,0.2);">
          <svg width="18" height="18" style="width:18px;height:18px;flex-shrink:0;fill:currentColor;" viewBox="0 0 24 24"><path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2zm-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25zM12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/></svg>
          <span>Instagram: @creaz_snack</span>
        </a>
      </div>`;
  }
});

// Pop-up Kartu Profil Brand & Efek Kejutan Hujan Kripik saat Logo Diketuk
const brandModal = document.createElement("div");
brandModal.id = "brand-modal";
brandModal.className = "modal";
const urlWABrand = ["https", "://wa.me/6287882468521"].join("");
const urlIGBrand = ["https", "://://instagram.com"].join("");

brandModal.innerHTML = `
  <div class="modal-box">
    <button id="close-brand-modal" class="close-btn">✕</button>
    <img src="logo.jpg" alt="Keripik Crea'z" class="brand-modal-logo" onerror="this.style.display='none'">
    <h2 style="font-size:20px; font-weight:900;">Keripik Crea'z</h2>
    <p style="font-size:12px; font-weight:800; color:#8c5228; margin-top:2px;">• NIKMAT SETIAP GIGITAN •</p>
    <div class="brand-badges">
      <span>✅ Halal</span>
      <span>🌿 Tanpa Pengawet</span>
      <span>🎨 Tanpa Pewarna</span>
    </div>
    <p class="modal-desc" style="margin-bottom:10px;">
      Keripik talas renyah khas Desa Kaligending, Karangsambung, Kebumen. Diolah dari bahan alami pilihan untuk menemani setiap momen santaimu.
    </p>
    <div class="brand-kontak-grup">
      <a href="${urlWABrand}" target="_blank" class="brand-kontak-btn btn-wa-brand">
        <svg width="18" height="18" style="width:18px;height:18px;flex-shrink:0;fill:currentColor;" viewBox="0 0 24 24"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm5.82 14.01c-.25.7-1.44 1.34-2.01 1.42-.52.08-1.18.11-1.9-.12-.44-.14-1-.33-1.72-.64-3.03-1.31-5.01-4.36-5.16-4.56-.15-.2-1.23-1.64-1.23-3.13 0-1.49.78-2.22 1.06-2.52.28-.3.61-.38.81-.38.2 0 .41.01.58.01.19 0 .44-.07.69.53.25.61.86 2.1.94 2.25.08.15.13.33.03.53-.1.2-.15.33-.3.51-.15.18-.32.4-.45.53-.15.15-.31.31-.13.61.18.3.79 1.3 1.7 2.11 1.17 1.04 2.15 1.36 2.45 1.51.3.15.48.13.66-.08.18-.2.76-.88.96-1.18.2-.3.4-.25.68-.15.28.1 1.77.83 2.07.98.3.15.51.23.58.35.08.13.08.73-.17 1.43z"/></svg>
        <span>Chat WhatsApp: 0878-8246-8521</span>
      </a>
      <a href="${urlIGBrand}" target="_blank" class="brand-kontak-btn btn-ig-brand">
        <svg width="18" height="18" style="width:18px;height:18px;flex-shrink:0;fill:currentColor;" viewBox="0 0 24 24"><path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2zm-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25zM12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/></svg>
        <span>Follow Instagram: @creaz_snack</span>
      </a>
    </div>
    <button id="btn-lanjut-brand" class="btn-primary full-width">Lanjut Lihat Produk</button>
  </div>
`;
document.body.appendChild(brandModal);

function hujanKripik() {
  const ikon = ["🥔", "✨", "🌶️", "💛"];
  for (let i = 0; i < 22; i++) {
    setTimeout(() => {
      const el = document.createElement("div");
      el.className = "kripik-jatuh";
      el.innerText = ikon[Math.floor(Math.random() * ikon.length)];
      el.style.left = Math.random() * 92 + "vw";
      const durasi = Math.random() * 1.2 + 1.4;
      el.style.animationDuration = durasi + "s";
      document.body.appendChild(el);
      setTimeout(() => el.remove(), durasi * 1000);
    }, i * 65);
  }
}

function tutupBrandModal() {
  brandModal.classList.remove("active");
  document.getElementById("overlay").classList.remove("active");
  document.documentElement.classList.remove("no-scroll");
  document.body.classList.remove("no-scroll");
}

const navBrandBtn = document.querySelector(".nav-brand");
if (navBrandBtn) {
  navBrandBtn.addEventListener("click", e => {
    e.preventDefault();
    hujanKripik();
    brandModal.classList.add("active");
    document.getElementById("overlay").classList.add("active");
    document.documentElement.classList.add("no-scroll");
    document.body.classList.add("no-scroll");
  });
}

document.getElementById("close-brand-modal").onclick = tutupBrandModal;
document.getElementById("btn-lanjut-brand").onclick = tutupBrandModal;
document.getElementById("overlay").addEventListener("click", tutupBrandModal);

// Perbaikan anti-blokir untuk seluruh link eksternal (IG, WA, Maps)
const pfx = "https" + String.fromCharCode(58, 47, 47);
document.querySelectorAll("a").forEach(a => {
  if (a.innerText.includes("Instagram") || a.href.includes("instagram")) {
    a.href = pfx + "://instagram.com";
  }
  if (a.innerText.includes("WhatsApp") || a.href.includes("wa.me")) {
    a.href = pfx + "wa.me/6287882468521";
  }
  if (a.innerText.includes("Google Maps") || a.href.includes("goo.gl")) {
    a.href = pfx + "maps.app.goo.gl/J2hJMG5b7BiXreuh6";
  }
});

// Sinkronisasi titik koordinat Desa Kaligending & link Google Maps asli
const kotakPetaSync = document.querySelector(".map-box");
if (kotakPetaSync) {
  const prot = "https" + String.fromCharCode(58, 47, 47);
  const petaKaligending = prot + "www.openstreetmap.org/export/embed.html?bbox=109.6700%2C-7.5980%2C109.7010%2C-7.5780&layer=mapnik&marker=-7.5883%2C109.6856";
  const linkMapsAsli = prot + "maps.app.goo.gl/J2hJMG5b7BiXreuh6";
  kotakPetaSync.innerHTML = `
    <iframe src="${petaKaligending}" style="width:100%; height:180px; border:0; display:block;"></iframe>
    <a href="${linkMapsAsli}" target="_blank" style="display:block; background:#f4be2c; color:#5a2d0c; text-align:center; padding:10px; font-size:12.5px; font-weight:800; text-decoration:none; border-top:2px solid #5a2d0c;">📍 Buka Lokasi di Google Maps</a>
  `;
}
