 const fs = require("fs-extra");
const path = require("path");

// Folder-ei json rakha thakle path hobe erokom Baby
const gameFilePath = path.join(__dirname, "userGames.json"); 

const parseAmount = (str) => {
  if (!str) return NaN;
  str = str.toLowerCase().replace(/\s+/g, "");
  const suffixes = {
    k: 1e3, m: 1e6, b: 1e9, t: 1e12,
    qd: 1e15, qi: 1e18, sx: 1e21, sp: 1e24, 
    oc: 1e27, no: 1e30, dc: 1e33, ud: 1e36, 
    dd: 1e39, td: 1e42, qut: 1e45, qid: 1e48, 
    sxd: 1e51, spd: 1e54, ocd: 1e57, nod: 1e60, 
    vg: 1e63, tg: 1e93, qag: 1e123, qig: 1e153, 
    sxg: 1e183, spg: 1e213, og: 1e243, nng: 1e273, 
    cnt: 1e303
  };
  let matched = Object.keys(suffixes).sort((a, b) => b.length - a.length).find(suf => str.endsWith(suf));
  let multiplier = matched ? suffixes[matched] : 1;
  if (matched) str = str.slice(0, -matched.length);
  let num = parseFloat(str);
  return isNaN(num) ? NaN : num * multiplier;
};

const toBoldSerifItalic = (text) => {
  const fonts = {
    'a': '𝒂','b': '𝒃','c': '𝒄','d': '𝒅','e': '𝒆','f': '𝒇','g': '𝒈',
    'h': '𝒉','i': '𝒊','j': '𝒋','k': '𝒌','l': '𝒍','m': '𝒎','n': '𝒏',
    'o': '𝒐','p': '𝒑','q': '𝗊','r': '𝒓','s': '𝒔','t': '𝒕','u': '𝒖',
    'v': '𝒗','w': '𝒘','x': '𝒙','y': '𝒚','z': '𝒛',
    'A': '𝑨','B': '𝑩','C': '𝑪','D': '𝑫','E': '𝑬','F': '𝑭','G': '𝑮',
    'H': '𝑯','I': '𝑰','J': '𝑱','K': '𝑲','L': '𝑳','M': '𝑴','N': '𝑵',
    'O': '𝑶','P': '𝑷','Q': '𝑸','R': '𝑹','S': '𝑺','T': '𝑻','U': '𝑼',
    'V': '𝑽','W': '𝑾','X': '𝑿','Y': '𝒀','Z': '𝒁',
    '0': '𝟎','1': '𝟏','2': '𝟐','3': '𝟑','4': '𝟒',
    '5': '𝟓','6': '𝟔','7': '𝟕','8': '𝟖','9': '𝟗'
  };
  return text.split('').map(char => fonts[char] || char).join('');
};

function formatMoney(num) {
  const suffixes = [
    { value: 1e303, symbol: "𝑪𝑵𝑻" }, { value: 1e273, symbol: "𝑵𝑵𝑮" },
    { value: 1e243, symbol: "𝑶𝑮" }, { value: 1e213, symbol: "𝑺𝑷𝑮" },
    { value: 1e183, symbol: "𝑺𝑿𝑮" }, { value: 1e153, symbol: "𝑸𝑰𝑮" },
    { value: 1e123, symbol: "𝑸𝑨𝑮" }, { value: 1e93,  symbol: "𝑻𝑮" },
    { value: 1e63,  symbol: "𝑽𝑮" }, { value: 1e60,  symbol: "𝑵𝑶𝑫" },
    { value: 1e57,  symbol: "𝑶𝑪𝑫" }, { value: 1e54,  symbol: "𝑺𝑷𝑫" },
    { value: 1e51,  symbol: "𝑺𝑿𝑫" }, { value: 1e48,  symbol: "𝑸𝑰𝑫" },
    { value: 1e45,  symbol: "𝑸𝑼𝑻" }, { value: 1e42,  symbol: "𝑻𝑫" },
    { value: 1e39,  symbol: "𝑫𝑫" }, { value: 1e36,  symbol: "𝑼𝑫" },
    { value: 1e33,  symbol: "𝑫𝑪" }, { value: 1e30,  symbol: "𝑵𝑶" },
    { value: 1e27,  symbol: "𝑶𝑪" }, { value: 1e24,  symbol: "𝑺𝑷" },
    { value: 1e21,  symbol: "𝑺𝑿" }, { value: 1e18,  symbol: "𝑸𝑰" },
    { value: 1e15,  symbol: "𝑸𝑫" }, { value: 1e12,  symbol: "𝑻" },
    { value: 1e9,   symbol: "𝑩" }, { value: 1e6,   symbol: "𝑴" },
    { value: 1e3,   symbol: "𝑲" }
  ];
  for (const s of suffixes) {
    if (num >= s.value) return toBoldSerifItalic((num / s.value).toFixed(2)) + s.symbol;
  }
  return toBoldSerifItalic(num.toString());
}

const wheelEmojis = [
  { emoji: "🍒", multiplier: 0.5, weight: 20 },
  { emoji: "🍋", multiplier: 1,   weight: 30 },
  { emoji: "🍊", multiplier: 2,   weight: 25 },
  { emoji: "🍇", multiplier: 3,   weight: 15 },
  { emoji: "💎", multiplier: 5,   weight: 7 },
  { emoji: "💰", multiplier: 10,  weight: 3 }
];

