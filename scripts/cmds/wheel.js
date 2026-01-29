const fs = require("fs-extra");
const path = require("path");

// Fancy Font Helper Baby
const fancy = (text) => {
  const fonts = {
    'a': '𝒂','b': '𝒃','c': '𝒄','d': '𝒅','e': '𝒆','f': '𝒇','g': '𝒈','h': '𝒉','i': '𝒊','j': '𝒋','k': '𝒌','l': '𝒍','m': '𝒎','n': '𝒏','o': '𝒐','p': '𝒑','q': '𝗊','r': '𝒓','s': '𝒔','t': '𝒕','u': '𝒖','v': '𝒗','w': '𝒘','x': '𝒙','y': '𝒚','z': '𝒛',
    'A': '𝑨','B': '𝑩','C': '𝑪','D': '𝑫','E': '𝑬','F': '𝑭','G': '𝑮','H': '𝑯','I': '𝑰','J': '𝑱','K': '𝑲','L': '𝑳','M': '𝑴','N': '𝑵','O': '𝑶','P': '𝑷','Q': '𝑸','R': '𝑹','S': '𝑺','T': '𝑻','U': '𝑼','V': '𝑽','W': '𝑾','X': '𝑿','Y': '𝒀','Z': '𝒁',
    '0': '𝟎','1': '𝟏','2': '𝟐','3': '𝟑','4': '𝟒','5': '𝟓','6': '𝟔','7': '𝟕','8': '𝟖','9': '𝟗', '.': '.'
  };
  return text.toString().split('').map(char => fonts[char] || char).join('');
};

const parseAmount = (str) => {
  if (!str) return NaN;
  str = str.toLowerCase().replace(/\s+/g, "");
  const map = {
    k: 1e3, m: 1e6, b: 1e9, t: 1e12, q: 1e15, qd: 1e18, qi: 1e21, sx: 1e24, sp: 1e27, 
    oc: 1e30, no: 1e33, dc: 1e36, udc: 1e39, ddc: 1e42, tdc: 1e45, ct: 1e303
  };
  const keys = Object.keys(map).sort((a, b) => b.length - a.length);
  for (let key of keys) {
    if (str.endsWith(key)) {
      let num = parseFloat(str.slice(0, -key.length));
      return isNaN(num) ? NaN : num * map[key];
    }
  }
  return parseFloat(str);
};

function formatMoney(amount) {
  const units = [
    { v: 1e303, s: "𝑪𝒕" }, { v: 1e45, s: "𝑻𝒅𝒄" }, { v: 1e42, s: "𝑫𝒅𝒄" }, { v: 1e39, s: "𝑼𝒅𝒄" },
    { v: 1e36, s: "𝑫𝒄" }, { v: 1e33, s: "𝑵𝒐" }, { v: 1e30, s: "𝑶𝒄" }, { v: 1e27, s: "𝑺𝒑" },
    { v: 1e24, s: "𝑺𝒙" }, { v: 1e21, s: "𝑸𝒊" }, { v: 1e18, s: "𝑸𝒅" }, { v: 1e15, s: "𝑸" },
    { v: 1e12, s: "𝑻" }, { v: 1e9, s: "𝑩" }, { v: 1e6, s: "𝑴" }, { v: 1e3, s: "𝑲" }
  ];
  for (let u of units) {
    if (Math.abs(amount) >= u.v) return fancy((amount / u.v).toFixed(2)) + u.s;
  }
  return fancy(Math.floor(amount).toLocaleString());
}

const wheelEmojis = ["🍒", "🍋", "🍊", "🍇", "💎", "💰", "💜", "💙", "💚"];

