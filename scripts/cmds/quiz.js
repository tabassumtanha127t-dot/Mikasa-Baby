const axios = require("axios");

const sessions = new Map();
const cooldowns = new Map();
const QUIZ_URL = "https://raw.githubusercontent.com/SAIFUL-404-ST/quiz-api/main/quizzes.json";

// Math Bold Italic Font Baby
const formatText = (text) => {
  const map = {
    'a': '𝒂', 'b': '𝒃', 'c': '𝒄', 'd': '𝒅', 'e': '𝒆', 'f': '𝒇', 'g': '𝒈', 'h': '𝒉', 'i': '𝒊', 'j': '𝒋',
    'k': '𝒌', 'l': '𝒍', 'm': '𝒎', 'n': '𝒏', 'o': '𝒐', 'p': '𝒑', 'q': '𝒒', 'r': '𝒓', 's': '𝒔', 't': '𝒕',
    'u': '𝒖', 'v': '𝒗', 'w': '𝒘', 'x': '𝒙', 'y': '𝒚', 'z': '𝒛',
    'A': '𝑨', 'B': '𝑩', 'C': '𝑪', 'D': '𝑫', 'E': '𝑬', 'F': '𝑭', 'G': '𝑮', 'H': '𝑯', 'I': '𝑰', 'J': '𝑱',
    'K': '𝑲', 'L': '𝑳', 'M': '𝑴', 'N': '𝑵', 'O': '𝑶', 'P': '𝑷', 'Q': '𝑸', 'R': '𝑹', 'S': '𝑺', 'T': '𝑻',
    'U': '𝑼', 'V': '𝑽', 'W': '𝑾', 'X': '𝑿', 'Y': '𝒀', 'Z': '𝒁',
    '0': '𝟎', '1': '𝟏', '2': '𝟐', '3': '𝟑', '4': '𝟒', '5': '𝟓', '6': '𝟔', '7': '𝟕', '8': '𝟖', '9': '𝟗'
  };
  return text.split('').map(char => map[char] || char).join('');
};

