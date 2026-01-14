const fs = require("fs");
const path = __dirname + "/𝒖𝒔𝒆𝒓𝑮𝒂𝒎𝒆𝒔.𝒋𝒔𝒐𝒏";
const cooldowns = new Map();

const loadData = () => {
  try {
    if (!fs.existsSync(path)) fs.writeFileSync(path, JSON.stringify({}));
    return JSON.parse(fs.readFileSync(path));
  } catch (e) { return {}; }
};

const saveData = (data) => {
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
};

const toBoldSerifItalic = (text) => {
  const fonts = {
    'a': '𝒂','b': '𝒃','c': '𝒄','d': '𝒅','e': '𝒆','f': '𝒇','g': '𝒈','h': '𝒉','i': '𝒊','j': '𝒋','k': '𝒌','l': '𝒍','m': '𝒎','n': '𝒏','o': '𝒐','p': '𝒑','q': '𝒒','r': '𝒓','s': '𝒔','t': '𝒕','u': '𝒖','v': '𝒗','w': '𝒘','x': '𝒙','y': '𝒚','z': '𝒛',
    'A': '𝑨','B': '𝑩','C': '𝑪','D': '𝑫','E': '𝑬','F': '𝑭','G': '𝑮','H': '𝑯','I': '𝑰','J': '𝑱','K': '𝑲','L': '𝑳','M': '𝑴','N': '𝑵','O': '𝑶','P': '𝑷','Q': '𝑸','R': '𝑹','S': '𝑺','T': '𝑻','U': '𝑼','V': '𝑽','W': '𝑾','X': '𝑿','Y': '𝒀','Z': '𝒁',
    '0': '𝟎','1': '𝟏','2': '𝟐','3': '𝟑','4': '𝟒','5': '𝟓','6': '𝟔','7': '𝟕','8': '𝟖','9': '𝟗'
  };
  return text.split('').map(char => fonts[char] || char).join('');
};

const parseAmount = (str) => {
  if (!str) return NaN;
  str = str.toLowerCase().replace(/\s+/g, "");
  const suffixes = {
    k: 1e3, m: 1e6, b: 1e9, t: 1e12, qa: 1e15, qi: 1e18, sx: 1e21, sp: 1e24, oc: 1e27, no: 1e30,
    dc: 1e33, ud: 1e36, dd: 1e39, td: 1e42, qad: 1e45, qid: 1e48, sxd: 1e51, spd: 1e54, ocd: 1e57, nod: 1e60,
    vg: 1e63, uvg: 1e66, dvg: 1e69, tvg: 1e72, qavg: 1e75, qivg: 1e78, sxvg: 1e81, spvg: 1e84, ocvg: 1e87, novg: 1e90,
    tg: 1e93, utg: 1e96, dtg: 1e99, c: 1e303 
  };
  let matched = Object.keys(suffixes).sort((a, b) => b.length - a.length).find(suf => str.endsWith(suf));
  let multiplier = matched ? suffixes[matched] : 1;
  if (matched) str = str.slice(0, -matched.length);
  let num = parseFloat(str);
  return isNaN(num) ? NaN : num * multiplier;
};

