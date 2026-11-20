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
    keranjang = JSON.parse(localStorage.getItem("keranjangCreaz")) || [];
    cartItemsContainer.innerHTML = "";
    let totalHarga = 0, totalQty = 0;

    if (keranjang.length === 0) {
      cartItemsContainer.innerHTML = `<p style="text-align:center;color:#8c5228;padding:30px 10px;font-weight:700;">Keranjang masih kosong nih.<br>Yuk pilih keripik favoritmu!</p>`;
    } else {
      cartItemsContainer.innerHTML = `<div style="text-align:right;margin-bottom:6px;"><button type="button" id="btn-kosong-cart" style="background:#fee2e2;color:#b91c1c;border:1px solid #fca5a5;border-radius:6px;padding:3px 8px;font-size:11px;font-weight:800;cursor:pointer;">🗑️ Kosongkan Keranjang</button></div>`;
      keranjang.forEach((item, index) => {
        const sub = item.harga * item.qty;
        totalHarga += sub; totalQty += item.qty;
        cartItemsContainer.innerHTML += `
          <div class="cart-item">
            <img src="${item.img || "produk1.png"}" alt="${item.nama}" class="cart-item-img">
            <div class="cart-item-info">
              <h4>${item.nama}</h4>
              <div class="cart-item-meta">${item.qty}x @ Rp ${item.harga.toLocaleString("id-ID")}</div>
              <div class="cart-item-sub">Subtotal: Rp ${sub.toLocaleString("id-ID")}</div>
            </div>
            <div class="qty-control">
              <button class="qty-btn minus" data-index="${index}">-</button>
              <span style="font-weight:800;font-size:13px;min-width:16px;text-align:center;">${item.qty}</span>
              <button class="qty-btn plus" data-index="${index}">+</button>
            </div>
          </div>`;
      });
    }

    const diskon = totalQty >= 10 ? Math.round(totalHarga * 0.2) : 0;
    const totalAkhir = totalHarga - diskon;
    const info = totalQty > 0 && totalQty < 10
      ? `<div style="font-size:11.5px;color:#8c5228;background:#fef7dc;border:1px dashed #5a2d0c;border-radius:8px;padding:6px 8px;margin-bottom:8px;text-align:center;font-weight:700;">💡 Tambah <b>${10 - totalQty} pcs lagi</b> untuk otomatis dapat <b>Diskon 20%</b>!</div>`
      : (totalQty >= 10 ? `<div style="font-size:11.5px;color:#15803d;background:#dcfce7;border:1px solid #86efac;border-radius:8px;padding:6px 8px;margin-bottom:8px;text-align:center;font-weight:800;">🎉 Diskon Grosir 20% (-Rp ${diskon.toLocaleString("id-ID")}) aktif!</div>` : "");

    const totalEl = document.getElementById("cart-total");
    if (totalEl) {
      totalEl.parentElement.innerHTML = info + (diskon > 0
        ? `<div style="display:flex;justify-content:space-between;font-size:12px;color:#8c5228;"><span>Subtotal (${totalQty} pcs):</span><span style="text-decoration:line-through;">Rp ${totalHarga.toLocaleString("id-ID")}</span></div>
           <div style="display:flex;justify-content:space-between;font-weight:900;font-size:15px;color:#5a2d0c;"><span>Total Akhir (-20%):</span><span id="cart-total">Rp ${totalAkhir.toLocaleString("id-ID")}</span></div>`
        : `<div style="display:flex;justify-content:space-between;font-weight:900;font-size:15px;color:#5a2d0c;"><span>Total Belanja:</span><span id="cart-total">Rp ${totalHarga.toLocaleString("id-ID")}</span></div>`);
    }

    if (cartBadge) cartBadge.innerText = totalQty;
    localStorage.setItem("keranjangCreaz", JSON.stringify(keranjang));

    document.querySelectorAll(".qty-btn.minus").forEach(b => b.onclick = () => {
      const i = b.dataset.index;
      if (keranjang[i].qty > 1) keranjang[i].qty -= 1; else keranjang.splice(i, 1);
      renderKeranjang();
    });
    const btnKosong = document.getElementById("btn-kosong-cart"); if (btnKosong) btnKosong.onclick = () => { keranjang = []; localStorage.setItem("keranjangCreaz", "[]"); renderKeranjang(); };
    document.querySelectorAll(".qty-btn.plus").forEach(b => b.onclick = () => {
      keranjang[b.dataset.index].qty += 1; renderKeranjang();
    });
  }

  document.getElementById("checkout-wa").onclick = () => {
    keranjang = JSON.parse(localStorage.getItem("keranjangCreaz")) || [];
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

    const pot = qtyAll >= 10 ? Math.round(subAll * 0.2) : 0;
    const totalAkhir = subAll - pot;

    let ringkasanHargaHTML = `<div style="display:flex;justify-content:space-between;font-size:12.5px;margin-top:8px;"><span>Total Barang (${qtyAll} pcs):</span><span>Rp ${subAll.toLocaleString("id-ID")}</span></div>`;
    if (pot > 0) {
      ringkasanHargaHTML += `<div style="display:flex;justify-content:space-between;font-size:12.5px;color:#15803d;font-weight:800;"><span>🎉 Diskon Grosir 20%:</span><span>-Rp ${pot.toLocaleString("id-ID")}</span></div>`;
      teksWA += `\nSubtotal (${qtyAll} pcs): Rp ${subAll.toLocaleString("id-ID")}`;
      teksWA += `\n🎉 *Diskon Grosir 20% (≥10 pcs): -Rp ${pot.toLocaleString("id-ID")}*`;
      teksWA += `\n*Total Bayar: Rp ${totalAkhir.toLocaleString("id-ID")}*\n\n`;
    } else {
      teksWA += `\n*Total Belanja (${qtyAll} pcs): Rp ${subAll.toLocaleString("id-ID")}*\n\n`;
    }
    ringkasanHargaHTML += `<div style="display:flex;justify-content:space-between;font-size:15px;font-weight:900;color:#5a2d0c;margin-top:6px;padding-top:6px;border-top:2px solid #5a2d0c;"><span>Total Bayar:</span><span>Rp ${totalAkhir.toLocaleString("id-ID")}</span></div>`;

    teksWA += `*Data Penerima:*\nNama: ${nama}\nAlamat: ${alamat}`;

    let modalVerif = document.getElementById("modal-verif-wa");
    if (!modalVerif) {
      modalVerif = document.createElement("div");
      modalVerif.id = "modal-verif-wa";
      modalVerif.className = "modal";
      modalVerif.style.zIndex = "3500";
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
        ${ringkasanHargaHTML}
        <div style="background:#fff;border:1px solid #e6dec8;border-radius:8px;padding:8px;margin:10px 0 14px;font-size:12px;color:#5a2d0c;">
          <div><b>Penerima:</b> ${nama}</div>
          <div><b>Alamat:</b> ${alamat}</div>
        </div>
        <button id="btn-lanjut-wa" class="btn-primary full-width" style="background:#16a34a;color:#fff;border-color:#5a2d0c;font-size:14px;">✅ Lanjutkan ke WhatsApp</button>
      </div>`;

    modalVerif.classList.add("active");
    document.getElementById("tutup-verif-wa").onclick = () => modalVerif.classList.remove("active");

    document.getElementById("btn-lanjut-wa").onclick = function() {
      this.disabled = true;
      this.innerHTML = "⏳ Pembelian sedang diproses...";
      setTimeout(() => {
        window.open(`https://wa.me/6287882468521?text=${encodeURIComponent(teksWA)}`, "_blank");
        modalVerif.classList.remove("active");
        this.disabled = false;
        this.innerHTML = "✅ Lanjutkan ke WhatsApp";
      }, 900);
    };
  };

  window.sinkronKeranjangUI = () => { keranjang = JSON.parse(localStorage.getItem("keranjangCreaz")) || []; renderKeranjang(); };
  renderKeranjang();
});
window.addEventListener("load", () => { window.scrollTo(0, 0); setTimeout(() => window.scrollTo(0, 0), 1600); });

window.scrollTo(0, 0);