module.exports = {
  config: {
    name: "wheel",
    version: "10.0",
    author: "Saif & Gemini",
    category: "game",
    countDown: 5,
    description: "🎡 𝑼𝑳𝑻𝑹𝑨-𝑾𝑯𝑬𝑬𝑳 𝑷𝑹𝑬𝑴𝑰𝑼𝑴 𝑩𝑨𝑩𝒀"
  },

  onStart: async function ({ api, event, args, usersData, role }) {
    const { senderID, threadID, messageID, mentions, messageReply } = event;
    const today = new Date().toISOString().split('T')[0];

    if (args[0] === "refresh" && role >= 2) {
      let targetID = messageReply ? messageReply.senderID : (Object.keys(mentions).length > 0 ? Object.keys(mentions)[0] : args[1]);
      if (!targetID) return api.sendMessage(fancy("❌ 𝑼𝒔𝒂𝒈𝒆: 𝒘𝒉𝒆𝒆𝒍 𝒓𝒆𝒇𝒓𝒆𝒔𝒉 @𝒕𝒂𝒈 𝒃𝒂𝒃𝒚"), threadID, messageID);
      let tData = await usersData.get(targetID);
      if (!tData.data) tData.data = {};
      tData.data.gameLimit = { lastUpdate: today, wheel: 0 };
      await usersData.set(targetID, { data: tData.data });
      return api.sendMessage(fancy("✅ 𝑳𝑰𝑴𝑰𝑻 𝑹𝑬𝑭𝑹𝑬𝑺𝑯𝑬𝑫 𝑩𝑨𝑩𝒀! 🎀"), threadID, messageID);
    }

    let user = await usersData.get(senderID);
    if (!user.data) user.data = {};
    if (!user.data.gameLimit || user.data.gameLimit.lastUpdate !== today) {
      user.data.gameLimit = { lastUpdate: today, wheel: 0 };
    }

    if (user.data.gameLimit.wheel >= 20) {
      return api.sendMessage(fancy("🚫 𝑫𝑨𝑰𝑳𝒀 𝑳𝑰𝑴𝑰𝑻 (𝟐𝟎/𝟐𝟎) 𝑹𝑬𝑨𝑪𝑯𝑬𝑫 𝑩𝑨𝑩𝒀!"), threadID, messageID);
    }

    let betAmount = parseAmount(args[0]);
    if (isNaN(betAmount) || betAmount <= 0) return api.sendMessage(fancy("❌ 𝑰𝒏𝒗𝒂𝒍𝒊𝒅 𝒃𝒆𝒕 𝒂𝒎𝒐𝒖𝒏𝒕 𝒃𝒂𝒃𝒚!"), threadID, messageID);
    if (user.money < betAmount) return api.sendMessage(fancy("💰 𝑰𝒏𝒔𝒖𝒇𝒇𝒊𝒄𝒊𝒆𝒏𝒕 𝒃𝒂𝒍𝒂𝒏𝒄𝒆!"), threadID, messageID);

    const loadingMsg = await api.sendMessage(fancy("🎰 𝑺𝒑𝒊𝒏𝒏𝒊𝒏𝒈... 𝒃𝒂𝒃𝒚 🎀"), threadID, messageID);
    
    // Random Wheel Generation Baby
    const res = [wheelEmojis[Math.floor(Math.random() * wheelEmojis.length)], wheelEmojis[Math.floor(Math.random() * wheelEmojis.length)], wheelEmojis[Math.floor(Math.random() * wheelEmojis.length)]];
    
    let multiplier = 0;
    if (res[0] === res[1] && res[1] === res[2]) multiplier = 10;
    else if (res[0] === res[1] || res[1] === res[2] || res[0] === res[2]) multiplier = 2;
    else multiplier = 0.5;

    const winAmount = Math.floor(betAmount * multiplier);
    const profit = winAmount - betAmount;
    user.data.gameLimit.wheel += 1;

    await usersData.set(senderID, { money: user.money + profit, data: user.data });

    const status = profit >= 0 ? fancy(`𝑩𝒂𝒃𝒚, 𝒀𝒐𝒖 𝑾𝒐𝒏 `) + formatMoney(Math.abs(profit)) + "!" : fancy(`𝑩𝒂𝒃𝒚, 𝒀𝒐𝒖 𝑳𝒐𝒔𝒕 `) + formatMoney(Math.abs(profit)) + "!";
    
    const resultMsg = `
🎀
• ${status}
• ${fancy("𝑮𝒂𝒎𝒆 𝑹𝒆𝒔𝒖𝒍𝒕𝒔:")} [ ${res[0]} | ${res[1]} | ${res[2]} ]
• ${fancy("𝑩𝒂𝒍𝒂𝒏𝒄𝒆:")} ${formatMoney(user.money + profit)}
• ${fancy("𝑫𝒂𝒊𝒍𝒚 𝑼𝒔𝒆:")} ${fancy(user.data.gameLimit.wheel.toString())}/𝟐𝟎
    `.trim();

    return api.editMessage(resultMsg, loadingMsg.messageID);
  }
};
