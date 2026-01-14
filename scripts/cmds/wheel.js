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

// --- Updated Suffixes with QD Baby ---
const suffixes = [
  { value: 1e303, symbol: "𝑪" },   { value: 1e99,  symbol: "𝑫𝑻𝑮" }, { value: 1e96,  symbol: "𝑼𝑻𝑮" },
  { value: 1e93,  symbol: "𝑻𝑮" },  { value: 1e90,  symbol: "𝑵𝑶𝑽𝑮" }, { value: 1e87,  symbol: "𝑶𝑪𝑽𝑮" },
  { value: 1e84,  symbol: "𝑺𝑷𝑽𝑮" }, { value: 1e81,  symbol: "𝑺𝑿𝑽𝑮" }, { value: 1e78,  symbol: "𝑸𝑰𝑽𝑮" },
  { value: 1e75,  symbol: "𝑸𝑨𝑽𝑮" }, { value: 1e72,  symbol: "𝑻𝑽𝑮" },  { value: 1e69,  symbol: "𝑫𝑽𝑮" },
  { value: 1e66,  symbol: "𝑼𝑽𝑮" }, { value: 1e63,  symbol: "𝑽𝑮" },   { value: 1e60,  symbol: "𝑵𝑶𝑫" },
  { value: 1e57,  symbol: "𝑶𝑪𝑫" }, { value: 1e54,  symbol: "𝑺𝑷𝑫" },  { value: 1e51,  symbol: "𝑺𝑿𝑫" },
  { value: 1e48,  symbol: "𝑸𝑰𝑫" }, { value: 1e45,  symbol: "𝑸𝑫" },   { value: 1e42,  symbol: "𝑻𝑫" },
  { value: 1e39,  symbol: "𝑫𝑫" },   { value: 1e36,  symbol: "𝑼𝑫" },   { value: 1e33,  symbol: "𝑫𝑪" },
  { value: 1e30,  symbol: "𝑵𝑶" },   { value: 1e27,  symbol: "𝑶𝑪" },   { value: 1e24,  symbol: "𝑺𝑷" },
  { value: 1e21,  symbol: "𝑺𝑿" },   { value: 1e18,  symbol: "𝑸𝑰" },   { value: 1e15,  symbol: "𝑸𝑫" },
  { value: 1e12,  symbol: "𝑻" },    { value: 1e9,   symbol: "𝑩" },    { value: 1e6,   symbol: "𝑴" },
  { value: 1e3,   symbol: "𝑲" }
];

const parseAmount = (str) => {
  if (!str) return NaN;
  str = str.toLowerCase().replace(/\s+/g, "");
  let matched = suffixes.find(s => str.endsWith(s.symbol.toLowerCase()));
  let multiplier = matched ? matched.value : 1;
  let numStr = matched ? str.slice(0, -matched.symbol.length) : str;
  let num = parseFloat(numStr);
  return isNaN(num) ? NaN : num * multiplier;
};

function formatMoney(num) {
  if (!isFinite(num)) return toBoldSerifItalic("𝑰𝒏𝒇𝒊𝒏𝒊𝒕𝒚");
  for (const s of suffixes) {
    if (Math.abs(num) >= s.value) {
      let val = (num / s.value).toFixed(2);
      if (val.endsWith(".00")) val = val.slice(0, -3);
      return toBoldSerifItalic(val) + s.symbol;
    }
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
    version: "15.0",
    author: "Saif",
    category: "game",
    countDown: 10,
    shortDescription: "🎡 𝑾𝒉𝒆𝒆𝒍 𝒘𝒊𝒕𝒉 𝑸𝑫 𝒔𝒖𝒇𝒇𝒊𝒙 𝒇𝒊𝒙"
  },

  onStart: async function ({ api, event, args, usersData }) {
    const { senderID, threadID, messageID } = event;
    const nowTime = Date.now();
    if (cooldowns.has(senderID) && nowTime < cooldowns.get(senderID) + 10000) return;

    const gameName = "wheel";
    const dailyLimit = 20;
    let allData = loadData();
    const today = new Date().toISOString().split('T')[0];

    if (!allData[senderID]) allData[senderID] = { lastUpdate: today, games: {} };
    if (allData[senderID].lastUpdate !== today) {
      allData[senderID].lastUpdate = today;
      allData[senderID].games = {};
    }
    if (!allData[senderID].games[gameName]) allData[senderID].games[gameName] = 0;

    if (allData[senderID].games[gameName] >= dailyLimit) {
      return api.sendMessage(toBoldSerifItalic(`🚫 𝑩𝒂𝒃𝒚, 𝒍𝒊𝒎𝒊𝒕 𝒔𝒉𝒆𝒔𝒉!`), threadID, messageID);
    }

    let betAmount = parseAmount(args[0]);
    if (isNaN(betAmount) || betAmount <= 0) return api.sendMessage(toBoldSerifItalic("❌ 𝑰𝒏𝒗𝒂𝒍𝒊𝒅 𝒃𝒆𝒕!"), threadID, messageID);

    let userData = await usersData.get(senderID);
    if (userData.money < betAmount) {
      return api.sendMessage(toBoldSerifItalic("💰 𝑳𝒐𝒘 𝒃𝒂𝒍𝒂𝒏𝒄𝒆: ") + formatMoney(userData.money), threadID, messageID);
    }

    const balanceAfterBet = userData.money - betAmount;
    await usersData.set(senderID, { money: balanceAfterBet });
    allData[senderID].games[gameName] += 1;
    saveData(allData);
    cooldowns.set(senderID, nowTime);

    const loadingMsg = await api.sendMessage(toBoldSerifItalic(`🎰 𝑺𝒑𝒊𝒏... (${allData[senderID].games[gameName]}/${dailyLimit})`), threadID, messageID);
    await new Promise(r => setTimeout(r, 2000));

    const totalWeight = wheelEmojis.reduce((sum, e) => sum + e.weight, 0);
    const rand = Math.random() * totalWeight;
    let cumulative = 0;
    const spinResult = wheelEmojis.find(e => (cumulative += e.weight) >= rand) || wheelEmojis[0];

    const payout = Math.floor(betAmount * spinResult.multiplier);
    const finalBalance = balanceAfterBet + payout;
    await usersData.set(senderID, { money: finalBalance });

    let outcomeText = spinResult.multiplier < 1 ? toBoldSerifItalic("❌ 𝑳𝒐𝒔𝒕: ") + formatMoney(betAmount - payout) : 
                     toBoldSerifItalic(`✅ 𝑾𝒐𝒏! +`) + formatMoney(Math.abs(payout - betAmount));

    const finalResult = `🎰 ${spinResult.emoji}\n${outcomeText}\n💰 𝑩𝒂𝒍𝒂𝒏𝒄𝒆: ${formatMoney(finalBalance)}\n✨ 𝑳𝒊𝒎𝒊𝒕: ${dailyLimit - allData[senderID].games[gameName]}`;
    return api.editMessage(finalResult, loadingMsg.messageID);
  }
};
