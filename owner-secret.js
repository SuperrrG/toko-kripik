(function () {
  const OWNER_KEY = "creazowner";
  const OWNER_PIN = "998877";
  const LS_LOG_KEY = "creaz_owner_visitors_v1";
  const LS_FB_KEY = "creaz_owner_firebase_url";
  const DEFAULT_FB_URL = "";

  function getFirebaseUrl() {
    const saved = (localStorage.getItem(LS_FB_KEY) || DEFAULT_FB_URL).trim();
    return saved.replace(/\/+$/, "");
  }

  function formatWaktuID(dateObj) {
    const hari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const bulan = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    const h = hari[dateObj.getDay()];
    const tgl = dateObj.getDate();
    const bln = bulan[dateObj.getMonth()];
    const thn = dateObj.getFullYear();
    const jam = String(dateObj.getHours()).padStart(2, "0");
    const mnt = String(dateObj.getMinutes()).padStart(2, "0");
    return `${h}, ${tgl} ${bln} ${thn} • ${jam}:${mnt} WIB`;
  }

  function deteksiPerangkat() {
    const ua = navigator.userAgent || "";
    let os = "Perangkat Lain";
    const mAnd = ua.match(/Android\s([0-9.]+)/i);
    if (mAnd) os = `Android ${mAnd[1]}`;
    else if (/iPhone|iPad|iPod/i.test(ua)) os = "iPhone / iOS";
    else if (/Windows/i.test(ua)) os = "Windows PC";
    else if (/Mac/i.test(ua)) os = "MacBook / macOS";

    let browser = "Browser Web";
    if (/Instagram/i.test(ua)) browser = "Instagram App";
    else if (/musical_ly|TikTok|Bytedance/i.test(ua)) browser = "TikTok App";
    else if (/FBAN|FBAV/i.test(ua)) browser = "Facebook App";
    else if (/Edg/i.test(ua)) browser = "Edge";
    else if (/Chrome/i.test(ua)) browser = "Chrome";
    else if (/Safari/i.test(ua)) browser = "Safari";

    const layar = `${window.screen.width}x${window.screen.height}`;
    return `${os} • ${browser} (${layar})`;
  }

  function deteksiSumber() {
    const ref = (document.referrer || "").toLowerCase();
    if (!ref) return "Buka Link Langsung / WA";
    if (ref.includes("wa.me") || ref.includes("whatsapp")) return "WhatsApp";
    if (ref.includes("instagram")) return "Instagram";
    if (ref.includes("tiktok")) return "TikTok";
    if (ref.includes("facebook") || ref.includes("fb.")) return "Facebook";
    if (ref.includes("google")) return "Pencarian Google";
    return ref.replace(/^https?:\/\//, "").split("/")[0];
  }

  async function rekamKunjungan() {
    const params = new URLSearchParams(window.location.search);
    if (params.get("owner") === OWNER_KEY) return;
    if (sessionStorage.getItem("creaz_visit_recorded")) return;
    sessionStorage.setItem("creaz_visit_recorded", "1");

    const now = new Date();
    const tanggalKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

    let baterai = "-";
    try {
      if (navigator.getBattery) {
        const bat = await navigator.getBattery();
        baterai = `${Math.round(bat.level * 100)}%${bat.charging ? " ⚡" : ""}`;
      }
    } catch (e) {}

    let jaringan = "-";
    try {
      const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      if (conn && conn.effectiveType) jaringan = conn.effectiveType.toUpperCase();
    } catch (e) {}

    let lokasi = "Indonesia";
    let provider = "-";
    try {
      const res = await fetch("https://ipwho.is");
      const geo = await res.json();
      if (geo && geo.success) {
        lokasi = [geo.city, geo.region].filter(Boolean).join(", ") || geo.country || "Indonesia";
        provider = (geo.connection && geo.connection.isp) ? geo.connection.isp : "-";
      }
    } catch (e) {}

    const record = {
      id: Date.now(), tanggalKey, waktu: formatWaktuID(now),
      perangkat: deteksiPerangkat(), sumber: deteksiSumber(),
      lokasi, provider, baterai, jaringan
    };

    try {
      const list = JSON.parse(localStorage.getItem(LS_LOG_KEY) || "[]");
      list.unshift(record);
      localStorage.setItem(LS_LOG_KEY, JSON.stringify(list.slice(0, 100)));
    } catch (e) {}

    const fbUrl = getFirebaseUrl();
    if (fbUrl) {
      try {
        await fetch(`${fbUrl}/visitors.json`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify(record)
        });
      } catch (e) {}
    }
  }
  function jalankanDenganLoading(pesan, durasi, cb) {
    if (typeof window.tampilLoadingAksi === "function") window.tampilLoadingAksi(pesan, durasi, cb);
    else setTimeout(cb, 300);
  }

  function pesanAlert(teks, judul, ikon) {
    if (typeof window.creazAlert === "function") window.creazAlert(teks, judul, ikon);
    else alert(`${judul}\n${teks}`);
  }

  async function ambilSemuaDataKunjungan() {
    const lokal = JSON.parse(localStorage.getItem(LS_LOG_KEY) || "[]");
    const fbUrl = getFirebaseUrl();
    if (!fbUrl) return lokal;
    try {
      const res = await fetch(`${fbUrl}/visitors.json`);
      const obj = await res.json();
      if (!obj || typeof obj !== "object") return lokal;
      return Object.values(obj).sort((a, b) => (b.id || 0) - (a.id || 0));
    } catch (e) { return lokal; }
  }

  function buatStyleOwner() {
    if (document.getElementById("owner-secret-style")) return;
    const st = document.createElement("style");
    st.id = "owner-secret-style";
    st.textContent = `
      .owner-overlay { position: fixed; inset: 0; background: rgba(45, 22, 6, 0.72); backdrop-filter: blur(4px); z-index: 99998; display: flex; align-items: center; justify-content: center; padding: 16px; }
      .owner-box { width: 100%; max-width: 430px; max-height: 88vh; overflow-y: auto; background: #fef7dc; border: 3px solid #5a2d0c; border-radius: 22px; box-shadow: 0 10px 0 #5a2d0c; padding: 20px; color: #5a2d0c; font-family: inherit; box-sizing: border-box; }
      .owner-header { display: flex; align-items: center; justify-content: space-between; border-bottom: 2px dashed #5a2d0c; padding-bottom: 12px; margin-bottom: 14px; }
      .owner-close { background: #fee2e2; color: #b91c1c; border: 2px solid #5a2d0c; border-radius: 50%; width: 34px; height: 34px; font-weight: 900; cursor: pointer; }
      .owner-stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 14px; }
      .owner-stat-card { background: #fff; border: 2px solid #5a2d0c; border-radius: 14px; padding: 12px; text-align: center; box-shadow: 0 3px 0 #5a2d0c; }
      .owner-stat-card b { display: block; font-size: 22px; color: #b45309; margin-top: 2px; }
      .owner-visitor-card { background: #fff; border: 1.5px solid #5a2d0c; border-radius: 12px; padding: 10px 12px; margin-bottom: 9px; font-size: 12px; line-height: 1.45; }
      .owner-btn { background: #f4be2c; color: #5a2d0c; border: 2px solid #5a2d0c; border-radius: 12px; padding: 9px 12px; font-weight: 900; font-size: 12.5px; box-shadow: 0 3px 0 #5a2d0c; cursor: pointer; }
      .owner-btn.danger { background: #fee2e2; color: #b91c1c; }
    `;
    document.head.appendChild(st);
  }

  async function bukaDashboardOwner() {
    buatStyleOwner();
    const lama = document.getElementById("owner-secret-modal");
    if (lama) lama.remove();

    const wrap = document.createElement("div");
    wrap.id = "owner-secret-modal";
    wrap.className = "owner-overlay";
    wrap.innerHTML = `
      <div class="owner-box">
        <div class="owner-header">
          <div>
            <span style="background:#f4be2c;border:1.5px solid #5a2d0c;border-radius:99px;padding:2px 9px;font-size:10.5px;font-weight:900;">👑 RUANG KHUSUS OWNER</span>
            <h3 style="margin:6px 0 0;font-size:17px;">Statistik Pengunjung Crea'z</h3>
          </div>
          <button id="owner-close-dash" class="owner-close">✕</button>
        </div>
        <div id="owner-dash-body" style="text-align:center;padding:20px 0;font-weight:800;">⏳ Memuat data pengunjung...</div>
      </div>
    `;
    document.body.appendChild(wrap);
    document.getElementById("owner-close-dash").onclick = () => {
      jalankanDenganLoading("👋 Menutup Ruang Khusus Owner...", 1000, () => {
        wrap.remove();
        window.history.replaceState({}, "", window.location.pathname);
      });
    };

    const data = await ambilSemuaDataKunjungan();
    const now = new Date();
    const hariIniKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const jmlHariIni = data.filter(d => d.tanggalKey === hariIniKey).length;
    const fbAktif = Boolean(getFirebaseUrl());

    const daftarHTML = data.length === 0
      ? `<div style="background:#fff;border:1.5px dashed #5a2d0c;border-radius:12px;padding:16px;text-align:center;font-size:12.5px;">Belum ada riwayat pengunjung tercatat.</div>`
      : data.slice(0, 40).map((v, i) => `
        <div class="owner-visitor-card">
          <div style="display:flex;justify-content:space-between;font-weight:900;color:#5a2d0c;margin-bottom:3px;">
            <span>#${data.length - i} • ${v.lokasi || "Indonesia"}</span>
            <span style="font-size:11px;color:#8c5228;">${v.waktu || "-"}</span>
          </div>
          <div>📱 <b>HP:</b> ${v.perangkat || "-"}</div>
          <div>🔗 <b>Sumber:</b> ${v.sumber || "-"} • 📡 ${v.provider || "-"}</div>
          <div>🔋 <b>Baterai:</b> ${v.baterai || "-"} • 📶 <b>Sinyal:</b> ${v.jaringan || "-"}</div>
        </div>
      `).join("");

    document.getElementById("owner-dash-body").innerHTML = `
      <div class="owner-stat-grid">
        <div class="owner-stat-card"><span style="font-size:11.5px;font-weight:800;">👁️ Total Pengunjung</span><b>${data.length}</b></div>
        <div class="owner-stat-card"><span style="font-size:11.5px;font-weight:800;">📅 Hari Ini</span><b>${jmlHariIni}</b></div>
      </div>
      <div style="background:#fff;border:1.5px solid #5a2d0c;border-radius:12px;padding:10px;margin-bottom:12px;text-align:left;font-size:11.5px;">
        <div style="font-weight:900;margin-bottom:4px;">☁️ Sinkronisasi Semua HP: ${fbAktif ? '<span style="color:#15803d;">Aktif (Firebase)</span>' : '<span style="color:#b45309;">Lokal HP Ini</span>'}</div>
        <div style="display:flex;gap:6px;">
          <input type="text" id="owner-fb-input" value="${getFirebaseUrl()}" placeholder="Tempel URL Firebase (opsional)" style="flex:1;padding:6px 8px;border:1.5px solid #5a2d0c;border-radius:8px;font-size:11.5px;">
          <button id="owner-save-fb" class="owner-btn" style="padding:6px 10px;">Simpan</button>
        </div>
      </div>
      <div style="display:flex;gap:8px;margin-bottom:12px;">
        <button id="owner-refresh-btn" class="owner-btn" style="flex:1;">🔄 Segarkan Data</button>
        <button id="owner-clear-btn" class="owner-btn danger">🗑️ Reset Lokal</button>
      </div>
      <div style="text-align:left;font-weight:900;font-size:13px;margin-bottom:8px;">📋 Riwayat Pengunjung Terbaru:</div>
      <div style="text-align:left;">${daftarHTML}</div>
    `;
    document.getElementById("owner-save-fb").onclick = () => {
      localStorage.setItem(LS_FB_KEY, document.getElementById("owner-fb-input").value.trim());
      pesanAlert("Pengaturan sinkronisasi database berhasil disimpan!", "Berhasil Disimpan", "✅");
      bukaDashboardOwner();
    };
    document.getElementById("owner-refresh-btn").onclick = () => jalankanDenganLoading("🔄 Memuat ulang statistik...", 900, bukaDashboardOwner);
    document.getElementById("owner-clear-btn").onclick = () => {
      if (confirm("Hapus riwayat pengunjung lokal di perangkat ini?")) {
        localStorage.removeItem(LS_LOG_KEY);
        pesanAlert("Riwayat kunjungan lokal berhasil dibersihkan.", "Riwayat Dibersihkan", "🗑️");
        bukaDashboardOwner();
      }
    };
  }

  function tampilkanGerbangPinOwner() {
    buatStyleOwner();
    const wrap = document.createElement("div");
    wrap.id = "owner-pin-modal";
    wrap.className = "owner-overlay";
    wrap.innerHTML = `
      <div class="owner-box" style="max-width:340px;text-align:center;">
        <div style="font-size:38px;margin-bottom:6px;">🔐</div>
        <h3 style="margin:0 0 6px;font-size:18px;">Gerbang Khusus Owner</h3>
        <p style="font-size:12.5px;color:#8c5228;margin:0 0 14px;">Masukkan PIN Rahasia Owner untuk membuka ruang statistik pribadi.</p>
        <input type="password" id="owner-pin-input" inputmode="numeric" maxlength="8" placeholder="••••••" style="width:100%;padding:11px;text-align:center;font-size:18px;letter-spacing:6px;font-weight:900;border:2px solid #5a2d0c;border-radius:12px;margin-bottom:12px;box-sizing:border-box;">
        <div style="display:flex;gap:8px;">
          <button id="owner-pin-batal" class="owner-btn danger" style="flex:1;">Batal</button>
          <button id="owner-pin-masuk" class="owner-btn" style="flex:2;background:#16a34a;color:#fff;">Masuk Owner</button>
        </div>
      </div>
    `;
    document.body.appendChild(wrap);
    const inp = document.getElementById("owner-pin-input");
    inp.focus();

    document.getElementById("owner-pin-batal").onclick = () => {
      wrap.remove();
      window.history.replaceState({}, "", window.location.pathname);
    };

    const verifikasiPin = () => {
      if (inp.value.trim() === OWNER_PIN) {
        wrap.remove();
        jalankanDenganLoading("👑 Membuka Ruang Rahasia Owner...", 1300, () => {
          pesanAlert("Selamat Datang Owner! Akses ruang rahasia berhasil dibuka.", "Owner Sukses Masuk", "👑");
          bukaDashboardOwner();
        });
      } else {
        inp.value = "";
        inp.focus();
        pesanAlert("PIN Rahasia Owner salah! Akses ditolak.", "Akses Ditolak", "⛔");
      }
    };

    document.getElementById("owner-pin-masuk").onclick = verifikasiPin;
    inp.onkeydown = (e) => { if (e.key === "Enter") verifikasiPin(); };
  }

  window.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("owner") === OWNER_KEY) setTimeout(tampilkanGerbangPinOwner, 600);
    else rekamKunjungan();
  });
})();
