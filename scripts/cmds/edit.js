const axios = require("axios");

module.exports = {
  config: {
    name: "edit",
    aliases: ["imgedit", "modify"],
    version: "2.7",
    author: "SiFu ゐ", 
    countDown: 15,
    role: 0,
    shortDescription: { en: "Edit image with Seedream V4" },
    longDescription: { en: "Edit or modify an existing image using Seedream V4 Edit AI model" },
    category: "image",
    guide: {
      en: "{pn} <prompt>"
    }
  },

  onStart: async function ({ message, event, api, args }) {
    const hasPhotoReply = event.type === "message_reply" && event.messageReply?.attachments?.[0]?.type === "photo";

    if (!hasPhotoReply) {
      return message.reply("𝑰𝒇 𝒚𝒐𝒖 𝒘𝒂𝒏𝒕 𝒕𝒐 𝒆𝒅𝒊𝒕 𝒂𝒏 𝒊𝒎𝒂𝒈𝒆, 𝒑𝒍𝒆𝒂𝒔𝒆 𝒓𝒆𝒑𝒍𝒚 𝒕𝒐 𝒂 𝒑𝒉𝒐𝒕𝒐, 𝑩𝒂𝒃𝒚.");
    }

    const prompt = args.join(" ").trim();
    if (!prompt) {
      return message.reply("𝑷𝒍𝒆𝒂𝒔𝒆 𝒆𝒏𝒕𝒆𝒓 𝒂 𝒑𝒓𝒐𝒎𝒑𝒕 𝒕𝒐 𝒔𝒕𝒂𝒓𝒕 𝒕𝒉𝒆 𝒆𝒅𝒊𝒕𝒊𝒏𝒈, 𝑩𝒂𝒃𝒚.");
    }

    const model = "seedream v4 edit";
    const imageUrl = event.messageReply.attachments[0].url;
    let processingMsg;

    try {
      processingMsg = await message.reply("𝑷𝒓𝒐𝒄𝒆𝒔𝒔𝒊𝒏𝒈 𝒚𝒐𝒖𝒓 𝒊𝒎𝒂𝒈𝒆 𝒘𝒊𝒕𝒉 𝑺𝒆𝒆𝒅𝒓𝒆𝒂𝒎 𝑽𝟒, 𝒑𝒍𝒆𝒂𝒔𝒆 𝒘𝒂𝒊𝒕, 𝑩𝒂𝒃𝒚.");

      const res = await axios.get("https://fluxcdibai-1.onrender.com/generate", {
        params: { prompt, model, imageUrl },
        timeout: 120000
      });

      const data = res.data;
      const resultUrl = data?.data?.imageResponseVo?.url;

      if (!resultUrl) {
        if (processingMsg) await api.unsendMessage(processingMsg.messageID);
        return message.reply("𝑻𝒉𝒆 𝒔𝒚𝒔𝒕𝒆𝒎 𝒄𝒐𝒖𝒍𝒅 𝒏𝒐𝒕 𝒓𝒆𝒕𝒖𝒓𝒏 𝒂𝒏 𝒆𝒅𝒊𝒕𝒆𝒅 𝒊𝒎𝒂𝒈𝒆, 𝑩𝒂𝒃𝒚.");
      }

      // Unsend the processing message right before sending the final result
      if (processingMsg) {
        await api.unsendMessage(processingMsg.messageID);
      }

      await message.reply({
        body: "𝒀𝒐𝒖𝒓 𝒊𝒎𝒂𝒈𝒆 𝒉𝒂𝒔 𝒃𝒆𝒆𝒏 𝒆𝒅𝒊𝒕𝒆𝒅 𝒔𝒖𝒄𝒄𝒆𝒔𝒇𝒖𝒍𝒍𝒚, 𝑩𝒂𝒃𝒚.",
        attachment: await global.utils.getStreamFromURL(resultUrl)
      });

    } catch (err) {
      console.error(err);
      if (processingMsg) await api.unsendMessage(processingMsg.messageID);
      return message.reply("𝑨𝒏 𝒆𝒓𝒓𝒐𝒓 𝒐𝒄𝒄𝒖𝒓𝒓𝒆𝒅 𝒘𝒉𝒊𝒍𝒆 𝒆𝒅𝒊𝒕𝒊𝒏𝒈 𝒕𝒉𝒆 𝒊𝒎𝒂𝒈𝒆, 𝑩𝒂𝒃𝒚.");
    }
  }
};
