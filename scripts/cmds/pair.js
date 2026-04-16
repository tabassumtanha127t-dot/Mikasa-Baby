const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

const COST = 500;
const AVT_URL = (id) =>
  `https://graph.facebook.com/${id}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

// ── Helpers ──────────────────────────────────────────────
function drawCircle(ctx, img, x, y, size) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(img, x, y, size, size);
  ctx.restore();
}

async function fetchBuffer(url) {
  return (await axios.get(url, { responseType: "arraybuffer" })).data;
}

async function getGenderCandidates(api, event) {
  const threadInfo = await api.getThreadInfo(event.threadID);
  const all = threadInfo.userInfo;
  const botID = api.getCurrentUserID();
  const senderID = event.senderID;
  const me = all.find(u => u.id === senderID);
  const myGender = me?.gender || null;

  let candidates = all.filter(u => u.id !== senderID && u.id !== botID);
  if (myGender === "MALE") candidates = candidates.filter(u => u.gender === "FEMALE");
  else if (myGender === "FEMALE") candidates = candidates.filter(u => u.gender === "MALE");
  if (!candidates.length) candidates = all.filter(u => u.id !== senderID && u.id !== botID);

  return { all, candidates };
}

// ── Style 1 — Bold serif, crazy %, love note, canvas ────
async function style1({ api, event, senderID, name1, id2, name2, remaining }) {
  const cacheDir = path.join(__dirname, "cache");
  fs.ensureDirSync(cacheDir);
  const pathImg = path.join(cacheDir, `pair1_${senderID}.png`);
  const pathAvt1 = path.join(cacheDir, `avt1_${senderID}.png`);
  const pathAvt2 = path.join(cacheDir, `avt2_${senderID}.png`);

  const rand1 = Math.floor(Math.random() * 100) + 1;
  const crazyValues = ["0", "-1", "99,99", "-99", "-100", "101", "0,01"];
  const pool = [rand1, rand1, rand1, crazyValues[Math.floor(Math.random() * crazyValues.length)], rand1, rand1, rand1];
  const percentage = pool[Math.floor(Math.random() * pool.length)];

  const loveNotes = [
    "𝐘𝐨𝐮𝐫 𝐥𝐨𝐯𝐞 𝐬𝐭𝐨𝐫𝐲 𝐣𝐮𝐬𝐭 𝐛𝐞𝐠𝐚𝐧, 𝐚𝐧𝐝 𝐢𝐭'𝐬 𝐛𝐞𝐚𝐮𝐭𝐢𝐟𝐮𝐥. 🌹",
    "𝐃𝐞𝐬𝐭𝐢𝐧𝐲 𝐜𝐡𝐨𝐬𝐞 𝐲𝐨𝐮 𝐭𝐰𝐨 𝐭𝐨 𝐛𝐞 𝐭𝐨𝐠𝐞𝐭𝐡𝐞𝐫. 💞",
    "𝐘𝐨𝐮𝐫 𝐡𝐞𝐚𝐫𝐭𝐬 𝐟𝐨𝐮𝐧𝐝 𝐭𝐡𝐞𝐢𝐫 𝐦𝐢𝐫𝐫𝐨𝐫 𝐢𝐧 𝐞𝐚𝐜𝐡 𝐨𝐭𝐡𝐞𝐫. 💖",
    "𝐓𝐰𝐨 𝐬𝐨𝐮𝐥𝐬, 𝐨𝐧𝐞 𝐩𝐚𝐭𝐡. ✨",
    "𝐋𝐨𝐯𝐞 𝐟𝐢𝐧𝐝𝐬 𝐢𝐭𝐬 𝐰𝐚𝐲—𝐚𝐧𝐝 𝐢𝐭 𝐣𝐮𝐬𝐭 𝐝𝐢𝐝. 🔗",
    "𝐓𝐡𝐞 𝐮𝐧𝐢𝐯𝐞𝐫𝐬𝐞 𝐜𝐨𝐧𝐬𝐩𝐢𝐫𝐞𝐝 𝐭𝐨 𝐛𝐫𝐢𝐧𝐠 𝐲𝐨𝐮 𝐭𝐨𝐠𝐞𝐭𝐡𝐞𝐫. 🌌",
    "𝐋𝐨𝐯𝐞 𝐢𝐬 𝐧𝐨𝐭 𝐫𝐚𝐧𝐝𝐨𝐦—𝐢𝐭'𝐬 𝐲𝐨𝐮. 💘",
    "𝐓𝐰𝐨 𝐡𝐞𝐚𝐫𝐭𝐛𝐞𝐚𝐭𝐬, 𝐨𝐧𝐞 𝐫𝐡𝐲𝐭𝐡𝐦. 🫀"
  ];
  const note = loveNotes[Math.floor(Math.random() * loveNotes.length)];

  fs.writeFileSync(pathAvt1, Buffer.from(await fetchBuffer(AVT_URL(senderID))));
  fs.writeFileSync(pathAvt2, Buffer.from(await fetchBuffer(AVT_URL(id2))));
  fs.writeFileSync(pathImg, Buffer.from(await fetchBuffer("https://i.ibb.co/RBRLmRt/Pics-Art-05-14-10-47-00.jpg")));

  const bgImg = await loadImage(pathImg);
  const canvas = createCanvas(bgImg.width, bgImg.height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(await loadImage(pathAvt1), 111, 175, 330, 330);
  ctx.drawImage(await loadImage(pathAvt2), 1018, 173, 330, 330);
  fs.writeFileSync(pathImg, canvas.toBuffer());
  fs.removeSync(pathAvt1);
  fs.removeSync(pathAvt2);

  const body =
    `💞 𝐋𝐨𝐯𝐞 𝐏𝐚𝐢𝐫 𝐀𝐥𝐞𝐫𝐭 💞\n\n` +
    `💑 Congratulations @${name1} & @${name2}\n` +
    `💌 ${note}\n` +
    `🔗 Love Connection: ${percentage}% 💖\n\n` +
    `💸 Coins Deducted: ${COST}\n💰 Remaining: ${remaining}`;

  return api.sendMessage(
    { body, mentions: [{ tag: `@${name1}`, id: senderID }, { tag: `@${name2}`, id: id2 }], attachment: fs.createReadStream(pathImg) },
    event.threadID, () => fs.unlinkSync(pathImg), event.messageID
  );
}

// ── Style 2 — Bold unicode, dual avatar, no canvas ──────
async function style2({ api, event, senderID, name1, id2, name2, remaining }) {
  const { getStreamFromURL } = global.utils;

  const toBold = (text) => {
    const map = {"a":"𝐚","b":"𝐛","c":"𝐜","d":"𝐝","e":"𝐞","f":"𝐟","g":"𝐠","h":"𝐡","i":"𝐢","j":"𝐣","k":"𝐤","l":"𝐥","m":"𝐦","n":"𝐧","o":"𝐨","p":"𝐩","q":"𝐪","r":"𝐫","s":"𝐬","t":"𝐭","u":"𝐮","v":"𝐯","w":"𝐰","x":"𝐱","y":"𝐲","z":"𝐳","A":"𝐀","B":"𝐁","C":"𝐂","D":"𝐃","E":"𝐄","F":"𝐅","G":"𝐆","H":"𝐇","I":"𝐈","J":"𝐉","K":"𝐊","L":"𝐋","M":"𝐌","N":"𝐍","O":"𝐎","P":"𝐏","Q":"𝐐","R":"𝐑","S":"𝐒","T":"𝐓","U":"𝐔","V":"𝐕","W":"𝐖","X":"𝐗","Y":"𝐘","Z":"𝐙"," ":" "};
    return String(text).split("").map(c => map[c] || c).join("");
  };

  const lovePercent = Math.floor(Math.random() * 36) + 65;
  const compat = Math.floor(Math.random() * 36) + 65;
  const bn1 = toBold(name1);
  const bn2 = toBold(name2);

  const body =
    `\n💖 𝐍𝐞𝐰 𝐏𝐚𝐢𝐫 𝐀𝐥𝐞𝐫𝐭! 💖\n\n` +
    `🎉 𝐄𝐯𝐞𝐫𝐲𝐨𝐧𝐞, 𝐥𝐞𝐭'𝐬 𝐜𝐨𝐧𝐠𝐫𝐚𝐭𝐮𝐥𝐚𝐭𝐞 𝐨𝐮𝐫 𝐥𝐨𝐯𝐞𝐥𝐲 𝐧𝐞𝐰 𝐜𝐨𝐮𝐩𝐥𝐞:\n\n` +
    `@${bn1}\n@${bn2}\n\n` +
    `❤ 𝐋𝐨𝐯𝐞: ${lovePercent}%\n🌟 𝐂𝐨𝐦𝐩𝐚𝐭𝐢𝐛𝐢𝐥𝐢𝐭𝐲: ${compat}%\n\n` +
    `💰 𝐂𝐨𝐢𝐧𝐬 𝐃𝐞𝐝𝐮𝐜𝐭𝐞𝐝: ${COST}\n💳 𝐑𝐞𝐦𝐚𝐢𝐧𝐢𝐧𝐠: ${remaining}`;

  const attachments = [];
  try {
    const a1 = await getStreamFromURL(AVT_URL(senderID));
    const a2 = await getStreamFromURL(AVT_URL(id2));
    if (a1) attachments.push(a1);
    if (a2) attachments.push(a2);
  } catch {}

  return api.sendMessage(
    { body, mentions: [{ tag: `@${bn1}`, id: senderID }, { tag: `@${bn2}`, id: id2 }], ...(attachments.length && { attachment: attachments }) },
    event.threadID, event.messageID
  );
}

