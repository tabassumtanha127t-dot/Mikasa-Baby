const fs = require("fs");
const path = require("path");

// Fancy Font Helper Baby
function fancy(text) {
    const map = {
        'a': '𝒂','b': '𝒃','c': '𝒄','d': '𝒅','e': '𝒆','f': '𝒇','g': '𝒈','h': '𝒉','i': '𝒊','j': '𝒋','k': '𝒌','l': '𝒍','m': '𝒎','n': '𝒏','o': '𝒐','p': '𝒑','q': '𝗊','r': '𝒓','s': '𝒔','t': '𝒕','u': '𝒖','v': '𝒗','w': '𝒘','x': '𝒙','y': '𝒚','z': '𝒛',
        'A': '𝑨','B': '𝑩','C': '𝑪','D': '𝑫','E': '𝑬','F': '𝑭','G': '𝑮','H': '𝑯','I': '𝑰','J': '𝑱','K': '𝑲','L': '𝑳','M': '𝑴','N': '𝑵','O': '𝑶','P': '𝑷','Q': '𝑸','R': '𝑹','S': '𝑺','T': '𝑻','U': '𝑼','V': '𝑽','W': '𝒘','X': '𝑿','Y': '𝒀','Z': '𝒁',
        '0': '𝟎','1': '𝟏','2': '𝟐','3': '𝟑','4': '𝟒','5': '𝟓','6': '𝟔','7': '𝟕','8': '𝟖','9': '𝟗', '.': '.'
    };
    return text.toString().split('').map(char => map[char] || char).join('');
}

