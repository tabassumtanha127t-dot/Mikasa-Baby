const axios = require("axios");

const sessions = new Map();
const cooldowns = new Map();
const QUIZ_URL = "https://raw.githubusercontent.com/SAIFUL-404-ST/quiz-api/main/quizzes.json";

// Premium Font Helper Baby
const fancy = (text) => {
  const map = {
    'a': '𝒂', 'b': '𝒃', 'c': '𝒄', 'd': '𝒅', 'e': '𝒆', 'f': '𝒇', 'g': '𝒈', 'h': '𝒉', 'i': '𝒊', 'j': '𝒋',
    'k': '𝒌', 'l': '𝒍', 'm': '𝒎', 'n': '𝒏', 'o': '𝒐', 'p': '𝒑', 'q': '𝒒', 'r': '𝒓', 's': '𝒔', 't': '𝒕',
    'u': '𝒖', 'v': '𝒗', 'w': '𝒘', 'x': '𝒙', 'y': '𝒚', 'z': '𝒛',
    'A': '𝑨', 'B': '𝑩', 'C': '𝑪', 'D': '𝑫', 'E': '𝑬', 'F': '𝑭', 'G': '𝑮', 'H': '𝑯', 'I': '𝑰', 'J': '𝑱',
    'K': '𝑲', 'L': '𝑳', 'M': '𝑴', 'N': '𝑵', 'O': '𝑶', 'P': '𝑷', 'Q': '𝑸', 'R': '𝑹', 'S': '𝑺', 'T': '𝑻',
    'U': '𝑼', 'V': '𝑽', 'W': '𝑾', 'X': '𝑿', 'Y': '𝒀', 'Z': '𝒁',
    '0': '𝟎', '1': '𝟏', '2': '𝟐', '3': '𝟑', '4': '𝟒', '5': '𝟓', '6': '𝟔', '7': '𝟕', '8': '𝟖', '9': '𝟗'
  };
  return text.toString().split('').map(char => map[char] || char).join('');
};

