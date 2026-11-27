window.CREAZ_STATS = (function () {
  const FB_URL = "https://firebasedatabase.app";

  // Data dasar penjualan riil sebelumnya (tidak akan ter-reset)
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
      const res = await fetch(`${FB_URL}/${path}.json`);
      return await res.json();
    } catch (e) {
      return null;
    }
  }

  async function patchJSON(path, data) {
    try {
      await fetch(`${FB_URL}/${path}.json`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
    } catch (e) {}
  }

  async function catatDanAmbilProfil() {
    const cur = await getJSON("public_stats/profile");
    const views = (Number(cur && cur.views) || 0) + 1;
    await patchJSON("public_stats/profile", { views });
    return views;
  }

  async function ambilStatProduk(nama) {
    const k = safeKey(nama);
    const cur = await getJSON(`public_stats/products/${k}`);
    const base = BASE_SOLD[nama] || 0;
    const views = Number(cur && cur.views) || 0;
    const sold = Math.max(base, Number(cur && cur.sold) || base);
    if (!cur || Number(cur.sold) < base) {
      await patchJSON(`public_stats/products/${k}`, { nama, views, sold });
    }
    return { views, sold };
  }

  async function catatLihatDetailProduk(nama) {
    const st = await ambilStatProduk(nama);
    const viewsBaru = st.views + 1;
    await patchJSON(`public_stats/products/${safeKey(nama)}`, { nama, views: viewsBaru, sold: st.sold });
    return { views: viewsBaru, sold: st.sold };
  }

  async function catatTerjualProduk(nama, qty) {
    const st = await ambilStatProduk(nama);
    const soldBaru = st.sold + (Number(qty) || 0);
    await patchJSON(`public_stats/products/${safeKey(nama)}`, { nama, views: st.views, sold: soldBaru });
    return { views: st.views, sold: soldBaru };
  }

  return {
    catatDanAmbilProfil,
    ambilStatProduk,
    catatLihatDetailProduk,
    catatTerjualProduk
  };
})();