// Centillion Shorthand Parser Baby
function parseAmount(str) {
    if (!str) return NaN;
    str = str.toLowerCase().replace(/\s+/g, "");
    const map = {
        k: 1e3, m: 1e6, b: 1e9, t: 1e12, q: 1e15, qd: 1e18, qi: 1e21, sx: 1e24, sp: 1e27, 
        oc: 1e30, no: 1e33, dc: 1e36, udc: 1e39, ddc: 1e42, tdc: 1e45, ct: 1e303
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

// Money Formatter Baby
function formatMoney(amount) {
    const units = [
        { v: 1e303, s: "𝑪𝒕" }, { v: 1e36, s: "𝑫𝒄" }, { v: 1e33, s: "𝑵𝒐" }, { v: 1e30, s: "𝑶𝒄" },
        { v: 1e27, s: "𝑺𝒑" }, { v: 1e24, s: "𝑺𝒙" }, { v: 1e21, s: "𝑸𝒊" }, { v: 1e18, s: "𝑸𝒅" },
        { v: 1e15, s: "𝑸" }, { v: 1e12, s: "𝑻" }, { v: 1e9, s: "𝑩" }, { v: 1e6, s: "𝑴" }, { v: 1e3, s: "𝑲" }
    ];
    for (let u of units) {
        if (Math.abs(amount) >= u.v) return fancy((amount / u.v).toFixed(2)) + u.s;
    }
    return fancy(Math.floor(amount).toLocaleString());
}

module.exports = {
  config: {
    name: "bank",
    version: "2.5",
    description: "🏦 𝑼𝑳𝑻𝑹𝑨-𝑩𝑨𝑵𝑲 𝑩𝑨𝑩𝒀 🏦",
    category: "bank",
    author: "Saif & Gemini",
    countDown: 5
  },

  onStart: async function({ args, message, event, api, usersData }) {
    const userID = event.senderID;
    const bankPath = path.join(__dirname, "bankData.json");
    if (!fs.existsSync(bankPath)) fs.writeFileSync(bankPath, "{}");
    let bankData = JSON.parse(fs.readFileSync(bankPath, "utf8"));
    let userData = await usersData.get(userID);
    let userMoney = userData.money || 0;

    const saveBank = () => fs.writeFileSync(bankPath, JSON.stringify(bankData, null, 2));
    const reply = text => message.reply(`🏦 ${fancy("𝑴𝒊𝒌𝒂𝒔𝒂 𝑩𝒂𝒏𝒌 𝑩𝒂𝒃𝒚")} 🏦\n━━━━━━━━━━━━━━━━\n${text}`);

    const initUser = async (id) => {
      if (!bankData[id]) bankData[id] = { bank: 0, lastInterest: Date.now() };
      saveBank();
    };
    await initUser(userID);

    const command = args[0]?.toLowerCase();
    const amount = parseAmount(args[1]);

    switch(command) {
      case "deposit":
      case "dep":
        if (isNaN(amount) || amount <= 0) return reply(fancy("❌ 𝑬𝒏𝒕𝒆𝒓 𝒂 𝒗𝒂𝒍𝒊𝒅 𝒂𝒎𝒐𝒖𝒏𝒕 𝒃𝒂𝒃𝒚."));
        if (userMoney < amount) return reply(fancy("❌ 𝒀𝒐𝒖 𝒅𝒐𝒏'𝒕 𝒉𝒂𝒗𝒆 𝒆𝒏𝒐𝒖𝒈𝒉 𝒄𝒂𝒔𝒉 𝒃𝒂𝒃𝒚."));
        bankData[userID].bank += amount;
        await usersData.set(userID, { money: userMoney - amount });
        saveBank();
        return reply(`✅ ${fancy("𝑫𝒆𝒑𝒐𝒔𝒊𝒕𝒆𝒅:")} ${formatMoney(amount)}\n💰 ${fancy("𝑩𝒂𝒏𝒌 𝑩𝒂𝒍𝒂𝒏𝒄𝒆:")} ${formatMoney(bankData[userID].bank)}`);

      case "withdraw":
      case "wd":
        if (isNaN(amount) || amount <= 0) return reply(fancy("❌ 𝑬𝒏𝒕𝒆𝒓 𝒂 𝒗𝒂𝒍𝒊𝒅 𝒂𝒎𝒐𝒖𝒏𝒕 𝒃𝒂𝒃𝒚."));
        if (bankData[userID].bank < amount) return reply(fancy("❌ 𝒀𝒐𝒖𝒓 𝒃𝒂𝒏𝒌 𝒃𝒂𝒍𝒂𝒏𝒄𝒆 𝒊𝒔 𝒕𝒐𝒐 𝒍𝒐𝒘 𝒃𝒂𝒃𝒚."));
        bankData[userID].bank -= amount;
        await usersData.set(userID, { money: userMoney + amount });
        saveBank();
        return reply(`✅ ${fancy("𝑾𝒊𝒕𝒉𝒅𝒓𝒂𝒘𝒏:")} ${formatMoney(amount)}\n💵 ${fancy("𝑷𝒐𝒄𝒌𝒆𝒕 𝑴𝒐𝒏𝒆𝒚:")} ${formatMoney(userMoney + amount)}`);

      case "balance":
      case "bal":
        return reply(`🏦 ${fancy("𝑩𝒂𝒏𝒌:")} ${formatMoney(bankData[userID].bank)}\n💵 ${fancy("𝑪𝒂𝒔𝒉:")} ${formatMoney(userMoney)}`);

      case "interest":
        const now = Date.now();
        const diff = (now - bankData[userID].lastInterest) / 1000;
        if (diff < 86400) {
          const hours = Math.floor((86400 - diff) / 3600);
          const minutes = Math.floor(((86400 - diff) % 3600) / 60);
          return reply(fancy(`⌛ 𝑷𝒍𝒆𝒂𝒔𝒆 𝒘𝒂𝒊𝒕 ${hours}𝒉 ${minutes}𝒎 𝒇𝒐𝒓 𝒏𝒆𝒙𝒕 𝒊𝒏𝒕𝒆𝒓𝒆𝒔𝒕 𝒃𝒂𝒃𝒚.`));
        }
        const interest = bankData[userID].bank * 0.05; // 5% Interest Baby
        bankData[userID].bank += interest;
        bankData[userID].lastInterest = now;
        saveBank();
        return reply(`💸 ${fancy("𝑰𝒏𝒕𝒆𝒓𝒆𝒔𝒕 𝑬𝒂𝒓𝒏𝒆𝒅:")} ${formatMoney(interest)}`);

      case "transfer":
        let recipientID = event.messageReply ? event.messageReply.senderID : (event.mentions ? Object.keys(event.mentions)[0] : args[2]);
        if (!recipientID || isNaN(amount) || amount <= 0) return reply(fancy("❌ 𝑼𝒔𝒂𝒈𝒆: 𝒃𝒂𝒏𝒌 𝒕𝒓𝒂𝒏𝒔𝒇𝒆𝒓 <𝒂𝒎𝒐𝒖𝒏𝒕> @𝒕𝒂𝒈 𝒃𝒂𝒃𝒚."));
        if (recipientID === userID) return reply(fancy("❌ 𝒀𝒐𝒖 𝒄𝒂𝒏'𝒕 𝒔𝒆𝒏𝒅 𝒎𝒐𝒏𝒆𝒚 𝒕𝒐 𝒚𝒐𝒖𝒓𝒔𝒆𝒍𝒇 𝒃𝒂𝒃𝒚."));
        if (bankData[userID].bank < amount) return reply(fancy("❌ 𝑵𝒐𝒕 𝒆𝒏𝒐𝒖𝒈𝒉 𝒃𝒂𝒏𝒌 𝒃𝒂𝒍𝒂𝒏𝒄𝒆 𝒃𝒂𝒃𝒚."));

        await initUser(recipientID);
        bankData[userID].bank -= amount;
        bankData[recipientID].bank += amount;
        saveBank();
        return reply(`✅ ${fancy("𝑻𝒓𝒂𝒏𝒔𝒇𝒆𝒓𝒓𝒆𝒅:")} ${formatMoney(amount)}\n👤 ${fancy("𝑻𝒐:")} ${fancy(await usersData.getName(recipientID))}`);

      case "richlist":
        const sorted = Object.entries(bankData).sort(([,a],[,b]) => b.bank - a.bank).slice(0, 10);
        let leaderboard = `🏆 ${fancy("𝑻𝒐𝒑 𝟏𝟎 𝑩𝒂𝒏𝒌 𝑳𝒐𝒓𝒅𝒔 𝑩𝒂𝒃𝒚")} 🏆\n━━━━━━━━━━━━━━━\n`;
        for (let i = 0; i < sorted.length; i++) {
          const [id, data] = sorted[i];
          leaderboard += `${i+1}. ${fancy(await usersData.getName(id))} — ${formatMoney(data.bank)}\n`;
        }
        return reply(leaderboard);

      default:
        return reply(fancy("❌ 𝑪𝒐𝒎𝒎𝒂𝒏𝒅𝒔: 𝒅𝒆𝒑𝒐𝒔𝒊𝒕, 𝒘𝒊𝒕𝒉𝒅𝒓𝒂𝒘, 𝒃𝒂𝒍𝒂𝒏𝒄𝒆, 𝒊𝒏𝒕𝒆𝒓𝒆𝒔𝒕, 𝒕𝒓𝒂𝒏𝒔𝒇𝒆𝒓, 𝒓𝒊𝒄𝒉𝒍𝒊𝒔𝒕 𝒃𝒂𝒃𝒚."));
    }
  }
};
