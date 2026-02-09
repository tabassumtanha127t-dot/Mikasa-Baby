const axios = require("axios");

// 💰 Standard Shorthand Parser Baby (Matches Balance File)
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

// ✨ Bold Sans-Serif Font Baby
function fancy(text) {
    const map = {
        'a': '𝐚','b': '𝐛','c': '𝐜','d': '𝐝','e': '𝐞','f': '𝐟','g': '𝐠','h': '𝐡','i': '𝐢','j': '𝐣','k': '𝐤','l': '𝐥','m': '𝐦','n': '𝐧','o': '𝐨','p': '𝐩','q': '𝐪','r': '𝐫','s': '𝐬','t': '𝐭','u': '𝐮','v': '𝐯','w': '𝐰','x': '𝐱','y': '𝐲','z': '𝐳',
        'A': '𝐀','B': '𝐁','C': '𝐂','D': '𝐃','E': '𝐄','F': '𝐅','G': '𝐆','H': '𝐇','I': '𝐈','J': '𝐉','K': '𝐊','L': '𝐋','M': '𝐌','N': '𝐍','O': '𝐎','P': '𝐏','Q': '𝐐','R': '𝐑','S': '𝐒','T': '𝐓','U': '𝐔','V': '𝐕','W': '𝐖','X': '𝐗','Y': '𝐘','Z': '𝐙',
        '0': '𝟎','1': '𝟏','2': '𝟐','3': '𝟑','4': '𝟒','5': '𝟓','6': '𝟔','7': '𝟕','8': '𝟖','9': '𝟗', '.': '.', ':': ':', '/': '/'
    };
    return text.toString().split('').map(char => map[char] || char).join('');
}

// 🏦 Standard Shorthand Formatter Baby (Matches Balance File)
function formatMoney(amount) {
  if (amount === Infinity) return fancy("Infinity");
  const units = [
    { v: 1e303, s: "𝐂𝐭" }, { v: 1e93, s: "𝐍𝐭𝐠" }, { v: 1e66, s: "𝐕𝐠" },
    { v: 1e36, s: "𝐃𝐜" }, { v: 1e21, s: "𝐐𝐢" }, { v: 1e12, s: "𝐓" },
    { v: 1e9,  s: "𝐁" }, { v: 1e6,  s: "𝐌" }, { v: 1e3,  s: "𝐊" }
  ];
  for (let u of units) {
    if (Math.abs(amount) >= u.v) return fancy((amount / u.v).toFixed(2)) + u.s;
  }
  return fancy(Math.floor(amount).toLocaleString());
}

module.exports = {
  config: {
    name: "slot",
    version: "12.0",
    author: "SAIF",
    category: "game",
    countDown: 10 
  },

  onStart: async function ({ api, event, args, usersData, role }) {
    const { senderID, threadID, messageID, mentions, messageReply } = event;
    const today = new Date().toISOString().split('T')[0];

    // 🔄 Admin Refresh Logic Baby
    if (args[0] === "refresh" && role >= 2) {
      let targetID = messageReply ? messageReply.senderID : (Object.keys(mentions).length > 0 ? Object.keys(mentions)[0] : args[1]);
      if (!targetID) return api.sendMessage(fancy("❌ Usage: slot refresh @tag or UID Baby"), threadID, messageID);
      
      let tData = await usersData.get(targetID);
      if (!tData.data) tData.data = {};
      tData.data.slotLimit = { lastUpdate: today, count: 0 };
      await usersData.set(targetID, { data: tData.data });
      return api.sendMessage(fancy("✅ SLOT LIMIT REFRESHED BABY! 🎀"), threadID, messageID);
    }

    let user = await usersData.get(senderID);
    if (!user.data) user.data = {};
    if (!user.data.slotLimit || user.data.slotLimit.lastUpdate !== today) {
      user.data.slotLimit = { lastUpdate: today, count: 0 };
    }

    if (user.data.slotLimit.count >= 20) {
      return api.sendMessage(fancy("⚠️ You have reached your daily limit of 20 spins Baby!"), threadID, messageID);
    }

    const betAmount = parseAmount(args[0]);
    if (isNaN(betAmount) || betAmount <= 0) return api.sendMessage(fancy("⚠️ ENTER A VALID BET AMOUNT BABY."), threadID, messageID);
    if (betAmount > user.money) return api.sendMessage(fancy("💰 NOT ENOUGH BALANCE BABY."), threadID, messageID);

    const slots = ["❤️","💛","💚","💙","💎","👑","🪙"];
    let s1 = slots[Math.floor(Math.random() * slots.length)];
    let s2 = slots[Math.floor(Math.random() * slots.length)];
    let s3 = slots[Math.floor(Math.random() * slots.length)];

    function calculateWinnings(a, b, c, bet) {
      if (a === "🪙" && b === "🪙" && c === "🪙") return bet * 500;
      if (a === "👑" && b === "👑" && c === "👑") return bet * 100;
      if (a === "💎" && b === "💎" && c === "💎") return bet * 50;
      if (a === b && b === c) return bet * 15;
      if (a === b || a === c || b === c) return bet * 2;
      return -bet;
    }

    const winnings = calculateWinnings(s1, s2, s3, betAmount);
    user.data.slotLimit.count += 1;
    const newBalance = user.money + winnings;

    await usersData.set(senderID, { money: newBalance, data: user.data });

    let winStatus = winnings > 0 ? fancy("Won") : fancy("Lost");
    if (s1 === "🪙" && s2 === "🪙" && s3 === "🪙") winStatus = fancy("🔥 BIGGEST WON 🔥");

    const resultMsg = `🎀\n > ${fancy(user.name)}\n\n• ${fancy("Baby, You")} ${winStatus} ${formatMoney(Math.abs(winnings))}!\n• ${fancy("Game Results:")} [ ${s1} | ${s2} | ${s3} ]\n• ${fancy("Balance:")} ${formatMoney(newBalance)}\n• ${fancy("Daily Use:")} ${fancy(user.data.slotLimit.count)}/𝟐𝟎 𝐁𝐚𝐛𝐲`;

    return api.sendMessage({ body: resultMsg, mentions: [{ tag: user.name, id: senderID }] }, threadID, messageID);
  }
};
