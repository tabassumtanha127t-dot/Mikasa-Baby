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
    { v: 1e63, s: "𝐕𝐠" }, { v: 1e60, s: "𝐍𝐨𝐝" }, { v: 1e57, s: "𝐎𝐜𝐝" },
    { v: 1e54, s: "𝐒𝐩𝐝" }, { v: 1e51, s: "𝐒𝐱𝐝" }, { v: 1e48, s: "𝐐𝐢𝐝" },
    { v: 1e45, s: "𝐐𝐚𝐝" }, { v: 1e42, s: "𝐓𝐝" }, { v: 1e39, s: "𝐃𝐝" },
    { v: 1e36, s: "𝐔𝐝" }, { v: 1e33, s: "𝐃𝐜" }, { v: 1e30, s: "𝐍𝐨" },
    { v: 1e27, s: "𝐎𝐜" }, { v: 1e24, s: "𝐒𝐩" }, { v: 1e21, s: "𝐒𝐱" },
    { v: 1e18, s: "𝐐𝐢" }, { v: 1e15, s: "𝐐𝐚" }, { v: 1e12, s: "𝐓" },
    { v: 1e9, s: "𝐁" }, { v: 1e6, s: "𝐌" }, { v: 1e3, s: "𝐊" }
  ];
  for (let u of units) {
    if (Math.abs(amount) >= u.v) return fancy((amount / u.v).toFixed(2)) + u.s;
  }
  return fancy(Math.floor(amount).toLocaleString());
}

