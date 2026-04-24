const axios = require('axios');
const fs = require('fs-extra'); 
const path = require('path');

const formatText = (text) => {
  const mapping = {
    'a': '𝐚', 'b': '𝐛', 'c': '𝐜', 'd': '𝐝', 'e': '𝐞', 'f': '𝐟', 'g': '𝐠', 'h': '𝐡', 'i': '𝐢', 'j': '𝐣', 'k': '𝐤', 'l': '𝐥', 'm': '𝐦', 'n': '𝐧', 'o': '𝐨', 'p': '𝐩', 'q': '𝐪', 'r': '𝐫', 's': '𝐬', 't': '𝐭', 'u': '𝐮', 'v': '𝐯', 'w': '𝐰', 'x': '𝐱', 'y': '𝐲', 'z': '𝐳',
    'A': '𝐀', 'B': '𝐁', 'C': '𝐂', 'D': '𝐃', 'E': '𝐄', 'F': '𝐅', 'G': '𝐆', 'H': '𝐇', 'I': '𝐈', 'J': '𝐉', 'K': '𝐊', '𝐋': '𝐋', 'M': '𝐌', 'N': '𝐍', 'O': '𝐎', 'P': '𝐏', 'Q': '𝐐', 'R': '𝐑', 'S': '𝐒', 'T': '𝐓', 'U': '𝐔', 'V': '𝐕', 'W': '𝐖', 'X': '𝐗', 'Y': '𝐘', 'Z': '𝐙',
    '0': '𝟎', '1': '𝟏', '2': '𝟐', '3': '𝟑', '4': '𝟒', '5': '𝟓', '6': '𝟔', '7': '𝟕', '8': '𝟖', '9': '𝟗'
  };
  return text.split('').map(char => mapping[char] || char).join('');
};

const API_ENDPOINT = "https://dev.oculux.xyz/api/artv1"; 

module.exports = {
  config: {
    name: "art2",
    aliases: ["draw"],
    version: "1.1", 
    author: "NeoKEX + modified by saif",
    countDown: 15,
    role: 0,
    category: "image",
    shortDescription: "Generate an image using ArtV1",
    guide: "{pn} <prompt>"
  },

  onStart: async function({ api, message, args, event, usersData }) {
    const COST = 500;
    const senderID = event.senderID;
    const senderName = await usersData.getName(senderID);

    try {
      let userData = await usersData.get(senderID);
      let balance = userData.money || 0;

      // BROKE CHECK Baby
      if (balance < COST) {
        return message.reply(`‎🎀\n > ${senderName}\n\n` + formatText(`• Baby, You need ${COST} coin to use this command! Use daily /quiz and Other game and come again!`));
      }

      let prompt = args.join(" ");
      if (!prompt) {
        return message.reply(formatText("• Baby, please provide a prompt to draw!"));
      }

      api.setMessageReaction("⏳", event.messageID, (err) => {}, true);
      
      const cacheDir = path.join(__dirname, 'cache');
      if (!fs.existsSync(cacheDir)) await fs.mkdirp(cacheDir); 
      const tempFilePath = path.join(cacheDir, `artv1_${Date.now()}.png`);

      const fullApiUrl = `${API_ENDPOINT}?p=${encodeURIComponent(prompt.trim())}`;
      const res = await axios.get(fullApiUrl, { responseType: 'stream', timeout: 45000 });

      const writer = fs.createWriteStream(tempFilePath);
      res.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });

      // Deduct coins Baby
      const remaining = balance - COST;
      await usersData.set(senderID, { ...userData, money: remaining });

      api.setMessageReaction("✅", event.messageID, (err) => {}, true);

      const styledMsg = `‎🎀\n > ${senderName}\n\n` +
        `• ` + formatText(`Baby, Your Art is Ready!`) + `\n` +
        `• ` + formatText(`Deducted: ${COST}`) + `\n` +
        `• ` + formatText(`Balance: ${remaining} Baby`);

      await message.reply({
        body: styledMsg,
        attachment: fs.createReadStream(tempFilePath)
      }, () => {
        if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
      });

    } catch (error) {
      api.setMessageReaction("❌", event.messageID, (err) => {}, true);
      message.reply(formatText("• Generation failed, try a different prompt Baby!"));
      console.error(error);
    }
  }
};
