const axios = require("axios");

// 💰 Standard Shorthand Parser Baby (K to Ct)
const parseShorthand = (str) => {
  if (!str) return NaN;
  str = str.toLowerCase().replace(/\s+/g, "");
  const map = { 
    k: 1e3, m: 1e6, b: 1e9, t: 1e12, q: 1e15, qd: 1e18, qi: 1e21, sx: 1e24, 
    sp: 1e27, oc: 1e30, no: 1e33, dc: 1e36, udc: 1e39, ddc: 1e42, tdc: 1e45, ct: 1e303 
  };
  let suffix = Object.keys(map).sort((a,b) => b.length - a.length).find(s => str.endsWith(s));
  let multiplier = suffix ? map[suffix] : 1;
  if(suffix) str = str.slice(0, -suffix.length);
  const number = parseFloat(str);
  return isNaN(number) ? NaN : number * multiplier;
};

// ✨ Fancy Font Baby
function fancy(text) {
    const map = {
        'a': '𝒂','b': '𝒃','c': '𝒄','d': '𝒅','e': '𝒆','f': '𝒇','g': '𝒈','h': '𝒉','i': '𝒊','j': '𝒋','k': '𝒌','l': '𝒍','m': '𝒎','n': '𝒏','o': '𝒐','p': '𝒑','q': '𝗊','r': '𝒓','s': '𝒔','t': '𝒕','u': '𝒖','v': '𝒗','w': '𝒘','x': '𝒙','y': '𝒚','z': '𝒛',
        'A': '𝑨','B': '𝑩','C': '𝑪','D': '𝑫','E': '𝑬','F': '𝑭','G': '𝑮','H': '𝑯','I': '𝑰','J': '𝑱','K': '𝑲','L': '𝑳','M': '𝑴','N': '𝑵','O': '𝑶','P': '𝑷','Q': '𝑸','R': '𝑹','S': '𝑺','T': '𝑻','U': '𝑼','V': '𝑽','W': '𝑾','X': '𝑿','Y': '𝒀','Z': '𝒁',
        '0': '𝟎','1': '𝟏','2': '𝟐','3': '𝟑','4': '𝟒','5': '𝟓','6': '𝟔','7': '𝟕','8': '𝟖','9': '𝟗', '.': '.'
    };
    return text.toString().split('').map(char => map[char] || char).join('');
}

// 🏦 Standard Shorthand Formatter Baby
function formatMoney(num) {
  const units = [
    { v: 1e303, s: "𝑪𝒕" }, { v: 1e45, s: "𝑻𝒅𝒄" }, { v: 1e42, s: "𝑫𝒅𝒄" }, { v: 1e39, s: "𝑼𝒅𝒄" },
    { v: 1e36, s: "𝑫𝒄" }, { v: 1e33, s: "𝑵𝒐" }, { v: 1e30, s: "𝑶𝒄" }, { v: 1e27, s: "𝑺𝒑" },
    { v: 1e24, s: "𝑺𝒙" }, { v: 1e21, s: "𝑸𝒊" }, { v: 1e18, s: "𝑸𝒅" }, { v: 1e15, s: "𝑸" },
    { v: 1e12, s: "𝑻" }, { v: 1e9, s: "𝑩" }, { v: 1e6, s: "𝑴" }, { v: 1e3, s: "𝑲" }
  ];
  for (const u of units) {
    if (Math.abs(num) >= u.v) return fancy((num / u.v).toFixed(2)) + u.s;
  }
  return fancy(Math.floor(num).toLocaleString());
}

