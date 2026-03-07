const axios = require('axios');

// ─── Config ───────────────────────────────────────────────────────────────────

const BASE_API_URL = "https://noobs-api.top/dipto";
const BABY_API = `${BASE_API_URL}/baby`;

// ─── Random Replies (Original mixed) ─────────────────────────────────────────

const randomReplies = [
    `Kire Vuski dakis kn? 😤`,
    `Hmm bolo, shunuchi to.. 😍`,
    `Ji jaan, bolo ki hoyeche? 🙈`,
    `আম গাছে আম নাই, ঢিল কেনো মারো? তোমার সাথে কথা নাই বেবি কেনো ডাকো 😒`,
    `🙂🙂🙂`,
    `ভদ্রতার খাতিরেই নারীদের সাথে চলাফেরা করি, নইলে আমি মিকাসার পুরুষ সঙ্গি সর্বদাই পছন্দনীয়! 🙈`,
    `তোর কাজ নাই? সারাদিন খালি আমারে ডাকস 😾`,
    `বেশি ডাকলে আম্মু বকা দেবে তো 🥺`,
    `Ranna kortesi bby!! ektu por ashtesi 🍳`,
    `Ato bby bby na kore Amar saiful boss re Akta Girlfriend de 😤`,
    `বলো তোমার বয়ফ্রেন্ড রে আমার হাতে তুলে দিবা 🥺`,
    `Over acting er jnno 5tk kata 🐤`,
    `৩৩ তারিখ আমার বিয়ে 🐤`,
    `Sunchi, ekta kissi dao age! 💋`,
    `আতা গাছে তোতা পাখি নারিকেল গাছে ডাব, আমি তোরে বিয়া করমু কি করবে তোর বাপ 🤨`,
    `kole niba 🥺`,
    `আসসালামু আলাইকুম! 🌸`,
    `এই নাও 🍼, বেবি বলতে বলতে হাপিয়ে গেছো!`,
    `ki dorkar 🙂`,
    `yamete kudasai 🙏`,
    `Kire chapri amare dakte tor lojja lage na? 😑`,
    `Daisuki da yo 💕`
];

// ─── Helper Functions ─────────────────────────────────────────────────────────

const getRandomReply = () =>
    randomReplies[Math.floor(Math.random() * randomReplies.length)];

const buildMentionMessage = (name, uid, reply) => ({
    body: `♡ ${name} ♡\n\n${reply}`,
    mentions: [{
        tag: `♡ ${name} ♡`,
        id: uid,
        fromIndex: 0,
        length: `♡ ${name} ♡`.length
    }]
});

const fetchBabyReply = async (text, senderID) => {
    const url = `${BABY_API}?text=${encodeURIComponent(text)}&senderID=${senderID}&font=1`;
    const response = await axios.get(url);
    return response.data.reply;
};

const registerReply = (info, commandName, authorID) => {
    if (info) {
        global.GoatBot.onReply.set(info.messageID, {
            commandName,
            author: authorID
        });
    }
};

// ─── Module Config ────────────────────────────────────────────────────────────

module.exports.config = {
    name: "bby",
    aliases: ["baby", "bbe", "babe", "sam"],
    version: "7.3.0",
    author: "dipto",
    countDown: 0,
    role: 0,
    description: "Smart SimSimi-style bot with 20+ random replies + 😍 react on prefix",
    category: "box chat",
    guide: {
        en: "{pn} [anyMessage] OR {pn} teach [Message] - [Reply]"
    }
};

// ─── onStart ──────────────────────────────────────────────────────────────────

module.exports.onStart = async ({ api, event, args, usersData }) => {
    const { senderID, threadID, messageID } = event;
    const name = await usersData.getName(senderID);

    try {
        if (!args[0]) {
            const msg = buildMentionMessage(name, senderID, getRandomReply());
            return api.sendMessage(msg, threadID, messageID);
        }

        const input = args.join(" ").toLowerCase();

        if (args[0] === "teach") {
            const parts = input.replace("teach ", "").split(/\s*-\s*/);
            const [question, answer] = parts;
            if (!answer) return api.sendMessage("❌ Invalid format! Use: teach [question] - [answer]", threadID, messageID);

            await axios.get(`${BABY_API}?teach=${encodeURIComponent(question)}&reply=${encodeURIComponent(answer)}&senderID=${senderID}`);
            return api.sendMessage(`✅ Got it Baby! Learned that response 🧠`, threadID, messageID);
        }

        const reply = await fetchBabyReply(input, senderID);
        return api.sendMessage(reply, threadID, (err, info) => {
            registerReply(info, "bby", senderID);
        }, messageID);

    } catch (err) {
        console.error("[bby:onStart]", err.message);
        return api.sendMessage("⚠️ Something went wrong Baby! Try again 🥺", threadID);
    }
};

// ─── onReply ──────────────────────────────────────────────────────────────────

module.exports.onReply = async ({ api, event }) => {
    const { senderID, threadID, messageID, body } = event;

    try {
        const reply = await fetchBabyReply(body, senderID);
        return api.sendMessage(reply, threadID, (err, info) => {
            registerReply(info, "bby", senderID);
        }, messageID);
    } catch (err) {
        console.error("[bby:onReply]", err.message);
        return api.sendMessage("⚠️ API Error Baby! 🥺", threadID);
    }
};

// ─── onChat ───────────────────────────────────────────────────────────────────

const CHAT_PREFIXES = ["baby", "bby", "bot", "jan", "babu", "janu", "hi", "mikasa"];

module.exports.onChat = async ({ api, event, usersData }) => {
    const { senderID, threadID, messageID, body } = event;

    try {
        const text = body ? body.toLowerCase().trim() : "";
        const matchedPrefix = CHAT_PREFIXES.find(p => text.startsWith(p));
        if (!matchedPrefix) return;

        // ✅ React 😍 on the message that triggered the bot
        api.setMessageReaction("😍", messageID, () => {}, true);

        const name = await usersData.getName(senderID);
        const restMessage = text.replace(new RegExp(`^${matchedPrefix}\\s*`), "").trim();

        if (!restMessage) {
            const msg = buildMentionMessage(name, senderID, getRandomReply());
            return api.sendMessage(msg, threadID, (err, info) => {
                registerReply(info, "bby", senderID);
            }, messageID);
        }

        const reply = await fetchBabyReply(restMessage, senderID);
        return api.sendMessage(reply, threadID, (err, info) => {
            registerReply(info, "bby", senderID);
        }, messageID);

    } catch (err) {
        console.error("[bby:onChat]", err.message);
    }
};
