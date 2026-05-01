/cmd install yt.js const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

let pendingDownloads = {};

module.exports = {
  config: {
    name: "yt",
    aliases: ["youtube", "video"],
    version: "7.0",
    author: "Aminul Sordar (Fixed Pro)",
    role: 0,
    category: "media",
    shortDescription: "Search & download YouTube videos",
    longDescription: "Search YouTube and reply number to download",
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    const query = args.join(" ").trim();

    if (!query) {
      return api.sendMessage("❌ Please enter search text!", threadID, messageID);
    }

    try {
      const res = await axios.get(
        `https://aminul-youtube-api.vercel.app/search?query=${encodeURIComponent(query)}`
      );

      const data = res.data;

      if (!data || data.length === 0) {
        return api.sendMessage("😔 No video found!", threadID, messageID);
      }

      const videos = data.slice(0, 5);
      pendingDownloads[threadID] = videos;

      let msg = `🎬 𝗬𝗢𝗨𝗧𝗨𝗕𝗘 𝗥𝗘𝗦𝗨𝗟𝗧\n🔎 ${query}\n\n`;

      videos.forEach((v, i) => {
        msg += `${i + 1}. ${v.title}\n`;
        msg += `👤 ${v.author?.name || "Unknown"}\n`;
        msg += `⏱ ${v.duration?.timestamp || "N/A"}\n\n`;
      });

      msg += `📥 Reply (1-5) to download`;

      return api.sendMessage(msg, threadID, messageID);

    } catch (e) {
      console.error(e);
      return api.sendMessage("❌ Search failed!", threadID, messageID);
    }
  },

  onChat: async function ({ api, event }) {
    const { threadID, messageID, body } = event;

    if (!pendingDownloads[threadID]) return;
    if (!/^[1-5]$/.test(body)) return;

    const index = parseInt(body) - 1;
    const video = pendingDownloads[threadID][index];

    if (!video) return;

    const loading = await api.sendMessage("⏳ Downloading...", threadID);

    try {
      const res = await axios.get(
        `https://aminul-rest-api-three.vercel.app/downloader/alldownloader?url=${encodeURIComponent(video.url)}`
      );

      const data = res?.data?.data?.data;

      if (!data) throw new Error("No data");

      const videoUrl = data.high || data.low;

      if (!videoUrl) {
        return api.sendMessage("❌ Cannot download!", threadID, messageID);
      }

      const filePath = path.join(
        __dirname,
        "cache",
        `yt_${Date.now()}.mp4`
      );

      await fs.ensureDir(path.dirname(filePath));

      // ✅ Better download using axios stream
      const writer = fs.createWriteStream(filePath);

      const response = await axios({
        url: videoUrl,
        method: "GET",
        responseType: "stream"
      });

      response.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });

      // 📦 File size check (25MB limit)
      const stats = fs.statSync(filePath);
      if (stats.size > 25 * 1024 * 1024) {
        fs.unlinkSync(filePath);
        return api.sendMessage(
          "❌ File too large (over 25MB)",
          threadID,
          messageID
        );
      }

      await api.sendMessage(
        {
          body: `✅ ${video.title}`,
          attachment: fs.createReadStream(filePath)
        },
        threadID,
        () => fs.unlinkSync(filePath)
      );

    } catch (err) {
      console.error(err);
      api.sendMessage("❌ Download failed!", threadID, messageID);
    }

    delete pendingDownloads[threadID];
  }
};
