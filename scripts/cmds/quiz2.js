const axios = require("axios");

const sessions = new Map();
const QUIZ_API_URL = "https://saif-quiz.onrender.com/api/quiz";

const fancy = (text) => {
  const map = {
    'a': '𝗔', 'b': '𝗕', 'c': '𝗖', 'd': '𝗗', 'e': '𝗘', 'f': '𝗙', 'g': '𝗚', 'h': '𝗛', 'i': '𝗜', 'j': '𝗝',
    'k': '𝗞', 'l': '𝗟', 'm': '𝗠', 'n': '𝗡', 'o': '𝗢', 'p': '𝗣', 'q': '𝗤', 'r': '𝗥', 's': '𝗦', 't': '𝗧',
    'u': '𝗨', 'v': '𝗩', 'w': '𝗪', 'x': '𝗫', 'y': '𝗬', 'z': '𝗭',
    'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚', 'H': '𝗛', 'I': '𝗜', 'J': '𝗝',
    'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡', 'O': '𝗢', 'P': '𝗣', 'Q': '𝗤', 'R': '𝗥', 'S': '𝗦', 'T': '𝗧',
    'U': '𝗨', 'V': '𝗩', 'W': '𝗪', 'X': '𝗫', 'Y': '𝗬', 'Z': '𝗭',
    '0': '𝟎', '1': '𝟏', '2': '𝟐', '3': '𝟑', '4': '𝟒', '5': '𝟓', '6': '𝟔', '7': '𝟕', '8': '𝟖', '9': '𝟗'
  };
  return text.toString().split('').map(char => map[char] || char).join('');
};