// ── Style 3 — Anime bg, love notes, canvas ───────────────
async function style3({ api, event, senderID, name1, id2, name2, remaining }) {
  const cacheDir = path.join(__dirname, "cache");
  fs.ensureDirSync(cacheDir);
  const pathAvt1 = path.join(cacheDir, `avt1_3_${senderID}.png`);
  const pathAvt2 = path.join(cacheDir, `avt2_3_${senderID}.png`);
  const pathBg = path.join(cacheDir, `bg3_${senderID}.png`);
  const finalPath = path.join(cacheDir, `pair3_${senderID}.png`);

  fs.writeFileSync(pathAvt1, Buffer.from(await fetchBuffer(AVT_URL(senderID))));
  fs.writeFileSync(pathAvt2, Buffer.from(await fetchBuffer(AVT_URL(id2))));
  fs.writeFileSync(pathBg, Buffer.from(await fetchBuffer("https://i.ibb.co/RBRLmRt/Pics-Art-05-14-10-47-00.jpg")));

  const bgImg = await loadImage(pathBg);
  const canvas = createCanvas(bgImg.width, bgImg.height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(await loadImage(pathAvt1), 100, 150, 300, 300);
  ctx.drawImage(await loadImage(pathAvt2), 1000, 150, 300, 300);
  fs.writeFileSync(finalPath, canvas.toBuffer());
  fs.removeSync(pathAvt1);
  fs.removeSync(pathAvt2);
  fs.removeSync(pathBg);

  const notes = ["💖 Love is in the air!", "🌸 Destiny brought you two together!", "✨ Your hearts beat as one!", "💞 A perfect match!", "🌟 Stars align for your love!"];
  const note = notes[Math.floor(Math.random() * notes.length)];
  const pct = Math.floor(Math.random() * 101);

  const body =
    `💞 Successful pairing!\n` +
    `💌 ${note}\n` +
    `💕 Love Connection: ${pct}%\n` +
    `💸 Coins deducted: ${COST}\n💳 Remaining: ${remaining}`;

  return api.sendMessage(
    { body, mentions: [{ tag: name1, id: senderID }, { tag: name2, id: id2 }], attachment: fs.createReadStream(finalPath) },
    event.threadID, () => fs.unlinkSync(finalPath)
  );
}

// ── Style 4 — Cursive script font, external API image ────
async function style4({ api, event, senderID, name1, id2, name2, remaining }) {
  const cacheDir = path.join(__dirname, "cache");
  fs.ensureDirSync(cacheDir);
  const outputPath = path.join(cacheDir, `pair4_${senderID}.png`);

  let apiBase;
  try {
    const res = await axios.get("https://raw.githubusercontent.com/Saim-x69x/sakura/main/ApiUrl.json");
    apiBase = res.data.apiv1;
  } catch {}

  if (apiBase) {
    try {
      const imgRes = await axios.get(`${apiBase}/api/pair4?avatar1=${encodeURIComponent(AVT_URL(senderID))}&avatar2=${encodeURIComponent(AVT_URL(id2))}`, { responseType: "arraybuffer" });
      fs.writeFileSync(outputPath, Buffer.from(imgRes.data, "binary"));
    } catch {}
  }

  const lovePercent = Math.floor(Math.random() * 31) + 70;
  const body =
    `💞 𝗠𝗮𝘁𝗰𝗵𝗺𝗮𝗸𝗶𝗻𝗴 𝗖𝗼𝗺𝗽𝗹𝗲𝘁𝗲 💞\n\n` +
    `🎀 @${name1} ✨\n🎀 @${name2} ✨\n\n` +
    `🕊️ 𝓓𝓮𝓼𝓽𝓲𝓷𝔂 𝓱𝓪𝓼 𝔀𝓻𝓲𝓽𝓽𝓮𝓷 𝔂𝓸𝓾𝓻 𝓷𝓪𝓶𝓮𝓼 𝓽𝓸𝓰𝓮𝓽𝓱𝓮𝓻 🌹\n` +
    `𝓜𝓪𝔂 𝔂𝓸𝓾𝓻 𝓫𝓸𝓷𝓭 𝓵𝓪𝓼𝓽 𝓯𝓸𝓻𝓮𝓿𝓮𝓻 ✨\n\n` +
    `💘 𝙲𝚘𝚖𝚙𝚊𝚝𝚒𝚋𝚒𝚕𝚒𝚝𝚢: ${lovePercent}%\n` +
    `💸 Coins: ${COST} 💳 Remaining: ${remaining}`;

  const msgObj = { body, mentions: [{ tag: `@${name1}`, id: senderID }, { tag: `@${name2}`, id: id2 }] };
  if (fs.existsSync(outputPath)) msgObj.attachment = fs.createReadStream(outputPath);

  return api.sendMessage(msgObj, event.threadID, () => fs.existsSync(outputPath) && fs.unlinkSync(outputPath), event.messageID);
}

// ── Style 5 — Random background, square avatars ──────────
async function style5({ api, event, senderID, name1, id2, name2, remaining }) {
  const cacheDir = path.join(__dirname, "cache");
  fs.ensureDirSync(cacheDir);
  const outputPath = path.join(cacheDir, `pair5_${senderID}.png`);

  const bgs = [
    "https://i.imgur.com/OntEBiq.png",
    "https://i.imgur.com/IYCoZgc.jpeg",
    "https://i.imgur.com/753i3RF.jpeg"
  ];
  const bgUrl = bgs[Math.floor(Math.random() * bgs.length)];

  const canvas = createCanvas(800, 400);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(await loadImage(bgUrl), 0, 0, 800, 400);
  ctx.drawImage(await loadImage(AVT_URL(senderID)), 385, 40, 170, 170);
  ctx.drawImage(await loadImage(AVT_URL(id2)), 587, 190, 180, 170);

  await new Promise((res, rej) => {
    const out = fs.createWriteStream(outputPath);
    canvas.createPNGStream().pipe(out);
    out.on("finish", res);
    out.on("error", rej);
  });

  const lovePercent = Math.floor(Math.random() * 31) + 70;
  const body =
    `🥰 𝗦𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹 𝗽𝗮𝗶𝗿𝗶𝗻𝗴\n` +
    `@${name1} 🎀\n@${name2} 🎀\n` +
    `💌 𝗪𝗶𝘀𝗵 𝘆𝗼𝘂 𝘁𝘄𝗼 𝗵𝘂𝗻𝗱𝗿𝗲𝗱 𝘆𝗲𝗮𝗿𝘀 𝗼𝗳 𝗵𝗮𝗽𝗽𝗶𝗻𝗲𝘀𝘀 ❤️\n\n` +
    `𝗟𝗼𝘃𝗲 𝗽𝗲𝗿𝗰𝗲𝗻𝘁𝗮𝗴𝗲: ${lovePercent}% 💙\n` +
    `💸 Coins: ${COST} 💳 Remaining: ${remaining}`;

  return api.sendMessage(
    { body, mentions: [{ tag: `@${name1}`, id: senderID }, { tag: `@${name2}`, id: id2 }], attachment: fs.createReadStream(outputPath) },
    event.threadID, () => fs.unlinkSync(outputPath), event.messageID
  );
}

// ── Style 6 — Circle avatars + names on canvas, pink bg ──
async function style6({ api, event, senderID, name1, id2, name2, remaining }) {
  const cacheDir = path.join(__dirname, "cache");
  fs.ensureDirSync(cacheDir);
  const pathImg = path.join(cacheDir, `pair6_${senderID}.png`);
  const pathAvt1 = path.join(cacheDir, `avt1_6_${senderID}.png`);
  const pathAvt2 = path.join(cacheDir, `avt2_6_${senderID}.png`);

  fs.writeFileSync(pathAvt1, Buffer.from(await fetchBuffer(AVT_URL(senderID))));
  fs.writeFileSync(pathAvt2, Buffer.from(await fetchBuffer(AVT_URL(id2))));
  fs.writeFileSync(pathImg, Buffer.from(await fetchBuffer("https://i.postimg.cc/cLzjPg8W/fdb70a57a84df74c5118d1ab5541d745.jpg")));

  const baseImage = await loadImage(pathImg);
  const canvas = createCanvas(baseImage.width, baseImage.height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
  drawCircle(ctx, await loadImage(pathAvt1), 138, 128, 143);
  drawCircle(ctx, await loadImage(pathAvt2), 433, 130, 142);

  ctx.font = "bold 35px Arial";
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.fillText(name1, 207, 345);
  ctx.fillText(name2, 511, 345);

  const rate = Math.floor(Math.random() * 100);
  ctx.font = "bold 32px Arial";
  ctx.fillStyle = "#ff7bbd";
  ctx.fillText(`Love Match: ${rate}%`, canvas.width / 2, 430);

  fs.writeFileSync(pathImg, canvas.toBuffer());
  fs.removeSync(pathAvt1);
  fs.removeSync(pathAvt2);

  const body =
    `𝑳𝒐𝒗𝒆 𝑷𝒂𝒊𝒓 𝑨𝒍𝒆𝒓𝒕 🎀\n\n` +
    `𝑪𝒐𝒏𝒈𝒓𝒂𝒕𝒔 ✨ @${name1} 𝒂𝒏𝒅 @${name2} 🍭\n` +
    `𝑳𝒐𝒗𝒆 𝒇𝒊𝒏𝒅𝒔 𝒊𝒕𝒔 𝒘𝒂𝒚 🧸 𝒂𝒏𝒅 𝒊𝒕 𝒋𝒖𝒔𝒕 𝒅𝒊𝒅 𝑩𝒂𝒃𝒚 🍼\n` +
    `𝑶𝒖𝒓 𝒔𝒚𝒔𝒕𝒆𝒎 𝒔𝒂𝒚𝒔 𝒚𝒐𝒖 𝒂𝒓𝒆 ${rate}% 𝒎𝒂𝒅𝒆 𝒇𝒐𝒓 𝒆𝒂𝒄𝒉 𝒐𝒕𝒉𝒆𝒓 🧁\n\n` +
    `💸 Coins: ${COST} 💳 Remaining: ${remaining}`;

  return api.sendMessage(
    { body, mentions: [{ tag: `@${name1}`, id: senderID }, { tag: `@${name2}`, id: id2 }], attachment: fs.createReadStream(pathImg) },
    event.threadID, () => fs.unlinkSync(pathImg), event.messageID
  );
}

// ── Style 7 — Shadow canvas, catbox bg, italic script ────
async function style7({ api, event, senderID, name1, id2, name2, remaining }) {
  const cacheDir = path.join(__dirname, "cache");
  fs.ensureDirSync(cacheDir);
  const pathImg = path.join(cacheDir, `pair7_${senderID}.png`);
  const pathAvt1 = path.join(cacheDir, `avt1_7_${senderID}.png`);
  const pathAvt2 = path.join(cacheDir, `avt2_7_${senderID}.png`);

  fs.writeFileSync(pathAvt1, Buffer.from(await fetchBuffer(AVT_URL(senderID))));
  fs.writeFileSync(pathAvt2, Buffer.from(await fetchBuffer(AVT_URL(id2))));
  fs.writeFileSync(pathImg, Buffer.from(await fetchBuffer("https://files.catbox.moe/lshthw.jpg")));

  const baseImage = await loadImage(pathImg);
  const canvas = createCanvas(baseImage.width, baseImage.height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
  ctx.shadowColor = "rgba(0,0,0,0.5)";
  ctx.shadowBlur = 15;
  ctx.drawImage(await loadImage(pathAvt1), 717, 202, 303, 303);
  ctx.drawImage(await loadImage(pathAvt2), 1103, 510, 300, 303);
  fs.writeFileSync(pathImg, canvas.toBuffer());
  fs.removeSync(pathAvt1);
  fs.removeSync(pathAvt2);

  const pct = Math.floor(Math.random() * 100);
  const body =
    `𝑳𝒐𝒗𝒆 𝑷𝒂𝒊𝒓 𝑨𝒍𝒆𝒓𝒕 🎀\n\n` +
    `𝑪𝒐𝒏𝒈𝒓𝒂𝒕𝒔 ✨ @${name1}\n` +
    `𝒀𝒐𝒖 𝒂𝒓𝒆 𝒑𝒂𝒊𝒓𝒆𝒅 𝒘𝒊𝒕𝒉 ✨ @${name2} 🍭\n\n` +
    `𝑳𝒐𝒗𝒆 𝒇𝒊𝒏𝒅𝒔 𝒊𝒕𝒔 𝒘𝒂𝒚 🧸 𝒂𝒏𝒅 𝒊𝒕 𝒋𝒖𝒔𝒕 𝒅𝒊𝒅 𝑩𝒂𝒃𝒚 🍼\n` +
    `𝑪𝒐𝒏𝒏𝒆𝒄𝒕𝒊𝒐𝒏 𝑺𝒄𝒐𝒓𝒆: ${pct}% 🧁\n\n` +
    `💸 Coins: ${COST} 💳 Remaining: ${remaining}`;

  return api.sendMessage(
    { body, mentions: [{ tag: `@${name1}`, id: senderID }, { tag: `@${name2}`, id: id2 }], attachment: fs.createReadStream(pathImg) },
    event.threadID, () => fs.unlinkSync(pathImg), event.messageID
  );
}

// ── Style 8 — 3 attachments: avt1 + gif heart + avt2 ────
async function style8({ api, event, senderID, name1, id2, name2, remaining }) {
  const cacheDir = path.join(__dirname, "cache");
  fs.ensureDirSync(cacheDir);
  const pathAvt1 = path.join(cacheDir, `avt1_8_${senderID}.png`);
  const pathGif  = path.join(cacheDir, `gif8_${senderID}.png`);
  const pathAvt2 = path.join(cacheDir, `avt2_8_${senderID}.png`);

  fs.writeFileSync(pathAvt1, Buffer.from(await fetchBuffer(AVT_URL(senderID))));
  fs.writeFileSync(pathGif,  Buffer.from(await fetchBuffer("https://i.ibb.co/y4dWfQq/image.gif")));
  fs.writeFileSync(pathAvt2, Buffer.from(await fetchBuffer(AVT_URL(id2))));

  const tle = Math.floor(Math.random() * 101);
  const body =
    `🥰 Successful pairing!\n` +
    `💌 Wish you two hundred years of happiness\n` +
    `💕 Double ratio: ${tle}%\n` +
    `@${name1} 💓 @${name2}\n\n` +
    `💸 Coins: ${COST} 💳 Remaining: ${remaining}`;

  return api.sendMessage(
    {
      body,
      mentions: [{ tag: `@${name1}`, id: senderID }, { tag: `@${name2}`, id: id2 }],
      attachment: [fs.createReadStream(pathAvt1), fs.createReadStream(pathGif), fs.createReadStream(pathAvt2)]
    },
    event.threadID,
    () => { fs.removeSync(pathAvt1); fs.removeSync(pathGif); fs.removeSync(pathAvt2); },
    event.messageID
  );
}

// ── Style 9 — Circular avatars, postimg bg, 70~100% ─────
async function style9({ api, event, senderID, name1, id2, name2, remaining }) {
  const outputPath = path.join(__dirname, `pair9_${senderID}.png`);

  const canvas = createCanvas(800, 400);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(await loadImage("https://i.postimg.cc/pdv5dFVX/611905695-855684437229208-8377464727643815456-n.png"), 0, 0, 800, 400);
  drawCircle(ctx, await loadImage(AVT_URL(senderID)), 385, 40, 170);
  drawCircle(ctx, await loadImage(AVT_URL(id2)), 587, 190, 170);

  await new Promise((res, rej) => {
    const out = fs.createWriteStream(outputPath);
    canvas.createPNGStream().pipe(out);
    out.on("finish", res);
    out.on("error", rej);
  });

  const lovePercent = Math.floor(Math.random() * 31) + 70;
  const body =
    `🥰 𝑺𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍 𝑷𝒂𝒊𝒓𝒊𝒏𝒈 💞\n\n` +
    `✨ @${name1}\n✨ @${name2}\n\n` +
    `💌 𝑾𝒊𝒔𝒉 𝒚𝒐𝒖 𝒕𝒘𝒐 𝒉𝒖𝒏𝒅𝒓𝒆𝒅 𝒚𝒆𝒂𝒓𝒔 𝒐𝒇 𝒉𝒂𝒑𝒑𝒊𝒏𝒆𝒔𝒔 🌸\n` +
    `💖 𝑳𝒐𝒗𝒆 𝑺𝒄𝒐𝒓𝒆: ${lovePercent}%\n\n` +
    `💸 Coins: ${COST} 💳 Remaining: ${remaining}`;

  return api.sendMessage(
    { body, mentions: [{ tag: `@${name1}`, id: senderID }, { tag: `@${name2}`, id: id2 }], attachment: fs.createReadStream(outputPath) },
    event.threadID, () => fs.unlinkSync(outputPath), event.messageID
  );
}

// ── Main Command ─────────────────────────────────────────
module.exports = {
  config: {
    name: "pair",
    version: "9.0",
    author: "Mikasa Baby",
    countDown: 10,
    role: 0,
    shortDescription: { en: "Find your destined partner 💞" },
    longDescription: { en: "9 unique love pair styles. Use: pair 1 ~ pair 9. Costs 500 coins." },
    category: "love",
    guide: { en: "{pn} [1-9]" },
  },

  onStart: async function ({ api, event, usersData, args, message }) {
    const senderID = event.senderID;
    const styleNum = parseInt(args[0]);

    if (!styleNum || styleNum < 1 || styleNum > 9)
      return message.reply(
        `💞 𝐏𝐚𝐢𝐫 𝐒𝐭𝐲𝐥𝐞𝐬\n\n` +
        `pair 1 — Bold serif, crazy %\n` +
        `pair 2 — Bold unicode, dual avatar\n` +
        `pair 3 — Anime bg, love notes\n` +
        `pair 4 — Cursive script font\n` +
        `pair 5 — Random background\n` +
        `pair 6 — Circle avatars + names\n` +
        `pair 7 — Shadow canvas\n` +
        `pair 8 — 3 attachments + gif heart\n` +
        `pair 9 — Circular, 70~100% love\n\n` +
        `💸 Cost: 500 coins each`
      );

    try {
      // Balance check
      const userData = await usersData.get(senderID);
      const balance = userData?.money || 0;
      if (balance < COST)
        return message.reply(`💸 Need ${COST} coins!\n💰 Your balance: ${balance} coins`);

      await usersData.set(senderID, { ...userData, money: balance - COST });
      const remaining = balance - COST;

      const name1 = userData?.name || "Unknown";

      // Target selection
      let id2;
      if (event.type === "message_reply" && event.messageReply) {
        id2 = event.messageReply.senderID;
      } else if (Object.keys(event.mentions || {}).length > 0) {
        id2 = Object.keys(event.mentions)[0];
      } else {
        const { candidates } = await getGenderCandidates(api, event);
        if (!candidates.length) return message.reply("❌ No suitable partner found in this group.");
        id2 = candidates[Math.floor(Math.random() * candidates.length)].id;
      }

      const partnerData = await usersData.get(id2);
      const name2 = partnerData?.name || "Unknown";

      const ctx = { api, event, usersData, senderID, name1, id2, name2, remaining };
      const styles = [style1, style2, style3, style4, style5, style6, style7, style8, style9];
      await styles[styleNum - 1](ctx);

    } catch (err) {
      console.error("[pair]", err);
      return message.reply(`❌ Something went wrong 😿\n${err.message}`);
    }
  },
};
