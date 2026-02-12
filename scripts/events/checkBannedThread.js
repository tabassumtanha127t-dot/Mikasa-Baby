const cooldowns = new Map();

module.exports = {
    config: {
        name: "checkBannedThread",
        version: "2.0",
        author: "Your Name",
        envConfig: {
            allow: true
        },
        category: "events"
    },

    langs: {
        vi: {
            threadBanned: "⚠️ NHÓM NÀY ĐÃ BỊ CẤM!\n━━━━━━━━━━━━━━━━\n\n📛 Lý do: %1\n⏰ Thời gian: %2\n\n📞 Liên hệ admin để gỡ ban:\n%3"
        },
        en: {
            threadBanned: "⚠️ THIS GROUP IS BANNED!\n━━━━━━━━━━━━━━━━\n\n📛 Reason: %1\n⏰ Banned at: %2\n\n📞 Contact admin to unban:\n%3"
        }
    },

    onStart: async ({ event, threadsData, getLang, message }) => {
        const { threadID, senderID, body } = event;
        const { config } = global.GoatBot;

        // শুধু text message এ কাজ করবে
        if (!body || body.trim() === "") {
            return;
        }

        // Admin হলে return
        if (config.adminBot.includes(senderID)) {
            return;
        }

        // Cooldown check - 10 সেকেন্ডে একবার message
        const now = Date.now();
        const cooldownKey = threadID;
        
        if (cooldowns.has(cooldownKey)) {
            const expirationTime = cooldowns.get(cooldownKey) + 10000;
            if (now < expirationTime) {
                return "break"; // Silent block, message দিবে না
            }
        }

        try {
            const threadData = await threadsData.get(threadID);

            if (threadData && threadData.banned === true) {
                const reason = threadData.reason || "Unauthorized bot addition";
                const bannedAt = threadData.bannedAt || "Unknown";
                
                // Admin list
                const adminList = config.adminBot.map((id, index) => 
                    `${index + 1}. fb.com/${id}`
                ).join("\n");

                const banMessage = getLang("threadBanned", reason, bannedAt, adminList);
                
                await message.reply(banMessage);
                
                // Cooldown set
                cooldowns.set(cooldownKey, now);
                setTimeout(() => cooldowns.delete(cooldownKey), 15000);
                
                return "break";
            }

        } catch (err) {
            console.error("[checkBannedThread] Error:", err);
        }
    }
};