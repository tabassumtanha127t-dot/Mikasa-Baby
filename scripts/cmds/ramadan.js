const axios = require("axios");
const { createCanvas } = require("canvas");
const fs = require("fs-extra");
const path = require("path");
const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "ramadan",
    aliases: ["iftar", "sehri"],
    version: "5.5.0",
    author: "Saif / Mahbub",
    countDown: 10,
    role: 0,
    category: "islamic",
    guide: "{pn} <district_name>"
  },

  onStart: async function ({ api, event, args, usersData }) {
    const { threadID, messageID, senderID } = event;
    const location = args.join(" ") || "Dhaka";
    const senderName = await usersData.getName(senderID);
    const timeZone = "Asia/Dhaka";
    const now = moment().tz(timeZone);
    const currentTime = now.format("hh:mm:ss A | DD MMM YYYY");

    try {
      api.setMessageReaction("⏳", messageID, () => {}, true);

      const res = await axios.get(`https://mahbub-ullash.cyberbot.top/api/ramadan?location=${encodeURIComponent(location)}`);
      const d = res.data;

      if (!d || !d.today) return api.sendMessage("District not found, Baby!", threadID, messageID);

      // Random Color Palette System Baby
      const palettes = [
        { main: "#fbbf24", bg: ["#0f172a", "#1e293b"] }, // Golden
        { main: "#38bdf8", bg: ["#0c4a6e", "#082f49"] }, // Royal Blue
        { main: "#f472b6", bg: ["#4c0519", "#831843"] }, // Rose Gold
        { main: "#34d399", bg: ["#064e3b", "#065f46"] }, // Emerald Green
        { main: "#a78bfa", bg: ["#2e1065", "#4c1d95"] }  // Purple Premium
      ];
      const theme = palettes[Math.floor(Math.random() * palettes.length)];

      const canvas = createCanvas(800, 1180);
      const ctx = canvas.getContext("2d");

      // Background Gradient
      const grd = ctx.createLinearGradient(0, 0, 0, 1180);
      grd.addColorStop(0, theme.bg[0]);
      grd.addColorStop(1, theme.bg[1]);
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, 800, 1180);

      // Header
      ctx.fillStyle = theme.main;
      ctx.font = "bold 60px Arial";
      ctx.textAlign = "center";
      ctx.fillText("RAMADAN KAREEM", 400, 110);

      ctx.fillStyle = "#ffffff";
      ctx.font = "28px Arial";
      ctx.fillText(`${d.date_info.today_date} | ${d.name}`, 400, 170);

      // Fixed Countdown Logic Baby
      const iftarMoment = moment.tz(d.today.iftar, "hh:mm A", timeZone).set({
        year: now.year(), month: now.month(), date: now.date()
      });

      let diffText = "";
      if (iftarMoment.isAfter(now)) {
        const duration = moment.duration(iftarMoment.diff(now));
        diffText = `Iftar in ${duration.hours()}h ${duration.minutes()}m ${duration.seconds()}s`;
      } else {
        diffText = "Iftar time has passed! Alhamdulilah!";
      }

      ctx.fillStyle = theme.main;
      ctx.font = "bold 24px Arial";
      ctx.fillText(`⏰ ${diffText}`, 400, 235);

      // UI Boxes Baby
      const drawBox = (x, y, label, time, sub) => {
        ctx.strokeStyle = theme.main;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.roundRect(x, y, 330, 190, 25);
        ctx.stroke();
        ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 24px Arial";
        ctx.fillText(label, x + 165, y + 50);
        ctx.fillStyle = theme.main;
        ctx.font = "bold 52px Arial";
        ctx.fillText(time, x + 165, y + 120);
        ctx.fillStyle = "#94a3b8";
        ctx.font = "16px Arial";
        ctx.fillText(sub, x + 165, y + 165);
      };

      drawBox(50, 310, "SEHRI ENDS", d.today.sehri_end, "Pre-dawn Meal Ends");
      drawBox(420, 310, "IFTAR TIME", d.today.iftar, "Sunset Prayer Begins");

      // Prayer Times Table
      ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
      ctx.roundRect(50, 780, 700, 190, 20);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.font = "22px Arial";
      ctx.textAlign = "left";
      ctx.fillText(`✨ Fajr: ${d.other_times.fajri}`, 100, 835);
      ctx.fillText(`✨ Dhuhr: ${d.other_times.zohr}`, 100, 890);
      ctx.fillText(`✨ Asr: ${d.other_times.asr}`, 100, 945);
      ctx.fillText(`✨ Maghrib: ${d.other_times.maghrib}`, 450, 835);
      ctx.fillText(`✨ Isha: ${d.other_times.isha}`, 450, 890);
      ctx.fillText(`✨ Sunrise: ${d.other_times.sunrise}`, 450, 945);

      // Branding and Date/Time Baby
      ctx.textAlign = "center";
      ctx.fillStyle = theme.main;
      ctx.font = "bold 30px Arial";
      ctx.fillText(`MIKASA BABY`, 400, 1050);
      ctx.fillStyle = "#ffffff";
      ctx.font = "22px Arial";
      ctx.fillText(`Requested by: ${senderName} Baby`, 400, 1090);
      ctx.fillStyle = "#94a3b8";
      ctx.font = "italic 18px Arial";
      ctx.fillText(currentTime, 400, 1130);

      const cachePath = path.join(__dirname, "cache", `ramadan_mikasa_${Date.now()}.png`);
      await fs.ensureDir(path.join(__dirname, "cache"));
      fs.writeFileSync(cachePath, canvas.toBuffer());

      // IMPROVED TEXT VERSION FOR SLOW INTERNET Baby
      const msgBody = `--- MIKASA BABY SCHEDULE ---
Location: ${d.name}
Date: ${d.date_info.today_date}

🌙 Sehri Ends: ${d.today.sehri_end}
🌅 Iftar Time: ${d.today.iftar}

--- Full Prayer List ---
• Fajr: ${d.other_times.fajri}
• Dhuhr: ${d.other_times.zohr}
• Asr: ${d.other_times.asr}
• Maghrib: ${d.other_times.maghrib}
• Isha: ${d.other_times.isha}
• Sunrise: ${d.other_times.sunrise}

Time: ${currentTime}
Requested by: ${senderName} Baby`;

      api.setMessageReaction("✅", messageID, () => {}, true);

      return api.sendMessage({
        body: msgBody,
        attachment: fs.createReadStream(cachePath)
      }, threadID, () => { if(fs.existsSync(cachePath)) fs.unlinkSync(cachePath); }, messageID);

    } catch (err) {
      console.error(err);
      api.setMessageReaction("❌", messageID, () => {}, true);
      return api.sendMessage("System error, Baby!", threadID, messageID);
    }
  }
};
