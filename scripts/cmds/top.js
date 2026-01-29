// Style-4 Fancy Font (Bold Serif Italic) Baby
function fancy(text) {
    const map = {
        'a': '𝒂','b': '𝒃','c': '𝒄','d': '𝒅','e': '𝒆','f': '𝒇','g': '𝒈','h': '𝒉','i': '𝒊','j': '𝒋','k': '𝒌','l': '𝒍','m': '𝒎','n': '𝒏','o': '𝒐','p': '𝒑','q': '𝗊','r': '𝒓','s': '𝒔','t': '𝒕','u': '𝒖','v': '𝒗','w': '𝒘','x': '𝒙','y': '𝒚','z': '𝒛',
        'A': '𝑨','B': '𝑩','C': '𝑪','D': '𝑫','E': '𝑬','F': '𝑭','G': '𝑮','H': '𝑯','I': '𝑰','J': '𝑱','K': '𝑲','L': '𝑳','M': '𝑴','N': '𝑵','O': '𝑶','P': '𝑷','Q': '𝑸','R': '𝑹','S': '𝑺','T': '𝑻','U': '𝑼','V': '𝑽','W': '𝒘','X': '𝑿','Y': '𝒀','Z': '𝒁',
        '0': '𝟎','1': '𝟏','2': '𝟐','3': '𝟑','4': '𝟒','5': '𝟓','6': '𝟔','7': '𝟕','8': '𝟖','9': '𝟗', '.': '.'
    };
    return text.toString().split('').map(char => map[char] || char).join('');
}

// Centillion-Ready Shorthand Baby
function formatMoney(amount) {
    if (amount === Infinity) return fancy("𝑰𝒏𝒇𝒊𝒏𝒊𝒕𝒚");
    const units = [
        { v: 1e303, s: "𝑪𝒕" }, { v: 1e93, s: "𝑵𝒕𝒈" }, { v: 1e66, s: "𝑽𝒈" },
        { v: 1e63, s: "𝑵𝒐𝒅" }, { v: 1e60, s: "𝑶𝒄𝒅" }, { v: 1e57, s: "𝑺𝒑𝒅" },
        { v: 1e54, s: "𝑺𝒙𝒅" }, { v: 1e51, s: "𝑸𝒊𝒅" }, { v: 1e48, s: "𝑸𝒅𝒄" },
        { v: 1e45, s: "𝑻𝒅𝒄" }, { v: 1e42, s: "𝑫𝒅𝒄" }, { v: 1e39, s: "𝑼𝒅𝒄" },
        { v: 1e36, s: "𝑫𝒄" }, { v: 1e33, s: "𝑵𝒐" }, { v: 1e30, s: "𝑶𝒄" },
        { v: 1e27, s: "𝑺𝒑" }, { v: 1e24, s: "𝑺𝒙" }, { v: 1e21, s: "𝑸𝒊" },
        { v: 1e18, s: "𝑸𝒅" }, { v: 1e15, s: "𝑸" }, { v: 1e12, s: "𝑻" },
        { v: 1e9,  s: "𝑩" }, { v: 1e6,  s: "𝑴" }, { v: 1e3,  s: "𝑲" }
    ];
    for (let u of units) {
        if (Math.abs(amount) >= u.v) return fancy((amount / u.v).toFixed(2)) + u.s;
    }
    return fancy(Math.floor(amount).toLocaleString());
}

function getRankEmoji(rank) {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return "🔹";
}

module.exports = {
    config: {
        name: "top",
        aliases: ["richlist", "leaderboard"],
        version: "6.0",
        author: "Saif & tamim",
        shortDescription: "🎡 𝑻𝑶𝑷 𝑹𝑰𝑪𝑯𝑬𝑺𝑻 𝑳𝑬𝑨𝑫𝑬𝑹𝑩𝑶𝑨𝑹𝑫",
        category: "bank",
        guide: { en: "{p}top [count]" }
    },

    onStart: async function({ api, event, usersData, args }) {
        try {
            const { threadID, senderID, messageID } = event;
            const allUsers = await usersData.getAll();

            const sortedUsers = allUsers
                .filter(u => u.money !== undefined)
                .sort((a, b) => b.money - a.money);

            const requested = parseInt(args[0]) || 10;
            const topCount = Math.max(1, Math.min(requested, 100)); // Capped at 100 for stability
            const topUsers = sortedUsers.slice(0, topCount);

            if (!topUsers.length)
                return api.sendMessage(fancy("❌ 𝑵𝒐 𝒅𝒂𝒕𝒂 𝒇𝒐𝒖𝒏𝒅 𝒃𝒂𝒃𝒚!"), threadID, messageID);

            let msg = `🏆 ${fancy("𝑻𝑶𝑷")} ${fancy(topCount)} ${fancy("𝑹𝑰𝑪𝑯𝑬𝑺𝑻 𝑼𝑺𝑬𝑹𝑺 𝑩𝑨𝑩𝒀")}\n`;
            msg += `━━━━━━━━━━━━━━━━━━\n\n`;

            let mentions = [];
            topUsers.forEach((user, i) => {
                const rank = i + 1;
                const name = user.name || "𝑼𝒏𝒌𝒏𝒐𝒘𝒏";
                const balance = formatMoney(user.money || 0);
                const uid = user.userID || user.id;

                msg += `${getRankEmoji(rank)} ${fancy("𝑹𝒂𝒏𝒌")} ${fancy(rank)}: ${fancy(name)}\n`;
                msg += `💰 ${fancy("𝑩𝒂𝒍𝒂𝒏𝒄𝒆")}: ${balance}\n\n`;

                if (uid) mentions.push({ tag: name, id: uid });
            });

            const userRank = sortedUsers.findIndex(u => (u.userID || u.id) == senderID) + 1;
            const userMoney = sortedUsers.find(u => (u.userID || u.id) == senderID)?.money || 0;

            msg += `━━━━━━━━━━━━━━━━━━\n`;
            msg += `👤 ${fancy("𝒀𝑶𝑼𝑹 𝑹𝑨𝑵𝑲")}: ${userRank > 0 ? fancy(userRank) : fancy("𝑵/𝑨")}\n`;
            msg += `💳 ${fancy("𝒀𝑶𝑼𝑹 𝑩𝑨𝑳𝑨𝑵𝑪𝑬")}: ${formatMoney(userMoney)}\n`;
            msg += `━━━━━━━━━━━━━━━━━━\n`;
            msg += `💡 ${fancy("𝑼𝒔𝒆 {𝒑}𝒕𝒐𝒑 𝟓𝟎 | 𝟏𝟎𝟎")}`;

            return api.sendMessage({ body: msg, mentions }, threadID, messageID);

        } catch (err) {
            console.error(err);
            return api.sendMessage(fancy("⚠️ 𝑬𝒓𝒓𝒐𝒓 𝒍𝒐𝒂𝒅𝒊𝒏𝒈 𝒕𝒉𝒆 𝒘𝒆𝒂𝒍𝒕𝒉 𝒍𝒊𝒔𝒕 𝒃𝒂𝒃𝒚."), event.threadID, event.messageID);
        }
    }
};
