/*
  Updated formatMoney to handle up to Centillion (10^303)
  Shorthand scales included: K, M, B, T, QD, QN, SX, SP, OC, NO, DC, ..., CT
*/

function formatMoney(amount) {
    if (amount >= 1e303) return (amount / 1e303).toFixed(2) + "𝐂𝐓"; // Centillion
    if (amount >= 1e63) return (amount / 1e63).toFixed(2) + "𝐕𝐈";  // Vigintillion
    if (amount >= 1e60) return (amount / 1e60).toFixed(2) + "𝐍𝐃";  // Novemdecillion
    if (amount >= 1e57) return (amount / 1e57).toFixed(2) + "𝐎𝐃";  // Octodecillion
    if (amount >= 1e54) return (amount / 1e54).toFixed(2) + "𝐒𝐃";  // Septendecillion
    if (amount >= 1e51) return (amount / 1e51).toFixed(2) + "𝐒𝐃";  // Sexdecillion
    if (amount >= 1e48) return (amount / 1e48).toFixed(2) + "𝐐𝐃";  // Quindecillion
    if (amount >= 1e45) return (amount / 1e45).toFixed(2) + "𝐐𝐓";  // Quattuordecillion
    if (amount >= 1e42) return (amount / 1e42).toFixed(2) + "𝐓𝐃";  // Tredecillion
    if (amount >= 1e39) return (amount / 1e39).toFixed(2) + "𝐃𝐃";  // Duodecillion
    if (amount >= 1e36) return (amount / 1e36).toFixed(2) + "𝐔𝐃";  // Undecillion
    if (amount >= 1e33) return (amount / 1e33).toFixed(2) + "𝐃𝐂";  // Decillion
    if (amount >= 1e30) return (amount / 1e30).toFixed(2) + "𝐍𝐎";  // Nonillion
    if (amount >= 1e27) return (amount / 1e27).toFixed(2) + "𝐎𝐂";  // Octillion
    if (amount >= 1e24) return (amount / 1e24).toFixed(2) + "𝐒𝐏";  // Septillion
    if (amount >= 1e21) return (amount / 1e21).toFixed(2) + "𝐒𝐗";  // Sextillion
    if (amount >= 1e18) return (amount / 1e18).toFixed(2) + "𝐐𝐍";  // Quintillion
    if (amount >= 1e15) return (amount / 1e15).toFixed(2) + "𝐐𝐃";  // Quadrillion
    if (amount >= 1e12) return (amount / 1e12).toFixed(2) + "𝐓";   // Trillion
    if (amount >= 1e9)  return (amount / 1e9).toFixed(2)  + "𝐁";   // Billion
    if (amount >= 1e6)  return (amount / 1e6).toFixed(2)  + "𝐌";   // Million
    if (amount >= 1e3)  return (amount / 1e3).toFixed(2)  + "𝐊";   // Thousand
    return amount.toString();
}

function stylish(text) {
    const serifBold = {
        "a":"𝐚","b":"𝐛","c":"𝐜","d":"𝐝","e":"𝐞","f":"𝐟","g":"𝐠","h":"𝐡","i":"𝐢","j":"𝐣","k":"𝐤","l":"𝐥","m":"𝐦","n":"𝐧","o":"𝐨","p":"𝐩","q":"𝐪","r":"𝐫","s":"𝐬","t":"𝐭","u":"𝐮","v":"𝐯","w":"𝐰","x":"𝐱","y":"𝐲","z":"𝐳",
        "A":"𝐀","B":"𝐁","C":"𝐂","D":"𝐃","E":"𝐄","F":"𝐅","G":"𝐆","H":"𝐇","I":"𝐈","J":"𝐉","K":"𝐊","L":"𝐋","M":"𝐌","N":"𝐍","O":"𝐎","P":"𝐏","Q":"𝐐","R":"𝐑","S":"𝐒","T":"𝐓","U":"𝐔","V":"𝐕","W":"𝐖","X":"𝐗","Y":"𝐘","Z":"𝐙",
        "0":"𝟎","1":"𝟏","2":"𝟐","3":"𝟑","4":"𝟒","5":"𝟓","6":"𝟔","7":"𝟕","8":"𝟖","9":"𝟗"
    };
    return text.toString().split("").map(c => serifBold[c] || c).join("");
}

function getRankEmoji(rank) {
    if (rank === 1) return "👑";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return "✧";
}

module.exports = {
    config: {
        name: "top",
        aliases: ["richlist", "leaderboard"],
        version: "4.6",
        author: "Tꫝᴍɪᴍ & Gemini",
        shortDescription: "Top Money Leaderboard",
        longDescription: "Shows the richest users on the global server list.",
        category: "Economy",
        guide: { en: "{p}top [10/50/100]" }
    },

    onStart: async function({ api, event, usersData, args }) {
        try {
            const { threadID, senderID, messageID } = event;
            const allUsers = await usersData.getAll();

            const sortedUsers = allUsers
                .filter(u => u.money !== undefined)
                .sort((a, b) => b.money - a.money);

            const requested = parseInt(args[0]) || 10;
            const topCount = Math.max(1, Math.min(requested, 500));
            const topUsers = sortedUsers.slice(0, topCount);

            if (!topUsers.length)
                return api.sendMessage(
                    "❌ No data found, Baby!",
                    threadID,
                    null,
                    messageID
                );

            let msg = `🏆 ${stylish("𝐓𝐎𝐏")} ${stylish(topCount)} ${stylish("𝐑𝐈𝐂𝐇𝐄𝐒𝐓 𝐔𝐒𝐄𝐑𝐒")}\n`;
            msg += `━━━━━━━━━━━━━━━━━━\n\n`;

            let mentions = [];
            topUsers.forEach((user, i) => {
                const rank = i + 1;
                const name = user.name || "Unknown";
                const balance = formatMoney(user.money || 0);
                const uid = user.userID || user.id;

                msg += `${getRankEmoji(rank)} ${stylish("𝐑𝐚𝐧𝐤")} ${stylish(rank)}: ${stylish(name)}\n`;
                msg += `💸 ${stylish("𝐁𝐚𝐥𝐚𝐧𝐜𝐞")}: ${stylish(balance)}\n\n`;

                if (uid) mentions.push({ tag: name, id: uid });
            });

            const userRank =
                sortedUsers.findIndex(u => (u.userID || u.id) == senderID) + 1;
            const userMoney =
                sortedUsers.find(u => (u.userID || u.id) == senderID)?.money || 0;

            msg += `━━━━━━━━━━━━━━━━━━\n`;
            msg += `🎀 ${stylish("𝐘𝐎𝐔𝐑 𝐑𝐀𝐍𝐊")}: ${userRank > 0 ? stylish(userRank) : "𝐍/𝐀"}\n`;
            msg += `💸 ${stylish("𝐘𝐎𝐔𝐑 𝐁𝐀𝐋𝐀𝐍𝐂𝐄")}: ${stylish(formatMoney(userMoney))}\n`;
            msg += `━━━━━━━━━━━━━━━━━━\n`;
            msg += `➳ ${stylish("𝐔𝐬𝐞 {𝐩}𝐭𝐨𝐩 𝟓𝟎 | 𝟏𝟎𝟎 | 𝟓𝟎𝟎")}\n`;
            msg += `Keep grinding, Baby!`;

            api.sendMessage(
                { body: msg, mentions },
                threadID,
                null,
                messageID
            );

        } catch (err) {
            console.error(err);
            api.sendMessage(
                "⚠️ Error loading leaderboard, Baby.",
                event.threadID,
                null,
                event.messageID
            );
        }
    }
};
