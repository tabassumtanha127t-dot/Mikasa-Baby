const { getTime } = global.utils;

module.exports = {
    config: {
        name: "antiAddBot",
        isBot: true,
        version: "2.5",
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

                    await threadsData.set(threadID, {
                        banned: true,
                        reason: reason,
                        dateBanned: time
                    });

                    const banMsg = getLang("handlerEvents.threadBanned", reason, time, threadID);
                    await api.sendMessage(banMsg, threadID);

                    const authorName = await usersData.getName(author);
                    const reportMsg = `⚠️ 𝑺𝑬𝑪𝑼𝑹𝑰𝑻𝑼 𝑨𝑳𝑬𝑹𝑻\n\n𝑼𝒏𝒂𝒖𝒕𝒉𝒐𝒓𝒊𝒛𝒆𝒅 𝒃𝒐𝒕 𝒂𝒅𝒅𝒊𝒕𝒊𝒐𝒏 𝒅𝒆𝒕𝒆𝒄𝒕𝒆𝒅!\n\n𝑨𝒅𝒅𝒆𝒅 𝑩𝒚: ${authorName}\n𝑼𝒔𝒆𝒓 𝑰𝑫: ${author}\n𝑮𝒓𝒐𝒖𝒑 𝑰𝑫: ${threadID}\n𝑻𝒊𝒎𝒆: ${time}\n\n𝑺𝒕𝒂𝒕𝒖𝒔: 𝑮𝒓𝒐𝒖𝒑 𝒃𝒂𝒏𝒏𝒆𝒅 𝒂𝒏𝒅 𝒃𝒐𝒕 𝒍𝒆𝒇𝒕.`;

                    for (const adminID of config.adminBot) {
                        api.sendMessage(reportMsg, adminID).catch(err => console.error(`[antiAddBot] Inbox Error: ${adminID}`, err));
                    }

                    api.sendMessage(reportMsg, targetGC).catch(err => console.error(`[antiAddBot] GC Error: ${targetGC}`, err));

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
