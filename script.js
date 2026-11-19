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
      document.getElementById("katalog").scrollIntoView({ behavior: "smooth" });
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
        <a href="https://wa.me/6287882468521" target="_blank" class="brand-kontak-btn btn-wa-brand">💬 Chat WhatsApp: 0878-8246-8521</a>
        <a href="httpshttps://https://www.instagram.com/creaz_snack?evlk=MWltOGdiaXM1djBvag==" target="_blank" class="brand-kontak-btn btn-ig-brand">📸 Follow Instagram: @creaz_snack</a>
      </div>
      <button id="btn-lanjut-brand" class="btn-primary full-width">Lanjut Lihat Produk</button>
    </div>`;
  document.body.appendChild(brandModal);

  function bukaOverlay() { overlay.classList.add("active"); document.documentElement.classList.add("no-scroll"); document.body.classList.add("no-scroll"); }
  function tutupSemua() {
    cartDrawer.classList.remove("active"); detailModal.classList.remove("active"); brandModal.classList.remove("active");
    overlay.classList.remove("active"); document.documentElement.classList.remove("no-scroll"); document.body.classList.remove("no-scroll");
  }

  document.getElementById("btn-cart").onclick = () => { cartDrawer.classList.add("active"); bukaOverlay(); };
  document.getElementById("close-cart").onclick = tutupSemua;
  document.getElementById("close-modal").onclick = tutupSemua;
  document.getElementById("close-brand-modal").onclick = tutupSemua;
  document.getElementById("btn-lanjut-brand").onclick = tutupSemua;
  overlay.onclick = tutupSemua;
  overlay.addEventListener("touchmove", e => e.preventDefault(), { passive: false });

  document.querySelector(".nav-brand").onclick = e => {
    e.preventDefault();
    const ikon = ["🥔", "✨", "🌶️", "💛"];
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        const el = document.createElement("div");
        el.className = "kripik-jatuh"; el.innerText = ikon[Math.floor(Math.random() * ikon.length)];
        el.style.left = Math.random() * 92 + "vw"; el.style.animationDuration = "1.8s";
        document.body.appendChild(el); setTimeout(() => el.remove(), 1800);
      }, i * 60);
    }
    brandModal.classList.add("active"); bukaOverlay();
  };

  const katBtns = document.querySelectorAll(".kat-btn");
  const cards = document.querySelectorAll(".product-card");
  katBtns.forEach(btn => {
    btn.onclick = () => {
      katBtns.forEach(b => b.classList.remove("active")); btn.classList.add("active");
      const kat = btn.dataset.kategori;
      cards.forEach(card => card.style.display = (kat === "semua" || card.dataset.kategori === kat) ? "flex" : "none");
    };
  });

  const toastEl = document.createElement("div"); toastEl.className = "toast-notif"; document.body.appendChild(toastEl);
  let toastTimer = null;
  function munculToast(pesan) { toastEl.innerText = pesan; toastEl.classList.add("show"); clearTimeout(toastTimer); toastTimer = setTimeout(() => toastEl.classList.remove("show"), 1800); }

  cards.forEach(card => {
    const nama = card.dataset.nama, harga = parseInt(card.dataset.harga), desk = card.dataset.desk, img = card.dataset.img;
    card.querySelector(".btn-detail").onclick = () => {
      produkAktif = { nama, harga, img };
      document.getElementById("modal-img").src = img; document.getElementById("modal-title").innerText = nama;
      document.getElementById("modal-price").innerText = "Rp " + harga.toLocaleString("id-ID"); document.getElementById("modal-desc").innerText = desk;
      detailModal.classList.add("active"); bukaOverlay();
    };
    card.querySelector(".btn-add").onclick = () => { tambahItem(nama, harga, img); munculToast("✅ Masuk ke keranjang!"); };
  });

  document.getElementById("modal-add-btn").onclick = () => { if (produkAktif) { tambahItem(produkAktif.nama, produkAktif.harga, produkAktif.img); munculToast("✅ Masuk ke keranjang!"); tutupSemua(); } };

  function tambahItem(nama, harga, img) {
    const ada = keranjang.find(i => i.nama === nama);
    if (ada) { ada.qty += 1; ada.img = img; } else keranjang.push({ nama, harga, img: img || "produk1.png", qty: 1 });
    renderKeranjang();
  }
  window.ubahQty = (index, delta) => { keranjang[index].qty += delta; if (keranjang[index].qty <= 0) keranjang.splice(index, 1); renderKeranjang(); };

  function renderKeranjang() {
    localStorage.setItem("keranjangCreaz", JSON.stringify(keranjang));
    const wadah = document.getElementById("cart-items");
    let totalItem = 0, totalHarga = 0; wadah.innerHTML = "";
    if (keranjang.length === 0) { wadah.innerHTML = '<p class="empty-msg">Keranjang masih kosong nih.</p>'; }
    else {
      keranjang.forEach((item, i) => {
        totalItem += item.qty; totalHarga += item.harga * item.qty;
        wadah.innerHTML += `<div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid #e6dec8;">
          <img src="${item.img || 'produk1.png'}" style="width:48px;height:48px;object-fit:contain;background:#fff;border:1.5px solid #e6dec8;border-radius:10px;">
          <div style="flex:1;text-align:left;"><strong style="font-size:12.5px;display:block;">${item.nama}</strong>
          <small style="color:#78716c;display:block;font-size:11px;">Rp ${item.harga.toLocaleString("id-ID")} x ${item.qty}</small>
          <small style="color:#8c5228;font-weight:800;">Subtotal: Rp ${(item.harga * item.qty).toLocaleString("id-ID")}</small></div>
          <div style="display:flex;align-items:center;gap:6px;">
            <button onclick="ubahQty(${i},-1)" style="width:24px;height:24px;border-radius:6px;border:1.5px solid #5a2d0c;background:white;font-weight:bold;">-</button>
            <span style="font-size:13px;font-weight:bold;">${item.qty}</span>
            <button onclick="ubahQty(${i},1)" style="width:24px;height:24px;border-radius:6px;border:1.5px solid #5a2d0c;background:#f4be2c;font-weight:bold;">+</button>
          </div></div>`;
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
    let teks = `Halo Kak, saya mau pesan *Keripik Crea'z*:\n\n`, total = 0;
    keranjang.forEach((item, idx) => { const sub = item.harga * item.qty; total += sub; teks += `${idx + 1}. *${item.nama}* (${item.qty}x @ Rp ${item.harga.toLocaleString("id-ID")}) = Rp ${sub.toLocaleString("id-ID")}\n`; });
    teks += `\n*Total Belanja: Rp ${total.toLocaleString("id-ID")}*\n\n*Data Penerima:*\nNama: ${namaPembeli}\nAlamat: ${alamatPembeli}`;
    window.open(`https://wa.me/6287882468521{nomorWA}?text=${encodeURIComponent(teks)}`, "_blank");
  };

  renderKeranjang();
});
