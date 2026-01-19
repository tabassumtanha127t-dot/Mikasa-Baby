const fs = require("fs");

// Math Bold Italic Font Mapping (যেমন: 𝑻𝒉𝒊𝒔 𝒔𝒕𝒚𝒍𝒆)
const formatText = (text) => {
  const map = {
    'a': '𝒂', 'b': '𝒃', 'c': '𝒄', 'd': '𝒅', 'e': '𝒆', 'f': '𝒇', 'g': '𝒈', 'h': '𝒉', 'i': '𝒊', 'j': '𝒋',
    'k': '𝒌', 'l': '𝒍', 'm': '𝒎', 'n': '𝒏', 'o': '𝒐', 'p': '𝒑', 'q': '𝒒', 'r': '𝒓', 's': '𝒔', 't': '𝒕',
    'u': '𝒖', 'v': '𝒗', 'w': '𝒘', 'x': '𝒙', 'y': '𝒚', 'z': '𝒛',
    'A': '𝑨', 'B': '𝑩', 'C': '𝑪', 'D': '𝑫', 'E': '𝑬', 'F': '𝑭', 'G': '𝑮', 'H': '𝑯', 'I': '𝑰', 'J': '𝑱',
    'K': '𝑲', 'L': '𝑳', 'M': '𝑴', 'N': '𝑵', 'O': '𝑶', 'P': '𝑷', 'Q': '𝑸', 'R': '𝑹', 'S': '𝑺', 'T': '𝑻',
    'U': '𝑼', 'V': '𝑽', 'W': '𝑾', 'X': '𝑿', 'Y': '𝒀', 'Z': '𝒁',
    '0': '𝟎', '1': '𝟏', '2': '𝟐', '3': '𝟑', '4': '𝟒', '5': '𝟓', '6': '𝟔', '7': '𝟕', '8': '𝟖', '9': '𝟗',
    '!': '!', '?': '?', '.': '.', ',': ',', ':': ':', ';': ';', '-': '-', '_': '_', '(': '(', ')': ')',
    '[': '[', ']': ']', '{': '{', '}': '}', '<': '<', '>': '>', '/': '/', '\\': '\\', '|': '|', '@': '@',
    '#': '#', '$': '$', '%': '%', '^': '^', '&': '&', '*': '*', '+': '+', '=': '=', '~': '~', '`': '`',
    '"': '"', "'": "'", ' ': ' '
  };
  
  return text.split('').map(char => map[char] || char).join('');
};

