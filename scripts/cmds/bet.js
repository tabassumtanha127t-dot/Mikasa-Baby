// 💰 Standard Shorthand Parser Baby (Complete Edition)
const parseAmount = (str) => {
  if (!str) return NaN;
  str = str.toLowerCase().replace(/\s+/g, "");
  const suffixes = {
    vg: 1e63, nod: 1e60, ocd: 1e57, spd: 1e54, sxd: 1e51, qid: 1e48, qad: 1e45,
    td: 1e42, dd: 1e39, ud: 1e36, dc: 1e33, no: 1e30, oc: 1e27, sp: 1e24,
    sx: 1e21, qi: 1e18, qa: 1e15, t: 1e12, b: 1e9, m: 1e6, k: 1e3
  };
  let matched = Object.keys(suffixes).sort((a, b) => b.length - a.length).find(suf => str.endsWith(suf));
  let multiplier = matched ? suffixes[matched] : 1;
  if (matched) str = str.slice(0, -matched.length);
  let num = parseFloat(str);
  return isNaN(num) ? NaN : num * multiplier;
};

// ✨ Bold Sans-Serif Font Baby
const f = (text) => {
  if (text === undefined || text === null) return "";
  const fonts = {
    'a':'𝐚','b':'𝐛','c':'𝐜','d':'𝐝','e':'𝐞','f':'𝐟','g':'𝐠','h':'𝐡','i':'𝐢','j':'𝐣',
    'k':'𝐤','l':'𝐥','m':'𝐦','n':'𝐧','o':'𝐨','p':'𝐩','q':'𝐪','r':'𝐫','s':'𝐬','t':'𝐭',
    'u':'𝐮','v':'𝐯','w':'𝐰','x':'𝐱','y':'𝐲','z':'𝐳',
    'A':'𝐀','B':'𝐁','C':'𝐂','D':'𝐃','E':'𝐄','F':'𝐅','G':'𝐆','H':'𝐇','I':'𝐈','J':'𝐉',
    'K':'𝐊','L':'𝐋','M':'𝐌','N':'𝐍','O':'𝐎','P':'𝐏','Q':'𝐐','R':'𝐑','S':'𝐒','T':'𝐓',
    'U':'𝐔','V':'𝐕','W':'𝐖','X':'𝐗','Y':'𝐘','Z':'𝐙',
    '0':'𝟎','1':'𝟏','2':'𝟐','3':'𝟑','4':'𝟒','5':'𝟓','6':'𝟔','7':'𝟕','8':'𝟖','9':'𝟗',
    '.':'.', ':':':', '/':'/'
  };
  return String(text).split('').map(c => fonts[c] || c).join('');
};

// 🏦 Standard Shorthand Formatter Baby (Complete Edition)
function formatMoney(num) {
  if (num === undefined || num === null || isNaN(num)) return "0";
  const suffixes = [
    { value: 1e63, symbol: "𝐕𝐠" }, { value: 1e60, symbol: "𝐍𝐨𝐝" },
    { value: 1e57, symbol: "𝐎𝐜𝐝" }, { value: 1e54, symbol: "𝐒𝐩𝐝" },
    { value: 1e51, symbol: "𝐒𝐱𝐝" }, { value: 1e48, symbol: "𝐐𝐢𝐝" },
    { value: 1e45, symbol: "𝐐𝐚𝐝" }, { value: 1e42, symbol: "𝐓𝐝" },
    { value: 1e39, symbol: "𝐃𝐝" },  { value: 1e36, symbol: "𝐔𝐝" },
    { value: 1e33, symbol: "𝐃𝐜" },  { value: 1e30, symbol: "𝐍𝐨" },
    { value: 1e27, symbol: "𝐎𝐜" },  { value: 1e24, symbol: "𝐒𝐩" },
    { value: 1e21, symbol: "𝐒𝐱" },  { value: 1e18, symbol: "𝐐𝐢" },
    { value: 1e15, symbol: "𝐐𝐚" },  { value: 1e12, symbol: "𝐓" },
    { value: 1e9,  symbol: "𝐁" },   { value: 1e6,  symbol: "𝐌" },
    { value: 1e3,  symbol: "𝐊" }
  ];
  for (const s of suffixes) {
    if (Math.abs(num) >= s.value) return f((num / s.value).toFixed(2)) + s.symbol;
  }
  return f(Math.floor(num).toString());
}

// ✈️ Aviator Crash Point Generator — Realistic Distribution Baby
function generateCrashPoint() {
  const r = Math.random();
  if (r < 0.10) return 1.00; // 10% instant crash
  const raw = 0.97 / (1 - Math.random());
  return Math.round(Math.max(1.01, Math.min(raw, 200)) * 100) / 100;
}

