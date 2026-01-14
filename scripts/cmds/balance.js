// Number shorthand parser upgraded to Centillion Baby
function parseAmount(str) {
  if (!str) return NaN;
  str = str.toLowerCase().replace(/\s+/g, "");
  
  const map = {
    k: 1e3, m: 1e6, b: 1e9, t: 1e12, q: 1e15, qd: 1e18, qi: 1e21, sx: 1e24, sp: 1e27, 
    oc: 1e30, no: 1e33, dc: 1e36, udc: 1e39, ddc: 1e42, tdc: 1e45, qdc: 1e48, qid: 1e51, 
    sxd: 1e54, spd: 1e57, ocd: 1e60, nod: 1e63, vg: 1e66, ntg: 1e93, ct: 1e303
  };

  // Sort keys by length descending to match longest suffix first (e.g., 'qdc' before 'q')
  const sortedKeys = Object.keys(map).sort((a, b) => b.length - a.length);
  
  for (let key of sortedKeys) {
    if (str.endsWith(key)) {
      let num = parseFloat(str.slice(0, -key.length));
      return isNaN(num) ? NaN : num * map[key];
    }
  }
  return parseFloat(str);
}

// Style-4 Fancy Font (Bold Serif Italic)
function fancy(text) {
  const map = {
    'a': '𝒂','b': '𝒃','c': '𝒄','d': '𝒅','e': '𝒆','f': '𝒇','g': '𝒈','h': '𝒉','i': '𝒊','j': '𝒋','k': '𝒌','l': '𝒍','m': '𝒎','n': '𝒏','o': '𝒐','p': '𝒑','q': '𝗊','r': '𝒓','s': '𝒔','t': '𝒕','u': '𝒖','v': '𝒗','w': '𝒘','x': '𝒙','y': '𝒚','z': '𝒛',
    'A': '𝑨','B': '𝑩','C': '𝑪','D': '𝑫','E': '𝑬','F': '𝑭','G': '𝑮','H': '𝑯','I': '𝑰','J': '𝑱','K': '𝑲','L': '𝑳','M': '𝑴','N': '𝑵','O': '𝑶','P': '𝑷','Q': '𝑸','R': '𝑹','S': '𝑺','T': '𝑻','U': '𝑼','V': '𝑽','W': '𝒘','X': '𝑿','Y': '𝒀','Z': '𝒁',
    '0': '𝟎','1': '𝟏','2': '𝟐','3': '𝟑','4': '𝟒','5': '𝟓','6': '𝟔','7': '𝟕','8': '𝟖','9': '𝟗', '.': '.'
  };
  return text.toString().split('').map(char => map[char] || char).join('');
}

// Format money up to Centillion
function formatMoney(amount) {
  if (amount === Infinity) return fancy("𝑰𝒏𝒇𝒊𝒏𝒊𝒕𝒚");
  const units = [
    { v: 1e303, s: "𝑪𝒕" }, { v: 1e93, s: "𝑵𝒕𝒈" }, { v: 1e66, s: "𝑽𝒈" },
    { v: 1e63, s: "𝑵𝒐𝒅" }, { v: 1e60, s: "𝑶𝒄𝒅" }, { v: 1e57, s: "𝑺𝒑𝒅" },
    { v: 1e54, s: "𝑺𝒙𝒅" }, { v: 1e51, s: "𝑸𝒊𝒅" }, { v: 1e48, s: "𝑸𝒅𝒄" },
    { v: 1e45, s: "𝑻𝒅𝒄" }, { v: 1e42, s: "𝑫𝒅𝒄" }, { v: 1e39, s: "𝑼𝒅𝒄" },
    { v: 1e36, s: "𝑫𝒄" }, { v: 1e33, s: "𝑵𝒐" }, { v: 1e30, s: "𝑶𝒄" },
    { v: 1e27, s: "𝑺𝒑" }, { v: 1e24, s: "𝑺𝒙" }, { v: 1e21, s: "𝑸𝒊" },
    { v: 1e18, s: "𝑸𝒅" }, { v: 1e15, s: "𝑸" }, { v: 1e12, s: "𝑻" },
    { v: 1e9,  s: "𝑩" }, { v: 1e6,  s: "𝑴" }, { v: 1e3,  s: "𝑲" }
  ];
  for (let u of units) {
    if (Math.abs(amount) >= u.v) return fancy((amount / u.v).toFixed(2)) + u.s;
  }
  return fancy(Math.floor(amount).toLocaleString());
}

