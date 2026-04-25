// 💰 Standard Shorthand Parser Baby (Complete Edition)
const parseShorthand = (str) => {
  if (!str) return NaN;
  str = str.toLowerCase().replace(/\s+/g, "");
  const map = {
    vg: 1e63, nod: 1e60, ocd: 1e57, spd: 1e54, sxd: 1e51, qid: 1e48, qad: 1e45,
    td: 1e42, dd: 1e39, ud: 1e36, dc: 1e33, no: 1e30, oc: 1e27, sp: 1e24,
    sx: 1e21, qi: 1e18, qa: 1e15, t: 1e12, b: 1e9, m: 1e6, k: 1e3
  };
  let suffix = Object.keys(map).sort((a, b) => b.length - a.length).find(s => str.endsWith(s));
  let multiplier = suffix ? map[suffix] : 1;
  if (suffix) str = str.slice(0, -suffix.length);
  const number = parseFloat(str);
  return isNaN(number) ? NaN : number * multiplier;
};

// ✨ Fancy Font Baby - Bold Sans-Serif Style
function fancy(text) {
  if (text === undefined || text === null) return "";
  const map = {
    'a': '𝐚','b': '𝐛','c': '𝐜','d': '𝐝','e': '𝐞','f': '𝐟','g': '𝐠','h': '𝐡','i': '𝐢','j': '𝐣','k': '𝐤','l': '𝐥','m': '𝐦','n': '𝐧','o': '𝐨','p': '𝐩','q': '𝐪','r': '𝐫','s': '𝐬','t': '𝐭','u': '𝐮','v': '𝐯','w': '𝐰','x': '𝐱','y': '𝐲','z': '𝐳',
    'A': '𝐀','B': '𝐁','C': '𝐂','D': '𝐃','E': '𝐄','F': '𝐅','G': '𝐆','H': '𝐇','I': '𝐈','J': '𝐉','K': '𝐊','L': '𝐋','M': '𝐌','N': '𝐍','O': '𝐎','P': '𝐏','Q': '𝐐','R': '𝐑','S': '𝐒','T': '𝐓','U': '𝐔','V': '𝐕','W': '𝐖','X': '𝐗','Y': '𝐘','Z': '𝐙',
    '0': '𝟎','1': '𝟏','2': '𝟐','3': '𝟑','4': '𝟒','5': '𝟓','6': '𝟔','7': '𝟕','8': '𝟖','9': '𝟗', '.': '.'
  };
  return String(text).split('').map(char => map[char] || char).join('');
}

// 🏦 Standard Shorthand Formatter Baby - Complete Edition
function formatMoney(num) {
  if (num === undefined || num === null || isNaN(num)) return "0";
  const units = [
    { v: 1e63, s: "𝐕𝐠" }, { v: 1e60, s: "𝐍𝐨𝐝" }, { v: 1e57, s: "𝐎𝐜𝐝" },
    { v: 1e54, s: "𝐒𝐩𝐝" }, { v: 1e51, s: "𝐒𝐱𝐝" }, { v: 1e48, s: "𝐐𝐢𝐝" },
    { v: 1e45, s: "𝐐𝐚𝐝" }, { v: 1e42, s: "𝐓𝐝" }, { v: 1e39, s: "𝐃𝐝" },
    { v: 1e36, s: "𝐔𝐝" }, { v: 1e33, s: "𝐃𝐜" }, { v: 1e30, s: "𝐍𝐨" },
    { v: 1e27, s: "𝐎𝐜" }, { v: 1e24, s: "𝐒𝐩" }, { v: 1e21, s: "𝐒𝐱" },
    { v: 1e18, s: "𝐐𝐢" }, { v: 1e15, s: "𝐐𝐚" }, { v: 1e12, s: "𝐓" },
    { v: 1e9, s: "𝐁" }, { v: 1e6, s: "𝐌" }, { v: 1e3, s: "𝐊" }
  ];
  for (const u of units) {
    if (Math.abs(num) >= u.v) return fancy((num / u.v).toFixed(2)) + u.s;
  }
  return fancy(Math.floor(num).toLocaleString());
}

