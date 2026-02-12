const fs = require("fs-extra");
const path = require("path");

// Fancy Font Helper Baby - Bold Sans-Serif Style
const fancy = (text) => {
  const fonts = {
    'a': '𝐚','b': '𝐛','c': '𝐜','d': '𝐝','e': '𝐞','f': '𝐟','g': '𝐠','h': '𝐡','i': '𝐢','j': '𝐣','k': '𝐤','l': '𝐥','m': '𝐦','n': '𝐧','o': '𝐨','p': '𝐩','q': '𝐪','r': '𝐫','s': '𝐬','t': '𝐭','u': '𝐮','v': '𝐯','w': '𝐰','x': '𝐱','y': '𝐲','z': '𝐳',
    'A': '𝐀','B': '𝐁','C': '𝐂','D': '𝐃','E': '𝐄','F': '𝐅','G': '𝐆','H': '𝐇','I': '𝐈','J': '𝐉','K': '𝐊','L': '𝐋','M': '𝐌','N': '𝐍','O': '𝐎','P': '𝐏','Q': '𝐐','R': '𝐑','S': '𝐒','T': '𝐓','U': '𝐔','V': '𝐕','W': '𝐖','X': '𝐗','Y': '𝐘','Z': '𝐙',
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
    { v: 1e303, s: "𝐂𝐭" }, { v: 1e45, s: "𝐓𝐝𝐜" }, { v: 1e42, s: "𝐃𝐝𝐜" }, { v: 1e39, s: "𝐔𝐝𝐜" },
    { v: 1e36, s: "𝐃𝐜" }, { v: 1e33, s: "𝐍𝐨" }, { v: 1e30, s: "𝐎𝐜" }, { v: 1e27, s: "𝐒𝐩" },
    { v: 1e24, s: "𝐒𝐱" }, { v: 1e21, s: "𝐐𝐢" }, { v: 1e18, s: "𝐐𝐝" }, { v: 1e15, s: "𝐐" },
    { v: 1e12, s: "𝐓" }, { v: 1e9, s: "𝐁" }, { v: 1e6, s: "𝐌" }, { v: 1e3, s: "𝐊" }
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
    description: "🎡 𝐔𝐋𝐓𝐑𝐀-𝐖𝐇𝐄𝐄𝐋 𝐏𝐑𝐄𝐌𝐈𝐔𝐌 𝐁𝐀𝐁𝐘"
  },

  onStart: async function ({ api, event, args, usersData, role }) {
    const { senderID, threadID, messageID, mentions, messageReply } = event;
    const today = new Date().toISOString().split('T')[0];

    if (args[0] === "refresh" && role >= 2) {
      let targetID = messageReply ? messageReply.senderID : (Object.keys(mentions).length > 0 ? Object.keys(mentions)[0] : args[1]);
      if (!targetID) return api.sendMessage(fancy("❌ 𝐔𝐬𝐚𝐠𝐞: 𝐰𝐡𝐞𝐞𝐥 𝐫𝐞𝐟𝐫𝐞𝐬𝐡 @𝐭𝐚𝐠 𝐛𝐚𝐛𝐲"), threadID, messageID);
      let tData = await usersData.get(targetID);
      if (!tData.data) tData.data = {};
      tData.data.gameLimit = { lastUpdate: today, wheel: 0 };
      await usersData.set(targetID, { data: tData.data });
      return api.sendMessage(fancy("✅ 𝐋𝐈𝐌𝐈𝐓 𝐑𝐄𝐅𝐑𝐄𝐒𝐇𝐄𝐃 𝐁𝐀𝐁𝐘! 🎀"), threadID, messageID);
    }

    let user = await usersData.get(senderID);
    if (!user.data) user.data = {};
    if (!user.data.gameLimit || user.data.gameLimit.lastUpdate !== today) {
      user.data.gameLimit = { lastUpdate: today, wheel: 0 };
    }

    if (user.data.gameLimit.wheel >= 20) {
      return api.sendMessage(fancy("🚫 𝐃𝐀𝐈𝐋𝐘 𝐋𝐈𝐌𝐈𝐓 (𝟐𝟎/𝟐𝟎) 𝐑𝐄𝐀𝐂𝐇𝐄𝐃 𝐁𝐀𝐁𝐘!"), threadID, messageID);
    }

    let betAmount = parseAmount(args[0]);
    if (isNaN(betAmount) || betAmount <= 0) return api.sendMessage(fancy("❌ 𝐈𝐧𝐯𝐚𝐥𝐢𝐝 𝐛𝐞𝐭 𝐚𝐦𝐨𝐮𝐧𝐭 𝐛𝐚𝐛𝐲!"), threadID, messageID);
    if (user.money < betAmount) return api.sendMessage(fancy("💰 𝐈𝐧𝐬𝐮𝐟𝐟𝐢𝐜𝐢𝐞𝐧𝐭 𝐛𝐚𝐥𝐚𝐧𝐜𝐞!"), threadID, messageID);

    const loadingMsg = await api.sendMessage(fancy("🎰 𝐒𝐩𝐢𝐧𝐧𝐢𝐧𝐠... 𝐛𝐚𝐛𝐲 🎀"), threadID, messageID);
    
    // 🎯 50/50 Win Rate Implementation Baby!
    const winChance = Math.random();
    let res;
    
    if (winChance < 0.50) {
      // WIN SCENARIOS (50% chance)
      const winType = Math.random();
      
      if (winType < 0.05) {
        // 5% chance of TRIPLE match (within wins)
        const symbol = wheelEmojis[Math.floor(Math.random() * wheelEmojis.length)];
        res = [symbol, symbol, symbol];
      } else {
        // 45% chance of DOUBLE match (within wins)
        const symbol = wheelEmojis[Math.floor(Math.random() * wheelEmojis.length)];
        const position = Math.floor(Math.random() * 3);
        res = [symbol, symbol, wheelEmojis[Math.floor(Math.random() * wheelEmojis.length)]];
        // Shuffle to randomize which position doesn't match
        if (position === 0) res = [wheelEmojis[Math.floor(Math.random() * wheelEmojis.length)], symbol, symbol];
        else if (position === 1) res = [symbol, wheelEmojis[Math.floor(Math.random() * wheelEmojis.length)], symbol];
      }
    } else {
      // LOSS SCENARIOS (50% chance) - No matches
      res = [
        wheelEmojis[Math.floor(Math.random() * wheelEmojis.length)],
        wheelEmojis[Math.floor(Math.random() * wheelEmojis.length)],
        wheelEmojis[Math.floor(Math.random() * wheelEmojis.length)]
      ];
      // Make sure they're all different
      while (res[0] === res[1] || res[1] === res[2] || res[0] === res[2]) {
        res = [
          wheelEmojis[Math.floor(Math.random() * wheelEmojis.length)],
          wheelEmojis[Math.floor(Math.random() * wheelEmojis.length)],
          wheelEmojis[Math.floor(Math.random() * wheelEmojis.length)]
        ];
      }
    }
    
    // 💰 REDUCED WINNINGS - More balanced payouts
    let multiplier = 0;
    if (res[0] === res[1] && res[1] === res[2]) multiplier = 5;    // Reduced from 10x
    else if (res[0] === res[1] || res[1] === res[2] || res[0] === res[2]) multiplier = 1.5;  // Reduced from 2x
    else multiplier = 0;  // Changed from 0.5 to 0 (pure loss)

    const winAmount = Math.floor(betAmount * multiplier);
    const profit = winAmount - betAmount;
    user.data.gameLimit.wheel += 1;

    await usersData.set(senderID, { money: user.money + profit, data: user.data });

    const status = profit >= 0 ? fancy(`𝐁𝐚𝐛𝐲, 𝐘𝐨𝐮 𝐖𝐨𝐧 `) + formatMoney(Math.abs(profit)) + "!" : fancy(`𝐁𝐚𝐛𝐲, 𝐘𝐨𝐮 𝐋𝐨𝐬𝐭 `) + formatMoney(Math.abs(profit)) + "!";
    
    const resultMsg = `
🎀
• ${status}
• ${fancy("𝐆𝐚𝐦𝐞 𝐑𝐞𝐬𝐮𝐥𝐭𝐬:")} [ ${res[0]} | ${res[1]} | ${res[2]} ]
• ${fancy("𝐁𝐚𝐥𝐚𝐧𝐜𝐞:")} ${formatMoney(user.money + profit)}
• ${fancy("𝐃𝐚𝐢𝐥𝐲 𝐔𝐬𝐞:")} ${fancy(user.data.gameLimit.wheel.toString())}/𝟐𝟎
    `.trim();

    return api.editMessage(resultMsg, loadingMsg.messageID);
  }
};