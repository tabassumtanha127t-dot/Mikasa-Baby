// ✨ ফ্যান্সি ফন্ট হেল্পার (বোল্ড সেরিফ)
const fancy = (text) => {
  if (text === undefined || text === null) return "";
  const fonts = {
    'a': '𝐚','b': '𝐛','c': '𝐜','d': '𝐝','e': '𝐞','f': '𝐟','g': '𝐠','h': '𝐡','i': '𝐢','j': '𝐣','k': '𝐤','l': '𝐥','m': '𝐦','n': '𝐧','o': '𝐨','p': '𝐩','q': '𝐪','r': '𝐫','s': '𝐬','t': '𝐭','u': '𝐮','v': '𝐯','w': '𝐰','x': '𝐱','y': '𝐲','z': '𝐳',
    'A': '𝐀','B': '𝐁','C': '𝐂','D': '𝐃','E': '𝐄','F': '𝐅','G': '𝐆','H': '𝐇','I': '𝐈','J': '𝐉','K': '𝐊','L': '𝐋','M': '𝐌','N': '𝐍','O': '𝐎','P': '𝐏','Q': '𝐐','R': '𝐑','S': '𝐒','T': '𝐓','U': '𝐔','V': '𝐕','W': '𝐖','X': '𝐗','Y': '𝐘','Z': '𝐙',
    '0': '𝟎','1': '𝟏','2': '𝟐','3': '𝟑','4': '𝟒','5': '𝟓','6': '𝟔','7': '𝟕','8': '𝟖','9': '𝟗', '.': '.'
  };
  return String(text).split('').map(char => fonts[char] || char).join('');
};

// 💰 স্ট্যান্ডার্ড শর্টহ্যান্ড পার্সার (ভিজিন্টিলিয়ন পর্যন্ত)
const parseShorthand = (str) => {
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

// 🏦 স্ট্যান্ডার্ড শর্টহ্যান্ড ফরম্যাটার (বড় সংখ্যা দেখানোর জন্য)
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

module.exports = {
  config: {
    name: "dice",
    aliases: [],
    version: "2.1",
    author: "SAIF",
    category: "game",
    shortDescription: "🎲 roll a dice automatically with bet amount",
    longDescription: "User gives amount, bot rolls dice automatically to see if user wins",
    guide: { en: "{pn} <amount> - roll dice and bet automatically" },
  },

  onStart: async function({ message, event, args, usersData }) {
    const user = event.senderID;
    const userData = await usersData.get(user);

    const betInput = args[0];
    const betAmount = parseShorthand(betInput);

    if (isNaN(betAmount) || betAmount <= 0) 
      return message.reply(fancy("⚠️ ENTER A VALID AMOUNT."));
    if (userData.money < betAmount) 
      return message.reply(fancy("💰 NOT ENOUGH BALANCE."));

    // বট অটোমেটিক ডাইস রোল করে
    const diceNum = Math.floor(Math.random() * 6) + 1;
    const rolledDice = Math.floor(Math.random() * 6) + 1;
    const isWin = rolledDice === diceNum;
    const winnings = isWin ? betAmount * 2 : -betAmount;

    userData.money += winnings;
    await usersData.set(user, userData);

    // আউটপুট ফর্ম্যাট (আগের মতই, কিন্তু fancy ও formatMoney সহ)
    const resultMsg = [
      `🎲 ${fancy("YOUR DICE:")} ${diceNum}`,
      `🤖 ${fancy("ROLLED:")} ${rolledDice}`,
      "",
      isWin 
        ? ` ${fancy("YOU WON")} ${formatMoney(betAmount)}!` 
        : ` ${fancy("YOU LOST")} ${formatMoney(betAmount)}.`,
      "",
      ` ${fancy("BALANCE:")} ${formatMoney(userData.money)}`
    ].join("\n");

    return message.reply(resultMsg);
  }
};