module.exports = {
  config: {
    name: "quiz2",
    aliases: ["qz2"],
    version: "28.0",
    author: "Saif",
    countDown: 10, // বেবি, কাউন্টডাউন ১০ সেকেন্ড করে দিলাম
    role: 0,
    category: "game",
    description: "𝑷𝒓𝒆𝒎𝒊𝒖𝒎 𝑸𝒖𝒊𝒛 𝑽𝟐.𝟒 𝑳𝒊𝒎𝒊𝒕 𝟐𝟎"
  },

  onStart: async function ({ api, event, usersData, args }) {
    const { threadID, messageID, senderID } = event;

    // Usage limit 20 times per person logic Baby
    let user = await usersData.get(senderID);
    if (!user.data) user.data = {};
    if (!user.data.quiz2Stats) user.data.quiz2Stats = { won: 0, played: 0, exp: 0, dailyUsage: 0, lastDate: "" };

    const today = new Date().toLocaleDateString();
    if (user.data.quiz2Stats.lastDate !== today) {
      user.data.quiz2Stats.dailyUsage = 0;
      user.data.quiz2Stats.lastDate = today;
    }

    if (user.data.quiz2Stats.dailyUsage >= 20 && args[0] !== "stats" && args[0] !== "rank") {
      return api.sendMessage(`𝑳𝒊𝒎𝒊𝒕 𝑹𝒆𝒂𝒄𝒉𝒆𝒅\n━━━━━━━━━━━━━━━━━━\n𝒀𝒐𝒖 𝒉𝒂𝒗𝒆 𝒖𝒔𝒆𝒅 𝒚𝒐𝒖𝒓 𝟐𝟎 𝒕𝒖𝒓𝒏𝒔 𝒕𝒐𝒅𝒂𝒚 𝑩𝒂𝒃𝒚.`, threadID, messageID);
    }

    if (args[0] === "rank") {
      const allUsers = await usersData.getAll();
      const rankList = allUsers
        .filter(u => u.data && u.data.quiz2Stats)
        .sort((a, b) => (b.data.quiz2Stats.won || 0) - (a.data.quiz2Stats.won || 0))
        .slice(0, 10);

      let rankMsg = `𝑸𝑼𝑰𝒁𝟐 𝑹𝑨𝑵𝑲𝑰𝑵𝑮\n━━━━━━━━━━━━━━━━━━\n`;
      rankList.forEach((u, i) => {
        rankMsg += ` ${i + 1}. ${u.name} — ${fancy(u.data.quiz2Stats.won)}\n`;
      });
      return api.sendMessage(rankMsg, threadID, messageID);
    }

    if (args[0] === "stats") {
      const s = user.data.quiz2Stats;
      const statsMsg = `𝑷𝑳𝑨𝒀𝑬𝑹 𝑺𝑻𝑨𝑻𝑺\n━━━━━━━━━━━━━━━━━━\n𝑵𝒂𝒎𝒆: ${user.name}\n𝑾𝒊𝒏𝒔: ${fancy(s.won)}\n𝑷𝒍𝒂𝒚𝒆𝒅: ${fancy(s.played)}\n𝑬𝑿𝑷: ${fancy(s.exp)}\n𝑼𝒔𝒂𝒈𝒆: ${fancy(s.dailyUsage)}/𝟐𝟎\n━━━━━━━━━━━━━━━━━━`;
      return api.sendMessage(statsMsg, threadID, messageID);
    }

    try {
      const res = await axios.get(QUIZ_API_URL);
      const questions = res.data[0].questions;
      const q = questions[Math.floor(Math.random() * questions.length)];

      let optionsMsg = '';
      ['a', 'b', 'c', 'd'].forEach(l => {
        if (q.options[l]) optionsMsg += `├‣ ${fancy(l)}) ${q.options[l]}\n`;
      });

      const quizContent = `╭──✦ ${q.text}\n${optionsMsg}╰──────────────────‣\n𝑹𝒆𝒑𝒍𝒚 𝒘𝒊𝒕𝒉 𝒚𝒐𝒖𝒓 𝒂𝒏𝒔𝒘𝒆𝒓 𝑩𝒂𝒃𝒚.`;

      api.sendMessage(quizContent, threadID, (err, info) => {
        if (err) return;
        user.data.quiz2Stats.dailyUsage += 1;
        usersData.set(senderID, { data: user.data });

        const timeoutId = setTimeout(() => {
          if (sessions.has(info.messageID)) {
            sessions.delete(info.messageID);
            api.editMessage(`𝑻𝒊𝒎𝒆 𝑶𝒗𝒆𝒓\n𝑪𝒐𝒓𝒓𝒆𝒄𝒕: ${fancy(q.answer.toUpperCase())}`, info.messageID);
          }
        }, 60000);

        sessions.set(info.messageID, { answer: q.answer, author: senderID, timeoutId });
        global.GoatBot.onReply.set(info.messageID, { commandName: this.config.name, author: senderID, sessionId: info.messageID });
      }, messageID);
    } catch (e) { return api.sendMessage("𝑬𝒓𝒓𝒐𝒓 𝒍𝒐𝒂𝒅𝒊𝒏𝒈 𝒅𝒂𝒕𝒂", threadID, messageID); }
  },

  onReply: async function ({ event, api, Reply, usersData }) {
    const { senderID, body, threadID, messageID } = event;
    const session = sessions.get(Reply.sessionId);
    if (!session || senderID !== Reply.author) return;

    clearTimeout(session.timeoutId);
    sessions.delete(Reply.sessionId);
    try { await api.unsendMessage(messageID); } catch(e) {}

    const isCorrect = body.trim().toLowerCase() === session.answer;
    let user = await usersData.get(senderID);
    if (!user.data.quiz2Stats) user.data.quiz2Stats = { won: 0, played: 0, exp: 0, dailyUsage: 0 };
    user.data.quiz2Stats.played += 1;

    let status = "";
    if (isCorrect) {
      user.data.quiz2Stats.won += 1;
      user.data.quiz2Stats.exp = (user.data.quiz2Stats.exp || 0) + 143;
      const reward = 1000;
      await usersData.set(senderID, { money: (user.money || 0) + reward, data: user.data });
      status = `𝑪𝑶𝑹𝑹𝑬𝑪𝑻 𝑨𝑵𝑺𝑾𝑬𝑹\n━━━━━━━━━━━━━━━━━━\n𝑪𝒐𝒊𝒏𝒔: +${fancy(reward)}\n𝑬𝑿𝑷: +${fancy(143)}\n𝑾𝒊𝒏𝒔: ${fancy(user.data.quiz2Stats.won)}`;
    } else {
      await usersData.set(senderID, { data: user.data });
      status = `𝑾𝑹𝑶𝑵𝑮 𝑨𝑵𝑺𝑾𝑬𝑹\n━━━━━━━━━━━━━━━━━━\n𝑨𝒏𝒔𝒘𝒆𝒓: ${fancy(session.answer.toUpperCase())}\n𝑾𝒊𝒏𝒔: ${fancy(user.data.quiz2Stats.won)}`;
    }

    const resultMsg = `╭──✦ 𝑸𝑼𝑰𝒁 𝑹𝑬𝑺𝑼𝑳𝑻\n${status}\n╰──────────────────‣\n𝑲𝒆𝒆𝒑 𝒊𝒕 𝒖𝒑 𝑩𝒂𝒃𝒚.`;
    return api.editMessage(resultMsg, Reply.sessionId);
  }
};
