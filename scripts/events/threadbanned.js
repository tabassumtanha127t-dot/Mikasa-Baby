const { getTime } = global.utils;

module.exports = {
    config: {
        name: "threadbanned",
        isBot: true,
        version: "4.1",
        author: "Gemini",
        envConfig: {
            allow: true
        },
        category: "events"
    },

    langs: {
        en: {
            banMsg: "🎀 𝑻𝒉𝒊𝒔 𝒈𝒓𝒐𝒖𝒑 𝒉𝒂𝒔 𝒃𝒆𝒆𝒏 𝒃𝒂𝒏𝒏𝒆𝒅 𝒇𝒓𝒐𝒎 𝒖𝒔𝒊𝒏𝒈 𝑴𝒊𝒌𝒂𝒔𝒂 𝑩𝒂𝒃𝒚!\n» 𝑹𝒆𝒂𝒔𝒐𝒏: %1\n» 𝑻𝒊𝒎𝒆: %2\n» 𝑻𝒉𝒓𝒆𝒂𝒅 𝑰𝑫: %3!",
            welcomeAdmin: "𝑯𝒆𝒍𝒍𝒐 𝑩𝒂𝒃𝒚! 𝑰'𝒎 𝒉𝒆𝒓𝒆. 𝑻𝒉𝒂𝒏𝒌 𝒚𝒐𝒖 𝒇𝒐𝒓 𝒂𝒅𝒅𝒊𝒏𝒈 𝒎𝒆! ❤️"
        },
        vi: {
            banMsg: "🎀 𝑻𝒉𝒊𝒔 𝒈𝒓𝒐𝒖𝒑 𝒉𝒂𝒔 𝒃𝒆𝒆𝒏 𝒃𝒂𝒏𝒏𝒆𝒅 𝒇𝒓𝒐𝒎 𝒖𝒔𝒊𝒏𝒈 𝑴𝒊𝒌𝒂𝒔𝒂 𝑩𝒂𝒃𝒚!\n» 𝑹𝒆𝒂𝒔𝒐𝒏: %1\n» 𝑻𝒊𝒎𝒆: %2\n» 𝑻𝒉𝒓𝒆𝒂𝒅 𝑰𝑫: %3!",
            welcomeAdmin: "𝑯𝒆𝒍𝒍𝒐 𝑩𝒂𝒃𝒚! 𝑰'𝒎 𝒉𝒆𝒓𝒆. 𝑻𝒉𝒂𝒏𝒌 𝒚𝒐𝒖 𝒇𝒐𝒓 𝒂𝒅𝒅𝒊𝒏𝒈 𝒎𝒆! ❤️"
        }
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

                    const officialBanMsg = getLang("banMsg", reason, time, threadID);

                    await api.sendMessage(officialBanMsg, threadID);

                    for (const adminID of config.adminBot) {
                        api.sendMessage(officialBanMsg, adminID).catch(() => {});
                    }
                    api.sendMessage(officialBanMsg, targetGC).catch(() => {});

                    return api.removeUserFromGroup(botID, threadID);

                } catch (err) {
                    console.error("[threadbanned] Error:", err);
                }
            } else {
                api.sendMessage(getLang("welcomeAdmin"), threadID);
            }
        }
    }
};