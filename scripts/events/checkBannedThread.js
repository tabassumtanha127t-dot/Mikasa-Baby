module.exports = {
    config: {
        name: "checkBannedThread",
        version: "1.0",
        author: "saif",
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
        const { threadID, senderID } = event;
        const { config } = global.GoatBot;

        // Admin হলে command চলবে
        if (config.adminBot.includes(senderID)) {
            return;
        }

        try {
            // Thread data check করা
            const threadData = await threadsData.get(threadID);

            // যদি thread banned থাকে
            if (threadData && threadData.banned === true) {
                const reason = threadData.reason || "Unauthorized bot addition";
                const bannedAt = threadData.bannedAt || "Unknown";
                
                // Admin list তৈরি
                const adminList = config.adminBot.map((id, index) => 
                    `${index + 1}. fb.com/${id}`
                ).join("\n");

                const banMessage = getLang("threadBanned", reason, bannedAt, adminList);
                
                await message.reply(banMessage);
                
                // Command টা block করার জন্য
                return "break";
            }

        } catch (err) {
            console.error("[checkBannedThread] Error:", err);
        }
    }
};