module.exports = {
  config: {
    name: "quiz",
    aliases: ["qz"],
    version: "18.0",
    author: "Saif & Gemini",
    countDown: 5,
    role: 0,
    category: "game",
    description: "📝 𝑷𝑹𝑬𝑴𝑰𝑼𝑴 𝑸𝑼𝑰𝒁 𝑾𝑰𝑻𝑯 𝑴𝑶𝑵𝑬𝒀 𝑭𝑰𝑿 𝑩𝑨𝑩𝒀"
  },

  onStart: async function ({ api, event, usersData, args }) {
    const { threadID, messageID, senderID } = event;
    const now = Date.now();

    // Rank List Logic Baby
    if (args[0] === "rank" || args[0] === "list") {
      const allUsers = await usersData.getAll();
      const rankList = allUsers
        .filter(u => u.data && u.data.quizStats)
        .sort((a, b) => (b.data.quizStats.won || 0) - (a.data.quizStats.won || 0))
        .slice(0, 10);

      if (rankList.length === 0) return api.sendMessage(fancy("𝑵𝒐 𝒑𝒍𝒂𝒚𝒆𝒓𝒔 𝒊𝒏 𝒓𝒂𝒏𝒌𝒊𝒏𝒈 𝒚𝒆𝒕 𝑩𝒂𝒃𝒚 🥹"), threadID, messageID);

      let rankMsg = `🏆 ${fancy("𝑸𝒖𝒊𝒁 𝑹𝒂𝒏𝒌𝒊𝒏𝒈 𝑩𝒂𝒃𝒚")} 🏆\n━━━━━━━━━━━━━━━━━━\n`;
      rankList.forEach((u, i) => {
        rankMsg += `${i + 1}. ${fancy(u.name)} — 🏆 ${fancy(u.data.quizStats.won)}\n`;
      });
      return api.sendMessage(rankMsg, threadID, messageID);
    }

    if (cooldowns.has(senderID) && now - cooldowns.get(senderID) < 5000) return;
    cooldowns.set(senderID, now);

    try {
      const res = await axios.get(QUIZ_URL);
      const questions = res.data[0].questions;
      const q = questions[Math.floor(Math.random() * questions.length)];

      let optionsMsg = '';
      ['a', 'b', 'c', 'd'].forEach(l => {
        if (q.options[l]) optionsMsg += `\n${fancy(l.toUpperCase() + '.')} ${fancy(q.options[l])}`;
      });

      const quizContent = `
📝 ${fancy("𝑸𝒖𝒆𝒔𝒕𝒊𝒐𝒏:")} ${q.text}
━━━━━━━━━━━━━━━━━━${optionsMsg}

⏰ ${fancy("𝒀𝒐𝒖 𝒉𝒂𝒗𝒆 𝟔𝟎 𝒔𝒆𝒄𝒐𝒏𝒅𝒔!")}
💡 ${fancy("𝑹𝒆𝒑𝒍𝒚 𝒘𝒊𝒕𝒉: 𝒂, 𝒃, 𝒄 𝒐𝒓 𝒅 𝒃𝒂𝒃𝒚")}`;

      api.sendMessage(quizContent, threadID, (err, info) => {
        const timeoutId = setTimeout(() => {
          if (sessions.has(info.messageID)) {
            sessions.delete(info.messageID);
            api.editMessage(fancy("⏰ 𝑻𝒊𝒎𝒆'𝒔 𝒖𝒑! 𝑸𝒖𝒊𝒛 𝒆𝒙𝒑𝒊𝒓𝒆𝒅 𝑩𝒂𝒃𝒚."), info.messageID);
          }
        }, 60000);

        sessions.set(info.messageID, { 
          answer: q.answer.toLowerCase().trim(), 
          author: senderID, 
          timeoutId 
        });
        global.GoatBot.onReply.set(info.messageID, { 
          commandName: this.config.name, 
          author: senderID, 
          sessionId: info.messageID 
        });
      }, messageID);

    } catch (e) { 
      return api.sendMessage(fancy("❌ 𝑭𝒂𝒊𝒍𝒆𝒅 𝒕𝒐 𝒍𝒐𝒂𝒅 𝒒𝒖𝒊𝒛 𝒃𝒂𝒃𝒚."), threadID, messageID); 
    }
  },

  onReply: async function ({ event, api, Reply, usersData }) {
    const { senderID, body, threadID, messageID } = event;
    const { author, sessionId } = Reply;

    if (senderID !== author) return api.sendMessage(fancy("🐸 𝑵𝒐𝒕 𝒚𝒐𝒖𝒓 𝒒𝒖𝒊𝒛 𝑩𝒂𝒃𝒚!"), threadID, messageID);
    const session = sessions.get(sessionId);
    if (!session) return;

    clearTimeout(session.timeoutId);
    sessions.delete(sessionId);
    try { await api.unsendMessage(messageID); } catch(e) {}

    const isCorrect = body.trim().toLowerCase() === session.answer;
    let user = await usersData.get(senderID);
    
    // Data Initialization Baby
    if (!user.data) user.data = {};
    if (!user.data.quizStats) user.data.quizStats = { won: 0, played: 0 };
    user.data.quizStats.played += 1;

    let rewardMsg = "";
    let finalMoney = user.money || 0;

    if (isCorrect) {
      user.data.quizStats.won += 1;
      const reward = 500;
      finalMoney += reward;
      
      // Saving both money and stats Baby
      await usersData.set(senderID, { 
        money: finalMoney, 
        data: user.data 
      });
      rewardMsg = `• ${fancy("𝑩𝒂𝒃𝒚, 𝒀𝒐𝒖 𝑾𝒐𝒏 ")}${fancy(reward)} ${fancy("𝒄𝒐𝒊𝒏𝒔!")}`;
    } else {
      await usersData.set(senderID, { data: user.data });
      rewardMsg = `• ${fancy("𝑩𝒂𝒃𝒚, 𝒀𝒐𝒖 𝑳𝒐𝒔𝒕!")}\n• ${fancy("𝑪𝒐𝒓𝒓𝒆𝒄𝒕:")} ${fancy(session.answer.toUpperCase())}`;
    }

    const resultMsg = `
🎀
${rewardMsg}
• ${fancy("𝑩𝒂𝒍𝒂𝒏𝒄𝒆:")} ${fancy(finalMoney.toLocaleString())}
• ${fancy("𝑻𝒐𝒕𝒂𝒍 𝑾𝒊𝒏𝒔:")} ${fancy(user.data.quizStats.won)}
• ${fancy("𝑷𝒍𝒂𝒚𝒆𝒅:")} ${fancy(user.data.quizStats.played)} 𝒃𝒂𝒃𝒚
    `.trim();

    return api.editMessage(resultMsg, sessionId);
  }
};
