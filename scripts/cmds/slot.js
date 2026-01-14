const parseShorthand = (str) => {
  if (!str) return NaN;
  str = str.toLowerCase().replace(/\s+/g, "");
  const map = { 
    k: 1e3, m: 1e6, b: 1e9, t: 1e12, q: 1e15, qd: 1e18, qi: 1e21, sx: 1e24, 
    sp: 1e27, oc: 1e30, no: 1e33, dc: 1e36, udc: 1e39, ddc: 1e42, tdc: 1e45, ct: 1e303 
  };
  let suffix = Object.keys(map).sort((a,b)=>b.length-a.length).find(s=>str.endsWith(s));
  let multiplier = suffix ? map[suffix] : 1;
  if(suffix) str=str.slice(0,-suffix.length);
  const number=parseFloat(str);
  return isNaN(number)?NaN:number*multiplier;
};

function fancy(text) {
    const map = {
        'a': '𝒂','b': '𝒃','c': '𝒄','d': '𝒅','e': '𝒆','f': '𝒇','g': '𝒈','h': '𝒉','i': '𝒊','j': '𝒋','k': '𝒌','l': '𝒍','m': '𝒎','n': '𝒏','o': '𝒐','p': '𝒑','q': '𝗊','r': '𝒓','s': '𝒔','t': '𝒕','u': '𝒖','v': '𝒗','w': '𝒘','x': '𝒙','y': '𝒚','z': '𝒛',
        'A': '𝑨','B': '𝑩','C': '𝑪','D': '𝑫','E': '𝑬','F': '𝑭','G': '𝑮','H': '𝑯','I': '𝑰','J': '𝑱','K': '𝑲','L': '𝑳','M': '𝑴','N': '𝑵','O': '𝑶','P': '𝑷','Q': '𝑸','R': '𝑹','S': '𝑺','T': '𝑻','U': '𝑼','V': '𝑽','W': '𝒘','X': '𝑿','Y': '𝒀','Z': '𝒁',
        '0': '𝟎','1': '𝟏','2': '𝟐','3': '𝟑','4': '𝟒','5': '𝟓','6': '𝟔','7': '𝟕','8': '𝟖','9': '𝟗', '.': '.'
    };
    return text.toString().split('').map(char => map[char] || char).join('');
}

function formatMoney(num) {
  const suffixes = [
    { value: 1e303, symbol: "𝑪𝑻" }, { value: 1e36, symbol: "𝑫𝑪" }, { value: 1e33, symbol: "𝑵𝑶" }, 
    { value: 1e30, symbol: "𝑶𝑪" }, { value: 1e27, symbol: "𝑺𝑷" }, { value: 1e24, symbol: "𝑺𝑿" }, 
    { value: 1e21, symbol: "𝑸𝑰" }, { value: 1e18, symbol: "𝑸𝑻" }, { value: 1e15, symbol: "𝑸𝑫" }, 
    { value: 1e12, symbol: "𝑻" }, { value: 1e9, symbol: "𝑩" }, { value: 1e6, symbol: "𝑴" }, 
    { value: 1e3, symbol: "𝑲" }
  ];
  for (const s of suffixes) {
    if (Math.abs(num) >= s.value) return fancy((num / s.value).toFixed(2)) + s.symbol;
  }
  return fancy(Math.floor(num).toLocaleString());
}

const cooldowns = new Map();
const dailyUsage = new Map();

