window.CREAZ_STATS = (function () {
  const FB_URL = "https://firebasedatabase.app";

  const BASE_SOLD = {
    "Keripik Talas Crea'z — Rasa Jagung Manis": 5,
    "Keripik Singkong Crea'z — Singkong Pedas Manis": 7,
    "Keripik Talas Crea'z — Rasa Balado": 3
  };

  function safeKey(nama) {
    return btoa(unescape(encodeURIComponent(String(nama || "").trim()))).replace(/[=+/]/g, "_");
  }

  async function bacaServer(path) {
    try {
      const res = await fetch(`${FB_URL}/${path}.json?nocache=${Date.now()}`, { cache: "no-store" });
      if (!res.ok) return { ok: false, data: null };
      const data = await res.json();
      return { ok: true, data };
    } catch (e) {
      return { ok: false, data: null };
    }
  }

  async function tulisServer(path, payload) {
    try {
      const res = await fetch(`${FB_URL}/${path}.json`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      return res.ok;
    } catch (e) {
      return false;
    }
  }

  // 1. Jumlah Lihat Kartu Profil (100% berjalan di Firebase REST API)
  async function catatDanAmbilProfil() {
    const hasil = await bacaServer("public_stats/profile");
    if (!hasil.ok) return 1;
    const lama = Number(hasil.data && hasil.data.views) || 0;
    const baru = lama + 1;
    await tulisServer("public_stats/profile", { views: baru });
    return baru;
  }

  // 2. Ambil Statistik Produk (Dilihat + Terjual + Data Penjualan Awal)
  async function ambilStatProduk(nama) {
    const k = safeKey(nama);
    const hasil = await bacaServer(`public_stats/products/${k}`);
    const base = BASE_SOLD[nama] || 0;
    if (!hasil.ok) return { views: 0, sold: base };
    const views = Number(hasil.data && hasil.data.views) || 0;
    const soldExtra = Number(hasil.data && hasil.data.sold_extra) || 0;
    return { views, sold: base + soldExtra };
  }

  // 3. Tambah +1 Lihat Detail Produk
  async function catatLihatDetailProduk(nama) {
    const k = safeKey(nama);
    const hasil = await bacaServer(`public_stats/products/${k}`);
    const base = BASE_SOLD[nama] || 0;
    if (!hasil.ok) return { views: 1, sold: base };
    const viewsLama = Number(hasil.data && hasil.data.views) || 0;
    const soldExtra = Number(hasil.data && hasil.data.sold_extra) || 0;
    const viewsBaru = viewsLama + 1;
    await tulisServer(`public_stats/products/${k}`, {
      nama,
      views: viewsBaru,
      sold_extra: soldExtra
    });
    return { views: viewsBaru, sold: base + soldExtra };
  }

  // 4. Tambah +qty Terjual Produk saat Checkout WA
  async function catatTerjualProduk(nama, qty) {
    const k = safeKey(nama);
    const tambah = Math.max(1, Number(qty) || 1);
    const hasil = await bacaServer(`public_stats/products/${k}`);
    const base = BASE_SOLD[nama] || 0;
    if (!hasil.ok) return { views: 0, sold: base + tambah };
    const viewsLama = Number(hasil.data && hasil.data.views) || 0;
    const soldExtraLama = Number(hasil.data && hasil.data.sold_extra) || 0;
    const soldExtraBaru = soldExtraLama + tambah;
    await tulisServer(`public_stats/products/${k}`, {
      nama,
      views: viewsLama,
      sold_extra: soldExtraBaru
    });
    return { views: viewsLama, sold: base + soldExtraBaru };
  }

  return {
    catatDanAmbilProfil,
    ambilStatProduk,
    catatLihatDetailProduk,
    catatTerjualProduk
  };
})();