module.exports = {
  config: {
    name: "slot",
    version: "13.0",
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

    // 📖 First Time Player — Show Rules Baby
    let user = await usersData.get(senderID);
    if (!user.data) user.data = {};

    if (!user.data.slotSeen) {
      user.data.slotSeen = true;
      await usersData.set(senderID, { data: user.data });

      const rulesMsg =
        `🎀 𝐒𝐋𝐎𝐓 𝐌𝐀𝐂𝐇𝐈𝐍𝐄 — 𝐑𝐔𝐋𝐄𝐒 𝐁𝐀𝐁𝐘\n` +
        `━━━━━━━━━━━━━━━━━━━\n\n` +
        fancy(`📌 How To Play:\n`) +
        fancy(`Type: slot [amount]\n`) +
        fancy(`Example: slot 5m\n\n`) +
        fancy(`🎰 Slot Symbols & Payouts:\n`) +
        `• 🪙🪙🪙 → ×𝟐𝟎𝟎 ${fancy("(Mega Jackpot)")}\n` +
        `• 👑👑👑 → ×𝟓𝟎 ${fancy("(Royal Win)")}\n` +
        `• 💎💎💎 → ×𝟐𝟓\n` +
        `• ${fancy("Any Triple")} → ×𝟓\n` +
        `• ${fancy("Any Double")} → ×𝟐\n` +
        `• ${fancy("No Match")} → ${fancy("Lose Bet")}\n\n` +
        fancy(`⏰ Daily Limit:\n`) +
        fancy(`20 spins per 12 hours Baby.\n\n`) +
        `⚠️ ${fancy("BET WARNING:")}\n` +
        fancy(`If you bet more than $10M,\nyou will ALWAYS LOSE as penalty!\n`) +
        fancy(`Keep your bet under $10M Baby.\n\n`) +
        `✅ ${fancy("Rules seen! Now type")} ${fancy("slot [amount]")} ${fancy("to play Baby.")}`;

      return api.sendMessage(rulesMsg, threadID, messageID);
    }

    // 🕐 12 Hours Reset System Baby
    const TWELVE_HOURS = 12 * 60 * 60 * 1000;

    if (!user.data.slotLimit || !user.data.slotLimit.lastReset) {
      user.data.slotLimit = { lastReset: now, count: 0 };
    } else {
      if (now - user.data.slotLimit.lastReset >= TWELVE_HOURS) {
        user.data.slotLimit = { lastReset: now, count: 0 };
      }
    }

    if (user.data.slotLimit.count >= 20) {
      const timeLeft = TWELVE_HOURS - (now - user.data.slotLimit.lastReset);
      const hoursLeft = Math.floor(timeLeft / (60 * 60 * 1000));
      const minutesLeft = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
      return api.sendMessage(
        fancy(`⚠️ You have reached your limit of 20 spins!\n⏰ Reset in: ${hoursLeft}h ${minutesLeft}m`),
        threadID, messageID
      );
    }

    const betAmount = parseAmount(args[0]);
    if (isNaN(betAmount) || betAmount <= 0) return api.sendMessage(fancy("⚠️ ENTER A VALID BET AMOUNT BABY."), threadID, messageID);
    if (betAmount > user.money) return api.sendMessage(fancy("💰 NOT ENOUGH BALANCE BABY."), threadID, messageID);

    // ⚠️ Bet Cap Penalty — Over 10M = Always Lose Baby
    const BET_CAP = 10_000_000;
    if (betAmount > BET_CAP) {
      user.money = (user.money || 0) - betAmount;
      user.data.slotLimit.count += 1;
      await usersData.set(senderID, { money: user.money, data: user.data });

      const penaltyMsg =
        `🎀\n > ${user.name}\n\n` +
        `⚠️ ${fancy("PENALTY!")}\n` +
        `• ${fancy("Bet over $10M → Auto Lose Baby!")}\n` +
        `• ${fancy("Lost:")} ${formatMoney(betAmount)}\n` +
        `• ${fancy("Balance:")} ${formatMoney(user.money)}\n` +
        `• ${fancy("Daily Use:")} ${fancy(String(user.data.slotLimit.count))}/𝟐𝟎 𝐁𝐚𝐛𝐲\n\n` +
        fancy("⚠️ Keep bet under $10M to play fairly!");

      return api.sendMessage(
        { body: penaltyMsg, mentions: [{ tag: user.name, id: senderID }] },
        threadID, messageID
      );
    }

    // 🎯 Slot Logic — 50/50 Win Rate Baby
    const slots = ["❤️","💛","💚","💙","💎","👑","🪙"];
    const winChance = Math.random();
    let s1, s2, s3;

    if (winChance < 0.50) {
      const winType = Math.random();
      if (winType < 0.005) {
        s1 = s2 = s3 = "🪙";
      } else if (winType < 0.015) {
        s1 = s2 = s3 = "👑";
      } else if (winType < 0.04) {
        s1 = s2 = s3 = "💎";
      } else if (winType < 0.15) {
        const symbol = slots[Math.floor(Math.random() * (slots.length - 3))];
        s1 = s2 = s3 = symbol;
      } else {
        const symbol = slots[Math.floor(Math.random() * slots.length)];
        const position = Math.floor(Math.random() * 3);
        s1 = symbol; s2 = symbol; s3 = slots[Math.floor(Math.random() * slots.length)];
        if (position === 0) { s1 = slots[Math.floor(Math.random() * slots.length)]; s2 = symbol; s3 = symbol; }
        else if (position === 1) { s1 = symbol; s2 = slots[Math.floor(Math.random() * slots.length)]; s3 = symbol; }
      }
    } else {
      s1 = slots[Math.floor(Math.random() * slots.length)];
      s2 = slots[Math.floor(Math.random() * slots.length)];
      s3 = slots[Math.floor(Math.random() * slots.length)];
      while (s1 === s2 || s2 === s3 || s1 === s3) {
        s1 = slots[Math.floor(Math.random() * slots.length)];
        s2 = slots[Math.floor(Math.random() * slots.length)];
        s3 = slots[Math.floor(Math.random() * slots.length)];
      }
    }

    function calculateWinnings(a, b, c, bet) {
      if (a === "🪙" && b === "🪙" && c === "🪙") return bet * 200;
      if (a === "👑" && b === "👑" && c === "👑") return bet * 50;
      if (a === "💎" && b === "💎" && c === "💎") return bet * 25;
      if (a === b && b === c) return bet * 5;
      if (a === b || a === c || b === c) return bet * 2;
      return -bet;
    }

    const winnings = calculateWinnings(s1, s2, s3, betAmount);
    user.data.slotLimit.count += 1;
    const newBalance = user.money + winnings;
    await usersData.set(senderID, { money: newBalance, data: user.data });

    let winStatus = winnings > 0 ? fancy("Won") : fancy("Lost");
    if (s1 === "🪙" && s2 === "🪙" && s3 === "🪙") winStatus = fancy("🔥 MEGA JACKPOT 🔥");
    else if (s1 === "👑" && s2 === "👑" && s3 === "👑") winStatus = fancy("👑 ROYAL WIN 👑");

    const resultMsg =
      `🎀\n > ${fancy(user.name)}\n\n` +
      `• ${fancy("Baby, You")} ${winStatus} ${formatMoney(Math.abs(winnings))}!\n` +
      `• ${fancy("Game Results:")} [ ${s1} | ${s2} | ${s3} ]\n` +
      `• ${fancy("Balance:")} ${formatMoney(newBalance)}\n` +
      `• ${fancy("Daily Use:")} ${fancy(String(user.data.slotLimit.count))}/𝟐𝟎 𝐁𝐚𝐛𝐲`;

    return api.sendMessage(
      { body: resultMsg, mentions: [{ tag: user.name, id: senderID }] },
      threadID, messageID
    );
  }
};
