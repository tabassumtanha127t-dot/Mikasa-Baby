const fs = require('fs');
const moment = require('moment-timezone');

module.exports = {
  config: {
    name: "admingc",
    aliases: ["supportgc", "sgc"],
    version: "1.3",
    author: "SHIFAT",
    countDown: 5,
    role: 0,
    shortDescription: {
      vi: "",
      en: "add user in thread"
    },
    longDescription: {
      vi: "",
      en: "add any user to bot owner group chat. just type admingc"
    },
    category: "utility",
    guide: {
      en: "{pn} admingc"
    }
  },

  onStart: async function ({ api, event, args }) {
    const threadID = "23869391286001160";
    
    // Serif Bold Italic Font Mapping
    const fontStyle = (text) => {
      const map = {
        'a': '𝒂', 'b': '𝒃', 'c': '𝒄', 'd': '𝒅', 'e': '𝒆', 'f': '𝒇', 'g': '𝒈', 'h': '𝒉', 'i': '𝒊', 'j': '𝒋', 'k': '𝒌', 'l': '𝒍', 'm': '𝒎', 'n': '𝒏', 'o': '𝒐', 'p': '𝒑', 'q': '𝒒', 'r': '𝒓', 's': '𝒔', 't': '𝒕', 'u': '𝒖', 'v': '𝒗', 'w': '𝒘', 'x': '𝒙', 'y': '𝒚', 'z': '𝒛',
        'A': '𝑨', 'B': '𝑩', 'C': '𝑪', 'D': '𝑫', 'E': '𝑬', 'F': '𝑭', 'G': '𝑮', 'H': '𝑯', 'I': '𝑰', 'J': '𝑱', 'K': '𝑲', 'L': '𝑳', 'M': '𝑴', 'N': '𝑵', 'O': '𝑶', 'P': '𝑷', 'Q': '𝑸', 'R': '𝑹', 'S': '𝑺', 'T': '𝑻', 'U': '𝑼', 'V': '𝑽', 'W': '𝑾', 'X': '𝑿', 'Y': '𝒀', 'Z': '𝒁',
        '0': '𝟎', '1': '𝟏', '2': '𝟐', '3': '𝟑', '4': '𝟒', '5': '𝟓', '6': '𝟔', '7': '𝟕', '8': '𝟖', '9': '𝟗'
      };
      return text.split('').map(char => map[char] || char).join('');
    };

    try {
      const threadInfo = await api.getThreadInfo(threadID);
      const participants = threadInfo.participantIDs;

      if (participants.includes(event.senderID)) {
        const msg = fontStyle("Hey Baby, you're already in the group! Check your requests or spam folder if you can't find it.");
        api.sendMessage(msg, event.threadID, event.messageID);
        api.setMessageReaction("⚠", event.messageID, (err) => {}, true);
      } else {
        await api.addUserToGroup(event.senderID, threadID);
        const msg = fontStyle("Welcome to the family, Baby! I've added you to the group chat successfully.");
        api.sendMessage(msg, event.threadID, event.messageID);
        api.setMessageReaction("🖤", event.messageID, (err) => {}, true);
      }
    } catch (error) {
      const msg = fontStyle("Sorry Baby, I couldn't add you. Make sure I'm an admin in that group first!");
      api.sendMessage(msg, event.threadID, event.messageID);
      api.setMessageReaction("🤍", event.messageID, (err) => {}, true);
    }
  }
}
