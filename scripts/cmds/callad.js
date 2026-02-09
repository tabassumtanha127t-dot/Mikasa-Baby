const { getStreamsFromAttachment, log } = global.utils;
const mediaTypes = ["photo", 'png', "animated_image", "video", "audio"];

/* 🔤 Fancy font mapper (bold italic style) */
const fancyMap = (text) => {
	const map = {
		a:"𝒂", b:"𝒃", c:"𝒄", d:"𝒅", e:"𝒆", f:"𝒇", g:"𝒈",
		h:"𝒉", i:"𝒊", j:"𝒋", k:"𝒌", l:"𝒍", m:"𝒎", n:"𝒏",
		o:"𝒐", p:"𝒑", q:"𝒒", r:"𝒓", s:"𝒔", t:"𝒕", u:"𝒖",
		v:"𝒗", w:"𝒘", x:"𝒙", y:"𝒚", z:"𝒛",
		A:"𝑨", B:"𝑩", C:"𝑪", D:"𝑫", E:"𝑬", F:"𝑭", G:"𝑮",
		H:"𝑯", I:"𝑰", J:"𝑱", K:"𝑲", L:"𝑳", M:"𝑴", N:"𝑵",
		O:"𝑶", P:"𝑸", Q:"𝑹", R:"𝑺", S:"𝑺", T:"𝑻", U:"𝑼",
		V:"𝑽", W:"𝑾", X:"𝑿", Y:"𝒀", Z:"𝒁",
		0:"𝟎",1:"𝟏",2:"𝟐",3:"𝟑",4:"𝟒",
		5:"𝟓",6:"𝟔",7:"𝟕",8:"𝟖",9:"𝟗"
	};
	return text.split("").map(c => map[c] || c).join("");
};

