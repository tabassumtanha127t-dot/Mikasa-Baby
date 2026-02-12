const moment = require("moment-timezone");
const axios = require("axios");

module.exports.config = {
  name: 'autotime',
  version: "2.0.0",
  role: 0,
  author: "SAIF",
  description: "Auto send hourly message with optional media attachment",
  category: "utility",
  countDown: 3
};

module.exports.onLoad = async ({ api }) => {

  const times = {
    "12:00:00 AM": {
      message: " ──── •🖤• ──── NOW ITS TIME 12:00 AM !ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ ঘুমাও মানুষ টা তুমার না__||😊😅 ──── •🖤• ──── ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ𝐂꯭︎𝐄꯭𝐎꯭꯭꯭𝆺꯭𝅥ࠫ༎꯭𝐒꯭︎𝐀꯭︎𝐈꯭︎𝐅꯭ 💝",
      video: "https://files.catbox.moe/h8s2ik.mp4"
    },
    "01:00:00 AM": {
      message: " ──── •🖤• ──── NOW ITS TIME 01:00 AM!ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ এই শহরে এত কিছু হয় কিন্তু আমার মৃত্যু হয় না.! 🥺──── •🖤• ──── ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ𝐂꯭︎𝐄꯭𝐎꯭꯭꯭𝆺꯭𝅥ࠫ༎꯭𝐒꯭︎𝐀꯭︎𝐈꯭︎𝐅꯭ 💝 ",
      video: "https://files.catbox.moe/vyh3si.mp4"
    },
    "02:00:00 AM": {
      message: " ──── •🖤• ──── NOW ITS TIME 02:00 AM!  ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤভালো থাকার অভিনয়ে ক্লান্ত আমি, তবু চালিয়ে যেতে হয়।” 🥀  💤 ──── •🖤• ────ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ 𝐂꯭︎𝐄꯭𝐎꯭꯭꯭𝆺꯭𝅥ࠫ༎꯭𝐒꯭︎𝐀꯭︎𝐈꯭︎𝐅꯭ 💝",
      video: "https://files.catbox.moe/2p8ucs.mp4"
    },
    "03:00:00 AM": {
      message: " ──── •🖤• ──── NOW ITS TIME 3:00 AM!ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ এই সময় শুধু শান্তি আর নিস্তব্ধতা 🌙 ──── •🖤• ──── ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ𝐂꯭︎𝐄꯭𝐎꯭꯭꯭𝆺꯭𝅥ࠫ༎꯭𝐒꯭︎𝐀꯭︎𝐈꯭︎𝐅꯭ 💝",
      video: "https://files.catbox.moe/447e0x.mp4"
    },
    "04:00:00 AM": {
      message: " ──── •🖤• ──── NOW ITS TIME 04.00 AM! ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ ফজরের আজান হতে চলেছে ⏳🕌 ──── •🖤• ────ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ 𝐂꯭︎𝐄꯭𝐎꯭꯭꯭𝆺꯭𝅥ࠫ༎꯭𝐒꯭︎𝐀꯭︎𝐈꯭︎𝐅꯭ 💝",
      video: "https://files.catbox.moe/r0jcur.mp4"
    },
    "05:00:00 AM": {
      message: " ──── •🖤• ──── NOW ITS TIME 05:00 AM!ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ GOOD MORNING BABY 😝💝!  শুভ সকাল 🌅 ──── •🖤• ────ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ 𝐂꯭︎𝐄꯭𝐎꯭꯭꯭𝆺꯭𝅥ࠫ༎꯭𝐒꯭︎𝐀꯭︎𝐈꯭︎𝐅꯭ 💝",
      video: "https://files.catbox.moe/y9ras1.mp4"
    },
    "06:00:00 AM": {
      message: " ──── •🖤• ──── NOW ITS TIME 06:00 AM! ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ  নতুন দিনের শুরু হোক হাসি দিয়ে 😊 ──── •🖤• ────ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ 𝐂꯭︎𝐄꯭𝐎꯭꯭꯭𝆺꯭𝅥ࠫ༎꯭𝐒꯭︎𝐀꯭︎𝐈꯭︎𝐅꯭ 💝",
      video: "https://files.catbox.moe/ejhper.mp4"
    },
    "07:00:00 AM": {
      message: " ──── •🖤• ──── NOW ITS TIME 07:00 AM!ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ নাশতা খেয়ে নাও 🍞☕ ──── •🖤• ──── ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ𝐂꯭︎𝐄꯭𝐎꯭꯭꯭𝆺꯭𝅥ࠫ༎꯭𝐒꯭︎𝐀꯭︎𝐈꯭︎𝐅꯭ 💝",
      video: "https://files.catbox.moe/pmqlvl.mp4"
    },
    "08:00:00 AM": {
      message: " ──── •🖤• ──── NOW ITS TIME 08:00 AM!ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ কাজে মন দাও 💪 ──── •🖤• ──── ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ𝐂꯭︎𝐄꯭𝐎꯭꯭꯭𝆺꯭𝅥ࠫ༎꯭𝐒꯭︎𝐀꯭︎𝐈꯭︎𝐅꯭ 💝",
      video: "https://files.catbox.moe/0zwaxn.mp4"
    },
    "09:00:00 AM": {
      message: " ──── •🖤• ──── NOW ITS TIME 09:00 AM!ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ🖤 “সব কথা বলা হয় না, কিছু অনুভূতি চুপচাপ বুকে পাথর হয়ে জমে থাকে।” 🖤 ──── •🖤• ────ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ 𝐂꯭︎𝐄꯭𝐎꯭꯭꯭𝆺꯭𝅥ࠫ༎꯭𝐒꯭︎𝐀꯭︎𝐈꯭︎𝐅꯭ 💝",
      video: "https://files.catbox.moe/8z86qj.mp4"
    },
    "10:00:00 AM": {
      message: " ──── •🖤• ──── NOW ITS TIME 10:00 AM!ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ  তোমার অবহেলা আমাকে শিখিয়েছে—নিঃশব্দে দূরে চলে যাওয়াই হলো সবচেয়ে বড় শাস্তি!” ──── •🖤• ────ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ 𝐂꯭︎𝐄꯭𝐎꯭꯭꯭𝆺꯭𝅥ࠫ༎꯭𝐒꯭︎𝐀꯭︎𝐈꯭︎𝐅꯭ 💝",
      video: "https://files.catbox.moe/3we4k1.mp4"
    },
    "11:00:00 AM": {
      message: " ──── •🖤• ──── NOW ITS TIME 11:00 AM!ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ মানুষ নিজের প্রয়োজনে কাছে আসে..বিনা প্রয়োজনে তো কেউ কাউকে মনেও রাখেনা 🐤💝 ──── •🖤• ────ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ 𝐂꯭︎𝐄꯭𝐎꯭꯭꯭𝆺꯭𝅥ࠫ༎꯭𝐒꯭︎𝐀꯭︎𝐈꯭︎𝐅꯭ 💝",
      video: "https://files.catbox.moe/eay6ox.mp4"
    },
    "12:00:00 PM": {
      message: " ──── •🖤• ──── NOW ITS TIME 12:00 PM !ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤএকটু পর আজান দিবে।।নামাজ পড়ে নিও  ──── •🖤• ────ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ 𝐂꯭︎𝐄꯭𝐎꯭꯭꯭𝆺꯭𝅥ࠫ༎꯭𝐒꯭︎𝐀꯭︎𝐈꯭︎𝐅꯭ 💝",
      video: "https://files.catbox.moe/y9ras1.mp4"
    },
    "01:00:00 PM": {
      message: " ──── •🖤• ──── NOW ITS TIME 01:00 PM!ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ নামাজ পরে একটু বিশ্রাম নাও 😴 ──── •🖤• ────ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ𝐂꯭︎𝐄꯭𝐎꯭꯭꯭𝆺꯭𝅥ࠫ༎꯭𝐒꯭︎𝐀꯭︎𝐈꯭︎𝐅꯭ 💝",
      video: "https://files.catbox.moe/6oi5hz.mp4"
    },
    "02:00:00 PM": {
      message: " ──── •🖤• ──── NOW ITS TIME 02.00 PM!ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ বিকেলের কাজ শুরু করো 💼 ──── •🖤• ────ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ 𝐂꯭︎𝐄꯭𝐎꯭꯭꯭𝆺꯭𝅥ࠫ༎꯭𝐒꯭︎𝐀꯭︎𝐈꯭︎𝐅꯭ 💝",
      video: "https://files.catbox.moe/od7gza.mp4"
    },
    "03:00:00 PM": {
      message: " ──── •🖤• ──── NOW ITS TIME 03:00 PM! ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ“সবাই ছবির পেছনের গল্পটা বোঝে না… কিন্তু হাসিটা দেখে ভাবে সব ঠিক আছে। ──── •🖤• ────ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ 𝐂꯭︎𝐄꯭𝐎꯭꯭꯭𝆺꯭𝅥ࠫ༎꯭𝐒꯭︎𝐀꯭︎𝐈꯭︎𝐅꯭ 💝",
      video: "https://files.catbox.moe/l4guu5.mp4"
    },
    "04:00:00 PM": {
      message: " ──── •🖤• ──── NOW ITS TIME 04:00PM!ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ সে পাশে থাকলে  বিকাল টা সব চাইতে সুন্দর হত তাই না? ──── •🖤• ────ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ𝐂꯭︎𝐄꯭𝐎꯭꯭꯭𝆺꯭𝅥ࠫ༎꯭𝐒꯭︎𝐀꯭︎𝐈꯭︎𝐅꯭ 💝",
      video: "https://files.catbox.moe/fph5p1.mp4"
    },
    "05:00:00 PM": {
      message: " ──── •🖤• ──── NOW ITS TIME 05:00 PM!ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ আসরের নামাজ পরেছো তো?  🌆 ──── •🖤• ──── ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ𝐂꯭︎𝐄꯭𝐎꯭꯭꯭𝆺꯭𝅥ࠫ༎꯭𝐒꯭︎𝐀꯭︎𝐈꯭︎𝐅꯭ 💝",
      video: "https://files.catbox.moe/tqazjc.mp4"
    },
    "06:00:00 PM": {
      message: " ──── •🖤• ──── NOW ITS TIME 06:00 PM!ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ একটু পর মাগরিবের আজান  দিবে। নামাজ টা পড়ে নিও 🕌 ──── •🖤• ──── ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ𝐂꯭︎𝐄꯭𝐎꯭꯭꯭𝆺꯭𝅥ࠫ༎꯭𝐒꯭︎𝐀꯭︎𝐈꯭︎𝐅꯭ 💝",
      video: "https://files.catbox.moe/6wwmni.mp4"
    },
    "07:00:00 PM": {
      message: " ──── •🖤• ──── NOW ITS TIME 07:00 PM!ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ 😌 “শ্রদ্ধা না থাকলে, ভালোবাসাও অর্থহীন। ──── •🖤• ────ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ 𝐂꯭︎𝐄꯭𝐎꯭꯭꯭𝆺꯭𝅥ࠫ༎꯭𝐒꯭︎𝐀꯭︎𝐈꯭︎𝐅꯭ 💝",
      video: "https://files.catbox.moe/vw1vbl.mp4"
    },
    "08:00:00 PM": {
      message: " ──── •🖤• ──── NOW ITS TIME 08:00 PM! ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ পরিবারের সাথে সময় কাটাও 🏠 ──── •🖤• ──── ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ𝐂꯭︎𝐄꯭𝐎꯭꯭꯭𝆺꯭𝅥ࠫ༎꯭𝐒꯭︎𝐀꯭︎𝐈꯭︎𝐅꯭ 💝",
      video: "https://files.catbox.moe/ie8ss5.mp4"
    },
    "09:00:00 PM": {
      message: " ──── •🖤• ──── NOW ITS TIME 09:00 PM!ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤভালো থাকার অভিনয়ে ক্লান্ত আমি, তবু চালিয়ে যেতে হয়।” 🥀  ──── •🖤• ──── ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ𝐂꯭︎𝐄꯭𝐎꯭꯭꯭𝆺꯭𝅥ࠫ༎꯭𝐒꯭︎𝐀꯭︎𝐈꯭︎𝐅꯭ 💝",
      video: "https://files.catbox.moe/zfuv4z.mp4"
    },
    "10:00:00 PM": {
      message: " ──── •🖤• ──── NOW ITS TIME 10:00 PM! ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤএকাকিত্বই সুন্দর 🫶💝  ──── •🖤• ──── ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ𝐂꯭︎𝐄꯭𝐎꯭꯭꯭𝆺꯭𝅥ࠫ༎꯭𝐒꯭︎𝐀꯭︎𝐈꯭︎𝐅꯭ 💝",
      video: "https://files.catbox.moe/vp6cie.mp4"
    },
    "11:00:00 PM": {
      message: " ──── •🖤• ──── NOW ITS TIME 11:00 PM! ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤঘুমা বেক্কল 😾👋🏻 ──── •🖤• ────ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ 𝐂꯭︎𝐄꯭𝐎꯭꯭꯭𝆺꯭𝅥ࠫ༎꯭𝐒꯭︎𝐀꯭︎𝐈꯭︎𝐅꯭ 💝",
      video: "https://files.catbox.moe/qx9wq6.mp4"
    }
  };

  const sendLoop = async () => {
    const now = moment().tz("Asia/Dhaka").format("hh:mm:ss A");
    const data = times[now];

    if (data) {
      const allThreads = global.db.allThreadData.map(t => t.threadID);

      for (const thread of allThreads) {
        try {
          let msg = { body: data.message };

          if (data.video && data.video.trim() !== "") {
            const res = await axios.get(data.video, { responseType: "stream" });
            msg.attachment = res.data;
          }

          await api.sendMessage(msg, thread);
        } catch (err) {
          console.error(`Error sending message to ${thread}:`, err);
        }
      }
    }

    const nextMinute = moment().add(1, 'minute').startOf('minute');
    const delay = nextMinute.diff(moment());
    setTimeout(sendLoop, delay);
  };

  sendLoop();
};

module.exports.onStart = () => {};