module.exports = {
  config: {
    name: "balance",
    aliases: ["bal"],
    version: "6.0",
    author: "Saif",
    countDown: 5,
    role: 0,
    description: "Centillion edition balance and transfer system",
    category: "bank"
  },

  onStart: async function ({ api, message, usersData, event, args }) {
    const { senderID, threadID, messageReply } = event;
    const adminIDs = ["100081317798618", "100078639797619", "100001946540538", "61581271750258", "2871953095"];

    const targetID = messageReply ? messageReply.senderID : senderID;
    const senderData = await usersData.get(senderID);
    const targetData = await usersData.get(targetID);

    // ---------------------- ADMIN ADD (Unlimited Power Baby) ----------------------
    if (args[0] === "add") {
      if (!adminIDs.includes(senderID)) return message.reply(fancy("❌ 𝑶𝒏𝒍𝒚 𝒎𝒚 𝒎𝒂𝒔𝒕𝒆𝒓𝒔 𝒄𝒂𝒏 𝒖𝒔𝒆 𝒕𝒉𝒊𝒔 𝒃𝒂𝒃𝒚."));
      
      const amount = parseAmount(args[1]);
      if (isNaN(amount) || amount <= 0) return message.reply(fancy("❌ 𝑻𝒉𝒂𝒕'𝒔 𝒏𝒐𝒕 𝒂 𝒓𝒆𝒂𝒍 𝒏𝒖𝒎𝒃𝒆𝒓 𝒃𝒂𝒃𝒚."));

      senderData.money += amount;
      await usersData.set(senderID, senderData);

      return message.reply(`🔱 ${fancy("𝑼𝒏𝒍𝒊𝒎𝒊𝒕𝒆𝒅 𝑾𝒆𝒂𝒍𝒕𝒉 𝑩𝒂𝒃𝒚")} 🔱\n\n💵 ${fancy("𝑮𝒆𝒏𝒆𝒓𝒂𝒕𝒆𝒅:")} ${formatMoney(amount)}\n💳 ${fancy("𝑵𝒆𝒘 𝑻𝒐𝒕𝒂𝒍:")} ${formatMoney(senderData.money)}`);
    }

    // ---------------------- TRANSFER (Unlimited System) ----------------------
    if (args[0] === "transfer" || args[0] === "send") {
      if (!messageReply) return message.reply(fancy("❌ 𝑹𝒆𝒑𝒍𝒚 𝒕𝒐 𝒕𝒉𝒆 𝒍𝒖𝒄𝒌𝒚 𝒑𝒆𝒓𝒔𝒐𝒏 𝒃𝒂𝒃𝒚."));
      
      const amount = parseAmount(args[1]);
      if (isNaN(amount) || amount <= 0) return message.reply(fancy("❌ 𝑯𝒐𝒘 𝒎𝒖𝒄𝒉 𝒅𝒐 𝒚𝒐𝒖 𝒘𝒂𝒏𝒕 𝒕𝒐 𝒔𝒆𝒏𝒅 𝒃𝒂𝒃𝒚?"));

      if (senderData.money < amount) return message.reply(fancy("⚠️ 𝒀𝒐𝒖'𝒓𝒆 𝒕𝒐𝒐 𝒑𝒐𝒐𝒓 𝒇𝒐𝒓 𝒕𝒉𝒊𝒔 𝒕𝒓𝒂𝒏𝒔𝒇𝒆𝒓 𝒃𝒂𝒃𝒚."));

      senderData.money -= amount;
      targetData.money += amount;

      await usersData.set(senderID, senderData);
      await usersData.set(targetID, targetData);

      return message.reply({
        body: `🎀 ${fancy("𝑮𝒆𝒏𝒆𝒓𝒐𝒖𝒔 𝑻𝒓𝒂𝒏𝒔𝒇𝒆𝒓 𝑩𝒂𝒃𝒚")} 🎀\n\n📤 ${fancy("𝑺𝒆𝒏𝒕 𝑩𝒚:")} ${fancy(senderData.name)}\n📥 ${fancy("𝑹𝒆𝒄𝒆𝒊𝒗𝒆𝒅 𝑩𝒚:")} ${fancy(targetData.name)}\n💰 ${fancy("𝑨𝒎𝒐𝒖𝒏𝒕:")} ${formatMoney(amount)}\n\n✨ ${fancy("𝒀𝒐𝒖𝒓 𝑩𝒂𝒍𝒂𝒏𝒄𝒆:")} ${formatMoney(senderData.money)}`,
        mentions: [{ tag: senderData.name, id: senderID }, { tag: targetData.name, id: targetID }]
      });
    }

    // ---------------------- CHECK BALANCE ----------------------
    const isSelf = targetID === senderID;
    return message.reply(`🏦 ${fancy(isSelf ? "𝑴𝒚 𝑷𝒓𝒊𝒗𝒂𝒕𝒆 𝑩𝒂𝒏𝒌 𝑩𝒂𝒃𝒚" : "𝑼𝒔𝒆𝒓 𝑩𝒂𝒏𝒌 𝑷𝒓𝒐𝒇𝒊𝒍𝒆 𝑩𝒂𝒃𝒚")} 🏦\n\n👤 ${fancy("𝑶𝒘𝒏𝒆𝒓:")} ${fancy(targetData.name)}\n💰 ${fancy("𝑩𝒂𝒍𝒂𝒏𝒄𝒆:")} ${formatMoney(targetData.money)}\n👑 ${fancy("𝑹𝒂𝒏𝒌: 𝑼𝒍𝒕𝒓𝒂 𝑹𝒊𝒄𝒉")}`);
  }
};
