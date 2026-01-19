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

module.exports.config = {
    name: "bby",
    aliases: ["baby", "bbe", "babe", "sam"],
    version: "7.0.0",
    author: "dipto",
    countDown: 0,
    role: 0,
    description: "Better than all SimSimi with 20+ Random Replies and Serif Bold Italic font",
    category: "chat",
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
            const ran = [
                `Bolo ${name} baby, jaan amar! 😚`,
                `Hmm bolo ${name}, shunuchi to.. 😍`,
                `Ji jaan, ${name} bolo ki hoyeche? 🙈`,
                `Hi ${name} sona! Ki koro? ❤️`,
                `Bolo ${name} pakhi, ami to tomar kothai bhabchilam! 🐣`,
                `Hmm ${name}, khub miss korchi tomay! 😘`,
                `Oii ${name} pagli, emon kore dako keno? 🥰`,
                `Bolo ${name} jaan, kemon acho tumi? ✨`,
                `Umm ${name}, tumi ato mishti keno? 🍬`,
                `Ji bolun ${name} shaheb, ami hazir! 🫡`,
                `Hae ${name}, amar koliza, bolo ki bolbe? 💖`,
                `Bolo ${name}, tomay chara bhalo lage na! 🥺`,
                `Oii ${name}, cholo kothao ghure ashi! 🚗`,
                `Sunchi ${name}, ekta kissi dao age! 💋`,
                `Bolo ${name}, tomay khub bhalobashi! 💍`,
                `Ji ${name} Babu, khaba naki? 🍎`,
                `Hmm ${name}, tumi amar shob! 🌎`,
                `Bolo ${name}, amar bhalobasha kemon? 🔥`,
                `Oii ${name} bhoot, keno dakle? 👻`,
                `Ji ${name} moina, ki chai tomar? 💎`,
                `Hmm ${name} jaan, tomar kotha na shunle mon bhore na! 🌸`,
                `Bolo ${name} kolijar tukro, ki bolba? 💓`
            ];
            const msg = formatFont(ran[Math.floor(Math.random() * ran.length)]);
            return api.sendMessage(msg, event.threadID, event.messageID);
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
                const randomReplies = [
                    `Umm bolo ${name} baby, jaan amar! 😚`,
                    `Hi ${name}! Bolo ki bolte chao? 😘`,
                    `Yes ${name} baby, ami shunchi to! 😍`,
                    `Hmm ${name}, bolo jaan, ki korte pari? 🙈`,
                    `Bolo ${name} sona, ami ekhaney achi! ❤️`,
                    `Oii ${name}, tomay chara bhalo lage na! 🥺`,
                    `Hmm ${name}, ekta kissi dao age! 💋`,
                    `Hi ${name} pakhi, kemon acho? 🐣`,
                    `Bolo ${name} koliza, ki hoyeche? 💓`,
                    `Ji ${name} Babu, keno dakle? 🥰`,
                    `Hmm ${name}, tumi ato mishti keno? 🍬`,
                    `Bolo ${name} sona, ami hazir! 🫡`,
                    `Oii ${name} pagli, shunuchi to! 😍`,
                    `Ji jaan ${name}, kemon acho? ✨`,
                    `Hmm ${name}, amar bhalobasha! 💍`,
                    `Bolo ${name} moina, ki chai? 💎`,
                    `Oii ${name} bhoot, koto din por dakle! 👻`,
                    `Hi ${name} amar lokkhi ta! 🌸`,
                    `Bolo ${name} jaan, khub miss korchi! 😘`,
                    `Ji ${name} shaheb, hukum korun! 👑`,
                    `Hmm ${name}, tumi amar shob kichu! 🌎`,
                    `Oii ${name}, cholo kothao ghure ashi! 🚗`
                ];
                return api.sendMessage(formatFont(randomReplies[Math.floor(Math.random() * randomReplies.length)]), event.threadID, (err, info) => {
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
