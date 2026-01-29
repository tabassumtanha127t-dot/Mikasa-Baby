const axios = require("axios");
const fs = require("fs");
const path = require("path");

const a = {
  y: /(youtube\.com|youtu\.be)/i,
  fb: /(facebook\.com|fb\.watch)/i,
  tk: /(tiktok\.com)/i,
  ig: /(instagram\.com)/i,
  s: /(spotify\.com|spotify\.link)/i,
  i: /(imgur\.com|i\.imgur\.com)/i,
  p: /(pinterest\.com|pin\.it)/i,
  b: /(imgbb\.com|ibb\.co)/i
};

function getPlatform(u) {
  if (a.y.test(u)) return "𝐘𝐨𝐮𝐓𝐮𝐛𝐞";
  if (a.fb.test(u)) return "𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤";
  if (a.tk.test(u)) return "𝐓𝐢𝐤𝐓𝐨𝐤";
  if (a.ig.test(u)) return "𝐈𝐧𝐬𝐭𝐚𝐠𝐫𝐚𝐦";
  if (a.s.test(u)) return "𝐒𝐩𝐨𝐭𝐢𝐟𝐲";
  if (a.p.test(u)) return "𝐏𝐢𝐧𝐭𝐞𝐫𝐞𝐬𝐭";
  return "𝐌𝐞𝐝𝐢𝐚";
}

function boldSerifItalic(text) {
  const fonts = {
    a: "𝒂", b: "𝒃", c: "𝒄", d: "𝒅", e: "𝒆", f: "𝒇", g: "𝒈", h: "𝒉", i: "𝒊", j: "𝒋", k: "𝒌", l: "𝒍", m: "𝒎",
    n: "𝒏", o: "𝒐", p: "𝒑", q: "𝒒", r: "𝒓", s: "𝒔", t: "𝒕", u: "𝒖", v: "𝒗", w: "𝒘", x: "𝒙", y: "𝒚", z: "𝒛",
    A: "𝑨", B: "𝑩", C: "𝑪", D: "𝑫", E: "𝑬", F: "𝑭", G: "𝑮", H: "𝑯", I: "𝑰", J: "𝑱", K: "𝑲", L: "𝑳", M: "𝑴",
    N: "𝑵", O: "𝑶", P: "𝑷", Q: "𝑸", R: "𝑹", S: "𝑺", T: "𝑻", U: "𝑼", V: "𝑽", W: "𝑾", X: "𝑿", Y: "𝒀", Z: "𝒁",
    "0": "𝟎", "1": "𝟏", "2": "𝟐", "3": "𝟑", "4": "𝟒", "5": "𝟓", "6": "𝟔", "7": "𝟕", "8": "𝟖", "9": "𝟗",
    ".": "．", ":": "："
  };
  return text.split('').map(char => fonts[char] || char).join('');
}

async function c(u, api, t, m) {
  api.setMessageReaction("⌛", m, () => {}, true);
  const startTime = Date.now();

  let r;
  try {
    r = await axios.get(
      `https://downvid.onrender.com/api/download?url=${encodeURIComponent(u)}`,
      { timeout: 60000 }
    );
  } catch {
    api.setMessageReaction("❌", m, () => {}, true);
    return;
  }

  const d = r?.data;
  if (!d || d.status !== "success") {
    api.setMessageReaction("❌", m, () => {}, true);
    return;
  }

  // ***Better Title Finder Baby! Checks all possible locations***
  const e = d?.data?.data || {};
  const videoTitle = d.title || e.title || d.desc || e.desc || "Social Video";
  
  const v = d.video || e.nowm || e.video || null;
  const a2 = d.audio || e.audio || null;
  const i2 = d.image || e.image || null;

  let g = [];
  if (v) g.push({ u: v, t: "v" });
  else if (a2) g.push({ u: a2, t: "a" });
  else if (i2) g.push({ u: i2, t: "i" });

  if (g.length === 0) return api.setMessageReaction("❌", m, () => {}, true);

  const k = path.join(__dirname, "cache");
  if (!fs.existsSync(k)) fs.mkdirSync(k, { recursive: true });

  const l = [];
  const n = [];

  try {
    for (const o of g) {
      const ext = o.t === "a" ? "mp3" : o.t === "i" ? "jpg" : "mp4";
      const p = path.join(k, `autodl_${Date.now()}_${Math.random()}.${ext}`);

      const q = await axios.get(o.u, {
        responseType: "arraybuffer",
        timeout: 120000,
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });

      fs.writeFileSync(p, q.data);
      l.push(fs.createReadStream(p));
      n.push(p);
    }

    const endTime = Date.now();
    const timeTaken = ((endTime - startTime) / 1000).toFixed(2);
    const platform = getPlatform(u);

    const infoCard = 
`╔════════════════════╗
  ${boldSerifItalic("🎬 𝑻𝒊𝒕𝒍𝒆： " + (videoTitle.length > 25 ? videoTitle.substring(0, 22) + "..." : videoTitle))}
  ${boldSerifItalic("🌐 𝑷𝒍𝒂𝒕𝒇𝒐𝒓𝒎： " + platform)}
  ${boldSerifItalic("⏳ 𝑻𝒊𝒎𝒆 𝑻𝒂𝒌𝒆𝒏： " + timeTaken + "𝒔")}
╚════════════════════╝
 ${boldSerifItalic("𝑷𝒐𝒘𝒆𝒓𝒆𝒅 𝒃𝒚 𝑴𝒊𝒌𝒂𝒔𝒂")}`;

    await api.sendMessage(
      {
        body: infoCard,
        attachment: l
      },
      t,
      () => n.forEach(x => { try { fs.unlinkSync(x); } catch {} }),
      m
    );

    api.setMessageReaction("✅", m, () => {}, true);
  } catch (err) {
    console.error(err);
    n.forEach(x => { try { fs.unlinkSync(x); } catch {} });
    api.setMessageReaction("❌", m, () => {}, true);
  }
}

module.exports = {
  config: {
    name: "autodl",
    version: "4.2",
    author: "Saif Fix",
    category: "media",
    guide: "{pn} <url> OR send link"
  },

  onStart: async function d({ api, event, args }) {
    const u = args.join(" ").match(/https?:\/\/\S+/i)?.[0];
    if (!u) {
      return api.sendMessage(boldSerifItalic("📥 𝑩𝒂𝒃𝒚, 𝒑𝒍𝒆𝒂𝒔𝒆 𝒔𝒆𝒏𝒅 𝒂 𝒍𝒊𝒏𝒌！"), event.threadID, event.messageID);
    }
    await c(u, api, event.threadID, event.messageID);
  },

  onChat: async function e({ api, event }) {
    const u = event.body?.match(/https?:\/\/\S+/i)?.[0];
    if (!u) return;
    await c(u, api, event.threadID, event.messageID);
  }
};
