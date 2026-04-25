const fs = require("fs-extra");
const path = require("path");

// Fancy Font Helper Baby - Bold Sans-Serif Style
const fancy = (text) => {
  if (text === undefined || text === null) return "";
  const fonts = {
    'a': '𝐚','b': '𝐛','c': '𝐜','d': '𝐝','e': '𝐞','f': '𝐟','g': '𝐠','h': '𝐡','i': '𝐢','j': '𝐣','k': '𝐤','l': '𝐥','m': '𝐦','n': '𝐧','o': '𝐨','p': '𝐩','q': '𝐪','r': '𝐫','s': '𝐬','t': '𝐭','u': '𝐮','v': '𝐯','w': '𝐰','x': '𝐱','y': '𝐲','z': '𝐳',
    'A': '𝐀','B': '𝐁','C': '𝐂','D': '𝐃','E': '𝐄','F': '𝐅','G': '𝐆','H': '𝐇','I': '𝐈','J': '𝐉','K': '𝐊','L': '𝐋','M': '𝐌','N': '𝐍','O': '𝐎','P': '𝐏','Q': '𝐐','R': '𝐑','S': '𝐒','T': '𝐓','U': '𝐔','V': '𝐕','W': '𝐖','X': '𝐗','Y': '𝐘','Z': '𝐙',
    '0': '𝟎','1': '𝟏','2': '𝟐','3': '𝟑','4': '𝟒','5': '𝟓','6': '𝟔','7': '𝟕','8': '𝟖','9': '𝟗', '.': '.'
  };
  return String(text).split('').map(char => fonts[char] || char).join('');
};

