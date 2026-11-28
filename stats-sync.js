window.CREAZ_STATS = (function () {
  const FB_URL = "https://firebasedatabase.app";

  // Data dasar penjualan riil sebelumnya (tidak akan pernah ter-reset)
  const BASE_SOLD = {
    "Keripik Talas Crea'z — Rasa Jagung Manis": 5,
    "Keripik Singkong Crea'z — Singkong Pedas Manis": 7,
    "Keripik Talas Crea'z — Rasa Balado": 3
  };

  function safeKey(nama) {
    return btoa(unescape(encodeURIComponent(String(nama || "").trim()))).replace(/[=+/]/g, "_");
  }

  async function getJSON(path) {
    try {
      const res = await fetch(`${FB_URL}/${path}.json?t=${Date.now()}`, { cache: "no-store" });
      if (!res.ok) return undefined;
      return await res.json();
    } catch (e) {
      return undefined;
    }
  }

  async function patchJSON(path, data) {
    try {
      const res = await fetch(`${FB_URL}/${path}.json`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  }

  // 1. Jumlah Lihat Kartu Profil (Atomic Increment langsung di server Firebase)
  async function catatDanAmbilProfil() {
    const res = await patchJSON("public_stats/profile", {
      views: { ".sv": { "increment": 1 } }
    });
    if (res && typeof res.views === "number") return res.views;
    const cur = await getJSON("public_stats/profile");
    return Number(cur && cur.views) || 1;
  }

  // 2. Ambil Statistik Produk (Dilihat + Terjual + Data Penjualan Awal)
  async function ambilStatProduk(nama) {
    const k = safeKey(nama);
    const cur = await getJSON(`public_stats/products/${k}`);
    const base = BASE_SOLD[nama] || 0;
    const views = Number(cur && cur.views) || 0;
    const soldExtra = Number(cur && cur.sold_extra) || 0;
    return { views, sold: base + soldExtra };
  }

  // 3. Tambah +1 Lihat Detail Produk (Atomic Increment - mustahil ter-reset)
  async function catatLihatDetailProduk(nama) {
    const k = safeKey(nama);
    const res = await patchJSON(`public_stats/products/${k}`, {
      nama,
      views: { ".sv": { "increment": 1 } }
    });
    const base = BASE_SOLD[nama] || 0;
    if (res && typeof res.views === "number") {
      return { views: res.views, sold: base + (Number(res.sold_extra) || 0) };
    }
    return await ambilStatProduk(nama);
  }

  // 4. Tambah +qty Terjual Produk saat Checkout WA (Atomic Increment - mustahil ter-reset)
  async function catatTerjualProduk(nama, qty) {
    const k = safeKey(nama);
    const tambah = Math.max(1, Number(qty) || 1);
    const res = await patchJSON(`public_stats/products/${k}`, {
      nama,
      sold_extra: { ".sv": { "increment": tambah } }
    });
    const base = BASE_SOLD[nama] || 0;
    if (res && typeof res.sold_extra === "number") {
      return { views: Number(res.views) || 0, sold: base + res.sold_extra };
    }
    return await ambilStatProduk(nama);
  }

  return {
    catatDanAmbilProfil,
    ambilStatProduk,
    catatLihatDetailProduk,
    catatTerjualProduk
  };
})();
