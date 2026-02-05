const axios = require("axios");

// Number shorthand parser upgraded Baby
function parseAmount(str) {
  if (!str) return NaN;
  str = str.toLowerCase().replace(/\s+/g, "");
  const map = {
    k: 1e3, m: 1e6, b: 1e9, t: 1e12, q: 1e15, qd: 1e18, qi: 1e21, sx: 1e24, sp: 1e27, 
    oc: 1e30, no: 1e33, dc: 1e36, udc: 1e39, ddc: 1e42, tdc: 1e45, qdc: 1e48, qid: 1e51, 
    sxd: 1e54, spd: 1e57, ocd: 1e60, nod: 1e63, vg: 1e66, ntg: 1e93, ct: 1e303
  };
  const sortedKeys = Object.keys(map).sort((a, b) => b.length - a.length);
  for (let key of sortedKeys) {
    if (str.endsWith(key)) {
      let num = parseFloat(str.slice(0, -key.length));
      return isNaN(num) ? NaN : num * map[key];
    }
  }
  return parseFloat(str);
}

// Style-4 Fancy Font Baby
function fancy(text) {
  const map = {
    'a': '𝒂','b': '𝒃','c': '𝒄','d': '𝒅','e': '𝒆','f': '𝒇','g': '𝒈','h': '𝒉','i': '𝒊','j': '𝒋','k': '𝒌','l': '𝒍','m': '𝒎','n': '𝒏','o': '𝒐','p': '𝒑','q': '𝗊','r': '𝒓','s': '𝒔','t': '𝒕','u': '𝒖','v': '𝒗','w': '𝒘','x': '𝒙','y': '𝒚','z': '𝒛',
    'A': '𝑨','B': '𝑩','C': '𝑪','D': '𝑫','E': '𝑬','F': '𝑭','G': '𝑮','H': '𝑯','I': '𝑰','J': '𝑱','K': '𝑲','L': '𝑳','M': '𝑴','N': '𝑵','O': '𝑶','P': '𝑷','Q': '𝑸','R': '𝑹','S': '𝑺','T': '𝑻','U': '𝑼','V': '𝑽','W': '𝒘','X': '𝑿','Y': '𝒀','Z': '𝒁',
    '0': '𝟎','1': '𝟏','2': '𝟐','3': '𝟑','4': '𝟒','5': '𝟓','6': '𝟔','7': '𝟕','8': '𝟖','9': '𝟗', '.': '.'
  };
  return text.toString().split('').map(char => map[char] || char).join('');
}

// Format money Baby
function formatMoney(amount) {
  if (amount === Infinity) return fancy("𝑰𝒏𝒇𝒊𝒏𝒊𝒕𝒚");
  const units = [
    { v: 1e303, s: "𝑪𝒕" }, { v: 1e93, s: "𝑵𝒕𝒈" }, { v: 1e66, s: "𝑽𝒈" },
    { v: 1e36, s: "𝑫𝒄" }, { v: 1e21, s: "𝑸𝒊" }, { v: 1e12, s: "𝑻" },
    { v: 1e9,  s: "𝑩" }, { v: 1e6,  s: "𝑴" }, { v: 1e3,  s: "𝑲" }
  ];
  for (let u of units) {
    if (Math.abs(amount) >= u.v) return fancy((amount / u.v).toFixed(2)) + u.s;
  }
  return fancy(Math.floor(amount).toLocaleString());
}

// Rich System Rank Baby
function getRank(money) {
  if (money < 1000) return fancy("𝑷𝒐𝒐𝒓 𝑩𝒂𝒃𝒚");
  if (money < 50000) return fancy("𝑨𝒗𝒆𝒓𝒂𝒈𝒆 𝑩𝒂𝒃𝒚");
  if (money < 1000000) return fancy("𝑹𝒊𝒄𝒉 𝑩𝒂𝒃𝒚");
  if (money < 1e12) return fancy("𝑴𝒊𝒍𝒍𝒊𝒐𝒏𝒂𝒊𝒓𝒆 𝑩𝒂𝒃𝒚");
  if (money < 1e21) return fancy("𝑩𝒊𝒍𝒍𝒊𝒐𝒏𝒂𝒊𝒓𝒆 𝑩𝒂𝒃𝒚");
  return fancy("𝑼𝒍𝒕𝒓𝒂 𝑹𝒊𝒄𝒉 𝑩𝒂𝒃𝒚");
}

