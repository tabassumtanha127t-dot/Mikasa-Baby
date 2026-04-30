module.exports = {
  config: {
    name: "mentionreply",
    version: "1.6.0",
    permission: 0,
    credits: "Saif",
    description: "Auto reply when specific users are mentioned",
    prefix: false,
    category: "utility",
    usages: "",
    cooldowns: 3
  },

  onStart: async function () {
    // Will be used if any setup is needed later
  },

  onChat: async function({ api, event }) {
    const targetUIDs = new Set([
      "61572249173718",
      "100081317798618",
      "100078639797619"
    ]);

    // ✨ Replies with mix Bangla, Capitalized English, and Anime lines
    const replies = [
      "𝐁𝐨𝐬𝐬 এখন 𝐁𝐮𝐬𝐲 — তোর mention এর ভাগ্যে 𝐒𝐞𝐞𝐧 জুটবে না 😏",
      "এই নিনজা কমেডি কে? 𝐁𝐨𝐬𝐬 কে 𝐌𝐞𝐧𝐭𝐢𝐨𝐧 করার 𝐋𝐞𝐯𝐞𝐥 তোর নাই 👶🍥",
      "お前はもう死んでいる (Omae wa mou shindeiru) — তোর mention মারা গেছে 😵",
      "𝐁𝐨𝐬𝐬 এখন 𝐆𝐞𝐧𝐣𝐮𝐭𝐬𝐮-তে আটকা, রিয়েল ওয়ার্ল্ডে নাই 🌀",
      "𝐁𝐨𝐬𝐬 কে ডিসটার্ব করছিস? 𝐁𝐚𝐧𝐤𝐚𝐢! 💥",
      "𝐁𝐨𝐬𝐬 এখন 𝐊𝐚𝐦𝐞𝐡𝐚𝐦𝐞𝐡𝐚 চার্জ করছে — তুই 𝐒𝐞𝐧𝐳𝐮 𝐁𝐞𝐚𝐧 খা 🫘",
      "তুই mention দেওয়া মানেই 𝐁𝐨𝐬𝐬 reply দিবে? এটা 𝐒𝐡𝐢𝐧𝐨𝐛𝐢 𝐖𝐨𝐫𝐥𝐝 না 😂",
      "𝐁𝐨𝐬𝐬 তোর mention দেখেও 𝐳𝐚𝐧𝐬𝐞𝐧 (全然) পাত্তা দিবে না 👺",
      "𝐁𝐨𝐬𝐬 𝐊𝐚𝐢𝐳𝐨𝐤𝐮-ও না, ওনি (王) — তুই শুধু একটা 𝐍𝐚𝐦𝐢 🏴‍☠️",
      "𝐁𝐨𝐬𝐬 এক্ষুনি আসবে... (Sike! うそつき！) 🤥",
      "𝐁𝐨𝐬𝐬 যদি 𝐁𝐚𝐧𝐤𝐚𝐢 বের করে, তুই 𝐒𝐮𝐩𝐞𝐫 𝐒𝐚𝐢𝐲𝐚𝐧 নাহ! 😈",
      "𝐁𝐨𝐬𝐬 𝐒𝐚𝐢𝐟, মনে রেখো — মেনশন কম দিও, নাহয় 𝐈𝐭𝐚𝐝𝐨𝐫𝐢 𝐌𝐨𝐝𝐞 চালু হবে",
      "𝐂𝐡𝐢𝐛𝐚𝐤𝐮 𝐂𝐡𝐢𝐛𝐚! তোর mention 𝐍𝐨-𝐬𝐜𝐨𝐩𝐞 𝐃𝐞𝐥𝐞𝐭𝐞 💢",
      "もういい (Mou ii) — 𝐁𝐨𝐬𝐬 tired, তুই later আসিস বাবু",
      "𝐁𝐨𝐬𝐬 𝐃𝐚𝐭𝐭𝐞𝐛𝐚𝐲𝐨! মানে কিছুই না, শুধু mention করে লাভ নাই 😬"
    ];

    // If no one mentioned, do nothing
    if (!event.mentions || Object.keys(event.mentions).length === 0) return;

    const mentionedUIDs = new Set(Object.keys(event.mentions));
    for (const uid of targetUIDs) {
      if (mentionedUIDs.has(uid)) {
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        return api.sendMessage(randomReply, event.threadID, event.messageID);
      }
    }
  }
};