// 💰 Standard Shorthand Parser Baby (Complete Edition)
const parseAmount = (str) => {
  if (!str) return NaN;
  str = str.toLowerCase().replace(/\s+/g, "");
  const map = {
    vg: 1e63, nod: 1e60, ocd: 1e57, spd: 1e54, sxd: 1e51, qid: 1e48, qad: 1e45,
    td: 1e42, dd: 1e39, ud: 1e36, dc: 1e33, no: 1e30, oc: 1e27, sp: 1e24,
    sx: 1e21, qi: 1e18, qa: 1e15, t: 1e12, b: 1e9, m: 1e6, k: 1e3
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

// 🏦 Standard Shorthand Formatter Baby (Complete Edition)
function formatMoney(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return "0";
  
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

// 💖 Love-only wheel emojis (as requested)
const wheelEmojis = ["❤️","🧡","💛","💚","💙","💜","🖤"];

module.exports = {
  config: {
    name: "wheel",
    version: "10.0-love",
    author: "Saif & Gemini",
    category: "game",
    countDown: 5,
    description: "🎡 𝐔𝐋𝐓𝐑𝐀-𝐖𝐇𝐄𝐄𝐋 𝐏𝐑𝐄𝐌𝐈𝐔𝐌 𝐁𝐀𝐁𝐘"
  },

  onStart: async function ({ api, event, args, usersData, role }) {
    const { senderID, threadID, messageID, mentions, messageReply } = event;
    const now = Date.now();

    // 🔄 Admin Refresh
    if (args[0] === "refresh" && role >= 2) {
      let targetID = messageReply ? messageReply.senderID : (Object.keys(mentions).length > 0 ? Object.keys(mentions)[0] : args[1]);
      if (!targetID) return api.sendMessage(fancy("❌ Usage: wheel refresh @tag or UID Baby"), threadID, messageID);
      let tData = await usersData.get(targetID);
      if (!tData.data) tData.data = {};
      tData.data.gameLimit = { lastReset: now, wheel: 0 };
      await usersData.set(targetID, { data: tData.data });
      return api.sendMessage(fancy("✅ 𝐋𝐈𝐌𝐈𝐓 𝐑𝐄𝐅𝐑𝐄𝐒𝐇𝐄𝐃 𝐁𝐀𝐁𝐘! 🎀"), threadID, messageID);
    }

    // 📖 First time rules (updated)
    let user = await usersData.get(senderID);
    if (!user.data) user.data = {};

    if (!user.data.wheelSeen) {
      user.data.wheelSeen = true;
      await usersData.set(senderID, { data: user.data });

      const rulesMsg =
        `🎀 𝐖𝐇𝐄𝐄𝐋 — 𝐑𝐔𝐋𝐄𝐒 𝐁𝐀𝐁𝐘\n` +
        `━━━━━━━━━━━━━━━━━━━\n\n` +
        fancy(`📌 How To Play:\n`) +
        fancy(`Type: wheel [amount]\n`) +
        fancy(`Example: wheel 5m\n\n`) +
        fancy(`🎰 Symbols & Payouts:\n`) +
        `• ${fancy("Any Triple (❤️❤️❤️, 🖤🖤🖤)")} → ×𝟑 ${fancy("(Jackpot)")}\n` +
        `• ${fancy("Any Double (❤️❤️💛)")} → ×𝟐\n` +
        `• ${fancy("No Match")} → ${fancy("Lose Bet")}\n\n` +
        fancy(`⏰ Daily Limit:\n`) +
        fancy(`20 spins per 12 hours Baby.\n\n`) +
        `✅ ${fancy("Rules seen! Now type")} ${fancy("wheel [amount]")} ${fancy("to play Baby.")}`;

      return api.sendMessage(rulesMsg, threadID, messageID);
    }

    // 🕐 12h reset
    const TWELVE_HOURS = 12 * 60 * 60 * 1000;
    if (!user.data.gameLimit) user.data.gameLimit = {};
    if (!user.data.gameLimit.lastReset) {
      user.data.gameLimit = { lastReset: now, wheel: 0 };
    } else if (now - user.data.gameLimit.lastReset >= TWELVE_HOURS) {
      user.data.gameLimit = { lastReset: now, wheel: 0 };
    }

    if (user.data.gameLimit.wheel >= 20) {
      const timeLeft = TWELVE_HOURS - (now - user.data.gameLimit.lastReset);
      const h = Math.floor(timeLeft / 3600000);
      const m = Math.floor((timeLeft % 3600000) / 60000);
      return api.sendMessage(
        fancy(`⚠️ You have reached your limit of 20 spins!\n⏰ Reset in: ${h}h ${m}m`),
        threadID, messageID
      );
    }

    const betAmount = parseAmount(args[0]);
    if (isNaN(betAmount) || betAmount <= 0) return api.sendMessage(fancy("⚠️ ENTER A VALID BET AMOUNT BABY."), threadID, messageID);
    if (betAmount > user.money) return api.sendMessage(fancy("💰 NOT ENOUGH BALANCE BABY."), threadID, messageID);

    // Show spinning message
    const loadingMsg = await api.sendMessage(fancy("🎰 Spinning... baby 🎀"), threadID, messageID);

    const BET_CAP = 10_000_000;
    let res, winnings;

    if (betAmount > BET_CAP) {
      // Penalty: always lose, random 50–80% loss
      const lossPercent = [50, 60, 70, 80][Math.floor(Math.random() * 4)];
      do {
        res = [
          wheelEmojis[Math.floor(Math.random() * wheelEmojis.length)],
          wheelEmojis[Math.floor(Math.random() * wheelEmojis.length)],
          wheelEmojis[Math.floor(Math.random() * wheelEmojis.length)]
        ];
      } while (res[0] === res[1] || res[1] === res[2] || res[0] === res[2]);
      winnings = - (betAmount * lossPercent / 100);
    } else {
      // Normal: Win 45% (Jackpot 5%, Double 40%) | Loss 55%
      const roll = Math.random();
      if (roll < 0.45) {
        // Win branch
        if (Math.random() < 5 / 45) { // Jackpot (triple)
          const symbol = wheelEmojis[Math.floor(Math.random() * wheelEmojis.length)];
          res = [symbol, symbol, symbol];
          winnings = betAmount * 3;
        } else { // Double
          const symbol = wheelEmojis[Math.floor(Math.random() * wheelEmojis.length)];
          const pos = Math.floor(Math.random() * 3);
          if (pos === 0) res = [wheelEmojis[Math.floor(Math.random() * wheelEmojis.length)], symbol, symbol];
          else if (pos === 1) res = [symbol, wheelEmojis[Math.floor(Math.random() * wheelEmojis.length)], symbol];
          else res = [symbol, symbol, wheelEmojis[Math.floor(Math.random() * wheelEmojis.length)]];
          winnings = betAmount * 2;
        }
      } else {
        // Loss
        do {
          res = [
            wheelEmojis[Math.floor(Math.random() * wheelEmojis.length)],
            wheelEmojis[Math.floor(Math.random() * wheelEmojis.length)],
            wheelEmojis[Math.floor(Math.random() * wheelEmojis.length)]
          ];
        } while (res[0] === res[1] || res[1] === res[2] || res[0] === res[2]);
        winnings = -betAmount;
      }
    }

    // Update spins & balance
    user.data.gameLimit.wheel += 1;
    const newBalance = user.money + winnings;
    await usersData.set(senderID, { money: newBalance, data: user.data });

    // Format result (no name/balance/daily count)
    const amtFormatted = formatMoney(Math.abs(winnings));
    let statusText;
    if (winnings > 0) {
      statusText = (res[0] === res[1] && res[1] === res[2]) ? fancy("JACKPOT Won") : fancy("Won");
    } else {
      statusText = fancy("Lost");
    }

    const resultMsg =
      ">🎀\n" +
      `• ${fancy("Baby, You")} ${statusText} $${amtFormatted}\n` +
      `• ${fancy("Game Results:")} [ ${res[0]} | ${res[1]} | ${res[2]} ]`;

    // 🕓 4-second spinning delay then edit
    setTimeout(async () => {
      try {
        await api.editMessage(resultMsg, loadingMsg.messageID);
        // Auto-unsend after 1 minute from edit (you can adjust)
        setTimeout(() => {
          api.unsendMessage(loadingMsg.messageID).catch(() => {});
        }, 60000);
      } catch (e) {
        console.error(e);
      }
    }, 4000);
  }
};