module.exports = {
  config: {
    name: "balance",
    aliases: ["bal", "money"],
    version: "11.0",
    author: "Saif & Gemini",
    countDown: 5,
    role: 0,
    category: "bank",
    description: "𝑷𝒓𝒆𝒎𝒊𝒖𝒎 𝑩𝒂𝒏𝒌 𝑺𝒚𝒔𝒕𝒆𝒎 𝑩𝒂𝒃𝒚"
  },

  onStart: async function ({ api, usersData, event, args }) {
    const { senderID, threadID, messageID, messageReply } = event;
    const adminIDs = ["100081317798618", "100078639797619", "100001946540538", "61581271750258", "2871953095"];

    const targetID = messageReply ? messageReply.senderID : senderID;
    const senderData = await usersData.get(senderID);
    const targetData = await usersData.get(targetID);

    // ---------------------- TRANSFER (-t / transfer) ----------------------
    if (args[0] === "-t" || args[0] === "transfer" || args[0] === "send") {
      if (!messageReply) return api.sendMessage(fancy("❌ 𝑹𝒆𝒑𝒍𝒚 𝒕𝒐 𝒔𝒐𝒎𝒆𝒐𝒏𝒆 𝒕𝒐 𝒕𝒓𝒂𝒏𝒔𝒇𝒆𝒓 𝒃𝒂𝒃𝒚."), threadID, messageID);
      const amount = parseAmount(args[1]);
      if (isNaN(amount) || amount <= 0) return api.sendMessage(fancy("❌ 𝑬𝒏𝒕𝒆𝒓 𝒂 𝒗𝒂𝒍𝒊𝒅 𝒂𝒎𝒐𝒖𝒏𝒕 𝒃𝒂𝒃𝒚."), threadID, messageID);
      if (senderData.money < amount) return api.sendMessage(fancy("⚠️ 𝒀𝒐𝒖'𝒓𝒆 𝒕𝒐𝒐 𝒑𝒐𝒐𝒓 𝒇𝒐𝒓 𝒕𝒉𝒊𝒔 𝒃𝒂𝒃𝒚."), threadID, messageID);

      senderData.money -= amount;
      targetData.money += amount;
      await usersData.set(senderID, senderData);
      await usersData.set(targetID, targetData);

      return api.sendMessage(`📤 ${fancy("𝑻𝒓𝒂𝒏𝒔𝒇𝒆𝒓 𝑺𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍")} 📤\n━━━━━━━━━━━━━━━━━━\n👤 ${fancy("𝑻𝒐:")} ${fancy(targetData.name)}\n💰 ${fancy("𝑨𝒎𝒐𝒖𝒏𝒕:")} ${formatMoney(amount)}\n✨ ${fancy("𝑩𝒂𝒍𝒂𝒏𝒄𝒆:")} ${formatMoney(senderData.money)}`, threadID, messageID);
    }

    // ---------------------- REQUEST (-r / req / request) ----------------------
    if (args[0] === "-r" || args[0] === "req" || args[0] === "request") {
      if (!messageReply) return api.sendMessage(fancy("❌ 𝑹𝒆𝒑𝒍𝒚 𝒕𝒐 𝒔𝒐𝒎𝒆𝒐𝒏𝒆 𝒕𝒐 𝒂𝒔𝒌 𝒇𝒐𝒓 𝒎𝒐𝒏𝒆𝒚 𝒃𝒂𝒃𝒚."), threadID, messageID);
      
      return api.sendMessage({
        body: `🙏 ${fancy("𝑩𝒂𝒍𝒂𝒏𝒄𝒆 𝑹𝒆𝒒𝒖𝒆𝒔𝒕")} 🙏\n━━━━━━━━━━━━━━━━━━\n👤 ${fancy(senderData.name)} ${fancy("𝒊𝒔 𝒂𝒔𝒌𝒊𝒏𝒈 𝒇𝒐𝒓 𝒎𝒐𝒏𝒆𝒚.")}\n💬 ${fancy("𝑹𝒆𝒑𝒍𝒚 𝒘𝒊𝒕𝒉 𝒕𝒉𝒆 𝒂𝒎𝒐𝒖𝒏𝒕 𝒚𝒐𝒖 𝒘𝒂𝒏𝒕 𝒕𝒐 𝒈𝒊𝒗𝒆 𝒃𝒂𝒃𝒚.")}`,
        mentions: [{ tag: senderData.name, id: senderID }]
      }, threadID, (err, info) => {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: this.config.name,
          author: targetID, // Person who will give money
          requesterID: senderID,
          type: "request_payment"
        });
      }, messageID);
    }

    // ---------------------- DEFAULT BALANCE CHECK ----------------------
    const resultMsg = `╭───━━━━🌟━━━━───╮\n      ${fancy(targetID === senderID ? "𝑴𝒀 𝑩𝑨𝑵𝑲 𝑷𝑹𝑶𝑭𝑰𝑳𝑬" : "𝑼𝑺𝑬𝑹 𝑩𝑨𝑵𝑲 𝑷𝑹𝑶𝑭𝑰𝑳𝑬")}\n━━━━━━━━━━━━━━━━━━\n👤 ${fancy("𝑶𝒘𝒏𝒆𝒓:")} ${fancy(targetData.name)}\n💰 ${fancy("𝑩𝒂𝒍𝒂𝒏𝒄𝒆:")} ${formatMoney(targetData.money)}\n🏆 ${fancy("𝑹𝒂𝒏𝒌:")} ${getRank(targetData.money)}\n╰───━━━━🌟━━━━───╯`;
    return api.sendMessage(resultMsg, threadID, messageID);
  },

  onReply: async function ({ api, event, Reply, usersData }) {
    const { senderID, body, threadID, messageID } = event;

    // Logic: Request approve by sending amount
    if (Reply.type === "request_payment" && senderID === Reply.author) {
      const amount = parseAmount(body);
      if (isNaN(amount) || amount <= 0) return api.sendMessage(fancy("❌ 𝑷𝒍𝒆𝒂𝒔𝒆 𝒆𝒏𝒕𝒆𝒓 𝒂 𝒗𝒂𝒍𝒊𝒅 𝒂𝒎𝒐𝒖𝒏𝒕 𝒕𝒐 𝒈𝒊𝒗𝒆 𝒃𝒂𝒃𝒚."), threadID, messageID);

      const giverData = await usersData.get(senderID);
      const requesterData = await usersData.get(Reply.requesterID);

      if (giverData.money < amount) return api.sendMessage(fancy("⚠️ 𝒀𝒐𝒖 𝒅𝒐𝒏'𝒕 𝒉𝒂𝒗𝒆 𝒕𝒉𝒂𝒕 𝒎𝒖𝒄𝒉 𝒎𝒐𝒏𝒆𝒚 𝒃𝒂𝒃𝒚."), threadID, messageID);

      giverData.money -= amount;
      requesterData.money += amount;

      await usersData.set(senderID, giverData);
      await usersData.set(Reply.requesterID, requesterData);

      return api.sendMessage(`✅ ${fancy("𝑷𝒂𝒚𝒎𝒆𝒏𝒕 𝑺𝒆𝒏𝒕 𝑩𝒂𝒃𝒚!")}\n━━━━━━━━━━━━━━━━━━\n📤 ${fancy("𝑭𝒓𝒐𝒎:")} ${fancy(giverData.name)}\n📥 ${fancy("𝑻𝒐:")} ${fancy(requesterData.name)}\n💰 ${fancy("𝑨𝒎𝒐𝒖𝒏𝒕:")} ${formatMoney(amount)}`, threadID, messageID);
    }
  }
};
