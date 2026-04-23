const fs = require("fs-extra");
const axios = require("axios");
const { createCanvas, loadImage } = require("canvas");

module.exports = {
  config: {
    name: "lml",
    version: "1.9",
    author: "—͟͞͞𝐓𝐀𝐌𝐈𝐌",
    countDown: 5,
    role: 0,
    shortDescription: "Rich girl edit with custom text",
    category: "fun",
    guide: { en: "{pn} @tag | reply" }
  },

  onStart: async function ({ event, message, usersData, api }) {
    try {
      let targetUID =
        event.messageReply?.senderID ||
        Object.keys(event.mentions || {})[0] ||
        event.senderID;

      const COST = 500;
      const userData = await usersData.get(event.senderID);

      if (!userData || userData.money < COST) {
        return message.reply(`❌ You need ${COST} coins for this!`);
      }

      const waitMsg = await message.reply("⌛ Processing, please wait...");

      // 1. Fetch Avatar
      const avatarUrl = `https://graph.facebook.com/${targetUID}/picture?width=800&height=800&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
      const avatarRes = await axios.get(avatarUrl, { responseType: "arraybuffer" });
      const avatarImg = await loadImage(Buffer.from(avatarRes.data));

      // 2. Load Background
      const bgUrl = "https://files.catbox.moe/ljqjy3.jpg";
      const bgRes = await axios.get(bgUrl, { responseType: "arraybuffer" });
      const bgImg = await loadImage(Buffer.from(bgRes.data));

      // 3. Canvas
      const canvas = createCanvas(bgImg.width, bgImg.height);
      const ctx = canvas.getContext("2d");
      ctx.drawImage(bgImg, 0, 0, bgImg.width, bgImg.height);

      // 4. Avatar position
      const avatarSize = Math.round(bgImg.width * 0.42);
      const centerX = Math.round(bgImg.width * 0.52);
      const centerY = Math.round(bgImg.height * 0.25);

      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, avatarSize / 2, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(
        avatarImg,
        centerX - avatarSize / 2,
        centerY - avatarSize / 2,
        avatarSize,
        avatarSize
      );
      ctx.restore();

      // 5. Save to /tmp
      const tmpPath = `/tmp/lml_${targetUID}.png`;
      fs.writeFileSync(tmpPath, canvas.toBuffer("image/png"));

      // 6. Deduct coins
      await usersData.set(event.senderID, {
        money: userData.money - COST
      });

      // 7. Send with your custom text
      await message.reply(
        {
          body: `এই গরিব টাকা নে আর সব ভুলে যা`,
          attachment: fs.createReadStream(tmpPath)
        },
        () => {
          if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
          if (waitMsg?.messageID) api.unsendMessage(waitMsg.messageID);
        }
      );

    } catch (err) {
      console.error("[lml error]", err);
      message.reply("❌ An error occurred, please try again!");
    }
  }
};
