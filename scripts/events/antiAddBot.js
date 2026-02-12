const { getTime } = global.utils;

module.exports = {
    config: {
        name: "antiAddBot",
        isBot: true,
        version: "2.6",
        author: "Gemini",
        envConfig: {
            allow: true
        },
        category: "events"
    },

    onStart: async ({ threadsData, event, api, usersData, getLang }) => {
        const { logMessageType, logMessageData, author, threadID } = event;
        const botID = api.getCurrentUserID();
        const { config } = global.GoatBot;
        const targetGC = "23869391286001160";

        if (logMessageType == "log:subscribe" && logMessageData.addedParticipants.some(item => item.userFbId == botID)) {
            
            if (!config.adminBot.includes(author)) {
                try {
                    const time = getTime("DD/MM/YYYY HH:mm:ss");
                    const reason = "𝑼𝒏𝒂𝒖𝒕𝒉𝒐𝒓𝒊𝒛𝒆𝒅 𝒃𝒐𝒕 𝒂𝒅𝒅𝒊𝒕𝒊𝒐𝒏";

                    // 1. Thread ban in database
                    await threadsData.set(threadID, {
                        banned: true,
                        reason: reason,
                        dateBanned: time
                    });

                    // 2. Language file theke official 🎀 message-ta create kora
                    // %1 = reason, %2 = time, %3 = threadID
                    const officialBanMsg = getLang("handlerEvents.threadBanned", reason, time, threadID);

                    // 3. Group-e pathano
                    await api.sendMessage(officialBanMsg, threadID);

                    // 4. Admin Inbox + Admin GC-te pathano (Same language file output)
                    for (const adminID of config.adminBot) {
                        api.sendMessage(officialBanMsg, adminID).catch(err => console.error(`[antiAddBot] Inbox Error: ${adminID}`, err));
                    }
                    api.sendMessage(officialBanMsg, targetGC).catch(err => console.error(`[antiAddBot] GC Error: ${targetGC}`, err));

                    // 5. Bot leaves
                    return api.removeUserFromGroup(botID, threadID);

                } catch (err) {
                    console.error("[antiAddBot] Error:", err);
                }
            } else {
                api.sendMessage("𝑴𝒂𝒔𝒕𝒆𝒓! 𝑰'𝒎 𝒉𝒆𝒓𝒆. 𝑻𝒉𝒂𝒏𝒌 𝒚𝒐𝒖 𝒇𝒐𝒓 𝒂𝒅𝒅𝒊𝒏𝒈 𝒎𝒆, 𝑩𝒂𝒃𝒚! ❤️", threadID);
            }
        }
    }
};
