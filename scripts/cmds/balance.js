// Style-4 Fancy Font (Bold Serif Italic) Baby
function fancy(text) {
    const map = {
        'a': '𝒂','b': '𝒃','c': '𝒄','d': '𝒅','e': '𝒆','f': '𝒇','g': '𝒈','h': '𝒉','i': '𝒊','j': '𝒋','k': '𝒌','l': '𝒍','m': '𝒎','n': '𝒏','o': '𝒐','p': '𝒑','q': '𝒒','r': '𝒓','s': '𝒔','t': '𝒕','u': '𝒖','v': '𝒗','w': '𝒘','x': '𝒙','y': '𝒚','z': '𝒛',
        'A': '𝑨','B': '𝑩','C': '𝑪','D': '𝑫','E': '𝑬','F': '𝑭','G': '𝑮','H': '𝑯','I': '𝑰','J': '𝑱','K': '𝑲','L': '𝑳','M': '𝑴','N': '𝑵','O': '𝑶','P': '𝑷','Q': '𝑸','R': '𝑹','S': '𝑺','T': '𝑻','U': '𝑼','V': '𝑽','W': '𝑾','X': '𝑿','Y': '𝒀','Z': '𝒁',
        '0': '𝟎','1': '𝟏','2': '𝟐','3': '𝟑','4': '𝟒','5': '𝟏','6': '𝟔','7': '𝟕','8': '𝟖','9': '𝟗', 
        '.': '.', ',': ',', '!': '!', '?': '?', ' ': ' '
    };
    return text.toString().split('').map(char => map[char] || char).join('');
}

// Centillion-Ready Shorthand Baby - FIXED VERSION
function formatMoney(amount) {
    if (amount === Infinity || amount === -Infinity) return fancy("𝑰𝒏𝒇𝒊𝒏𝒊𝒕𝒚");
    if (isNaN(amount) || amount === null || amount === undefined) return fancy("0");
    
    const absAmount = Math.abs(amount);
    const units = [
        { v: 1e303, s: "𝑪𝒕" },
        { v: 1e93, s: "𝑵𝒕𝒈" },
        { v: 1e66, s: "𝑽𝒈" },
        { v: 1e63, s: "𝑵𝒐𝒅" },
        { v: 1e60, s: "𝑶𝒄𝒅" },
        { v: 1e57, s: "𝑺𝒑𝒅" },
        { v: 1e54, s: "𝑺𝒙𝒅" },
        { v: 1e51, s: "𝑸𝒊𝒅" },
        { v: 1e48, s: "𝑸𝒅𝒄" },
        { v: 1e45, s: "𝑻𝒅𝒄" },
        { v: 1e42, s: "𝑫𝒅𝒄" },
        { v: 1e39, s: "𝑼𝒅𝒄" },
        { v: 1e36, s: "𝑫𝒄" },
        { v: 1e33, s: "𝑵𝒐" },
        { v: 1e30, s: "𝑶𝒄" },
        { v: 1e27, s: "𝑺𝒑" },
        { v: 1e24, s: "𝑺𝒙" },
        { v: 1e21, s: "𝑸𝒊" },
        { v: 1e18, s: "𝑸𝒅" },
        { v: 1e15, s: "𝑸" },
        { v: 1e12, s: "𝑻" },
        { v: 1e9,  s: "𝑩" },
        { v: 1e6,  s: "𝑴" },
        { v: 1e3,  s: "𝑲" }
    ];
    
    // Find the appropriate unit
    for (let u of units) {
        if (absAmount >= u.v) {
            const value = amount / u.v;
            // Format with 2 decimal places, but remove trailing .00 if whole number
            const formatted = value.toFixed(2).replace(/\.00$/, '');
            return fancy(formatted) + u.s;
        }
    }
    
    // For amounts less than 1000
    if (absAmount >= 1) {
        return fancy(amount.toFixed(2).replace(/\.00$/, ''));
    } else {
        return fancy(amount.toString());
    }
}

function getRankEmoji(rank) {
    switch(rank) {
        case 1: return "👑";
        case 2: return "🥈";
        case 3: return "🥉";
        case 4: case 5: case 6: case 7: case 8: case 9: case 10: return "🏅";
        default: return "🔹";
    }
}

function getRankTitle(rank) {
    switch(rank) {
        case 1: return "𝑲𝑰𝑵𝑮 𝑶𝑭 𝑾𝑬𝑨𝑳𝑻𝑯";
        case 2: return "𝑬𝑳𝑰𝑻𝑬 𝑩𝑰𝑳𝑳𝑰𝑶𝑵𝑨𝑰𝑹𝑬";
        case 3: return "𝑮𝑶𝑳𝑫𝑬𝑵 𝑻𝒀𝑪𝑶𝑶𝑵";
        case 4: case 5: case 6: return "𝑷𝑳𝑨𝑻𝑰𝑵𝑼𝑴 𝑴𝑨𝑮𝑵𝑨𝑻𝑬";
        case 7: case 8: case 9: case 10: return "𝑫𝑰𝑨𝑴𝑶𝑵𝑫 𝑴𝑶𝑮𝑼𝑳";
        default: return "𝑨𝑺𝑷𝑰𝑹𝑰𝑵𝑮 𝑻𝒀𝑪𝑶𝑶𝑵";
    }
}

