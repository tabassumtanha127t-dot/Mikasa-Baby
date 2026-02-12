const cooldowns = new Map(); // message cooldown tracker

module.exports = {
    config: {
        name: "checkBannedThread",
        version: "1.2",
        author: "Your Name",
        envConfig: {
            allow: true
        },
        category: "events"
    },

    langs: {
        vi: {
            threadBanned: "⚠️ NHÓM NÀY ĐÃ BỊ CẤM SỬ DỤNG BOT!\n\n📛 Lý do: %1\n⏰ Thời gian ban: %2\n\n📞 Liên hệ admin để được gỡ ban:\n%3"
        },
        en: {
            threadBanned: "⚠️ THIS GROUP IS BANNED FROM USING BOT!\n\n📛 Reason: %1\n⏰ Banned at: %2\n\n📞 Contact admin to unban:\n%3"
        }
    },

    onStart: async ({ event, api, threadsData, getLang, message }) => {
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

        // Cooldown check - একই thread এ 5 সেকেন্ডে একবার message
        const now = Date.now();
        const cooldownKey = `${threadID}`;
        
        if (cooldowns.has(cooldownKey)) {
            const expirationTime = cooldowns.get(cooldownKey) + 5000; // 5 seconds
            if (now < expirationTime) {
                return "break"; // message দিবে না, শুধু command block করবে
            }
        }

        try {
            const threadData = await threadsData.get(threadID);

            if (threadData && threadData.banned === true) {
                const reason = threadData.reason || "Unauthorized bot addition";
                const bannedAt = threadData.bannedAt || "Unknown";
                
                const adminList = config.adminBot.map((id, index) => 
                    `${index + 1}. fb.com/${id}`
                ).join("\n");

                const banMessage = getLang("threadBanned", reason, bannedAt, adminList);
                
                await message.reply(banMessage);
                
                // Cooldown set করা
                cooldowns.set(cooldownKey, now);
                
                // 10 সেকেন্ড পর cooldown clear করা
                setTimeout(() => cooldowns.delete(cooldownKey), 10000);
                
                return "break";
            }

        } catch (err) {
            console.error("[checkBannedThread] Error:", err);
        }
    }
};