module.exports = {
  config: {
    name: "pending",
    aliases: ["pen", "pend", "pe"],
    version: "2.2",
    author: "♡ 𝑺𝑨𝑰𝑭 ♡",
    countDown: 5,
    role: 1,
    shortDescription: formatText("Handle pending requests"),
    longDescription: formatText("Approve or reject pending users/groups"),
    category: "utility",
  },

  onReply: async function ({ message, api, event, Reply }) {
    const { author, pending, messageID } = Reply;
    if (String(event.senderID) !== String(author)) return;

    const { body, threadID } = event;

    if (body.trim().toLowerCase() === "c") {
      try {
        await api.unsendMessage(messageID);
        return api.sendMessage(formatText("❌ 𝑶𝒑𝒆𝒓𝒂𝒕𝒊𝒐𝒏 𝒄𝒂𝒏𝒄𝒆𝒍𝒆𝒅! 🐇"), threadID);
      } catch {
        return;
      }
    }

    const indexes = body.split(/\s+/).map(Number);

    if (isNaN(indexes[0])) {
      return api.sendMessage(formatText("⚠ 𝑰𝒏𝒗𝒂𝒍𝒊𝒅 𝒊𝒏𝒑𝒖𝒕! 𝑻𝒓𝒚 𝒂𝒈𝒂𝒊𝒏 🦋"), threadID);
    }

    let count = 0;

    for (const idx of indexes) {
      if (idx <= 0 || idx > pending.length) continue;
      const group = pending[idx - 1];

      try {
        await api.sendMessage(
          formatText("✅ 𝑮𝒓𝒐𝒖𝒑 𝒂𝒑𝒑𝒓𝒐𝒗𝒆𝒅 𝒃𝒚 𝑺𝒆𝒏𝒑𝒂𝒊! 🐇💌\n✨ 𝑬𝒏𝒋𝒐𝒚 𝒚𝒐𝒖𝒓 𝒏𝒆𝒘 𝒂𝒅𝒗𝒆𝒏𝒕𝒖𝒓𝒆! 🦄"),
          group.threadID
        );

        await api.changeNickname(
          formatText(`${global.GoatBot.config.nickNameBot || "🦋𝑺𝑨𝑰𝑭✨"}`),
          group.threadID,
          api.getCurrentUserID()
        );

        count++;
      } catch {
        count++;
      }
    }

    for (const idx of indexes.sort((a, b) => b - a)) {
      if (idx > 0 && idx <= pending.length) {
        pending.splice(idx - 1, 1);
      }
    }

    return api.sendMessage(
      formatText(`🎉 𝑺𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚 𝒂𝒑𝒑𝒓𝒐𝒗𝒆𝒅 ${count} 𝒈𝒓𝒐𝒖𝒑(𝒔)/𝒖𝒔𝒆𝒓(𝒔)! 🐇💖`),
      threadID
    );
  },

  onStart: async function ({ api, event, args, usersData }) {
    const { threadID, messageID } = event;
    const adminBot = global.GoatBot.config.adminBot;

    if (!adminBot.includes(event.senderID)) {
      return api.sendMessage(formatText("⚠ 𝑵𝒐 𝒑𝒆𝒓𝒎𝒊𝒔𝒔𝒊𝒐𝒏 𝒃𝒂𝒌𝒂! 🐇"), threadID);
    }

    try {
      const spam = (await api.getThreadList(100, null, ["OTHER"])) || [];
      const pending = (await api.getThreadList(100, null, ["PENDING"])) || [];
      const allList = [...spam, ...pending];

      if (allList.length === 0) {
        return api.sendMessage(
          formatText("📭 𝑷𝑬𝑵𝑫𝑰𝑵𝑮 𝑳𝑰𝑺𝑻\n\n") +
          formatText("𝑵𝒐 𝒑𝒆𝒏𝒅𝒊𝒏𝒈 𝒓𝒆𝒒𝒖𝒆𝒔𝒕𝒔 𝒇𝒐𝒖𝒏𝒅! 🥹\n") +
          formatText("𝑬𝒗𝒆𝒓𝒚𝒕𝒉𝒊𝒏𝒈 𝒊𝒔 𝒄𝒍𝒆𝒂𝒏! 🎀"),
          threadID, messageID
        );
      }

      let msg = formatText("📭 𝑷𝑬𝑵𝑫𝑰𝑵𝑮 𝑳𝑰𝑺𝑻\n\n");
      let index = 1;
      
      for (const single of allList) {
        const name = single.name || (await usersData.getName(single.threadID)) || formatText("𝑼𝒏𝒌𝒏𝒐𝒘𝒏");
        const type = single.isGroup ? formatText("👥 𝑮𝒓𝒐𝒖𝒑") : formatText("👤 𝑼𝒔𝒆𝒓");
        msg += formatText(`[${index}] ${type} - ${name}\n`);
        index++;
      }

      msg += formatText(`\n🎀 𝑻𝒐𝒕𝒂𝒍: ${allList.length} 𝒑𝒆𝒏𝒅𝒊𝒏𝒈\n`);
      msg += formatText(`✨ 𝑹𝒆𝒑𝒍𝒚 𝒘𝒊𝒕𝒉 𝒏𝒖𝒎𝒃𝒆𝒓(𝒔) 𝒕𝒐 𝒂𝒑𝒑𝒓𝒐𝒗𝒆 🐇\n`);
      msg += formatText(`❌ 𝑹𝒆𝒑𝒍𝒚 "𝒄" 𝒕𝒐 𝒄𝒂𝒏𝒄𝒆𝒍, 𝒔𝒆𝒏𝒑𝒂𝒊 💌`);

      return api.sendMessage(
        msg,
        threadID,
        (error, info) => {
          if (error) return;
          global.GoatBot.onReply.set(info.messageID, {
            commandName: this.config.name,
            messageID: info.messageID,
            author: event.senderID,
            pending: allList,
          });
        },
        messageID
      );
    } catch (error) {
      console.error("Pending Error:", error);
      return api.sendMessage(
        formatText("❌ 𝑬𝑹𝑹𝑶𝑹\n\n") +
        formatText("𝑭𝒂𝒊𝒍𝒆𝒅 𝒕𝒐 𝒓𝒆𝒕𝒓𝒊𝒆𝒗𝒆 𝒑𝒆𝒏𝒅𝒊𝒏𝒈 𝒍𝒊𝒔𝒕!\n") +
        formatText("𝑷𝒍𝒆𝒂𝒔𝒆 𝒕𝒓𝒚 𝒂𝒈𝒂𝒊𝒏 𝒍𝒂𝒕𝒆𝒓."), 
        threadID, 
        messageID
      );
    }
  },
};
