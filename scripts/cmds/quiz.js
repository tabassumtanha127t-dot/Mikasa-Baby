const axios = require("axios");

if (!global.quizStats) global.quizStats = {};
const sessions = new Map();
const cooldowns = new Map();
const QUIZ_URL = "https://raw.githubusercontent.com/SAIFUL-404-ST/quiz-api/main/quizzes.json";

// Math Bold Italic Font
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

// Simple border
const createBox = (content) => {
  const lines = content.split('\n');
  const maxLength = Math.max(...lines.map(line => line.length));
  const width = Math.min(Math.max(maxLength + 4, 40), 60);
  
  const top = `┏${'━'.repeat(width - 2)}┓`;
  const bottom = `┗${'━'.repeat(width - 2)}┘`;
  
  const formattedLines = lines.map(line => {
    const padding = Math.max(0, width - line.length - 2);
    return `┃ ${line}${' '.repeat(padding)} ┃`;
  }).join('\n');
  
  return `${top}\n${formattedLines}\n${bottom}`;
};

function cleanupSessions() {
  const now = Date.now();
  for (const [sessionId, session] of sessions.entries()) {
    if (now - session.createdAt > 120000) {
      clearTimeout(session.timeoutId);
      sessions.delete(sessionId);
    }
  }
  for (const [userId, time] of cooldowns.entries()) {
    if (now - time > 3600000) cooldowns.delete(userId);
  }
}

