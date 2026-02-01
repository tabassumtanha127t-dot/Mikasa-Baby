const { getTime } = global.utils;

module.exports = {
	config: {
		name: "logsbot",
		isBot: true,
		version: "1.4",
		author: "NTKhang",
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
		if (
			(event.logMessageType == "log:subscribe" && event.logMessageData.addedParticipants.some(item => item.userFbId == api.getCurrentUserID()))
			|| (event.logMessageType == "log:unsubscribe" && event.logMessageData.leftParticipantFbId == api.getCurrentUserID())
		) return async function () {
			let msg = getLang("title");
			const { author, threadID } = event;
			if (author == api.getCurrentUserID())
				return;
			let threadName;
			const { config } = global.GoatBot;

			if (event.logMessageType == "log:subscribe") {
				if (!event.logMessageData.addedParticipants.some(item => item.userFbId == api.getCurrentUserID()))
					return;
				threadName = (await api.getThreadInfo(threadID)).threadName;
				const authorName = await usersData.getName(author);
				msg += getLang("added", authorName);
			}
			else if (event.logMessageType == "log:unsubscribe") {
				if (event.logMessageData.leftParticipantFbId != api.getCurrentUserID())
					return;
				const authorName = await usersData.getName(author);
				const threadData = await threadsData.get(threadID);
				threadName = threadData.threadName;
				msg += getLang("kicked", authorName);
			}
			const time = getTime("DD/MM/YYYY HH:mm:ss");
			msg += getLang("footer", author, threadName, threadID, time);

			// helper: try send with small retry and detailed logging
			async function trySendWithRetry(api, message, adminID, retries = 1, delayMs = 3000) {
				for (let attempt = 0; attempt <= retries; attempt++) {
					try {
						// api.sendMessage usually supports Promise; await to catch errors
						const res = await api.sendMessage(message, adminID);
						// Log success (use console for now; project logging system can be used)
						console.log(`[logsbot] Sent log to admin ${adminID}`, res || "");
						return res;
					} catch (err) {
						// Normalize error output
						const errMsg = (err && (err.error || err.message)) || err || "Unknown error";
						console.error(`[logsbot] Failed to send log to admin ${adminID} (attempt ${attempt + 1}/${retries + 1}):`, errMsg);
						// On final failure, capture more info if available
						if (attempt < retries) {
							await new Promise(r => setTimeout(r, delayMs));
						} else {
							// Final failure: consider saving to a persistent queue or notify via alternate webhook
							try {
								if (global.utils && typeof global.utils.saveFailedLog === "function") {
									await global.utils.saveFailedLog?.({ adminID, message, error: errMsg, time: Date.now() });
								}
							} catch (e) {
								console.error("[logsbot] Failed to persist failed log:", e);
							}
						}
					}
				}
			}

			// Send sequentially to avoid rate limits; if you prefer parallel, wrap in Promise.all
			for (const adminID of config.adminBot) {
				await trySendWithRetry(api, msg, adminID, 1, 3000);
			}
		};
	}
};