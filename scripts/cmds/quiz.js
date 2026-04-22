const axios = require("axios");

const sessions = new Map();
const cooldowns = new Map();
const QUIZ_URL = "https://raw.githubusercontent.com/SAIFUL-404-ST/quiz-api/main/quizzes.json";

const fancy = (text) => {
  const map = {
    'a': '𝐚', 'b': '𝐛', 'c': '𝐜', 'd': '𝐝', 'e': '𝐞', 'f': '𝐟', 'g': '𝐠', 'h': '𝐡', 'i': '𝐢', 'j': '𝐣',
    'k': '𝐤', 'l': '𝐥', 'm': '𝐦', 'n': '𝐧', 'o': '𝐨', 'p': '𝐩', 'q': '𝐪', 'r': '𝐫', 's': '𝐬', 't': '𝐭',
    'u': '𝐮', 'v': '𝐯', 'w': '𝐰', 'x': '𝐱', 'y': '𝐲', 'z': '𝐳',
    'A': '𝐀', 'B': '𝐁', 'C': '𝐂', 'D': '𝐃', 'E': '𝐄', 'F': '𝐅', 'G': '𝐆', 'H': '𝐇', 'I': '𝐈', 'J': '𝐉',
    'K': '𝐊', 'L': '𝐋', 'M': '𝐌', 'N': '𝐍', 'O': '𝐎', 'P': '𝐏', 'Q': '𝐐', 'R': '𝐑', 'S': '𝐒', 'T': '𝐓',
    'U': '𝐔', 'V': '𝐕', 'W': '𝐖', 'X': '𝐗', 'Y': '𝐘', 'Z': '𝐙',
    '0': '𝟎', '1': '𝟏', '2': '𝟐', '3': '𝟑', '4': '𝟒', '5': '𝟓', '6': '𝟔', '7': '𝟕', '8': '𝟖', '9': '𝟗'
  };
  return text.toString().split('').map(char => map[char] || char).join('');
};