module.exports = {
  config: {
    name: "quiz",
    aliases: ["qz"],
    version: "15.0",
    author: "Saif",
    countDown: 5,
    role: 0,
    category: "game",
    guide: { en: "!quiz -> 𝑺𝒕𝒂𝒓𝒕 𝒒𝒖𝒊𝒛\n!quiz 𝒍𝒊𝒔𝒕 -> 𝑺𝒉𝒐𝒘 𝒓𝒂𝒏𝒌𝒊𝒏𝒈𝒔" }
  },

  onStart: async function ({ api, event, usersData, args }) {
    const { threadID, messageID, senderID } = event;
    const now = Date.now();

    cleanupSessions();

    if (args[0] === "list" || args[0] === "rank") {
      const entries = Object.entries(global.quizStats);
      if (entries.length === 0) {
        return api.sendMessage(
          createBox(formatText("📊 𝑸𝑼𝑰𝒁 𝑹𝑨𝑵𝑲𝑰𝑵𝑮𝑺\n\n") +
          formatText("𝑵𝒐 𝒑𝒍𝒂𝒚𝒆𝒓𝒔 𝒚𝒆𝒕 𝑩𝒂𝒃𝒚 🥹\n") +
          formatText("𝑺𝒕𝒂𝒓𝒕 𝒑𝒍𝒂𝒚𝒊𝒏𝒈 𝒘𝒊𝒕𝒉: !𝒒𝒖𝒊𝒛")), 
          threadID, messageID
        );
      }
      
      entries.sort((a, b) => b[1].won - a[1].won);
      let rankContent = formatText("📊 𝑸𝑼𝑰𝒁 𝑹𝑨𝑵𝑲𝑰𝑵𝑮𝑺\n") + "━━━━━━━━━━━━━━━━━━\n";
      
      for (let i = 0; i < Math.min(entries.length, 10); i++) {
        const [uid, st] = entries[i];
        const name = await usersData.getName(uid) || formatText("𝑩𝒂𝒃𝒚");
        rankContent += formatText(`${i + 1}. ${name} — 🏆 ${st.won} (🎮 ${st.played})\n`);
      }
      
      return api.sendMessage(createBox(rankContent), threadID, messageID);
    }

    if (cooldowns.has(senderID) && now - cooldowns.get(senderID) < 5000) {
      const timeLeft = Math.ceil((5000 - (now - cooldowns.get(senderID))) / 1000);
      return api.sendMessage(
        createBox(
          formatText(`⏰ 𝑷𝒍𝒆𝒂𝒔𝒆 𝒘𝒂𝒊𝒕 ${timeLeft} 𝒔𝒆𝒄𝒐𝒏𝒅𝒔\n`) +
          formatText(`𝒃𝒆𝒇𝒐𝒓𝒆 𝒔𝒕𝒂𝒓𝒕𝒊𝒏𝒈 𝒂𝒏𝒐𝒕𝒉𝒆𝒓 𝒒𝒖𝒊𝒛!`)
        ), 
        threadID, messageID
      );
    }
    
    cooldowns.set(senderID, now);

    try {
      const res = await axios.get(QUIZ_URL, { timeout: 10000 });
      if (!res.data?.[0]?.questions?.length) {
        throw new Error("Invalid quiz data");
      }
      
      const questions = res.data[0].questions;
      const q = questions[Math.floor(Math.random() * questions.length)];
      
      if (!q.text || !q.options || !q.answer) {
        throw new Error("Invalid question");
      }

      let optionsMsg = '';
      ['a', 'b', 'c', 'd'].forEach(letter => {
        if (q.options[letter]) {
          optionsMsg += `\n${formatText(letter.toUpperCase() + '.')} ${formatText(q.options[letter])}`;
        }
      });
      
      const quizContent = 
        formatText("📝 ") + q.text + "\n" +
        optionsMsg + "\n\n" +
        formatText("⏰ 𝒀𝒐𝒖 𝒉𝒂𝒗𝒆 𝟔𝟎 𝒔𝒆𝒄𝒐𝒏𝒅𝒔!\n") +
        formatText("📝 𝑹𝒆𝒑𝒍𝒚 𝒘𝒊𝒕𝒉 → 𝒂𝒏𝒔𝒘𝒆𝒓 <𝒂|𝒃|𝒄|𝒅>");
      
      const quizMsg = createBox(quizContent);

      api.sendMessage(quizMsg, threadID, async (err, info) => {
        if (err) {
          console.error("Failed to send quiz:", err);
          cooldowns.delete(senderID);
          return;
        }
        
        const sessionId = `${senderID}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const timeoutId = setTimeout(async () => {
          if (sessions.has(sessionId)) {
            sessions.delete(sessionId);
            if (global.GoatBot?.onReply?.has(info.messageID)) {
              global.GoatBot.onReply.delete(info.messageID);
            }
            
            const timeoutContent = 
              formatText("⏰ 𝑻𝒊𝒎𝒆'𝒔 𝒖𝒑! 𝑸𝒖𝒊𝒛 𝒆𝒙𝒑𝒊𝒓𝒆𝒅\n\n") +
              formatText("✅ 𝑪𝒐𝒓𝒓𝒆𝒄𝒕 𝒂𝒏𝒔𝒘𝒆𝒓 𝒘𝒂𝒔: ") + 
              formatText(q.answer.toUpperCase()) + "\n\n" +
              formatText("🎮 𝑺𝒕𝒂𝒓𝒕 𝒏𝒆𝒘 𝒒𝒖𝒊𝒛 𝒘𝒊𝒕𝒉: !𝒒𝒖𝒊𝒛");
            
            const timeoutBox = createBox(timeoutContent);
            
            try {
              await api.editMessage(timeoutBox, info.messageID);
            } catch (editErr) {
              api.sendMessage(timeoutBox, threadID);
            }
          }
        }, 60000);

        sessions.set(sessionId, { 
          correctAnswer: q.answer.toLowerCase().trim(),
          messageID: info.messageID,
          userId: senderID,
          createdAt: Date.now(),
          timeoutId: timeoutId,
          questionText: q.text
        });

        if (!global.quizStats[senderID]) {
          global.quizStats[senderID] = { played: 0, won: 0 };
        }
        global.quizStats[senderID].played += 1;

        global.GoatBot.onReply.set(info.messageID, { 
          commandName: this.config.name, 
          author: senderID, 
          messageID: info.messageID,
          sessionId: sessionId
        });

      }, messageID);
      
    } catch (error) {
      console.error("Quiz Error:", error);
      cooldowns.delete(senderID);
      const errorBox = createBox(
        formatText("❌ 𝑬𝑹𝑹𝑶𝑹\n\n") +
        formatText("𝑭𝒂𝒊𝒍𝒆𝒅 𝒕𝒐 𝒍𝒐𝒂𝒅 𝒒𝒖𝒊𝒛 𝒒𝒖𝒆𝒔𝒕𝒊𝒐𝒏𝒔\n") +
        formatText("𝑷𝒍𝒆𝒂𝒔𝒆 𝒕𝒓𝒚 𝒂𝒈𝒂𝒊𝒏 𝒍𝒂𝒕𝒆𝒓.")
      );
      return api.sendMessage(errorBox, threadID, messageID);
    }
  },

  onReply: async function ({ event, api, Reply, usersData }) {
    const { senderID, body, threadID, messageID } = event;
    const { author, messageID: quizMsgID, sessionId } = Reply;

    // যদি অন্য user উত্তর দেয়
    if (senderID !== author) {
      // শুধু সেই user-কে reply message পাঠাবে
      const notYourQuiz = formatText("🐸 𝑻𝒉𝒊𝒔 𝒊𝒔 𝒏𝒐𝒕 𝒚𝒐𝒖𝒓 𝒒𝒖𝒊𝒛 𝑩𝒂𝒃𝒚!\n𝑾𝒂𝒊𝒕 𝒇𝒐𝒓 𝒚𝒐𝒖𝒓 𝒐𝒘𝒏 𝒕𝒖𝒓𝒏.");
      return api.sendMessage(notYourQuiz, threadID, messageID); // messageID দিলে reply হবে
    }
    
    const session = sessions.get(sessionId);
    if (!session) {
      const expiredMsg = formatText("⏰ 𝑻𝒊𝒎𝒆'𝒔 𝒖𝒑! 𝑸𝒖𝒊𝒛 𝒆𝒙𝒑𝒊𝒓𝒆𝒅.\n𝑷𝒍𝒆𝒂𝒔𝒆 𝒔𝒕𝒂𝒓𝒕 𝒂 𝒏𝒆𝒘 𝒐𝒏𝒆 𝒘𝒊𝒕𝒉: !𝒒𝒖𝒊𝒛");
      return api.sendMessage(expiredMsg, threadID, messageID); // reply হবে
    }

    // Cleanup session
    sessions.delete(sessionId);
    if (session.timeoutId) clearTimeout(session.timeoutId);
    if (global.GoatBot?.onReply?.has(quizMsgID)) {
      global.GoatBot.onReply.delete(quizMsgID);
    }
    
    // Delete user's reply
    try {
      await api.unsendMessage(messageID);
    } catch (e) {}

    // Process answer
    let userAnswer = body.trim().toLowerCase();
    if (userAnswer.startsWith("answer ")) {
      userAnswer = userAnswer.replace("answer ", "").trim();
    }
    userAnswer = userAnswer.match(/[a-d]/)?.[0] || '';

    if (userAnswer === session.correctAnswer) {
      const rewardCoins = 500;
      const rewardExp = 121;
      
      try {
        const userData = await usersData.get(senderID);
        await usersData.set(senderID, { 
          money: (userData.money || 0) + rewardCoins, 
          exp: (userData.exp || 0) + rewardExp 
        });
        
        if (global.quizStats[senderID]) {
          global.quizStats[senderID].won += 1;
        }
        
        // ✅ EDIT: Correct answer
        const winContent = 
          formatText("🎉 𝑪𝑶𝑹𝑹𝑬𝑪𝑻! 𝑾𝑬𝑳𝑳 𝑫𝑶𝑵𝑬!\n\n") +
          formatText("✅ 𝒀𝒐𝒖𝒓 𝒂𝒏𝒔𝒘𝒆𝒓: ") + formatText(userAnswer.toUpperCase()) + "\n" +
          formatText("💰 𝑹𝒆𝒘𝒂𝒓𝒅: ") + formatText(rewardCoins.toString()) + formatText(" 𝒄𝒐𝒊𝒏𝒔\n") +
          formatText("⭐ 𝑬𝒙𝒑: ") + formatText(rewardExp.toString()) + formatText(" 𝒑𝒐𝒊𝒏𝒕𝒔\n\n") +
          formatText("🏆 𝑻𝒐𝒕𝒂𝒍 𝑾𝒊𝒏𝒔: ") + formatText(global.quizStats[senderID].won.toString()) + "\n" +
          formatText("🎮 𝑷𝒍𝒂𝒚 𝒂𝒈𝒂𝒊𝒏: !𝒒𝒖𝒊𝒛");
        
        const winBox = createBox(winContent);
        await api.editMessage(winBox, quizMsgID);
        
      } catch (error) {
        console.error("Reward error:", error);
        const simpleWin = createBox(
          formatText("✅ 𝑪𝑶𝑹𝑹𝑬𝑪𝑻\n\n") +
          formatText("𝑪𝒐𝒓𝒓𝒆𝒄𝒕! 𝑪𝒐𝒓𝒓𝒆𝒄𝒕 𝒂𝒏𝒔𝒘𝒆𝒓 𝒘𝒂𝒔: ") + 
          formatText(session.correctAnswer.toUpperCase())
        );
        await api.editMessage(simpleWin, quizMsgID);
      }
      
    } else {
      // ✅ EDIT: Wrong answer
      const wrongContent = 
        formatText("❌ 𝑾𝑹𝑶𝑵𝑮 𝑨𝑵𝑺𝑾𝑬𝑹\n\n") +
        formatText("𝑾𝒓𝒐𝒏𝒈 𝒂𝒏𝒔𝒘𝒆𝒓! 𝑩𝒆𝒕𝒕𝒆𝒓 𝒍𝒖𝒄𝒌 𝒏𝒆𝒙𝒕 𝒕𝒊𝒎𝒆!\n\n") +
        formatText("✏️ 𝒀𝒐𝒖𝒓 𝒂𝒏𝒔𝒘𝒆𝒓: ") + formatText(userAnswer.toUpperCase() || "𝑵𝒐𝒏𝒆") + "\n" +
        formatText("✅ 𝑪𝒐𝒓𝒓𝒆𝒄𝒕 𝒂𝒏𝒔𝒘𝒆𝒓: ") + formatText(session.correctAnswer.toUpperCase()) + "\n\n" +
        formatText("💡 𝑻𝒓𝒚 𝒂𝒈𝒂𝒊𝒏 𝒘𝒊𝒕𝒉: !𝒒𝒖𝒊𝒛");
      
      const wrongBox = createBox(wrongContent);
      await api.editMessage(wrongBox, quizMsgID);
    }
  },

  onChat: async function({ event }) {
    if (Math.random() < 0.01) {
      cleanupSessions();
    }
  }
};