module.exports = {
  config: {
    name: "wheel",
    version: "6.1",
    author: "Saif",
    category: "game",
    countDown: 10,
    shortDescription: "🎡 𝑼𝑳𝑻𝑹𝑨-𝑺𝑻𝑨𝑩𝑳𝑬 𝑾𝑯𝑬𝑬𝑳 𝑮𝑨𝑴𝑬 𝑾𝑰𝑻𝑯 𝑳𝑰𝑴𝑰𝑻",
    guide: { en: "{p}wheel <amount>" }
  },

  onStart: async function ({ api, event, args, usersData }) {
    const { senderID, threadID, messageID } = event;
    const today = new Date().toISOString().split('T')[0];

    if (!fs.existsSync(gameFilePath)) fs.writeJsonSync(gameFilePath, {});
    let userDataFile = fs.readJsonSync(gameFilePath);

    if (!userDataFile[senderID]) {
      userDataFile[senderID] = { lastUpdate: today, games: { wheel: 0 } };
    }

    if (userDataFile[senderID].lastUpdate !== today) {
      userDataFile[senderID].lastUpdate = today;
      // Sob game reset hobe Baby
      if (userDataFile[senderID].games) {
          Object.keys(userDataFile[senderID].games).forEach(g => userDataFile[senderID].games[g] = 0);
      } else {
          userDataFile[senderID].games = { wheel: 0 };
      }
    }

    if ((userDataFile[senderID].games.wheel || 0) >= 20) {
      return api.sendMessage(toBoldSerifItalic("🚫 𝑶𝑶𝑷𝑺! 𝒀𝑶𝑼𝑹 𝑫𝑨𝑰𝑳𝒀 𝑳𝑰𝑴𝑰𝑻 (𝟐𝟎) 𝑰𝑺 𝑶𝑽𝑬𝑹, 𝑩𝑨𝑩𝒀. 𝑪𝑶𝑴𝑬 𝑩𝑨𝑪𝑲 𝑻𝑶𝑴𝑶𝑹𝑹𝑶𝑾! 🎀"), threadID, messageID);
    }

    let betAmount = parseAmount(args[0]);
    if (isNaN(betAmount) || betAmount <= 0) {
      return api.sendMessage(toBoldSerifItalic("❌ 𝑰𝑵𝑽𝑨𝑳𝑰𝑫 𝑩𝑬𝑻! 𝑼𝑺𝑨𝑮𝑬: wheel 500 or 1cnt"), threadID, messageID);
    }

    const user = await usersData.get(senderID);
    if (!user || user.money < betAmount) {
      return api.sendMessage(toBoldSerifItalic("💰 𝑰𝑵𝑺𝑼𝑭𝑭𝑰𝑪𝑰𝑬𝑵𝑻 𝑩𝑨𝑳𝑨𝑵𝑪𝑬! 𝒀𝑶𝑼 𝑯𝑨𝑽𝑬: ") + formatMoney(user?.money || 0), threadID, messageID);
    }

    const loadingMsg = await api.sendMessage(toBoldSerifItalic("🎰 𝑺𝑷𝑰𝑵𝑵𝑰𝑵𝑮 𝑻𝑯𝑬 𝑾𝑯𝑬𝑬𝑳 𝑩𝑨𝑩𝒀... 🎀\n💵 𝑩𝑬𝑻: ") + formatMoney(betAmount), threadID, messageID);

    await new Promise(r => setTimeout(r, 2000));

    const totalWeight = wheelEmojis.reduce((sum, e) => sum + e.weight, 0);
    const rand = Math.random() * totalWeight;
    let cumulative = 0;
    const spinResult = wheelEmojis.find(e => (cumulative += e.weight) >= rand) || wheelEmojis[0];

    const winAmount = (betAmount * spinResult.multiplier) - betAmount;
    const newBalance = user.money + winAmount;
    await usersData.set(senderID, { money: newBalance });

    userDataFile[senderID].games.wheel = (userDataFile[senderID].games.wheel || 0) + 1;
    fs.writeJsonSync(gameFilePath, userDataFile);

    let outcomeText = spinResult.multiplier < 1 
      ? toBoldSerifItalic("❌ 𝑳𝑶𝑺𝑻: ") + formatMoney(betAmount * (1 - spinResult.multiplier))
      : spinResult.multiplier === 1 ? toBoldSerifItalic("➖ 𝑩𝑹𝑶𝑲𝑬 𝑬𝑽𝑬𝑵")
      : toBoldSerifItalic(`✅ 𝑾𝑶𝑵 ${spinResult.multiplier}𝑿! (+`) + formatMoney(winAmount) + toBoldSerifItalic(")");

    const finalResult = `
🎰 ${toBoldSerifItalic("𝑾𝑯𝑬𝑬𝑳 𝑺𝑻𝑶𝑷𝑷𝑬𝑫 𝑶𝑵:")} ${spinResult.emoji}
${outcomeText}
💰 ${toBoldSerifItalic("𝑵𝑬𝑾 𝑩𝑨𝑳𝑨𝑵𝑪𝑬:")} ${formatMoney(newBalance)}
🎀 ${toBoldSerifItalic("𝑹𝑬𝑴𝑨𝑰𝑵𝑰𝑵𝑮 𝑳𝑰𝑴𝑰𝑻:")} ${toBoldSerifItalic((20 - userDataFile[senderID].games.wheel).toString())}
    `.trim();

    return api.editMessage(finalResult, loadingMsconst
