// 4. Logika Tambah, Kurang, Hapus & Simpan Keranjang
function tambahKeKeranjang(nama, harga) {
  const ada = keranjang.find(item => item.nama === nama);
  if (ada) {
    ada.qty += 1;
  } else {
    keranjang.push({ nama, harga, qty: 1 });
  }
  simpanDanTampilkan();
}

function ubahQty(index, perubahan) {
  keranjang[index].qty += perubahan;
  if (keranjang[index].qty <= 0) keranjang.splice(index, 1);
  simpanDanTampilkan();
}

function simpanDanTampilkan() {
  localStorage.setItem("keranjangKripik", JSON.stringify(keranjang));
  const wadah = document.getElementById("cart-items");
  const badge = document.getElementById("cart-badge");
  const totalEl = document.getElementById("cart-total");

  let totalItem = 0;
  let totalHarga = 0;
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

// 5. Checkout Otomatis ke WhatsApp
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
  window.open(`https://wa.me{nomorWA}?text=${encodeURIComponent(teks)}`, "_blank");
};

simpanDanTampilkan();