module.exports = {
  config: {
    name: "spin",
    version: "11.0-love",
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
      if (!targetID) return api.sendMessage(fancy("❌ Usage: spin refresh @tag or UID Baby"), threadID, messageID);
      let tData = await usersData.get(targetID);
      if (!tData.data) tData.data = {};
      tData.data.spinLimit = { lastReset: now, count: 0 };
      await usersData.set(targetID, { data: tData.data });
      return api.sendMessage(fancy("✅ SPIN LIMIT REFRESHED BABY! 🎀"), threadID, messageID);
    }

    // 📖 First Time Player — Show Rules Baby (updated)
    let user = await usersData.get(senderID);
    if (!user.data) user.data = {};

    if (!user.data.spinSeen) {
      user.data.spinSeen = true;
      await usersData.set(senderID, { data: user.data });

      const rulesMsg =
        `🎀 𝐒𝐏𝐈𝐍 — 𝐑𝐔𝐋𝐄𝐒 𝐁𝐀𝐁𝐘\n` +
        `━━━━━━━━━━━━━━━━━━━\n\n` +
        fancy(`📌 How To Play:\n`) +
        fancy(`Type: spin [amount]\n`) +
        fancy(`Example: spin 5m\n\n`) +
        fancy(`🎰 Symbols & Payouts:\n`) +
        `• ${fancy("Any Triple (❤️❤️❤️, 🖤🖤🖤, etc.)")} → ×𝟑 ${fancy("(Jackpot)")}\n` +
        `• ${fancy("Any Double (❤️❤️💛, 💙💙🖤, etc.)")} → ×𝟐\n` +
        `• ${fancy("No Match")} → ${fancy("Lose Bet")}\n\n` +
        fancy(`⏰ Daily Limit:\n`) +
        fancy(`20 spins per 12 hours Baby.\n\n`) +
        `✅ ${fancy("Rules seen! Now type")} ${fancy("spin [amount]")} ${fancy("to play Baby.")}`;

      return api.sendMessage(rulesMsg, threadID, messageID);
    }

    // 🕐 12 Hours Reset System Baby
    const TWELVE_HOURS = 12 * 60 * 60 * 1000;

    if (!user.data.spinLimit || !user.data.spinLimit.lastReset) {
      user.data.spinLimit = { lastReset: now, count: 0 };
    } else {
      if (now - user.data.spinLimit.lastReset >= TWELVE_HOURS) {
        user.data.spinLimit = { lastReset: now, count: 0 };
      }
    }

    if (user.data.spinLimit.count >= 20) {
      const timeLeft = TWELVE_HOURS - (now - user.data.spinLimit.lastReset);
      const hoursLeft = Math.floor(timeLeft / (60 * 60 * 1000));
      const minutesLeft = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
      return api.sendMessage(
        fancy(`⚠️ You have reached your limit of 20 spins!\n⏰ Reset in: ${hoursLeft}h ${minutesLeft}m`),
        threadID, messageID
      );
    }

    const betAmount = parseShorthand(args[0]);
    if (isNaN(betAmount) || betAmount <= 0) return api.sendMessage(fancy("⚠️ ENTER A VALID BET AMOUNT BABY."), threadID, messageID);
    if (betAmount > user.money) return api.sendMessage(fancy("💰 NOT ENOUGH BALANCE BABY."), threadID, messageID);

    // ⚠️ Bet Cap (10M) → silent random big loss, no warning
    const BET_CAP = 10_000_000;

    // 💖 Love-only emoji list
    const slots = ["❤️","🧡","💛","💚","💙","💜","🖤"];
    let s1, s2, s3, winnings;

    if (betAmount > BET_CAP) {
      // Guaranteed loss, 50/60/70/80% random deduction
      const lossPercent = [50, 60, 70, 80][Math.floor(Math.random() * 4)];
      do {
        s1 = slots[Math.floor(Math.random() * slots.length)];
        s2 = slots[Math.floor(Math.random() * slots.length)];
        s3 = slots[Math.floor(Math.random() * slots.length)];
      } while (s1 === s2 || s1 === s3 || s2 === s3);
      winnings = - (betAmount * lossPercent / 100);
    } else {
      // Normal: Win 45% (Jackpot 5%, Double 40%) | Loss 55%
      const roll = Math.random();
      if (roll < 0.45) {
        // Win
        if (Math.random() < 5 / 45) { // Jackpot (triple)
          const symbol = slots[Math.floor(Math.random() * slots.length)];
          s1 = s2 = s3 = symbol;
          winnings = betAmount * 3;
        } else { // Double
          const symbol = slots[Math.floor(Math.random() * slots.length)];
          const pos = Math.floor(Math.random() * 3);
          if (pos === 0) {
            s1 = slots[Math.floor(Math.random() * slots.length)];
            s2 = symbol;
            s3 = symbol;
          } else if (pos === 1) {
            s1 = symbol;
            s2 = slots[Math.floor(Math.random() * slots.length)];
            s3 = symbol;
          } else {
            s1 = symbol;
            s2 = symbol;
            s3 = slots[Math.floor(Math.random() * slots.length)];
          }
          winnings = betAmount * 2;
        }
      } else {
        // Loss (no match)
        do {
          s1 = slots[Math.floor(Math.random() * slots.length)];
          s2 = slots[Math.floor(Math.random() * slots.length)];
          s3 = slots[Math.floor(Math.random() * slots.length)];
        } while (s1 === s2 || s1 === s3 || s2 === s3);
        winnings = -betAmount;
      }
    }

    // Update spin count & money
    user.data.spinLimit.count += 1;
    const newBalance = user.money + winnings;
    await usersData.set(senderID, { money: newBalance, data: user.data });

    // 🎤 Result (only what you asked – no name, no daily count)
    const amtFormatted = formatMoney(Math.abs(winnings));
    let status = winnings > 0 
      ? (s1 === s2 && s2 === s3 ? fancy("JACKPOT Won") : fancy("Won"))
      : fancy("Lost");

    const resultMsg =
      ">🎀\n" +
      `• ${fancy("Baby, You")} ${status} $${amtFormatted}\n` +
      `• ${fancy("Game Results:")} [ ${s1} | ${s2} | ${s3} ]`;

    return api.sendMessage(resultMsg, threadID, messageID);
  }
};
