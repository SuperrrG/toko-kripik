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
