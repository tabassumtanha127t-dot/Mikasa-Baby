const axios = require("axios");

// 💰 Standard Shorthand Parser Baby (Complete Edition)
function parseAmount(str) {
  if (!str) return NaN;
  str = str.toLowerCase().replace(/\s+/g, "");
  const map = {
    vg: 1e63, nod: 1e60, ocd: 1e57, spd: 1e54, sxd: 1e51, qid: 1e48, qad: 1e45,
    td: 1e42, dd: 1e39, ud: 1e36, dc: 1e33, no: 1e30, oc: 1e27, sp: 1e24,
    sx: 1e21, qi: 1e18, qa: 1e15, t: 1e12, b: 1e9, m: 1e6, k: 1e3
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
    if (text === undefined || text === null) return "";
    const map = {
        'a': '𝐚','b': '𝐛','c': '𝐜','d': '𝐝','e': '𝐞','f': '𝐟','g': '𝐠','h': '𝐡','i': '𝐢','j': '𝐣','k': '𝐤','l': '𝐥','m': '𝐦','n': '𝐧','o': '𝐨','p': '𝐩','q': '𝐪','r': '𝐫','s': '𝐬','t': '𝐭','u': '𝐮','v': '𝐯','w': '𝐰','x': '𝐱','y': '𝐲','z': '𝐳',
        'A': '𝐀','B': '𝐁','C': '𝐂','D': '𝐃','E': '𝐄','F': '𝐅','G': '𝐆','H': '𝐇','I': '𝐈','J': '𝐉','K': '𝐊','L': '𝐋','M': '𝐌','N': '𝐍','O': '𝐎','P': '𝐏','Q': '𝐐','R': '𝐑','S': '𝐒','T': '𝐓','U': '𝐔','V': '𝐕','W': '𝐖','X': '𝐗','Y': '𝐘','Z': '𝐙',
        '0': '𝟎','1': '𝟏','2': '𝟐','3': '𝟑','4': '𝟒','5': '𝟓','6': '𝟔','7': '𝟕','8': '𝟖','9': '𝟗', '.': '.', ':': ':', '/': '/'
    };
    return String(text).split('').map(char => map[char] || char).join('');
}

// 🏦 Standard Shorthand Formatter Baby (Complete Edition)
function formatMoney(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return "0";
  if (amount === Infinity) return fancy("Infinity");
  
  const units = [
    { v: 1e63, s: "𝐕𝐠" },   // Vigintillion
    { v: 1e60, s: "𝐍𝐨𝐝" },  // Novemdecillion
    { v: 1e57, s: "𝐎𝐜𝐝" },  // Octodecillion
    { v: 1e54, s: "𝐒𝐩𝐝" },  // Septendecillion
    { v: 1e51, s: "𝐒𝐱𝐝" },  // Sexdecillion
    { v: 1e48, s: "𝐐𝐢𝐝" },  // Quindecillion
    { v: 1e45, s: "𝐐𝐚𝐝" },  // Quattuordecillion
    { v: 1e42, s: "𝐓𝐝" },   // Tredecillion
    { v: 1e39, s: "𝐃𝐝" },   // Duodecillion
    { v: 1e36, s: "𝐔𝐝" },   // Undecillion
    { v: 1e33, s: "𝐃𝐜" },   // Decillion
    { v: 1e30, s: "𝐍𝐨" },   // Nonillion
    { v: 1e27, s: "𝐎𝐜" },   // Octillion
    { v: 1e24, s: "𝐒𝐩" },   // Septillion
    { v: 1e21, s: "𝐒𝐱" },   // Sextillion
    { v: 1e18, s: "𝐐𝐢" },   // Quintillion
    { v: 1e15, s: "𝐐𝐚" },   // Quadrillion
    { v: 1e12, s: "𝐓" },    // Trillion
    { v: 1e9, s: "𝐁" },     // Billion
    { v: 1e6, s: "𝐌" },     // Million
    { v: 1e3, s: "𝐊" }      // Thousand
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
    const now = Date.now();

    // 🔄 Admin Refresh Logic Baby
    if (args[0] === "refresh" && role >= 2) {
      let targetID = messageReply ? messageReply.senderID : (Object.keys(mentions).length > 0 ? Object.keys(mentions)[0] : args[1]);
      if (!targetID) return api.sendMessage(fancy("❌ Usage: slot refresh @tag or UID Baby"), threadID, messageID);
      
      let tData = await usersData.get(targetID);
      if (!tData.data) tData.data = {};
      tData.data.slotLimit = { lastReset: now, count: 0 };
      await usersData.set(targetID, { data: tData.data });
      return api.sendMessage(fancy("✅ SLOT LIMIT REFRESHED BABY! 🎀"), threadID, messageID);
    }

    // 🕐 12 Hours Reset System Baby
    let user = await usersData.get(senderID);
    if (!user.data) user.data = {};
    
    const TWELVE_HOURS = 12 * 60 * 60 * 1000; // 12 hours in milliseconds
    
    if (!user.data.slotLimit || !user.data.slotLimit.lastReset) {
      user.data.slotLimit = { lastReset: now, count: 0 };
    } else {
      const timeSinceReset = now - user.data.slotLimit.lastReset;
      if (timeSinceReset >= TWELVE_HOURS) {
        user.data.slotLimit = { lastReset: now, count: 0 };
      }
    }

    if (user.data.slotLimit.count >= 20) {
      const timeLeft = TWELVE_HOURS - (now - user.data.slotLimit.lastReset);
      const hoursLeft = Math.floor(timeLeft / (60 * 60 * 1000));
      const minutesLeft = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
      
      return api.sendMessage(
        fancy(`⚠️ You have reached your limit of 20 spins!\n⏰ Reset in: ${hoursLeft}h ${minutesLeft}m`),
        threadID,
        messageID
      );
    }

    const betAmount = parseAmount(args[0]);
    if (isNaN(betAmount) || betAmount <= 0) return api.sendMessage(fancy("⚠️ ENTER A VALID BET AMOUNT BABY."), threadID, messageID);
    if (betAmount > user.money) return api.sendMessage(fancy("💰 NOT ENOUGH BALANCE BABY."), threadID, messageID);

    const slots = ["❤️","💛","💚","💙","💎","👑","🪙"];
    const winChance = Math.random();
    let s1, s2, s3;

    // 🎯 50/50 Win Rate Implementation
    if (winChance < 0.50) {
      // WIN SCENARIOS (50% chance)
      const winType = Math.random();
      
      if (winType < 0.005) {
        // 0.5% chance of 🪙🪙🪙 (mega jackpot)
        s1 = s2 = s3 = "🪙";
      } else if (winType < 0.015) {
        // 1% chance of 👑👑👑
        s1 = s2 = s3 = "👑";
      } else if (winType < 0.04) {
        // 2.5% chance of 💎💎💎
        s1 = s2 = s3 = "💎";
      } else if (winType < 0.15) {
        // 11% chance of any other triple match
        const symbol = slots[Math.floor(Math.random() * (slots.length - 3))]; // Exclude 🪙, 👑, 💎
        s1 = s2 = s3 = symbol;
      } else {
        // 35% chance of double match
        const symbol = slots[Math.floor(Math.random() * slots.length)];
        const position = Math.floor(Math.random() * 3);
        s1 = symbol;
        s2 = symbol;
        s3 = slots[Math.floor(Math.random() * slots.length)];
        // Shuffle to randomize which position doesn't match
        if (position === 0) {
          s1 = slots[Math.floor(Math.random() * slots.length)];
          s2 = symbol;
          s3 = symbol;
        } else if (position === 1) {
          s1 = symbol;
          s2 = slots[Math.floor(Math.random() * slots.length)];
          s3 = symbol;
        }
      }
    } else {
      // LOSS SCENARIOS (50% chance) - No matches
      s1 = slots[Math.floor(Math.random() * slots.length)];
      s2 = slots[Math.floor(Math.random() * slots.length)];
      s3 = slots[Math.floor(Math.random() * slots.length)];
      // Make sure they're all different
      while (s1 === s2 || s2 === s3 || s1 === s3) {
        s1 = slots[Math.floor(Math.random() * slots.length)];
        s2 = slots[Math.floor(Math.random() * slots.length)];
        s3 = slots[Math.floor(Math.random() * slots.length)];
      }
    }

    function calculateWinnings(a, b, c, bet) {
      // 💰 BALANCED WINNINGS
      if (a === "🪙" && b === "🪙" && c === "🪙") return bet * 200; // Reduced from 500x
      if (a === "👑" && b === "👑" && c === "👑") return bet * 50;  // Reduced from 100x
      if (a === "💎" && b === "💎" && c === "💎") return bet * 25;  // Reduced from 50x
      if (a === b && b === c) return bet * 5;   // Reduced from 15x
      if (a === b || a === c || b === c) return bet * 2; // Keep at 2x
      return -bet;
    }

    const winnings = calculateWinnings(s1, s2, s3, betAmount);
    user.data.slotLimit.count += 1;
    const newBalance = user.money + winnings;

    await usersData.set(senderID, { money: newBalance, data: user.data });

    let winStatus = winnings > 0 ? fancy("Won") : fancy("Lost");
    if (s1 === "🪙" && s2 === "🪙" && s3 === "🪙") winStatus = fancy("🔥 MEGA JACKPOT 🔥");
    else if (s1 === "👑" && s2 === "👑" && s3 === "👑") winStatus = fancy("👑 ROYAL WIN 👑");

    const resultMsg = `🎀\n > ${fancy(user.name)}\n\n• ${fancy("Baby, You")} ${winStatus} ${formatMoney(Math.abs(winnings))}!\n• ${fancy("Game Results:")} [ ${s1} | ${s2} | ${s3} ]\n• ${fancy("Balance:")} ${formatMoney(newBalance)}\n• ${fancy("Daily Use:")} ${fancy(user.data.slotLimit.count)}/𝟐𝟎 𝐁𝐚𝐛𝐲`;

    return api.sendMessage(
      { body: resultMsg, mentions: [{ tag: user.name, id: senderID }] },
      threadID,
      (err, info) => {
        if (err) return;
        
        // Auto-unsend after 1 minute (60 seconds)
        setTimeout(() => {
          api.unsendMessage(info.messageID);
        }, 60000);
      },
      messageID
    );
  }
};