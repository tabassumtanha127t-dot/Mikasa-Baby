const { getTime } = global.utils;

module.exports = {
    config: {
        name: "logsbot",
        isBot: true,
        version: "1.7",
        author: "NTKhang-modify bh saif",
        envConfig: {
            allow: true
        },
        category: "events"
    },

    langs: {
        vi: {
            title: "====== Nhật ký bot ======",
            added: "\n✅\nSự kiện: bot được thêm vào nhóm mới\n- Người thêm: %1",
            kicked: "\n❌\nSự kiện: bot bị kick\n- Người kick: %1",
            footer: "\n- User ID: %1\n- Nhóm: %2\n- ID nhóm: %3\n- Thời gian: %4"
        },
        en: {
            title: "====== Bot logs ======",
            added: "\n✅\nEvent: bot has been added to a new group\n- Added by: %1",
            kicked: "\n❌\nEvent: bot has been kicked\n- Kicked by: %1",
            footer: "\n- User ID: %1\n- Group: %2\n- Group ID: %3\n- Time: %4"
        }
    },

    onStart: async ({ usersData, threadsData, event, api, getLang }) => {
        const { logMessageType, logMessageData, author, threadID } = event;
        const botID = api.getCurrentUserID();

        // Shudhu bot add ba kick holei logic kaj korbe
        if (
            (logMessageType == "log:subscribe" && logMessageData.addedParticipants.some(item => item.userFbId == botID))
            || (logMessageType == "log:unsubscribe" && logMessageData.leftParticipantFbId == botID)
        ) {
            if (author == botID) return;

            let msg = getLang("title");
            const { config } = global.GoatBot;
            let threadName;

            try {
                if (logMessageType == "log:subscribe") {
                    const threadInfo = await api.getThreadInfo(threadID);
                    threadName = threadInfo.threadName || "Unnamed Group";
                    const authorName = await usersData.getName(author);
                    msg += getLang("added", authorName);
                } else {
                    const threadData = await threadsData.get(threadID);
                    threadName = threadData.threadName || "Unnamed Group";
                    const authorName = await usersData.getName(author);
                    msg += getLang("kicked", authorName);
                }

                const time = getTime("DD/MM/YYYY HH:mm:ss");
                msg += getLang("footer", author, threadName, threadID, time);

                // --- 1. Admin Inbox-e pathano ---
                for (const adminID of config.adminBot) {
                    api.sendMessage(msg, adminID).catch(err => console.error(`[logsbot] Inbox Error: ${adminID}`, err));
                }

                // --- 2. Tomar dewa Specific Admin GC-te pathano ---
                const targetGC = "1793140328378082";
                api.sendMessage(msg, targetGC).catch(err => console.error(`[logsbot] GC Error: ${targetGC}`, err));

            } catch (e) {
                console.error("[logsbot] Error:", e);
            }
        }
    }
};