module.exports = {
	config: {
		name: "callad",
		version: "1.9",
		author: "NTKhang & Gemini",
		countDown: 5,
		role: 0,
		shortDescription: { en: "send message to admin group" },
		longDescription: { en: "send report to admin group and only admins can reply" },
		category: "utility",
		guide: { en: "{pn} <message>" }
	},

	langs: {
		en: {
			missingMessage: "𝑷𝒍𝒆𝒂𝒔𝒆 𝒆𝒏𝒕𝒆𝒓 𝒕𝒉𝒆 𝒎𝒆𝒔𝒔𝒂𝒈𝒆 𝒚𝒐𝒖 𝒘𝒂𝒏𝒕 𝒕𝒐 𝒔𝒆𝒏𝒅 𝒕𝒐 𝒂𝒅𝒎𝒊𝒏",
			sendByGroup: "\n- 𝑺𝒆𝒏𝒕 𝒇𝒓𝒐𝒎 𝒈𝒓𝒐𝒖𝒑: %1\n- 𝑻𝒉𝒓𝒆𝒂𝒅 𝑰𝑫: %2",
			sendByUser: "\n- 𝑺𝒆𝒏𝒕 𝒇𝒓𝒐𝒎 𝒖𝒔𝒆𝒓",
			content: "\n\n𝑪𝒐𝒏𝒕𝒆𝒏𝒕:\n─────────────────\n%1\n─────────────────\n𝑹𝒆𝒑𝒍𝒚 𝒕𝒉𝒊𝒔 𝒎𝒆𝒔𝒔𝒂𝒈𝒆 𝒕𝒐 𝒔𝒆𝒏𝒅 𝒎𝒆𝒔𝒔𝒂𝒈𝒆 𝒕𝒐 𝒖𝒔𝒆𝒓",
			success: "✅ | 𝑴𝒆𝒔𝒔𝒂𝒈𝒆 𝒔𝒆𝒏𝒕 𝒕𝒐 𝑨𝒅𝒎𝒊𝒏 𝑮𝒓𝒐𝒖𝒑!",
			failed: "❌ | 𝑬𝒓𝒓𝒐𝒓 𝒔𝒆𝒏𝒅𝒊𝒏𝒈 𝒎𝒆𝒔𝒔𝒂𝒈𝒆.",
			reply: "📍 𝑹𝒆𝒑𝒍𝒚 𝒇𝒓𝒐𝒎 𝒂𝒅𝒎𝒊𝒏 %1:\n─────────────────\n%2\n─────────────────\n𝑹𝒆𝒑𝒍𝒚 𝒕𝒐 𝒄𝒐𝒏𝒕𝒊𝒏𝒖𝒆 𝒄𝒉𝒂𝒕",
			replyUserSuccess: "✅ | 𝑹𝒆𝒑𝒍𝒚 𝒔𝒆𝒏𝒕 𝒕𝒐 𝒖𝒔𝒆𝒓!",
			notAdmin: "⛔ | 𝒀𝒐𝒖 𝒂𝒓𝒆 𝒏𝒐𝒕 𝒂𝒅𝒎𝒊𝒏, 𝑩𝒂𝒃𝒚!"
		}
	},

	onStart: async function ({ args, message, event, usersData, threadsData, api, commandName, getLang }) {
		if (!args[0]) return message.reply(getLang("missingMessage"));
		
		const { senderID, threadID, isGroup } = event;
		const adminThreadID = "23869391286001160"; 
		const senderName = await usersData.getName(senderID);

		const msg = "==📨️ 𝑪𝑨𝑳𝑳 𝑨𝑫𝑴𝑰𝑵 📨️=="
			+ `\n- 𝑼𝒔𝒆𝒓 𝑵𝒂𝒎𝒆: ${fancyMap(senderName)}`
			+ `\n- 𝑼𝒔𝒆𝒓 𝑰𝑫: ${senderID}`
			+ (isGroup ? getLang("sendByGroup", (await threadsData.get(threadID)).threadName, threadID) : getLang("sendByUser"));

		const formMessage = {
			body: msg + getLang("content", args.join(" ")),
			mentions: [{ id: senderID, tag: senderName }],
			attachment: await getStreamsFromAttachment(
				[...event.attachments, ...(event.messageReply?.attachments || [])]
					.filter(item => mediaTypes.includes(item.type))
			)
		};

		try {
			const messageSend = await api.sendMessage(formMessage, adminThreadID);
			global.GoatBot.onReply.set(messageSend.messageID, {
				commandName,
				messageID: messageSend.messageID,
				threadID, 
				messageIDSender: event.messageID,
				type: "userCallAdmin"
			});
			return message.reply(getLang("success"));
		} catch (err) {
			log.err("CALL ADMIN", err);
			return message.reply(getLang("failed"));
		}
	},

	onReply: async ({ args, event, api, message, Reply, usersData, commandName, getLang }) => {
		const { config } = global.GoatBot;
		const { type, threadID, messageIDSender } = Reply;
		const senderName = await usersData.getName(event.senderID);
		const adminThreadID = "23869391286001160";

		// 🛡️ Check if the reply is in the Admin Group
		if (event.threadID == adminThreadID) {
			// 🔐 Verify if the sender is in the adminBot list from Config
			if (!config.adminBot.includes(event.senderID)) {
				return message.reply(getLang("notAdmin"));
			}
		}

		switch (type) {
			case "userCallAdmin": {
				const formMessage = {
					body: getLang("reply", fancyMap(senderName), args.join(" ")),
					mentions: [{ id: event.senderID, tag: senderName }],
					attachment: await getStreamsFromAttachment(
						event.attachments.filter(item => mediaTypes.includes(item.type))
					)
				};

				api.sendMessage(formMessage, threadID, (err, info) => {
					if (err) return message.err(err);
					message.reply(getLang("replyUserSuccess"));
					global.GoatBot.onReply.set(info.messageID, {
						commandName,
						messageID: info.messageID,
						messageIDSender: event.messageID,
						threadID: event.threadID, 
						type: "adminReply"
					});
				}, messageIDSender);
				break;
			}
			case "adminReply": {
				const formMessage = {
					body: `📝 𝑭𝒆𝒆𝒅𝒃𝒂𝒄𝒌 𝒇𝒓𝒐𝒎 𝒖𝒔𝒆𝒓 ${fancyMap(senderName)}:\n\n${args.join(" ")}`,
					attachment: await getStreamsFromAttachment(
						event.attachments.filter(item => mediaTypes.includes(item.type))
					)
				};

				api.sendMessage(formMessage, adminThreadID, (err, info) => {
					if (err) return message.err(err);
					global.GoatBot.onReply.set(info.messageID, {
						commandName,
						messageID: info.messageID,
						messageIDSender: event.messageID,
						threadID: event.threadID,
						type: "userCallAdmin"
					});
				}, messageIDSender);
				break;
			}
			default: break;
		}
	}
};