module.exports = {
  config: {
    name: "slot",
    version: "10.5",
    author: "SAIF ",
    category: "game",
    countDown: 10 
  },

  onStart: async function ({ api, event, args, usersData, role }) {
    const { senderID, threadID, messageID, mentions, messageReply } = event;
    const today = new Date().toISOString().split('T')[0];

    // 🔄 Admin Refresh Logic Baby (Tag/Reply/UID Support)
    if (args[0] === "refresh" && role >= 2) {
      let targetID = messageReply ? messageReply.senderID : (Object.keys(mentions).length > 0 ? Object.keys(mentions)[0] : args[1]);
      if (!targetID) return api.sendMessage(fancy("❌ 𝑼𝒔𝒂𝒈𝒆: 𝒔𝒍𝒐𝒕 𝒓𝒆𝒇𝒓𝒆𝒔𝒉 @𝒕𝒂𝒈 𝒐𝒓 𝑼𝑰𝑫 𝒃𝒂𝒃𝒚"), threadID, messageID);
      
      let tData = await usersData.get(targetID);
      if (!tData.data) tData.data = {};
      tData.data.slotLimit = { lastUpdate: today, count: 0 };
      await usersData.set(targetID, { data: tData.data });
      return api.sendMessage(fancy("✅ 𝑺𝑳𝑶𝑻 𝑳𝑰𝑴𝑰𝑻 𝑹𝑬𝑭𝑹𝑬𝑺𝑯𝑬𝑫 𝑩𝑨𝑩𝒀! 🎀"), threadID, messageID);
    }

    let user = await usersData.get(senderID);
    if (!user.data) user.data = {};
    if (!user.data.slotLimit || user.data.slotLimit.lastUpdate !== today) {
      user.data.slotLimit = { lastUpdate: today, count: 0 };
    }

    if (user.data.slotLimit.count >= 20) {
      return api.sendMessage(fancy("⚠️ 𝒀𝒐𝒖 𝒉𝒂𝒗𝒆 𝒓𝒆𝒂𝒄𝒉𝒆𝒅 𝒚𝒐𝒖𝒓 𝒅𝒂𝒊𝒍𝒚 𝒍𝒊𝒎𝒊𝒕 𝒐𝒇 𝟐𝟎 𝒔𝒑𝒊𝒏𝒔 𝒃𝒂𝒃𝒚!"), threadID, messageID);
    }

    const betAmount = parseShorthand(args[0]);
    if (isNaN(betAmount) || betAmount <= 0) return api.sendMessage(fancy("⚠️ 𝑬𝑵𝑻𝑬𝑹 𝑨 𝑽𝑨𝑳𝑰𝑫 𝑩𝑬𝑻 𝑨𝑴𝑶𝑼𝑵𝑻 𝑩𝑨𝑩𝒀."), threadID, messageID);
    if (betAmount > user.money) return api.sendMessage(fancy("💰 𝑵𝑶𝑻 𝑬𝑵𝑶𝑼𝑮𝑯 𝑩𝑨𝑳𝑨𝑵𝑪𝑬 𝑩𝑨𝑩𝒀."), threadID, messageID);

    const slots = ["❤️","💛","💚","💙","💎","👑","🪙"];
    const winChance = Math.random();
    let s1, s2, s3;

    if (winChance < 0.45) {
      const winType = Math.random();
      if (winType < 0.01) s1 = s2 = s3 = "🪙";
      else if (winType < 0.05) s1 = s2 = s3 = "👑";
      else if (winType < 0.15) s1 = s2 = s3 = "💎";
      else {
        s1 = slots[Math.floor(Math.random() * slots.length)];
        s2 = s1;
        s3 = Math.random() < 0.4 ? s1 : slots[Math.floor(Math.random() * slots.length)];
      }
    } else {
      s1 = slots[Math.floor(Math.random() * slots.length)];
      s2 = slots.filter(s => s !== s1)[Math.floor(Math.random() * (slots.length - 1))];
      s3 = slots[Math.floor(Math.random() * slots.length)];
    }

    function calculateWinnings(a, b, c, bet) {
      if (a === "🪙" && b === "🪙" && c === "🪙") return bet * 500;
      if (a === "👑" && b === "👑" && c === "👑") return bet * 100;
      if (a === "💎" && b === "💎" && c === "💎") return bet * 50;
      if (a === b && b === c) return bet * 15;
      if (a === b || a === c || b === c) return bet * 2;
      return -bet;
    }

    const winnings = calculateWinnings(s1, s2, s3, betAmount);
    user.data.slotLimit.count += 1;
    const newBalance = user.money + winnings;

    await usersData.set(senderID, { money: newBalance, data: user.data });

    let winStatus = winnings > 0 ? fancy("𝑾𝒐𝒏") : fancy("𝑳𝒐𝒔𝒕");
    if (s1 === "🪙" && s2 === "🪙" && s3 === "🪙") winStatus = fancy("🔥 𝑩𝑰𝑮𝑮𝑬𝑺𝑻 𝑾𝑶𝑵 🔥");

    const resultMsg = `🎀
• ${fancy("𝑩𝒂𝒃𝒚, 𝒀𝒐𝒖")} ${winStatus} ${formatMoney(Math.abs(winnings))}!
• ${fancy("𝑮𝒂𝒎𝒆 𝑹𝒆𝒔𝒖𝒍𝒕𝒔:")} [ ${s1} | ${s2} | ${s3} ]
• ${fancy("𝑩𝒂𝒍𝒂𝒏𝒄𝒆:")} ${formatMoney(newBalance)}
• ${fancy("𝑫𝒂𝒊𝒍𝒚 𝑼𝒔𝒆:")} ${fancy(user.data.slotLimit.count)}/𝟐𝟎 𝒃𝒂𝒃𝒚`;

    return api.sendMessage(resultMsg, threadID, messageID);
  }
};