function formatMoney(num) {
  const suffixes = [
    { value: 1e303, symbol: "𝑪" }, { value: 1e99, symbol: "𝑫𝑻𝑮" }, { value: 1e96, symbol: "𝑼𝑻𝑮" },
    { value: 1e93, symbol: "𝑻𝑮" }, { value: 1e90, symbol: "𝑵𝑶𝑽𝑮" }, { value: 1e87, symbol: "𝑶𝑪𝑽𝑮" },
    { value: 1e84, symbol: "𝑺𝑷𝑽𝑮" }, { value: 1e81, symbol: "𝑺𝑿𝑽𝑮" }, { value: 1e78, symbol: "𝑸𝑰𝑽𝑮" },
    { value: 1e75, symbol: "𝑸𝑨𝑽𝑮" }, { value: 1e72, symbol: "𝑻𝑽𝑮" }, { value: 1e69, symbol: "𝑫𝑽𝑮" },
    { value: 1e66, symbol: "𝑼𝑽𝑮" }, { value: 1e63, symbol: "𝑽𝑮" }, { value: 1e60, symbol: "𝑵𝑶𝑫" },
    { value: 1e33, symbol: "𝑫𝑪" }, { value: 1e30, symbol: "𝑵𝑶" }, { value: 1e27, symbol: "𝑶𝑪" },
    { value: 1e24, symbol: "𝑺𝑷" }, { value: 1e21, symbol: "𝑺𝑿" }, { value: 1e18, symbol: "𝑸𝑰" },
    { value: 1e15, symbol: "𝑸𝑨" }, { value: 1e12, symbol: "𝑻" }, { value: 1e9, symbol: "𝑩" },
    { value: 1e6, symbol: "𝑴" }, { value: 1e3, symbol: "𝑲" }
  ];
  for (const s of suffixes) {
    if (Math.abs(num) >= s.value) return toBoldSerifItalic((num / s.value).toFixed(2)) + s.symbol;
  }
  return toBoldSerifItalic(Math.floor(num).toString());
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
    version: "12.0",
    author: "Saif",
    category: "game",
    countDown: 10,
    shortDescription: "🎡 𝑾𝒉𝒆𝒆𝒍 𝒘𝒊𝒕𝒉 𝒑𝒆𝒓𝒎𝒂𝒏𝒆𝒏𝒕 𝒅𝒂𝒕𝒂 & 𝒇𝒊𝒙𝒆𝒅 𝒃𝒂𝒍𝒂𝒏𝒄𝒆",
    guide: { en: "{p}wheel <amount>" }
  },

  onStart: async function ({ api, event, args, usersData }) {
    const { senderID, threadID, messageID } = event;
    const nowTime = Date.now();
    
    if (cooldowns.has(senderID) && nowTime < cooldowns.get(senderID) + 10000) return;

    const dailyLimit = 20;
    const gameName = "wheel";
    let allData = loadData();
    const today = new Date().toISOString().split('T')[0];

    if (!allData[senderID]) allData[senderID] = { lastUpdate: today, games: {} };
    if (allData[senderID].lastUpdate !== today) {
        allData[senderID].lastUpdate = today;
        allData[senderID].games = {};
    }
    if (!allData[senderID].games[gameName]) allData[senderID].games[gameName] = 0;

    if (allData[senderID].games[gameName] >= dailyLimit) {
      return api.sendMessage(toBoldSerifItalic(`🚫 𝑩𝒂𝒃𝒚, 𝒚𝒐𝒖'𝒗𝒆 𝒖𝒔𝒆𝒅 𝒖𝒑 𝒚𝒐𝒖𝒓 𝒅𝒂𝒊𝒍𝒚 𝒍𝒊𝒎𝒊𝒕 𝒐𝒇 ${dailyLimit} 𝒔𝒑𝒊𝒏𝒔!`), threadID, messageID);
    }

    let betAmount = parseAmount(args[0]);
    if (!betAmount || betAmount <= 0) return api.sendMessage(toBoldSerifItalic("❌ 𝑰𝒏𝒗𝒂𝒍𝒊𝒅 𝒃𝒆𝒕 𝒂𝒎𝒐𝒖𝒏𝒕 𝑩𝒂𝒃𝒚!"), threadID, messageID);

    // Fetch fresh user data before bet check
    let userData = await usersData.get(senderID);
    if (userData.money < betAmount) return api.sendMessage(toBoldSerifItalic("💰 𝑰𝒏𝒔𝒖𝒇𝒇𝒊𝒄𝒊𝒆𝒏𝒕 𝒃𝒂𝒍𝒂𝒏𝒄𝒆! 𝒀𝒐𝒖 𝒉𝒂𝒗𝒆: ") + formatMoney(userData.money), threadID, messageID);

    // Save count and cooldown Baby
    allData[senderID].games[gameName] += 1;
    saveData(allData);
    cooldowns.set(senderID, nowTime);

    const loadingMsg = await api.sendMessage(toBoldSerifItalic(`🎰 𝑺𝒑𝒊𝒏𝒏𝒊𝒏𝒈... (${allData[senderID].games[gameName]}/${dailyLimit})\n💵 𝑩𝒆𝒕: `) + formatMoney(betAmount), threadID, messageID);
    await new Promise(r => setTimeout(r, 2000));

    const totalWeight = wheelEmojis.reduce((sum, e) => sum + e.weight, 0);
    const rand = Math.random() * totalWeight;
    let cumulative = 0;
    const spinResult = wheelEmojis.find(e => (cumulative += e.weight) >= rand) || wheelEmojis[0];

    const winAmount = Math.floor(betAmount * spinResult.multiplier) - betAmount;
    
    // FETCH FRESH DATA AGAIN TO BE SAFE BEFORE UPDATING
    let currentData = await usersData.get(senderID);
    const updatedBalance = currentData.money + winAmount;
    await usersData.set(senderID, { money: updatedBalance });

    let outcomeText = spinResult.multiplier < 1 ? toBoldSerifItalic("❌ 𝑳𝒐𝒔𝒕: ") + formatMoney(betAmount * 0.5) : 
                     spinResult.multiplier === 1 ? toBoldSerifItalic("➖ 𝑩𝒓𝒐𝒌𝒆 𝒆𝒗𝒆𝒏") : 
                     toBoldSerifItalic(`✅ 𝑾𝒐𝒏 ${spinResult.multiplier}𝒙! (+`) + formatMoney(winAmount) + toBoldSerifItalic(")");

    const finalResult = `
🎰 ${toBoldSerifItalic("𝑾𝒉𝒆𝒆𝒍 𝒔𝒕𝒐𝒑𝒑𝒆𝒅 𝒐𝒏:")} ${spinResult.emoji}
${outcomeText}
💰 ${toBoldSerifItalic("𝑵𝒆𝒘 𝒃𝒂𝒍𝒂𝒏𝒄𝒆:")} ${formatMoney(updatedBalance)}
✨ ${toBoldSerifItalic("𝑹𝒆𝒎𝒂𝒊𝒏𝒊𝒏𝒈 𝒍𝒊𝒎𝒊𝒕:")} ${dailyLimit - allData[senderID].games[gameName]}`.trim();

    return api.editMessage(finalResult, loadingMsg.messageID);
  }
};