// 📊 Progress Bar Baby
function buildBar(current, target) {
  const progress = Math.min((current - 1.00) / (target - 1.00), 1);
  const filled = Math.round(progress * 10);
  return "[" + f("█".repeat(filled) + "░".repeat(10 - filled)) + "]";
}

// 🎬 Build Frame Message Baby
function buildFrame(betAmount, targetMult, currentMult, status) {
  const bar = buildBar(currentMult, targetMult);
  let statusLine = "";
  if (status === "flying")  statusLine = `✈️  ${f("Flying...")}  ${f(currentMult.toFixed(2) + "x")} 📈`;
  if (status === "won")     statusLine = `🛬  ${f("Cashed out at")} ${f(currentMult.toFixed(2) + "x!")}`;
  if (status === "crashed") statusLine = `💥  ${f("Crashed at")} ${f(currentMult.toFixed(2) + "x!")}`;
  if (status === "instant") statusLine = `💥  ${f("Instant Crash!")}`;

  return (
    `✈️ ${f("AVIATOR BET — BABY")}\n` +
    `━━━━━━━━━━━━━━━━━━━\n` +
    `💵 ${f("Bet:")} ${formatMoney(betAmount)}  ${f("Target:")} ${f(targetMult.toFixed(2) + "x")}\n\n` +
    `${bar} ${f(currentMult.toFixed(2) + "x")} / ${f(targetMult.toFixed(2) + "x")}\n\n` +
    `${statusLine}`
  );
}

const delay = (ms) => new Promise(r => setTimeout(r, ms));

