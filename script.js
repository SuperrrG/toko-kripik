document.addEventListener("DOMContentLoaded", () => {
  const splash = document.getElementById("loader") || document.getElementById("splash-screen");
  if (splash) setTimeout(() => { splash.classList.add("hidden"); splash.style.opacity = "0"; setTimeout(() => splash.remove(), 450); }, 900);

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
    const verif = document.getElementById("modal-verif-wa"); if (verif) verif.classList.remove("active");
    document.body.classList.remove("no-scroll");
  }

  if (overlay) overlay.onclick = tutupSemua;
  const closeCart = document.getElementById("close-cart"); if (closeCart) closeCart.onclick = tutupSemua;
  const closeModal = document.getElementById("close-modal"); if (closeModal) closeModal.onclick = tutupSemua;

  const btnSearch = document.getElementById("btn-search");
  if (btnSearch && searchBar) {
    btnSearch.onclick = () => { searchBar.classList.toggle("active"); if (searchBar.classList.contains("active") && searchInput) searchInput.focus(); };
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
      window._toastTimer = setTimeout(() => { toast.style.opacity = "0"; setTimeout(() => toast.style.display = "none", 200); }, 1800);
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
          ${ringkasanHTML}
          <div style="background:#fff;border:1px solid #e6dec8;border-radius:8px;padding:8px;margin:10px 0 14px;font-size:12px;color:#5a2d0c;">
            <div><b>Penerima:</b> ${nama}</div>
            <div><b>Alamat:</b> ${alamat}</div>
          </div>
          <button id="btn-lanjut-wa" class="btn-primary full-width" style="background:#16a34a;color:#fff;border-color:#5a2d0c;font-size:14px;">✅ Lanjutkan ke WhatsApp</button>
        </div>`;

      modalVerif.classList.add("active");
      document.getElementById("tutup-verif-wa").onclick = () => modalVerif.classList.remove("active");

      const waLink = "https" + String.fromCharCode(58,47,47) + "wa." + "me/6287882468521";
      document.getElementById("btn-lanjut-wa").onclick = function() {
        this.disabled = true;
        this.innerHTML = "⏳ Pembelian sedang diproses...";
        setTimeout(() => {
          window.open(`${waLink}?text=${encodeURIComponent(teksWA)}`, "_blank");
          modalVerif.classList.remove("active");
          this.disabled = false;
          this.innerHTML = "✅ Lanjutkan ke WhatsApp";
        }, 900);
      };
    };
  }
});
window.scrollTo(0, 0);
