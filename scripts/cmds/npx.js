module.exports = {
  config: {
    name: "npx",
    version: "1.1.0",
    author: "Gemini",
    countDown: 5,
    role: 0,
    shortDescription: "অটো অডিও রিপ্লাই (অন/অফ সিস্টেম)",
    longDescription: "নির্দিষ্ট শব্দে অডিও পাঠাবে। অন/অফ করা সম্ভব।",
    category: "utility",
    guide: {
      en: "{p}{n} on/off"
    }
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    if (!global.npxStatus) global.npxStatus = {};

    if (args[0] == "on") {
      global.npxStatus[threadID] = true;
      return api.sendMessage("Baby, npx system is now ON! ✅", threadID, messageID);
    } else if (args[0] == "off") {
      global.npxStatus[threadID] = false;
      return api.sendMessage("Baby, npx system is now OFF! ❌", threadID, messageID);
    } else {
      return api.sendMessage("Use 'npx on' to enable and 'npx off' to disable Baby! ✨", threadID, messageID);
    }
  },

  onChat: async function ({ api, event }) {
    const { threadID, messageID, body, senderID } = event;
    if (!global.npxStatus) global.npxStatus = {};
    
    // সিস্টেম অফ থাকলে বা বটের নিজের মেসেজ হলে কাজ করবে না Baby
    if (global.npxStatus[threadID] === false || !body || senderID == api.getCurrentUserID()) return;

    const message = body.toLowerCase();

    // ১. সরি সিস্টেম Baby
    const sorryKeywords = ["সরি", "দুক্ষিতো", "sry", "sorry", "sri", "🙏"];
    if (sorryKeywords.some(word => message.includes(word))) {
      try {
        const stream = await global.utils.getStreamFromURL("https://files.catbox.moe/7avi7u.mp3");
        return api.sendMessage({ attachment: stream }, threadID, messageID);
      } catch (e) { console.log(e); }
    }

    // ২. ইমোজি সিস্টেম Baby
    const emojiKeywords = ["🙄", "😒", "🤨", "🧐", "👁️‍🗨️", "👀", "🧔‍♀️"];
    if (emojiKeywords.some(emoji => message.includes(emoji))) {
      try {
        const stream = await global.utils.getStreamFromURL("https://files.catbox.moe/6hsk04.mp3");
        return api.sendMessage({ attachment: stream }, threadID, messageID);
      } catch (e) { console.log(e); }
    }

    // ৩. রাগ সিস্টেম Baby
    const angerKeywords = ["🙂", "🙃", "😤", "😡", "😠", "🤬", "😈", "👿", "😾", "👺", "rag", "rege", "রাগ", "রেগে", "angry"];
    if (angerKeywords.some(word => message.includes(word))) {
      try {
        const stream = await global.utils.getStreamFromURL("https://files.catbox.moe/xt06ku.mp3");
        return api.sendMessage({ attachment: stream }, threadID, messageID);
      } catch (e) { console.log(e); }
    }

    // ৪. ভালোবাসা সিস্টেম Baby
    const loveKeywords = ["mikasa", "baby", "bot", "love", "valobasi", "valobasa", "prem", "🥰", "😍", "🖤", "🤍", "🤎", "💜", "💙", "❤️‍🩹", "❤️", "🧡", "💛", "💚", "💝", "💖", "😘", "ভালোবাসি", "বেবি", "bby"];
    if (loveKeywords.some(word => message.includes(word))) {
      try {
        const stream = await global.utils.getStreamFromURL("https://files.catbox.moe/n3kerr.mp3");
        return api.sendMessage({ attachment: stream }, threadID, messageID);
      } catch (e) { console.log(e); }
    }
  }
};