module.exports = {
  config: {
    name: "slot",
    version: "9.5",
    author: "SAIF & Gemini",
    category: "game",
    shortDescription: { en: "Slot game with Ultra Rare & Biggest Wins" },
    countDown: 10 
  },

  onStart: async ({ args, message, event, usersData }) => {
    const user = event.senderID;
    const today = new Date().toDateString();

    if (!dailyUsage.has(user) || dailyUsage.get(user).date !== today) {
      dailyUsage.set(user, { count: 0, date: today });
    }
    const userDaily = dailyUsage.get(user);
    if (userDaily.count >= 20) return message.reply(fancy("⚠️ 𝒀𝒐𝒖 𝒉𝒂𝒗𝒆 𝒓𝒆𝒂𝒄𝒉𝒆𝒅 𝒚𝒐𝒖𝒓 𝒅𝒂𝒊𝒍𝒚 𝒍𝒊𝒎𝒊𝒕 𝒐𝒇 𝟐𝟎 𝒔𝒑𝒊𝒏𝒔 𝒃𝒂𝒃𝒚!"));

    const now = Date.now();
    const cooldownTime = (module.exports.config.countDown || 10) * 1000;
    if (cooldowns.has(user) && now - cooldowns.get(user) < cooldownTime) return;

    let userData = await usersData.get(user);
    const betAmount = parseShorthand(args[0]);
    if (isNaN(betAmount) || betAmount <= 0) return message.reply(fancy("⚠️ 𝑬𝑵𝑻𝑬𝑹 𝑨 𝑽𝑨𝑳𝑰𝑫 𝑩𝑬𝑻 𝑨𝑴𝑶𝑼𝑵𝑻 𝑩𝑨𝑩𝒀."));
    if (betAmount > userData.money) return message.reply(fancy("💰 𝑵𝑶𝑻 𝑬𝑵𝑶𝑼𝑮𝑯 𝑩𝑨𝑳𝑨𝑵𝑪𝑬 𝑩𝑨𝑩𝒀."));

    const slots = ["❤️","💛","💚","💙","💎","👑","🪙"];
    const winChance = Math.random();
    let slot1, slot2, slot3;

    // 50/50 Win/Loss System with Ultra Rares
    if (winChance < 0.50) {
      const winType = Math.random();
      if (winType < 0.01) { // 1% Biggest Win
        slot1 = slot2 = slot3 = "🪙";
      } else if (winType < 0.05) { // 4% Ultra Rare
        slot1 = slot2 = slot3 = "👑";
      } else if (winType < 0.20) { // Jackpot
        slot1 = slot2 = slot3 = "💎";
      } else { // Normal win
        slot1 = slots[Math.floor(Math.random() * slots.length)];
        slot2 = slot1;
        slot3 = Math.random() < 0.3 ? slot1 : slots[Math.floor(Math.random() * slots.length)];
      }
    } else {
      // Guaranteed Loss
      slot1 = slots[Math.floor(Math.random() * slots.length)];
      slot2 = slots.filter(s => s !== slot1)[Math.floor(Math.random() * (slots.length - 1))];
      slot3 = slots.filter(s => s !== slot2)[Math.floor(Math.random() * (slots.length - 1))];
    }

    const winnings = calculateWinnings(slot1, slot2, slot3, betAmount);
    userData.money += winnings;

    await usersData.set(user, userData);
    cooldowns.set(user, now);
    userDaily.count += 1;
    dailyUsage.set(user, userDaily);

    // Dynamic Winning Message Baby
    let winStatus = winnings > 0 ? fancy("𝑾𝒐𝒏") : fancy("𝑳𝒐𝒔𝒕");
    if (slot1 === "🪙" && slot2 === "🪙" && slot3 === "🪙") winStatus = fancy("🔥 𝑩𝑰𝑮𝑮𝑬𝑺𝑻 𝑾𝑶𝑵 🔥");
    if (slot1 === "👑" && slot2 === "👑" && slot3 === "👑") winStatus = fancy("👑 𝑼𝑳𝑻𝑹𝑨 𝑹𝑨𝑹𝑬 𝑾𝑰𝑵 👑");

    const resultMsg = `🎀
• ${fancy("𝑩𝒂𝒃𝒚, 𝒀𝒐𝒖")} ${winStatus} ${formatMoney(Math.abs(winnings))}!
• ${fancy("𝑮𝒂𝒎𝒆 𝑹𝒆𝒔𝒖𝒍𝒕𝒔:")} [ ${slot1} | ${slot2} | ${slot3} ]
• ${fancy("𝑩𝒂𝒍𝒂𝒏𝒄𝒆:")} ${formatMoney(userData.money)}
• ${fancy("𝑫𝒂𝒊𝒍𝒚 𝑼𝒔𝒆:")} ${fancy(userDaily.count)}/𝟐𝟎`;

    return message.reply(resultMsg);
  }
};

function calculateWinnings(s1, s2, s3, bet) {
  if (s1 === "🪙" && s2 === "🪙" && s3 === "🪙") return bet * 500;
  if (s1 === "👑" && s2 === "👑" && s3 === "👑") return bet * 100;
  if (s1 === "💎" && s2 === "💎" && s3 === "💎") return bet * 50;
  if (s1 === s2 && s2 === s3) {
    if (s1 === "💙") return bet * 15;
    if (s1 === "💚") return bet * 10;
    if (s1 === "💛") return bet * 5;
    return bet * 3; 
  }
  if (s1 === s2 || s1 === s3 || s2 === s3) return bet * 2;
  return -bet;
}
