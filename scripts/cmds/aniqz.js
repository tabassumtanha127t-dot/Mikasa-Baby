const axios = require("axios");

// ===== BASE API =====
const saif = async () => {
  const base = await axios.get(
    "https://raw.githubusercontent.com/mahmudx7/exe/main/baseApiUrl.json"
  );
  return base.data.mahmud;
};

// ===== SESSION MAP =====
const sessions = new Map();

module.exports = {
  config: {
    name: "aniqz",
    aliases: [" animequiz","animeqz"], // ❌ no 2, no extra alias
    version: "3.0",
    author: "Saif",
    countDown: 10,
    role: 0,
    category: "game",
    guide: { en: "{pn} [en/bn] | {pn} rank" }
  },

  // ================= onStart =================
  onStart: async function ({ api, event, usersData, args }) {
    const { threadID, messageID, senderID } = event;

    // ===== AUTHOR PROTECTION =====
    const obfuscatedAuthor = String.fromCharCode(83, 97, 105, 102); // Saif
    if (module.exports.config.author !== obfuscatedAuthor) {
      return api.sendMessage(
        "You are not authorized to change the author name.",
        threadID,
        messageID
      );
    }

    // ===== INIT USER DATA =====
    let user = await usersData.get(senderID);
    if (!user.data) user.data = {};
    if (!user.data.aniqzStats) {
      user.data.aniqzStats = { won: 0, played: 0 };
      await usersData.set(senderID, { data: user.data });
    }

    // ===== RANK SYSTEM =====
    if (args[0] === "rank") {
      const allUsers = await usersData.getAll();

      const rankList = allUsers
        .filter(u => u.data?.aniqzStats)
        .sort(
          (a, b) =>
            (b.data.aniqzStats.won || 0) -
            (a.data.aniqzStats.won || 0)
        )
        .slice(0, 10);

      if (!rankList.length)
        return api.sendMessage(
          "😴 No ranking data yet baby.",
          threadID,
          messageID
        );

      let msg = `╭───🏆 𝐀𝐍𝐈𝐐𝐙 𝐑𝐀𝐍𝐊 ───╮\n`;
      rankList.forEach((u, i) => {
        msg += ` ${i + 1}. ${u.name} — ${u.data.aniqzStats.won} wins\n`;
      });
      msg += `╰──────────────────────╯`;

      return api.sendMessage(msg, threadID, messageID);
    }

    try {
      // ===== LANGUAGE =====
      const input = args[0]?.toLowerCase() || "bn";
      const category =
        input === "en" || input === "english" ? "english" : "bangla";

      const apiUrl = await saif();
      const res = await axios.get(
        `${apiUrl}/api/aniqz2?category=${category}`
      );
      const quiz = res.data?.data || res.data;

      if (!quiz?.question)
        return api.sendMessage(
          "❌ No quiz available.",
          threadID,
          messageID
        );

      const { question, correctAnswer, options } = quiz;
      const { a, b, c, d } = options;

      const quizText =
        `╭──✦ ${question}\n` +
        `├‣ 𝗔) ${a}\n` +
        `├‣ 𝗕) ${b}\n` +
        `├‣ 𝗖) ${c}\n` +
        `├‣ 𝗗) ${d}\n` +
        `╰──────────────────‣\n` +
        `𝐑𝐞𝐩𝐥𝐲 𝐰𝐢𝐭𝐡 𝐲𝐨𝐮𝐫 𝐚𝐧𝐬𝐰𝐞𝐫.`;

      api.sendMessage(quizText, threadID, (err, info) => {
        if (err) return;

        // ===== SESSION SAVE =====
        const timeoutId = setTimeout(() => {
          if (sessions.has(info.messageID)) {
            sessions.delete(info.messageID);
            api.editMessage(
              `⌛ Time's up baby!\n✅ Correct answer: ${correctAnswer}`,
              info.messageID
            );
          }
        }, 60000); // 1 minute

        sessions.set(info.messageID, {
          author: senderID,
          answer: correctAnswer.toLowerCase(),
          timeoutId
        });

        global.GoatBot.onReply.set(info.messageID, {
          commandName: "aniqz",
          messageID: info.messageID
        });
      }, messageID);
    } catch (e) {
      console.error(e);
      api.sendMessage(
        "🥹 Error",
        threadID,
        messageID
      );
    }
  },

  // ================= onReply =================
  onReply: async function ({ api, event, Reply, usersData }) {
    const { senderID, body } = event;
    const session = sessions.get(Reply.messageID);
    if (!session) return;

    if (senderID !== session.author)
      return api.sendMessage(
        "⚠️ This quiz isn’t yours baby 🐸",
        event.threadID,
        event.messageID
      );

    clearTimeout(session.timeoutId);
    sessions.delete(Reply.messageID);

    const userReply = body.trim().toLowerCase();
    const isCorrect =
      userReply === session.answer ||
      userReply === session.answer[0];

    const userData = await usersData.get(senderID);
    const stats = userData.data.aniqzStats;
    stats.played += 1;

    let resultText = "";

    if (isCorrect) {
      stats.won += 1;
      const rewardCoins = 500;
      const rewardExp = 121;

      await usersData.set(senderID, {
        money: userData.money + rewardCoins,
        exp: userData.exp + rewardExp,
        data: { ...userData.data, aniqzStats: stats }
      });

      resultText =
        `✅ Correct answer baby 💕\n` +
        `🏆 Wins: ${stats.won}\n` +
        `💰 +${rewardCoins} coins | ✨ +${rewardExp} exp`;
    } else {
      await usersData.set(senderID, {
        data: { ...userData.data, aniqzStats: stats }
      });

      resultText =
        `❌ Wrong answer baby\n` +
        `✅ Correct answer: ${session.answer.toUpperCase()}\n` +
        `🏆 Wins: ${stats.won}`;
    }

    return api.editMessage(resultText, Reply.messageID);
  }
};