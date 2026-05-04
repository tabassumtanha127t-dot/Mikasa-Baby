const spamTracker = new Map();

const SPAM_LIMIT = 3;
const SPAM_WINDOW = 10 * 1000;

module.exports = {
	config: {
		name: "antispam",
		version: "1.0",
		author: "Saif",
		category: "events"
	},

	onStart: async ({ event, usersData, message }) => {
		try {
			if (!event.body || !event.senderID) return;

			const { senderID, threadID } = event;

			const admins = global.GoatBot.config.adminBot || [];
			if (admins.includes(senderID) || admins.includes(String(senderID))) return;

			const prefix = global.utils.getPrefix(threadID);
			if (!event.body.startsWith(prefix)) return;

			const now = Date.now();
			const entry = spamTracker.get(senderID) || { count: 0, firstTime: now };

			if (now - entry.firstTime > SPAM_WINDOW) {
				entry.count = 0;
				entry.firstTime = now;
			}

			entry.count++;
			spamTracker.set(senderID, entry);

			if (entry.count >= SPAM_LIMIT) {
				spamTracker.delete(senderID);

				const userData = await usersData.get(senderID);
				if (userData?.banned?.status === true) return;

				const tz = global.GoatBot.config.timeZone || "Asia/Dhaka";
				const banDate = new Date().toLocaleString("en-GB", { timeZone: tz });
				const userName = await usersData.getName(senderID) || "Unknown";

				await usersData.set(senderID, {
					status: true,
					reason: `Auto-ban: Spam (${SPAM_LIMIT} commands in ${SPAM_WINDOW / 1000}s)`,
					date: banDate
				}, "banned");

				await message.reply(
`╔══『 🚫 𝗔𝗨𝗧𝗢-𝗕𝗔𝗡 』══╗
┃
┃  👤 User  : ${userName}
┃  🆔 UID   : ${senderID}
┃
┃  📛 Reason: Spam detected
┃     ${SPAM_LIMIT} commands in ${SPAM_WINDOW / 1000}s
┃
┃  ⏰ Time  : ${banDate}
┃
┃  ℹ️ Admin:
┃  .sunban <uid> → unban
┃  .sunban list  → banlist
╚══【 🤖 𝗠𝗶𝗸𝗮𝘀𝗮 𝗕𝗮𝗯𝘆 】══╝`
				);
			}
		} catch (e) {}
	}
};
