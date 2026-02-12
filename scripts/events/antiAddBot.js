const { getTime } = global.utils;

module.exports = {
    config: {
        name: "antiAddBot",
        isBot: true,
        version: "1.0",
        author: "saif",
        envConfig: {
            allow: true
        },
        category: "events"
    },

    langs: {
        vi: {
            banned: "⚠️ Nhóm này đã bị cấm vì thêm bot không được phép!\n\n- Người thêm: %1\n- Nhóm: %2\n- ID nhóm: %3\n- Thời gian: %4\n\n❌ Bot sẽ rời khỏi nhóm ngay bây giờ.",
            notifyAdmin: "🚫 ĐÃ TỰ ĐỘNG BAN NHÓM\n\n- Lý do: Thêm bot không được phép\n- Người thêm: %1 (ID: %2)\n- Tên nhóm: %3\n- ID nhóm: %4\n- Thời gian: %5"
        },
        en: {
            banned: "⚠️ This group has been banned for adding bot without permission!\n\n- Added by: %1\n- Group: %2\n- Group ID: %3\n- Time: %4\n\n❌ Bot will leave this group now.",
            notifyAdmin: "🚫 AUTO-BANNED GROUP\n\n- Reason: Unauthorized bot addition\n- Added by: %1 (ID: %2)\n- Group name: %3\n- Group ID: %4\n- Time: %5"
        }
    },

    onStart: async ({ usersData, threadsData, event, api, getLang, message }) => {
        const { logMessageType, logMessageData, author, threadID } = event;
        const botID = api.getCurrentUserID();
        const { config } = global.GoatBot;

        // শুধুমাত্র bot add হলেই কাজ করবে
        if (logMessageType == "log:subscribe" && logMessageData.addedParticipants.some(item => item.userFbId == botID)) {
            
            // যদি bot নিজে join করে বা admin add করে তাহলে return
            if (author == botID || config.adminBot.includes(author)) {
                return;
            }

            try {
                // Thread info নেওয়া
                const threadInfo = await api.getThreadInfo(threadID);
                const threadName = threadInfo.threadName || "Unnamed Group";
                const authorName = await usersData.getName(author);
                const time = getTime("DD/MM/YYYY HH:mm:ss");

                // Thread ban করা
                await threadsData.set(threadID, {
                    banned: true,
                    reason: "Unauthorized bot addition",
                    bannedBy: "System",
                    bannedAt: time
                });

                // Group এ message পাঠানো
                const banMsg = getLang("banned", authorName, threadName, threadID, time);
                await message.send(banMsg);

                // Admin দের notify করা
                const adminMsg = getLang("notifyAdmin", authorName, author, threadName, threadID, time);
                
                // --- 1. সব Admin এর Inbox এ ---
                for (const adminID of config.adminBot) {
                    api.sendMessage(adminMsg, adminID).catch(err => 
                        console.error(`[antiAddBot] Failed to notify admin ${adminID}:`, err)
                    );
                }

                // --- 2. Specific Admin GC তে ---
                const targetGC = "23869391286001160"; // তোমার GC এর ID
                api.sendMessage(adminMsg, targetGC).catch(err => 
                    console.error(`[antiAddBot] Failed to notify GC ${targetGC}:`, err)
                );

                // Bot leave করবে
                setTimeout(() => {
                    api.removeUserFromGroup(botID, threadID);
                }, 3000); // 3 second পর leave করবে

            } catch (err) {
                console.error("[antiAddBot] Error:", err);
            }
        }
    }
};
