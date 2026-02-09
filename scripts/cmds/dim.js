const axios = require('axios');
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs-extra');
const path = require('path');
 
//avatar fetch fix by Eren
const fetchAvatar = async (uid) => {
  try {
    const avatarUrl = `https://graph.facebook.com/${uid}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
    const finalUrl = avatarUrl.includes("?")
      ? `${avatarUrl}&t=${Date.now()}`
      : `${avatarUrl}?t=${Date.now()}`;
 
    const response = await axios.get(finalUrl, {
      responseType: "arraybuffer",
      timeout: 15000,
      headers: { "User-Agent": "Mozilla/5.0" },
    });
 
    return Buffer.from(response.data);
  } catch (error) {
    throw new Error(`Failed to fetch avatar: ${error.message}`);
  }
};
 
module.exports = {
  config: {
    name: 'dim',
    aliases: ['egg'],
    version: '2.2',
    author: 'abrar / Gemini',
    role: 0,
    category: 'fun',
    shortDescription: 'Turn someone into dim meme',
    longDescription: 'Funny dim meme with avatar on egg head',
    guide: '{pn} @mention / reply'
  },
 
  onStart: async function ({ event, api, message }) {
    let processingMsg;
    try {
      const targetID = event.mentions && Object.keys(event.mentions).length > 0
        ? Object.keys(event.mentions)[0]
        : event.messageReply?.senderID;
 
      if (!targetID)
        return message.reply('🔹 Please mention or reply the one whom you want me to make an egg, Baby!');
      if (targetID === event.senderID)
        return message.reply('😂 Hhhh you fool, you cant make yourself an anda, Baby!');
 
      // Capture message info to unsend later
      processingMsg = await message.reply('⏳ Processing ur egg hhh, wait Baby...');
 
      const avatarBuffer = await fetchAvatar(targetID);
      const avatar = await loadImage(avatarBuffer);
 
      // Background load
      const cacheDir = path.join(__dirname, 'cache', 'dim');
      await fs.ensureDir(cacheDir);
      const bgPath = path.join(cacheDir, 'bg.jpg');
 
      let bg;
      if (!fs.existsSync(bgPath)) {
        const bgRes = await axios.get(
          'https://i.postimg.cc/Wbt5GLY7/5674fba3a393f7578a73919569b5147f.jpg',
          { responseType: 'arraybuffer' }
        );
        await fs.writeFile(bgPath, bgRes.data);
        bg = await loadImage(bgRes.data);
      } else {
        bg = await loadImage(await fs.readFile(bgPath));
      }
 
      const canvas = createCanvas(bg.width, bg.height);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(bg, 0, 0);
 
      const size = 150;
      const x = 100;
      const y = 60;
 
      ctx.save();
      ctx.beginPath();
      ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.shadowColor = 'rgba(0,0,0,0.4)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      ctx.clip();
      ctx.drawImage(avatar, x, y, size, size);
      ctx.restore();
 
      ctx.beginPath();
      ctx.arc(x + size / 2, y + size / 2, size / 2 + 3, 0, Math.PI * 2);
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 5;
      ctx.stroke();
 
      ctx.font = 'bold 28px Arial';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 4;
 
      const text = 'PURE DIM 😂';
      ctx.strokeText(text, bg.width / 2, bg.height - 40);
      ctx.fillText(text, bg.width / 2, bg.height - 40);
 
      const output = path.join(cacheDir, `${targetID}_${Date.now()}.png`);
      await fs.writeFile(output, canvas.toBuffer());
 
      const info = await api.getUserInfo(targetID);
      const name = info[targetID]?.name || 'Someone';
 
      // Send the final result
      await message.reply({
        body: `🥚🤣 ${name} Now its totally DIM LEVEL MAX, Baby!`,
        mentions: [{ tag: name, id: targetID }],
        attachment: fs.createReadStream(output)
      });

      // Unsend the processing message after final result is sent
      if (processingMsg && processingMsg.messageID) {
        api.unsendMessage(processingMsg.messageID);
      }
 
      setTimeout(() => fs.unlink(output).catch(() => {}), 5000);
 
    } catch (e) {
      console.error(e);
      // Ensure processing message is removed even if an error occurs
      if (processingMsg && processingMsg.messageID) {
        api.unsendMessage(processingMsg.messageID);
      }

      if (e.message.includes('Failed to fetch avatar')) {
        message.reply('❌ Cant create the Avatar! Maybe profile is private, Baby.');
      } else {
        message.reply('❌ An error occured while making egg, Baby!');
      }
    }
  }
};
