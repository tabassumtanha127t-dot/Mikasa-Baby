module.exports = {
  config: {
    name: "npx",
    version: "1.0.8",
    author: "Gemini",
    countDown: 5,
    role: 0,
    shortDescription: "শুধু অডিও অটো রিপ্লাই (নো টেক্সট)",
    longDescription: "নির্দিষ্ট শব্দে শুধু অডিও পাঠাবে, কোনো টেক্সট থাকবে না",
    category: "utility",
    guide: {
      en: "Type keywords to get audio replies"
    }
  },

  onStart: async function ({ api, event }) {
    // onStart খালি থাকবে Baby
  },

  onChat: async function ({ api, event }) {
    const { threadID, messageID, body, senderID } = event;
    
    // নিজের মেসেজে নিজে রিপ্লাই দেওয়া বন্ধ Baby
    if (!body || senderID == api.getCurrentUserID()) return;

    const message = body.toLowerCase();

    // ১. সরি সিস্টেম (Audio: 7avi7u)
    const sorryKeywords = ["সরি", "দুক্ষিতো", "sry", "sorry", "sri", "🙏"];
    if (sorryKeywords.some(word => message.includes(word))) {
      try {
        const stream = await global.utils.getStreamFromURL("https://files.catbox.moe/7avi7u.mp3");
        return api.sendMessage({
          attachment: stream
        }, threadID, messageID);
      } catch (e) { console.log(e); }
    }

    // ২. ইমোজি সিস্টেম (Audio: 6hsk04)
    const emojiKeywords = ["🙄", "😒", "🤨", "🧐", "👁️‍🗨️", "👀", "🧔‍♀️"];
    if (emojiKeywords.some(emoji => message.includes(emoji))) {
      try {
        const stream = await global.utils.getStreamFromURL("https://files.catbox.moe/6hsk04.mp3");
        return api.sendMessage({
          attachment: stream
        }, threadID, messageID);
      } catch (e) { console.log(e); }
    }

    // ৩. রাগ সিস্টেম (Audio: xt06ku)
    const angerKeywords = ["🙂", "🙃", "😤", "😡", "😠", "🤬", "😈", "👿", "😾", "👺", "rag", "rege", "রাগ", "রেগে", "angry"];
    if (angerKeywords.some(word => message.includes(word))) {
      try {
        const stream = await global.utils.getStreamFromURL("https://files.catbox.moe/xt06ku.mp3");
        return api.sendMessage({
          attachment: stream
        }, threadID, messageID);
      } catch (e) { console.log(e); }
    }

    // ৪. ভালোবাসা সিস্টেম (Audio: n3kerr)
    const loveKeywords = ["mikasa", "baby", "bot", "love", "valobasi", "valobasa", "prem", "🥰", "😍", "🖤", "🤍", "🤎", "💜", "💙", "❤️‍🩹", "❤️", "🧡", "💛", "💚", "💝", "💖", "😘", "ভালোবাসি", "বেবি", "bby"];
    if (loveKeywords.some(word => message.includes(word))) {
      try {
        const stream = await global.utils.getStreamFromURL("https://files.catbox.moe/n3kerr.mp3");
        return api.sendMessage({
          attachment: stream
        }, threadID, messageID);
      } catch (e) { console.log(e); }
    }
  }
};
