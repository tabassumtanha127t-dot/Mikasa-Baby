module.exports = {
  config: {
    name: "clear",
    aliases: [],
    author: "Saif",
    version: "3.0",
    cooldowns: 5,
    role: 2,
    shortDescription: {
      en: "Unsend bot messages"
    },
    longDescription: {
      en: "Unsent all messages sent by bot safely"
    },
    category: "owner",
    guide: {
      en: "{p}{n}"
    }
  },

  onStart: async function ({ api, event }) {

    try {
      const threadID = event.threadID;
      const botID = api.getCurrentUserID();

      // 200 পর্যন্ত নিতে পারো চাইলে
      const messages = await api.getThreadHistory(threadID, 100);

      const botMessages = messages.filter(
        msg => msg.senderID == botID && msg.messageID
      );

      let count = 0;

      for (const msg of botMessages) {
        try {
          await api.unsendMessage(msg.messageID);
          count++;
        } catch (err) {
          // Skip unavailable messages
        }
      }

      console.log(`Cleared ${count} messages successfully`);

    } catch (err) {
      console.log("Clear Command Error:", err);
    }
  }
};