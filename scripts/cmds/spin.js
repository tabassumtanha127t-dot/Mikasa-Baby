const axios = require("axios");

// 💰 Standard Shorthand Parser Baby (Up to Centillion)
const parseShorthand = (str) => {
  if (!str) return NaN;
  str = str.toLowerCase().replace(/\s+/g, "");
  const map = { 
    k: 1e3, m: 1e6, b: 1e9, t: 1e12, q: 1e15, qd: 1e18, qi: 1e21, sx: 1e24, 
    sp: 1e27, oc: 1e30, no: 1e33, dc: 1e36, udc: 1e39, ddc: 1e42, tdc: 1e45, ct: 1e303 
  };
  let suffix = Object.keys(map).sort((a,b) => b.length - a.length).find(s => str.endsWith(s));
  let multiplier = suffix ? map[suffix] : 1;
  if(suffix) str = str.slice(0, -suffix.length);
  const number = parseFloat(str);
  return isNaN(number) ? NaN : number * multiplier;
};

// ✨ Fancy Font Baby - Bold Sans-Serif Style
function fancy(text) {
    const map = {
        'a': '𝐚','b': '𝐛','c': '𝐜','d': '𝐝','e': '𝐞','f': '𝐟','g': '𝐠','h': '𝐡','i': '𝐢','j': '𝐣','k': '𝐤','l': '𝐥','m': '𝐦','n': '𝐧','o': '𝐨','p': '𝐩','q': '𝐪','r': '𝐫','s': '𝐬','t': '𝐭','u': '𝐮','v': '𝐯','w': '𝐰','x': '𝐱','y': '𝐲','z': '𝐳',
        'A': '𝐀','B': '𝐁','C': '𝐂','D': '𝐃','E': '𝐄','F': '𝐅','G': '𝐆','H': '𝐇','I': '𝐈','J': '𝐉','K': '𝐊','L': '𝐋','M': '𝐌','N': '𝐍','O': '𝐎','P': '𝐏','Q': '𝐐','R': '𝐑','S': '𝐒','T': '𝐓','U': '𝐔','V': '𝐕','W': '𝐖','X': '𝐗','Y': '𝐘','Z': '𝐙',
        '0': '𝟎','1': '𝟏','2': '𝟐','3': '𝟑','4': '𝟒','5': '𝟓','6': '𝟔','7': '𝟕','8': '𝟖','9': '𝟗', '.': '.'
    };
    return text.toString().split('').map(char => map[char] || char).join('');
}

// 🏦 Standard Shorthand Formatter Baby
function formatMoney(num) {
  const units = [
    { v: 1e303, s: "𝐂𝐭" }, { v: 1e45, s: "𝐓𝐝𝐜" }, { v: 1e42, s: "𝐃𝐝𝐜" }, { v: 1e39, s: "𝐔𝐝𝐜" },
    { v: 1e36, s: "𝐃𝐜" }, { v: 1e33, s: "𝐍𝐨" }, { v: 1e30, s: "𝐎𝐜" }, { v: 1e27, s: "𝐒𝐩" },
    { v: 1e24, s: "𝐒𝐱" }, { v: 1e21, s: "𝐐𝐢" }, { v: 1e18, s: "𝐐𝐝" }, { v: 1e15, s: "𝐐" },
    { v: 1e12, s: "𝐓" }, { v: 1e9, s: "𝐁" }, { v: 1e6, s: "𝐌" }, { v: 1e3, s: "𝐊" }
  ];
  for (const u of units) {
    if (Math.abs(num) >= u.v) return fancy((num / u.v).toFixed(2)) + u.s;
  }
  return fancy(Math.floor(num).toLocaleString());
}

