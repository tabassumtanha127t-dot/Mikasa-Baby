const axios = require('axios');
const baseApiUrl = async () => {
    return "https://noobs-api.top/dipto";
};

// Random replies এক জায়গায় রাখা
const randomReplies = [
    `Kire Vuski dakis kn? `,
    `Hmm bolo, shunuchi to.. 😍`,
    `Ji jaan, bolo ki hoyeche? 🙈`,
    `আম গাছে আম নাই, ঢিল কেনো মারো?  তোমার সাথে কথা নাই বেবি কেনো ডাকো`,
    `🙂🙂🙂`,
    `ভদ্রতার খাতিরেই নারী  দের সাথে চলাফেরা করি, নইলে আমি মিকাসার পুরুষ সজ্ঞি সর্ব্দাই পছন্দনীয়! 🙈 `,
    `তোর কাজ নাই?  সারাদিন খালি আমারে ডাকস 😾`,
    `বেশি ডাকলে আম্মু বকা দেবে তো 🥺`,
    `Ranna kortesi bby!!  ektu por ashtesi`,
    `Ato bby bby na kore Amar saiful boss re Akta Girlfriend de`,
    `বলো তোমার বয়ফ্রেন্ড  রে আমার হাতে তুলে দিবা 🥺`,
    `Over acting er jnno 5tk kata 🐤`,
    `৩৩ তারিখ আমার বিয়ে 🐤`,
    `Sunchi, ekta kissi dao age! 💋`,
    `আতা গাছে তোতা পাখি নারিকেল গাছে ডাব, আমি তোরে বিয়া করমু কি করবে তোর বাপ 🤨?`,
    `kole niba 🥺`,
    `আসসালামু আলাইকুম! `,
    `এই নাও 🍼, বেবি বলতে বলতে হাপিয়ে গেছো! `,
    `ki dorkar 🙂`,
    `-yamete kudasai`,
    `Kire chapri amare dakte tor lojja lage na? `,
    `Daisuki da yo`
];

module.exports.config = {
    name: "bby",
    aliases: ["baby", "bbe", "babe", "sam"],
    version: "7.1.0",
    author: "dipto & Gemini",
    countDown: 0,
    role: 0,
    description: "Better than all SimSimi with 20+ Random Replies (Normal Font)",
    category: "box chat",
    guide: {
        en: "{pn} [anyMessage] OR teach [Message] - [Reply]"
    }
};

module.exports.onStart = async ({ api, event, args, usersData }) => {
    const link = `${await baseApiUrl()}/baby`;
    const uid = event.senderID;
    const name = await usersData.getName(uid);

    try {
        if (!args[0]) {
            const randomReply = randomReplies[Math.floor(Math.random() * randomReplies.length)];
            const message = `♡ ${name} ♡\n\n${randomReply}`;

            return api.sendMessage({
                body: message,
                mentions: [{
                    tag: `♡ ${name} ♡`,
                    id: uid,
                    fromIndex: 0,
                    length: `♡ ${name} ♡`.length
                }]
            }, event.threadID, event.messageID);
        }

        const input = args.join(" ").toLowerCase();
        if (args[0] === 'teach') {
            const [comd, command] = input.split(/\s*-\s*/);
            const final = comd.replace("teach ", "");
            if (!command) return api.sendMessage("Invalid format Baby!", event.threadID, event.messageID);
            await axios.get(`${link}?teach=${encodeURIComponent(final)}&reply=${encodeURIComponent(command)}&senderID=${uid}`);
            return api.sendMessage(`✅ Done Baby! I learned that response.`, event.threadID, event.messageID);
        }

        const res = (await axios.get(`${link}?text=${encodeURIComponent(input)}&senderID=${uid}&font=1`)).data.reply;
        return api.sendMessage(res, event.threadID, (err, info) => {
            if(info) global.GoatBot.onReply.set(info.messageID, { commandName: this.config.name, author: uid });
        }, event.messageID);

    } catch (e) {
        api.sendMessage("Error occurred Baby!", event.threadID);
    }
};

module.exports.onReply = async ({ api, event }) => {
    try {
        const res = (await axios.get(`${await baseApiUrl()}/baby?text=${encodeURIComponent(event.body)}&senderID=${event.senderID}&font=1`)).data.reply;
        return api.sendMessage(res, event.threadID, (err, info) => {
            if(info) global.GoatBot.onReply.set(info.messageID, { commandName: "bby", author: event.senderID });
        }, event.messageID);
    } catch (err) {
        return api.sendMessage("API Error Baby!", event.threadID);
    }
};

module.exports.onChat = async ({ api, event, usersData }) => {
    try {
        const body = event.body ? event.body.toLowerCase() : "";
        const prefixes = ["baby", "bby", "bot", "jan", "babu", "janu", "hi", "mikasa"];
        const startsWithPrefix = prefixes.some(p => body.startsWith(p));

        if (startsWithPrefix) {
            const name = await usersData.getName(event.senderID);
            const arr = body.replace(/^\S+\s*/, "");

            if (!arr) {
                const randomReply = randomReplies[Math.floor(Math.random() * randomReplies.length)];
                const message = `♡ ${name} ♡\n\n${randomReply}`;

                return api.sendMessage({
                    body: message,
                    mentions: [{
                        tag: `♡ ${name} ♡`,
                        id: event.senderID,
                        fromIndex: 0,
                        length: `♡ ${name} ♡`.length
                    }]
                }, event.threadID, (err, info) => {
                    if(info) global.GoatBot.onReply.set(info.messageID, { commandName: "bby", author: event.senderID });
                }, event.messageID);
            }

            const res = (await axios.get(`${await baseApiUrl()}/baby?text=${encodeURIComponent(arr)}&senderID=${event.senderID}&font=1`)).data.reply;
            return api.sendMessage(res, event.threadID, (err, info) => {
                if(info) global.GoatBot.onReply.set(info.messageID, { commandName: "bby", author: event.senderID });
            }, event.messageID);
        }
    } catch (err) {
        console.log(err);
    }
};
