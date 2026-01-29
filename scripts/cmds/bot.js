const axios = require('axios');
const baseApiUrl = async () => {
    return "https://noobs-api.top/dipto";
};

// Serif Bold Italic Font Function Baby
function formatFont(text) {
    const fonts = {
        'a': '𝒂', 'b': '𝒃', 'c': '𝒄', 'd': '𝒅', 'e': '𝒆', 'f': '𝒇', 'g': '𝒈', 'h': '𝒉', 'i': '𝒊', 'j': '𝒋', 'k': '𝒌', 'l': '𝒍', 'm': '𝒎',
        'n': '𝒏', 'o': '𝒐', 'p': '𝒑', 'q': '𝒒', 'r': '𝒓', 's': '𝒔', 't': '𝒕', 'u': '𝒖', 'v': '𝒗', 'w': '𝒘', 'x': '𝒙', 'y': '𝒚', 'z': '𝒛',
        'A': '𝑨', 'B': '𝑩', 'C': '𝑪', 'D': '𝑫', 'E': '𝑬', 'F': '𝑭', 'G': '𝑮', 'H': '𝑯', 'I': '𝑰', 'J': '𝑱', 'K': '𝑲', 'L': '𝑳', 'M': '𝑴',
        'N': '𝑵', 'O': '𝑶', 'P': '𝑷', 'Q': '𝑸', 'R': '𝑹', 'S': '𝑺', 'T': '𝑻', 'U': '𝑼', 'V': '𝑽', 'W': '𝑾', 'X': '𝑿', 'Y': '𝒀', 'Z': '𝒁'
    };
    return text.split('').map(char => fonts[char] || char).join('');
}

// Random replies এক জায়গায় রাখা
const randomReplies = [
    `Kire Vuski dakis kn? `,
    `Hmm bolo, shunuchi to.. 😍`,
    `Ji jaan, bolo ki hoyeche? 🙈`,
    `আম গাছে আম নাই, ঢিল কেনো মারো?  তোমার সাথে কথা নাই বেবি কেনো ডাকো`,
    `Bolo pakhi, ami to tomar kothai bhabchilam! 🐣`,
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
    `Ji Babu, khaba naki? 🍎`,
    `আসসালামু আলাইকুম! `,
    `এই নাও 🥃, বেবি বলতে বলতে হাপিয়ে গেছো! `,
    `Oii bhoot, keno dakle? 👻`,
    `আমার বস নি:সন্দেহে এখনো সিংগেল।`,
    `Kire chapri amare dakte tor lojja lage na? `,
    `Daisuki da yo`
];

module.exports.config = {
    name: "bby",
    aliases: ["baby", "bbe", "babe", "sam"],
    version: "7.0.0",
    author: "dipto",
    countDown: 0,
    role: 0,
    description: "Better than all SimSimi with 20+ Random Replies and Serif Bold Italic font",
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
            const message = `♡ ${name} ♡\n\n${formatFont(randomReply)}`;
            
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
            if (!command) return api.sendMessage(formatFont("Invalid format Baby!"), event.threadID, event.messageID);
            await axios.get(`${link}?teach=${encodeURIComponent(final)}&reply=${encodeURIComponent(command)}&senderID=${uid}`);
            return api.sendMessage(formatFont(`✅ Done Baby! I learned that response.`), event.threadID, event.messageID);
        }

        const res = (await axios.get(`${link}?text=${encodeURIComponent(input)}&senderID=${uid}&font=1`)).data.reply;
        return api.sendMessage(formatFont(res), event.threadID, (err, info) => {
            if(info) global.GoatBot.onReply.set(info.messageID, { commandName: this.config.name, author: uid });
        }, event.messageID);

    } catch (e) {
        api.sendMessage("Error occurred Baby!", event.threadID);
    }
};

module.exports.onReply = async ({ api, event }) => {
    try {
        const res = (await axios.get(`${await baseApiUrl()}/baby?text=${encodeURIComponent(event.body)}&senderID=${event.senderID}&font=1`)).data.reply;
        return api.sendMessage(formatFont(res), event.threadID, (err, info) => {
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
                const message = `♡ ${name} ♡\n\n${formatFont(randomReply)}`;
                
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
            return api.sendMessage(formatFont(res), event.threadID, (err, info) => {
                if(info) global.GoatBot.onReply.set(info.messageID, { commandName: "bby", author: event.senderID });
            }, event.messageID);
        }
    } catch (err) {
        console.log(err);
    }
};