module.exports = {
  config: {
    name: "spin",
    version: "10.0",
    author: "SAIF",
    category: "game",
    countDown: 10 // ✅ এখন এটিই কাজ করবে Baby!
  },

  onStart: async function ({ api, event, args, usersData, role }) {
    const { senderID, threadID, messageID, mentions, messageReply } = event;
    const today = new Date().toISOString().split('T')[0];

    // 🔄 Admin Refresh Logic Baby
    if (args[0] === "refresh" && role >= 2) {
      let targetID = messageReply ? messageReply.senderID : (Object.keys(mentions).length > 0 ? Object.keys(mentions)[0] : args[1]);
      if (!targetID) return api.sendMessage(fancy("❌ 𝐔𝐬𝐚𝐠𝐞: 𝐬𝐩𝐢𝐧 𝐫𝐞𝐟𝐫𝐞𝐬𝐡 @𝐭𝐚𝐠 𝐨𝐫 𝐔𝐈𝐃 𝐛𝐚𝐛𝐲"), threadID, messageID);
      
      let tData = await usersData.get(targetID);
      if (!tData.data) tData.data = {};
      tData.data.spinLimit = { lastUpdate: today, count: 0 };
      await usersData.set(targetID, { data: tData.data });
      return api.sendMessage(fancy("✅ 𝐒𝐏𝐈𝐍 𝐋𝐈𝐌𝐈𝐓 𝐑𝐄𝐅𝐑𝐄𝐒𝐇𝐄𝐃 𝐁𝐀𝐁𝐘! 🎀"), threadID, messageID);
    }

    // MongoDB Data Sync Baby
    let user = await usersData.get(senderID);
    if (!user.data) user.data = {};
    if (!user.data.spinLimit || user.data.spinLimit.lastUpdate !== today) {
      user.data.spinLimit = { lastUpdate: today, count: 0 };
    }

    if (user.data.spinLimit.count >= 20) {
      return api.sendMessage(fancy("⚠️ 𝐘𝐨𝐮 𝐡𝐚𝐯𝐞 𝐫𝐞𝐚𝐜𝐡𝐞𝐝 𝐲𝐨𝐮𝐫 𝐝𝐚𝐢𝐥𝐲 𝐥𝐢𝐦𝐢𝐭 𝐨𝐟 𝟐𝟎 𝐬𝐩𝐢𝐧𝐬 𝐛𝐚𝐛𝐲!"), threadID, messageID);
    }

    const betAmount = parseShorthand(args[0]);
    if (isNaN(betAmount) || betAmount <= 0) return api.sendMessage(fancy("⚠️ 𝐄𝐍𝐓𝐄𝐑 𝐀 𝐕𝐀𝐋𝐈𝐃 𝐁𝐄𝐓 𝐀𝐌𝐎𝐔𝐍𝐓 𝐁𝐀𝐁𝐘."), threadID, messageID);
    if (betAmount > user.money) return api.sendMessage(fancy("💰 𝐍𝐎𝐓 𝐄𝐍𝐎𝐔𝐆𝐇 𝐁𝐀𝐋𝐀𝐍𝐂𝐄 𝐁𝐀𝐁𝐘."), threadID, messageID);

    const slots = ["❤️", "💛", "💙", "💚", "💎", "👑"];
    const winChance = Math.random();
    let s1, s2, s3;

    // 🎯 50/50 Win Rate - Changed from 0.48 to 0.50
    if (winChance < 0.50) { 
      const winType = Math.random();
      // Reduced jackpot chances to balance payouts
      if (winType < 0.01) s1 = s2 = s3 = "👑"; // Reduced from 0.02
      else if (winType < 0.05) s1 = s2 = s3 = "💎"; // Reduced from 0.08
      else {
        s1 = slots[Math.floor(Math.random() * (slots.length - 2))]; 
        s2 = s1;
        s3 = Math.random() < 0.4 ? s1 : slots[Math.floor(Math.random() * slots.length)];
      }
    } else {
      s1 = slots[Math.floor(Math.random() * slots.length)];
      s2 = slots.filter(s => s !== s1)[Math.floor(Math.random() * (slots.length - 1))];
      s3 = slots[Math.floor(Math.random() * slots.length)];
    }

    function calculateWinnings(a, b, c, bet) {
      // 💰 REDUCED WINNINGS - More balanced payouts
      if (a === "👑" && b === "👑" && c === "👑") return bet * 100; // Reduced from 500x
      if (a === "💎" && b === "💎" && c === "💎") return bet * 25;  // Reduced from 100x
      if (a === b && b === c) return bet * 5;  // Reduced from 15x
      if (a === b || a === c || b === c) return bet * 1.5; // Reduced from 2x
      return -bet;
    }

    const winnings = calculateWinnings(s1, s2, s3, betAmount);
    user.data.spinLimit.count += 1;
    const newBalance = user.money + winnings;

    await usersData.set(senderID, { money: newBalance, data: user.data });

    let winStatus = winnings > 0 ? fancy("𝐖𝐨𝐧") : fancy("𝐋𝐨𝐬𝐭");
    if (s1 === "👑" && s2 === "👑" && s3 === "👑") winStatus = fancy("🔥 𝐁𝐈𝐆𝐆𝐄𝐒𝐓 𝐖𝐎𝐍 🔥");

    const resultMsg = `🎀
• ${fancy("𝐁𝐚𝐛𝐲, 𝐘𝐨𝐮")} ${winStatus} ${formatMoney(Math.abs(winnings))}!
• ${fancy("𝐆𝐚𝐦𝐞 𝐑𝐞𝐬𝐮𝐥𝐭𝐬:")} [ ${s1} | ${s2} | ${s3} ]
• ${fancy("𝐁𝐚𝐥𝐚𝐧𝐜𝐞:")} ${formatMoney(newBalance)}
• ${fancy("𝐃𝐚𝐢𝐥𝐲 𝐔𝐬𝐞:")} ${fancy(user.data.spinLimit.count)}/𝟐𝟎 ${fancy("𝐁𝐚𝐛𝐲")}`;

    return api.sendMessage(resultMsg, threadID, messageID);
  }
};