module.exports = {
  config: {
    name: "quiz",
    aliases: ["qz"],
    version: "22.2",
    author: "Saif & Gemini",
    countDown: 5,
    role: 0,
    category: "game",
    description: "𝐒𝐓𝐘𝐋𝐈𝐒𝐇 𝐐𝐔𝐈𝐙 𝐖𝐈𝐓𝐇 𝐀𝐋𝐋 𝐏𝐋𝐀𝐘𝐄𝐑 𝐑𝐀𝐍𝐊𝐈𝐍𝐆 𝐁𝐀𝐁𝐘"
  },

  onStart: async function ({ api, event, usersData, args }) {
    const { threadID, messageID, senderID } = event;
    const now = Date.now();

    let user = await usersData.get(senderID);
    if (!user.data) user.data = {};
    if (!user.data.quizStats) user.data.quizStats = { won: 0, played: 0, dailyUsage: 0, lastDate: "" };

    const today = new Date().toLocaleDateString();
    if (user.data.quizStats.lastDate !== today) {
      user.data.quizStats.dailyUsage = 0;
      user.data.quizStats.lastDate = today;
    }

    if (args[0] === "rank") {
      const allUsers = await usersData.getAll();
      const rankList = allUsers
        .filter(u => u.data && u.data.quizStats && u.data.quizStats.played > 0)
        .sort((a, b) => (b.data.quizStats.won || 0) - (a.data.quizStats.won || 0));

      if (rankList.length === 0)
        return api.sendMessage("𝐍𝐨 𝐨𝐧𝐞 𝐡𝐚𝐬 𝐩𝐥𝐚𝐲𝐞𝐝 𝐲𝐞𝐭, 𝐁𝐚𝐛𝐲!", threadID, messageID);

      let rankMsg = `╭───━━━━🌟━━━━───╮\n      𝐀𝐋𝐋 𝐏𝐋𝐀𝐘𝐄𝐑 𝐑𝐀𝐍𝐊𝐈𝐍𝐆\n━━━━━━━━━━━━━━━━━━\n`;
      rankList.forEach((u, i) => {
        rankMsg += ` ${i + 1}. ${fancy(u.name)} — ${fancy(u.data.quizStats.won)} 𝐖𝐢𝐧𝐬\n`;
      });
      rankMsg += `━━━━━━━━━━━━━━━━━━\n   𝐓𝐨𝐭𝐚𝐥 𝐏𝐥𝐚𝐲𝐞𝐫𝐬: ${fancy(rankList.length)}\n╰───━━━━🌟━━━━───╯`;
      return api.sendMessage(rankMsg, threadID, messageID);
    }

    if (user.data.quizStats.dailyUsage >= 20) {
      return api.sendMessage(
        `⚠️ 𝐋𝐢𝐦𝐢𝐭 𝐑𝐞𝐚𝐜𝐡𝐞𝐝\n━━━━━━━━━━━━━━━━━━\n𝐁𝐚𝐛𝐲, 𝐲𝐨𝐮'𝐯𝐞 𝐮𝐬𝐞𝐝 𝐲𝐨𝐮𝐫 𝟐𝟎 𝐭𝐮𝐫𝐧𝐬 𝐭𝐨𝐝𝐚𝐲. 𝐂𝐨𝐦𝐞 𝐛𝐚𝐜𝐤 𝐭𝐨𝐦𝐨𝐫𝐫𝐨𝐰!`,
        threadID, messageID
      );
    }

    if (cooldowns.has(senderID) && now - cooldowns.get(senderID) < 5000) return;
    cooldowns.set(senderID, now);

    try {
      const res = await axios.get(QUIZ_URL);

      const questions = Array.isArray(res.data)
        ? (res.data[0] && res.data[0].questions)
        : res.data.questions;

      if (!Array.isArray(questions) || questions.length === 0) {
        return api.sendMessage("❌ 𝐐𝐮𝐢𝐳 𝐝𝐚𝐭𝐚 𝐞𝐦𝐩𝐭𝐲 𝐛𝐚𝐛𝐲.", threadID, messageID);
      }

      const q = questions[Math.floor(Math.random() * questions.length)];

      let optionsMsg = '';
      ['a', 'b', 'c', 'd'].forEach(l => {
        if (q.options[l]) optionsMsg += `  ${fancy(l.toUpperCase())} ❯ ${q.options[l]}\n`;
      });

      const quizContent = `╭───━━━━🌟━━━━───╮\n  ${q.text}\n━━━━━━━━━━━━━━━━━━\n${optionsMsg}╰───━━━━🌟━━━━───╯\n𝐁𝐚𝐛𝐲, 𝐫𝐞𝐩𝐥𝐲 𝐰𝐢𝐭𝐡 𝐭𝐡𝐞 𝐨𝐩𝐭𝐢𝐨𝐧!`;

      api.sendMessage(quizContent, threadID, (err, info) => {
        if (err) return;
        user.data.quizStats.dailyUsage += 1;
        usersData.set(senderID, { data: user.data });

        const timeoutId = setTimeout(() => {
          if (sessions.has(info.messageID)) {
            sessions.delete(info.messageID);
            api.editMessage(
              `⌛ 𝐓𝐢𝐦𝐞'𝐬 𝐔𝐩 𝐁𝐚𝐛𝐲!\n━━━━━━━━━━━━━━━━━━\n𝐓𝐡𝐞 𝐜𝐨𝐫𝐫𝐞𝐜𝐭 𝐨𝐧𝐞 𝐰𝐚𝐬: ${fancy(q.answer.toUpperCase())}`,
              info.messageID
            );
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
      console.error("Quiz load error:", e.message);
      return api.sendMessage("❌ 𝐅𝐚𝐢𝐥𝐞𝐝 𝐭𝐨 𝐥𝐨𝐚𝐝 𝐪𝐮𝐢𝐳 𝐛𝐚𝐛𝐲.", threadID, messageID);
    }
  },

  onReply: async function ({ event, api, Reply, usersData }) {
    const { senderID, body } = event;
    const session = sessions.get(Reply.sessionId);
    if (!session || senderID !== session.author) return;

    clearTimeout(session.timeoutId);
    sessions.delete(Reply.sessionId);
    try { await api.unsendMessage(event.messageID); } catch (e) {}

    const isCorrect = body.trim().toLowerCase() === session.answer;
    let userData = await usersData.get(senderID);
    let quizStats = userData.data.quizStats;
    quizStats.played += 1;

    let status = "";
    let finalMoney = userData.money || 0;

    if (isCorrect) {
      quizStats.won += 1;
      const reward = 1000;
      finalMoney += reward;
      status = `✨ 𝐘𝐨𝐮'𝐫𝐞 𝐁𝐫𝐢𝐥𝐥𝐢𝐚𝐧𝐭 𝐁𝐚𝐛𝐲! ✨\n━━━━━━━━━━━━━━━━━━\n💰 𝐂𝐨𝐢𝐧𝐬: +${fancy(reward)}\n🏆 𝐓𝐨𝐭𝐚𝐥 𝐖𝐢𝐧𝐬: ${fancy(quizStats.won)}`;
    } else {
      status = `💔 𝐎𝐨𝐩𝐬, 𝐖𝐫𝐨𝐧𝐠 𝐁𝐚𝐛𝐲! 💔\n━━━━━━━━━━━━━━━━━━\n✅ 𝐀𝐧𝐬𝐰𝐞𝐫: ${fancy(session.answer.toUpperCase())}\n🏆 𝐖𝐢𝐧𝐬: ${fancy(quizStats.won)}`;
    }

    await usersData.set(senderID, {
      money: finalMoney,
      data: { ...userData.data, quizStats: quizStats }
    });

    const resultMsg = `╭───━━━━🌟━━━━───╮\n      𝐐𝐔𝐈𝐙 𝐑𝐄𝐒𝐔𝐋𝐓\n━━━━━━━━━━━━━━━━━━\n${status}\n✨ 𝐁𝐚𝐥𝐚𝐧𝐜𝐞: ${fancy(finalMoney.toLocaleString())}\n╰───━━━━🌟━━━━───╯`;
    return api.editMessage(resultMsg, Reply.sessionId);
  }
};