module.exports = {
    config: {
        name: "top",
        aliases: ["richlist", "leaderboard", "wealth", "richest"],
        version: "6.9",
        author: "Saif & tamim",
        shortDescription: "🎡 𝑻𝑶𝑷 𝑹𝑰𝑪𝑯𝑬𝑺𝑻 𝑳𝑬𝑨𝑫𝑬𝑹𝑩𝑶𝑨𝑹𝑫",
        category: "bank",
        guide: { en: "{p}top [count]" }
    },

    onStart: async function({ api, event, usersData, args }) {
        try {
            const { threadID, senderID, messageID } = event;
            const allUsers = await usersData.getAll();

            // Filter and sort users by money
            const sortedUsers = allUsers
                .filter(u => u && u.money !== undefined && u.money !== null)
                .sort((a, b) => (b.money || 0) - (a.money || 0));

            // Determine how many to show (default 10, max 50)
            let requested = parseInt(args[0]);
            if (isNaN(requested) || requested < 1) requested = 10;
            const topCount = Math.min(requested, 50); // Max 50 for better performance
            
            const topUsers = sortedUsers.slice(0, topCount);

            if (topUsers.length === 0) {
                return api.sendMessage(fancy("❌ 𝑵𝒐 𝒖𝒔𝒆𝒓 𝒅𝒂𝒕𝒂 𝒇𝒐𝒖𝒏𝒅 𝒃𝒂𝒃𝒚!"), threadID, messageID);
            }

            // Build message header
            let msg = `╔══════════════════════════════╗\n`;
            msg += `       🏆 ${fancy("𝑾𝑬𝑨𝑳𝑻𝑯 𝑳𝑬𝑨𝑫𝑬𝑹𝑩𝑶𝑨𝑹𝑫")} 🏆\n`;
            msg += `╚══════════════════════════════╝\n\n`;
            msg += `${fancy(`𝑻𝑶𝑷 ${topCount} 𝑹𝑰𝑪𝑯𝑬𝑺𝑻 𝑷𝑳𝑨𝒀𝑬𝑹𝑺`)}\n`;
            msg += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

            let mentions = [];
            
            // Add each top user
            topUsers.forEach((user, index) => {
                const rank = index + 1;
                const name = user.name || "𝑼𝒏𝒌𝒏𝒐𝒘𝒏";
                const balance = user.money || 0;
                const uid = user.userID || user.id;
                
                const rankDisplay = rank < 10 ? `0${rank}` : `${rank}`;
                
                msg += `${getRankEmoji(rank)} ${fancy(`[${rankDisplay}]`)} ${fancy(name)}\n`;
                msg += `   ${fancy("𝑩𝒂𝒍𝒂𝒏𝒄𝒆")}: ${formatMoney(balance)}\n`;
                msg += `   ${fancy("𝑻𝒊𝒕𝒍𝒆")}: ${getRankTitle(rank)}\n`;
                
                // Add separator between users
                if (index < topUsers.length - 1) {
                    msg += `   ────────────────────\n`;
                } else {
                    msg += `\n`;
                }

                if (uid) mentions.push({ tag: name, id: uid });
            });

            // Find current user's rank and info
            const userIndex = sortedUsers.findIndex(u => 
                (u.userID || u.id) == senderID
            );
            const userRank = userIndex + 1;
            const userMoney = userIndex >= 0 ? sortedUsers[userIndex].money : 0;
            const userName = userIndex >= 0 ? sortedUsers[userIndex].name : "𝑼𝒏𝒌𝒏𝒐𝒘𝒏";

            // Add user's own rank info
            msg += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
            msg += `${fancy("𝒀𝑶𝑼𝑹 𝑺𝑻𝑨𝑻𝑼𝑺")} 👤\n`;
            msg += `   ${fancy("𝑵𝒂𝒎𝒆")}: ${fancy(userName)}\n`;
            msg += `   ${fancy("𝑹𝒂𝒏𝒌")}: ${userRank > 0 ? fancy(`#${userRank}`) : fancy("𝑵/𝑨")}\n`;
            msg += `   ${fancy("𝑩𝒂𝒍𝒂𝒏𝒄𝒆")}: ${formatMoney(userMoney)}\n`;
            
            if (userRank > 0 && userRank > topCount) {
                const usersAbove = userRank - topCount;
                msg += `   ${fancy("𝑵𝒆𝒆𝒅")}: ${formatMoney(sortedUsers[topCount - 1].money - userMoney + 1)} ${fancy("𝒕𝒐 𝒆𝒏𝒕𝒆𝒓 𝒕𝒐𝒑")} ${topCount}\n`;
            }
            
            msg += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
            msg += `${fancy("💡 𝑻𝑰𝑷: 𝑼𝒔𝒆")} {p}top 20 ${fancy("𝒐𝒓")} {p}top 50\n`;
            msg += `${fancy("📈 𝑻𝒐𝒕𝒂𝒍 𝑷𝒍𝒂𝒚𝒆𝒓𝒔:")} ${fancy(sortedUsers.length)}\n`;
            
            // Add timestamp
            const now = new Date();
            const timeStr = now.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit' });
            const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            msg += `${fancy("🕐 𝑼𝒑𝒅𝒂𝒕𝒆𝒅:")} ${dateStr} ${timeStr}`;

            return api.sendMessage({ 
                body: msg, 
                mentions 
            }, threadID, messageID);

        } catch (err) {
            console.error("Top command error:", err);
            return api.sendMessage(
                fancy("⚠️ 𝑬𝒓𝒓𝒐𝒓 𝒍𝒐𝒂𝒅𝒊𝒏𝒈 𝒕𝒉𝒆 𝒘𝒆𝒂𝒍𝒕𝒉 𝒍𝒊𝒔𝒕. 𝑷𝒍𝒆𝒂𝒔𝒆 𝒕𝒓𝒚 𝒂𝒈𝒂𝒊𝒏 𝒍𝒂𝒕𝒆𝒓 𝒃𝒂𝒃𝒚."), 
                event.threadID, 
                event.messageID
            );
        }
    }
};