module.exports = {
  config: {
    name: "bet",
    version: "7.0",
    author: "Saif",
    category: "game",
    countDown: 15,
    shortDescription: "✈️ 𝐀𝐕𝐈𝐀𝐓𝐎𝐑 𝐁𝐄𝐓 𝐆𝐀𝐌𝐄 𝐁𝐀𝐁𝐘",
    guide: { en: "{p}bet <amount> <target>\nExample: bet 5m 2.5" }
  },

  onStart: async function ({ api, event, args, usersData, role }) {
    const { senderID, threadID, messageID, mentions, messageReply } = event;
    const now = Date.now();

    // 🔄 Admin Refresh
    if (args[0] === "refresh" && role >= 2) {
      let targetID = messageReply ? messageReply.senderID
        : (Object.keys(mentions).length > 0 ? Object.keys(mentions)[0] : args[1]);
      if (!targetID) return api.sendMessage(f("❌ Usage: bet refresh @tag or UID Baby"), threadID, messageID);
      let tData = await usersData.get(targetID);
      if (!tData.data) tData.data = {};
      tData.data.betLimit = { lastReset: now, count: 0 };
      await usersData.set(targetID, { data: tData.data });
      return api.sendMessage(f("✅ BET LIMIT REFRESHED BABY! 🎀"), threadID, messageID);
    }

    const userData = await usersData.get(senderID);
    if (!userData.data) userData.data = {};

    // 📖 First Time Player — Show Rules Baby
    if (!userData.data.betSeen) {
      userData.data.betSeen = true;
      await usersData.set(senderID, { data: userData.data });

      return api.sendMessage(
        `✈️ ${f("AVIATOR BET — RULES BABY")}\n` +
        `━━━━━━━━━━━━━━━━━━━\n\n` +
        `📌 ${f("How To Play:")}\n` +
        f("Command: bet [amount] [target]\n") +
        f("Example:  bet 5m 2.5\n\n") +
        `🛫 ${f("How It Works:")}\n` +
        f("• Plane takes off, multiplier rises\n") +
        f("• You set a target cashout multiplier\n") +
        f("• Plane reaches target → WIN\n") +
        f("• Plane crashes before target → LOSE\n") +
        f("• Higher target = bigger risk & reward!\n\n") +
        `💰 ${f("Payout = Bet × Target Multiplier")}\n` +
        f("Example: 5M × 2.5x = 12.5M profit!\n\n") +
        `⏰ ${f("Daily Limit: 20 bets / 12 hours\n\n")}` +
        `⚠️ ${f("Bet over $10M → Auto Lose (Penalty)!")}\n` +
        f("Keep your bet under $10M Baby.\n\n") +
        `✅ ${f("Rules seen! Type bet [amount] [target] to play Baby.")}`,
        threadID, messageID
      );
    }

    // 🕐 12 Hours Reset System Baby
    const TWELVE_HOURS = 12 * 60 * 60 * 1000;
    if (!userData.data.betLimit || !userData.data.betLimit.lastReset) {
      userData.data.betLimit = { lastReset: now, count: 0 };
    } else if (now - userData.data.betLimit.lastReset >= TWELVE_HOURS) {
      userData.data.betLimit = { lastReset: now, count: 0 };
    }

    if (userData.data.betLimit.count >= 20) {
      const timeLeft = TWELVE_HOURS - (now - userData.data.betLimit.lastReset);
      const h = Math.floor(timeLeft / 3600000);
      const m = Math.floor((timeLeft % 3600000) / 60000);
      return api.sendMessage(
        f(`⚠️ Limit reached! 20/20 bets used.\n⏰ Reset in: ${h}h ${m}m Baby.`),
        threadID, messageID
      );
    }

    // 🎯 Parse Args
    const betAmount = parseAmount(args[0]);
    const targetMult = parseFloat(args[1]);

    if (isNaN(betAmount) || betAmount <= 0)
      return api.sendMessage(f("❌ Invalid amount! Usage: bet 5m 2.5 Baby."), threadID, messageID);
    if (isNaN(targetMult) || targetMult <= 1.00)
      return api.sendMessage(f("❌ Target must be above 1.00x! Example: bet 5m 2.5 Baby."), threadID, messageID);
    if (targetMult > 200)
      return api.sendMessage(f("❌ Maximum target is 200x Baby."), threadID, messageID);
    if (betAmount > userData.money)
      return api.sendMessage(
        f("💰 Not enough balance! You have: ") + formatMoney(userData.money || 0),
        threadID, messageID
      );

    // ⚠️ Bet Cap Penalty — Over 10M = Always Crash Baby
    const BET_CAP = 10_000_000;
    if (betAmount > BET_CAP) {
      userData.money = (userData.money || 0) - betAmount;
      userData.data.betLimit.count += 1;
      await usersData.set(senderID, { money: userData.money, data: userData.data });
      return api.sendMessage(
        `✈️ ${f("AVIATOR BET — BABY")}\n` +
        `━━━━━━━━━━━━━━━━━━━\n\n` +
        `⚠️ ${f("PENALTY — Bet over $10M!")}\n` +
        `💥 ${f("Auto Crashed! Plane refused to fly.")}\n\n` +
        `❌ ${f("Lost:")} ${formatMoney(betAmount)}\n` +
        `💰 ${f("Balance:")} ${formatMoney(userData.money)}\n` +
        `📈 ${f("Daily:")} ${f(String(userData.data.betLimit.count))}/𝟐𝟎 ${f("Baby")}\n\n` +
        `⚠️ ${f("Keep bet under $10M Baby!")}`,
        threadID, messageID
      );
    }

    // ✈️ Generate Crash Point
    const crashPoint = generateCrashPoint();
    const won = crashPoint >= targetMult;

    // 🚀 Send Initial Takeoff Frame
    const sent = await api.sendMessage(
      buildFrame(betAmount, targetMult, 1.00, "flying"),
      threadID, messageID
    );
    const msgID = sent.messageID;

    // 🎬 Animate Multiplier Climbing
    if (crashPoint === 1.00) {
      await delay(1000);
      await api.editMessage(buildFrame(betAmount, targetMult, 1.00, "instant"), msgID);
    } else {
      const peak = won ? targetMult : crashPoint;
      // 4 animation frames between 1.00 → peak
      for (let i = 1; i <= 4; i++) {
        const step = parseFloat((1.00 + (peak - 1.00) * (i / 4)).toFixed(2));
        await delay(750);
        await api.editMessage(buildFrame(betAmount, targetMult, step, "flying"), msgID);
      }
      await delay(750);
    }

    // 🏁 Final Result
    const finalMult = crashPoint === 1.00 ? 1.00 : (won ? targetMult : crashPoint);
    const finalStatus = crashPoint === 1.00 ? "instant" : (won ? "won" : "crashed");
    const winnings = won ? betAmount * targetMult - betAmount : -betAmount;
    const newBalance = userData.money + winnings;

    userData.data.betLimit.count += 1;
    await usersData.set(senderID, { money: newBalance, data: userData.data });

    const resultLine = won
      ? `✅ ${f("Won:")} ${formatMoney(Math.abs(winnings))} ${f("(" + targetMult.toFixed(2) + "x)")}`
      : `❌ ${f("Lost:")} ${formatMoney(betAmount)}`;

    return api.editMessage(
      buildFrame(betAmount, targetMult, finalMult, finalStatus) + "\n\n" +
      `${resultLine}\n` +
      `💰 ${f("Balance:")} ${formatMoney(newBalance)}\n` +
      `📈 ${f("Daily:")} ${f(String(userData.data.betLimit.count))}/𝟐𝟎 ${f("Baby")}`,
      msgID
    );
  }
};
