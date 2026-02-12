const { getTime } = global.utils;

// Cooldown tracker - একই group বারবার notify করবে না
const recentBans = new Map();

// Delay দিয়ে message পাঠানো
async function sendWithDelay(api, message, targetID, delay = 2000) {
    return new Promise((resolve) => {
        setTimeout(() => {
            api.sendMessage(message, targetID)
                .then(resolve)
                .catch(err => {
                    console.error(`[antiAddBot] Failed to send to ${targetID}:`, err);
                    resolve();
                });
        }, delay);
    });
}

module.exports = {
    config: {
        name: "antiAddBot",
        isBot: true,
        version: "2.0",
        author: "Your Name",
        envConfig: {
            allow: true
        },
        category: "events"
    },

    langs: {
        vi: {
            notifyAdmin: "🚫 TỰ ĐỘNG BAN NHÓM\n━━━━━━━━━━━━━━━━\n\n👤 Người thêm: %1\n🆔 User ID: %2\n📱 Tên nhóm: %3\n🔖 ID nhóm: %4\n⏰ Thời gian: %5\n\n⚠️ Lý do: Thêm bot không được phép",
            adminAdded: "✅ ADMIN ĐÃ THÊM BOT\n━━━━━━━━━━━━━━━━\n\n👤 Admin: %1\n🆔 Admin ID: %2\n📱 Nhóm: %3\n🔖 ID nhóm: %4\n⏰ Thời gian: %5"
        },
        en: {
            notifyAdmin: "🚫 AUTO-BANNED GROUP\n━━━━━━━━━━━━━━━━\n\n👤 Added by: %1\n🆔 User ID: %2\n📱 Group name: %3\n🔖 Group ID: %4\n⏰ Time: %5\n\n⚠️ Reason: Unauthorized bot addition",
            adminAdded: "✅ ADMIN ADDED BOT\n━━━━━━━━━━━━━━━━\n\n👤 Admin: %1\n🆔 Admin ID: %2\n📱 Group: %3\n🔖 Group ID: %4\n⏰ Time: %5"
        }
    },

    onStart: async ({ usersData, threadsData, event, api, getLang }) => {
        const { logMessageType, logMessageData, author, threadID } = event;
        const botID = api.getCurrentUserID();
        const { config } = global.GoatBot;

        // শুধুমাত্র bot add হলেই কাজ করবে
        if (logMessageType == "log:subscribe" && logMessageData.addedParticipants.some(item => item.userFbId == botID)) {
            
            // যদি bot নিজে join করে তাহলে return
            if (author == botID) {
                return;
            }

            try {
                const threadInfo = await api.getThreadInfo(threadID);
                const threadName = threadInfo.threadName || "Unnamed Group";
                const authorName = await usersData.getName(author);
                const time = getTime("DD/MM/YYYY HH:mm:ss");

                // Specific Admin GC
                const targetGC = "23869391286001160";

                // --- ADMIN ADD করলে ---
                if (config.adminBot.includes(author)) {
                    const adminMsg = getLang("adminAdded", authorName, author, threadName, threadID, time);
                    
                    // শুধু GC তে notify (spam avoid)
                    await sendWithDelay(api, adminMsg, targetGC);
                    
                    return;
                }

                // --- Cooldown Check - একই group 24 ঘন্টায় একবার notify ---
                if (recentBans.has(threadID)) {
                    console.log(`[antiAddBot] Group ${threadID} already banned recently, skipping notification`);
                    return;
                }

                // --- NON-ADMIN ADD = BAN ---
                
                // Thread silently ban করা
                await threadsData.set(threadID, {
                    banned: true,
                    reason: "Unauthorized bot addition",
                    bannedBy: "System",
                    bannedAt: time
                });

                // Admin notification message
                const adminMsg = getLang("notifyAdmin", authorName, author, threadName, threadID, time);
                
                // শুধু GC তে notify (individual inbox এ না - spam avoid)
                await sendWithDelay(api, adminMsg, targetGC);

                // Cooldown set করা - 24 ঘন্টা
                recentBans.set(threadID, Date.now());
                setTimeout(() => {
                    recentBans.delete(threadID);
                    console.log(`[antiAddBot] Cooldown cleared for ${threadID}`);
                }, 86400000); // 24 hours

                console.log(`[antiAddBot] Banned group: ${threadName} (${threadID})`);

            } catch (err) {
                console.error("[antiAddBot] Error:", err);
            }
        }
    }
};