module.exports = {
  config: {
    name: "quiz",
    aliases: ["qz"],
    version: "16.0",
    author: "Saif & Gemini",
    countDown: 5,
    role: 0,
    category: "game",
    description: "📝 𝑼𝑳𝑻𝑹𝑨-𝑸𝑼𝑰𝒁 𝑴𝑶𝑵𝑮𝑶𝑫𝑩 𝑩𝑨𝑩𝒀"
  },

  onStart: async function ({ api, event, usersData, args }) {
    const { threadID, messageID, senderID } = event;
    const now = Date.now();

    if (args[0] === "rank") {
      const allUsers = await usersData.getAll();
      const rankList = allUsers
        .filter(u => u.data && u.data.quizStats)
        .sort((a, b) => b.data.quizStats.won - a.data.quizStats.won)
        .slice(0, 10);

      if (rankList.length === 0) return api.sendMessage(formatText("𝑵𝒐 𝒑𝒍𝒂𝒚𝒆𝒓𝒔 𝒚𝒆𝒕 𝑩𝒂𝒃𝒚 🥹"), threadID, messageID);

      let msg = `🏆 ${formatText("𝑸𝒖𝒊𝒁 𝑹𝒂𝒏𝒌𝒊𝒏𝒈 𝑩𝒂𝒃𝒚")} 🏆\n━━━━━━━━━━━━━━━━━━\n`;
      rankList.forEach((u, i) => {
        msg += `${i + 1}. ${formatText(u.name)} — 🏆 ${u.data.quizStats.won}\n`;
      });
      return api.sendMessage(msg, threadID, messageID);
    }

    if (cooldowns.has(senderID) && now - cooldowns.get(senderID) < 5000) return;
    cooldowns.set(senderID, now);

    try {
      const res = await axios.get(QUIZ_URL);
      const questions = res.data[0].questions;
      const q = questions[Math.floor(Math.random() * questions.length)];

      let optionsMsg = '';
      ['a', 'b', 'c', 'd'].forEach(l => {
        if (q.options[l]) optionsMsg += `\n${formatText(l.toUpperCase() + '.')} ${formatText(q.options[l])}`;
      });

      const quizMsg = `
📝 ${formatText("𝑸𝒖𝒆𝒔𝒕𝒊𝒐𝒏:")} ${q.text}
━━━━━━━━━━━━━━━━━━${optionsMsg}

⏰ ${formatText("𝒀𝒐𝒖 𝒉𝒂𝒗𝒆 𝟔𝟎 𝒔𝒆𝒄𝒐𝒏𝒅𝒔!")}
💡 ${formatText("𝑹𝒆𝒑𝒍𝒚 𝒘𝒊𝒕𝒉: 𝒂, 𝒃, 𝒄 𝒐𝒓 𝒅 𝒃𝒂𝒃𝒚")}`;

      api.sendMessage(quizMsg, threadID, (err, info) => {
        const sessionId = info.messageID;
        const timeoutId = setTimeout(() => {
          if (sessions.has(sessionId)) {
            sessions.delete(sessionId);
            api.editMessage(formatText("⏰ 𝑻𝒊𝒎𝒆'𝒔 𝒖𝒑! 𝑸𝒖𝒊𝒛 𝒆𝒙𝒑𝒊𝒓𝒆𝒅 𝑩𝒂𝒃𝒚."), info.messageID);
          }
        }, 60000);

        sessions.set(sessionId, { answer: q.answer.toLowerCase(), author: senderID, timeoutId });
        global.GoatBot.onReply.set(info.messageID, { commandName: this.config.name, author: senderID, sessionId });
      }, messageID);

    } catch (e) { return api.sendMessage(formatText("❌ 𝑭𝒂𝒊𝒍𝒆𝒅 𝒕𝒐 𝒍𝒐𝒂𝒅 𝒒𝒖𝒊𝒛 𝒃𝒂𝒃𝒚."), threadID, messageID); }
  },

  onReply: async function ({ event, api, Reply, usersData }) {
    const { senderID, body, threadID, messageID } = event;
    const { author, sessionId } = Reply;

    if (senderID !== author) return api.sendMessage(formatText("🐸 𝑵𝒐𝒕 𝒚𝒐𝒖𝒓 𝒒𝒖𝒊𝒛 𝑩𝒂𝒃𝒚!"), threadID, messageID);
    const session = sessions.get(sessionId);
    if (!session) return;

    clearTimeout(session.timeoutId);
    sessions.delete(sessionId);
    try { await api.unsendMessage(messageID); } catch(e) {}

    const isCorrect = body.trim().toLowerCase() === session.answer;
    let user = await usersData.get(senderID);
    if (!user.data) user.data = {};
    if (!user.data.quizStats) user.data.quizStats = { won: 0, played: 0 };

    user.data.quizStats.played += 1;
    let rewardMsg = "";

    if (isCorrect) {
      user.data.quizStats.won += 1;
      const reward = 500;
      await usersData.set(senderID, { money: (user.money || 0) + reward, data: user.data });
      rewardMsg = `• ${formatText("𝑩𝒂𝒃𝒚, 𝒀𝒐𝒖 𝑾𝒐𝒏 ")}${reward} ${formatText("𝒄𝒐𝒊𝒏𝒔!")}`;
    } else {
      await usersData.set(senderID, { data: user.data });
      rewardMsg = `• ${formatText("𝑩𝒂𝒃𝒚, 𝒀𝒐𝒖 𝑳𝒐𝒔𝒕!")}\n• ${formatText("𝑪𝒐𝒓𝒓𝒆𝒄𝒕:")} ${formatText(session.answer.toUpperCase())}`;
    }

    const result = `
🎀
${rewardMsg}
• ${formatText("𝑻𝒐𝒕𝒂𝒍 𝑾𝒊𝒏𝒔:")} ${formatText(user.data.quizStats.won.toString())}
• ${formatText("𝑷𝒍𝒂𝒚𝒆𝒅:")} ${formatText(user.data.quizStats.played.toString())}
    `.trim();

    return api.editMessage(result, sessionId);
  }
};
