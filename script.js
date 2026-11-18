document.addEventListener("DOMContentLoaded", () => {
  const nomorWA = "628788268521";
  let keranjang = JSON.parse(localStorage.getItem("keranjangKripik")) || [];
  let produkAktif = null;

  const searchBar = document.getElementById("search-bar");
  const searchInput = document.getElementById("search-input");
  const cartDrawer = document.getElementById("cart-drawer");
  const detailModal = document.getElementById("detail-modal");
  const overlay = document.getElementById("overlay");

  document.getElementById("btn-search").onclick = () => {
    searchBar.classList.toggle("active");
    if (searchBar.classList.contains("active")) searchInput.focus();
  };

  document.getElementById("btn-cart").onclick = () => {
    cartDrawer.classList.add("active");
    overlay.classList.add("active");
  };

  function tutupSemua() {
    cartDrawer.classList.remove("active");
    detailModal.classList.remove("active");
    overlay.classList.remove("active");
  }

  document.getElementById("close-cart").onclick = tutupSemua;
  document.getElementById("close-modal").onclick = tutupSemua;
  overlay.onclick = tutupSemua;
  const katBtns = document.querySelectorAll(".kat-btn");
  const cards = document.querySelectorAll(".product-card");

  katBtns.forEach(btn => {
    btn.onclick = () => {
      katBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const kat = btn.dataset.kategori;
      cards.forEach(card => {
        card.style.display = (kat === "semua" || card.dataset.kategori === kat) ? "flex" : "none";
      });
    };
  });

  searchInput.oninput = () => {
    const kata = searchInput.value.toLowerCase();
    cards.forEach(card => {
      const nama = card.dataset.nama.toLowerCase();
      card.style.display = nama.includes(kata) ? "flex" : "none";
    });
  };

  cards.forEach(card => {
    const nama = card.dataset.nama;
    const harga = parseInt(card.dataset.harga);
    const desk = card.dataset.desk;

    card.querySelector(".btn-detail").onclick = () => {
      produkAktif = { nama, harga };
      document.getElementById("modal-title").innerText = nama;
      document.getElementById("modal-price").innerText = "Rp " + harga.toLocaleString("id-ID");
      document.getElementById("modal-desc").innerText = desk;
      detailModal.classList.add("active");
      overlay.classList.add("active");
    };

    card.querySelector(".btn-add").onclick = () => tambahItem(nama, harga);
  });

  document.getElementById("modal-add-btn").onclick = () => {
    if (produkAktif) {
      tambahItem(produkAktif.nama, produkAktif.harga);
      tutupSemua();
    }
  };

  function tambahItem(nama, harga) {
    const ada = keranjang.find(i => i.nama === nama);
    if (ada) ada.qty += 1;
    else keranjang.push({ nama, harga, qty: 1 });
    renderKeranjang();
  }

  window.ubahQty = (index, delta) => {
    keranjang[index].qty += delta;
    if (keranjang[index].qty <= 0) keranjang.splice(index, 1);
    renderKeranjang();
  };

  function renderKeranjang() {
    localStorage.setItem("keranjangKripik", JSON.stringify(keranjang));
    const wadah = document.getElementById("cart-items");
    const badge = document.getElementById("cart-badge");
    const totalEl = document.getElementById("cart-total");

    let totalItem = 0, totalHarga = 0;
    wadah.innerHTML = "";

    if (keranjang.length === 0) {
      wadah.innerHTML = '<p class="empty-msg">Keranjang masih kosong nih.</p>';
    } else {
      keranjang.forEach((item, i) => {
        totalItem += item.qty;
        totalHarga += item.harga * item.qty;
        wadah.innerHTML += `
          <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid #e7e5e4;">
            <div style="text-align:left;">
              <strong style="font-size:13px; display:block;">${item.nama}</strong>
              <small style="color:#ea580c; font-weight:700;">Rp ${(item.harga * item.qty).toLocaleString("id-ID")}</small>
            </div>
            <div style="display:flex; align-items:center; gap:8px;">
              <button onclick="ubahQty(${i}, -1)" style="width:26px; height:26px; border-radius:6px; border:1px solid #d6d3d1; background:white; font-weight:bold;">-</button>
              <span style="font-size:13px; font-weight:bold;">${item.qty}</span>
              <button onclick="ubahQty(${i}, 1)" style="width:26px; height:26px; border-radius:6px; border:none; background:#ea580c; color:white; font-weight:bold;">+</button>
            </div>
          </div>`;
      });
    }

    badge.innerText = totalItem;
    totalEl.innerText = "Rp " + totalHarga.toLocaleString("id-ID");
  }

  document.getElementById("checkout-wa").onclick = () => {
    if (keranjang.length === 0) return alert("Pilih kripik dulu ya sebelum pesan!");
    let teks = "Halo Kak, saya mau pesan kripik:\n\n";
    let total = 0;
    keranjang.forEach((item, idx) => {
      const sub = item.harga * item.qty;
      total += sub;
      teks += `${idx + 1}. *${item.nama}* (${item.qty}x) - Rp ${sub.toLocaleString("id-ID")}\n`;
    });
    teks += `\n*Total Belanja: Rp ${total.toLocaleString("id-ID")}*\nMohon info ongkirnya ya Kak!`;
    const url = ["https", "://wa.me/", nomorWA, "?text=", encodeURIComponent(teks)].join("");
    window.open(url, "_blank");
  };

  renderKeranjang();
});

// Kunci total scroll luar saat keranjang atau modal terbuka
const obsScroll = new MutationObserver(() => {
  const terbuka = document.getElementById("overlay").classList.contains("active");
  document.documentElement.classList.toggle("no-scroll", terbuka);
  document.body.classList.toggle("no-scroll", terbuka);
});
obsScroll.observe(document.getElementById("overlay"), { attributes: true, attributeFilter: ["class"] });

document.getElementById("overlay").addEventListener("touchmove", e => e.preventDefault(), { passive: false });
