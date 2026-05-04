module.exports = {
	config: {
		name: "antispamunban",
		aliases: ["sunban", "spamunban"],
		version: "2.0",
		author: "Saif",
		countDown: 5,
		role: 2,
		category: "owner",
		guide: {
			en: "{pn} list — Show all spam-banned users\n{pn} <uid | @tag | reply> — Unban a user\n{pn} all — Unban everyone"
		}
	},

	onStart: async ({ message, event, args, usersData }) => {

		// ─── LIST ───────────────────────────────────────────
		if (args[0] === "list") {
			try {
				const allUsers = await usersData.getAll();
				const banned = allUsers.filter(u => u.banned?.status === true);

				if (banned.length === 0)
					return message.reply(
`╔══『 📋 𝗕𝗔𝗡𝗟𝗜𝗦𝗧 』══╗
┃
┃  ✅ No banned users!
┃
╚══【 🤖 𝗠𝗶𝗸𝗮𝘀𝗮 𝗕𝗮𝗯𝘆 】══╝`
					);

				let body = `╔══『 📋 𝗦𝗣𝗔𝗠 𝗕𝗔𝗡𝗟𝗜𝗦𝗧 』══╗\n┃  Total: ${banned.length} user(s)\n┃\n`;

				for (let i = 0; i < banned.length; i++) {
					const u = banned[i];
					const name = await usersData.getName(u.userID) || "Unknown";
					body +=
`┃  ${i + 1}. ${name}
┃     🆔 ${u.userID}
┃     📛 ${u.banned.reason || "No reason"}
┃     ⏰ ${u.banned.date || "Unknown"}
┃\n`;
				}

				body += `╚══【 🤖 𝗠𝗶𝗸𝗮𝘀𝗮 𝗕𝗮𝗯𝘆 】══╝\n\n💡 Use .sunban <uid> to unban`;

				return message.reply(body);
			} catch (err) {
				return message.reply(`❌ Error fetching list: ${err.message}`);
			}
		}

		// ─── UNBAN ALL ───────────────────────────────────────
		if (args[0] === "all") {
			try {
				const allUsers = await usersData.getAll();
				const banned = allUsers.filter(u => u.banned?.status === true);

				if (banned.length === 0)
					return message.reply("✅ No banned users to unban!");

				let count = 0;
				for (const u of banned) {
					await usersData.set(u.userID, { status: false, reason: null, date: null }, "banned");
					count++;
				}

				return message.reply(
`╔══『 ✅ 𝗨𝗡𝗕𝗔𝗡𝗡𝗘𝗗 𝗔𝗟𝗟 』══╗
┃
┃  👮 By: ${await usersData.getName(event.senderID) || "Admin"}
┃  ✅ Unbanned: ${count} user(s)
┃
╚══【 🤖 𝗠𝗶𝗸𝗮𝘀𝗮 𝗕𝗮𝗯𝘆 】══╝`
				);
			} catch (err) {
				return message.reply(`❌ Error: ${err.message}`);
			}
		}

		// ─── UNBAN SINGLE USER ───────────────────────────────
		let targetID;

		if (args[0] && !isNaN(args[0]))
			targetID = args[0];
		else if (event.messageReply?.senderID)
			targetID = event.messageReply.senderID;
		else if (Object.keys(event.mentions || {}).length)
			targetID = Object.keys(event.mentions)[0];

		if (!targetID)
			return message.reply(
`╔══『 ⚠️ USAGE 』══╗
┃
┃  .sunban list
┃   → All banned users
┃
┃  .sunban <uid>
┃  .sunban @tag
┃  (reply) .sunban
┃   → Unban one user
┃
┃  .sunban all
┃   → Unban everyone
┃
╚══════════════════╝`
			);

		try {
			const userData = await usersData.get(targetID);

			if (!userData?.banned?.status)
				return message.reply(
`╔══『 ℹ️ INFO 』══╗
┃
┃  🆔 UID: ${targetID}
┃  ✅ Not currently banned
┃
╚══════════════════╝`
				);

			const prevReason = userData.banned.reason || "Unknown";
			const prevDate = userData.banned.date || "Unknown";
			const userName = await usersData.getName(targetID) || "Unknown";
			const adminName = await usersData.getName(event.senderID) || "Admin";

			await usersData.set(targetID, {
				status: false,
				reason: null,
				date: null
			}, "banned");

			return message.reply(
`╔══『 ✅ 𝗨𝗡𝗕𝗔𝗡𝗡𝗘𝗗 』══╗
┃
┃  👤 User   : ${userName}
┃  🆔 UID    : ${targetID}
┃
┃  📋 Reason : ${prevReason}
┃  ⏰ Banned : ${prevDate}
┃  👮 By     : ${adminName}
┃
╚══【 🤖 𝗠𝗶𝗸𝗮𝘀𝗮 𝗕𝗮𝗯𝘆 】══╝`
			);

		} catch (err) {
			return message.reply(`❌ Error: ${err.message}`);
		}
	}
};
