module.exports = {
    config: {
        name: "unban",
        version: "1.0",
        author: "saif",
        countDown: 5,
        role: 2, // শুধু admin use করতে পারবে
        description: "Unban a thread",
        category: "admin",
        guide: "{pn}"
    },

    langs: {
        en: {
            noBannedThreads: "✅ No banned threads found!",
            bannedList: "🚫 BANNED THREADS LIST\n━━━━━━━━━━━━━━━━\n\n%1\n━━━━━━━━━━━━━━━━\n\n💡 Reply with serial number to unban",
            invalidReply: "❌ Invalid serial number!",
            unbanned: "✅ Successfully unbanned!\n\n📌 Thread ID: %1\n📛 Previous reason: %2\n👤 Unbanned by: %3",
            selectThread: "🔄 Waiting for your reply..."
        }
    },

    onStart: async ({ message, event, threadsData, getLang, usersData, commandName }) => {
        try {
            // সব threads এর data নিয়ে আসা
            const allThreads = await threadsData.getAll();
            
            // শুধু banned threads filter করা
            const bannedThreads = allThreads.filter(thread => thread.banned === true);

            if (bannedThreads.length === 0) {
                return message.reply(getLang("noBannedThreads"));
            }

            // List তৈরি করা
            let listMsg = "";
            bannedThreads.forEach((thread, index) => {
                const threadName = thread.threadName || "Unknown Group";
                const reason = thread.reason || "No reason";
                const bannedAt = thread.bannedAt || "Unknown";
                
                listMsg += `${index + 1}. ${threadName}\n`;
                listMsg += `   📍 ID: ${thread.threadID}\n`;
                listMsg += `   📛 Reason: ${reason}\n`;
                listMsg += `   ⏰ Time: ${bannedAt}\n\n`;
            });

            // Message পাঠানো
            const sentMsg = await message.reply(getLang("bannedList", listMsg));

            // Reply এর জন্য wait করা
            global.GoatBot.onReply.set(sentMsg.messageID, {
                commandName,
                messageID: sentMsg.messageID,
                author: event.senderID,
                bannedThreads: bannedThreads
            });

        } catch (err) {
            console.error("[unban] Error:", err);
            message.reply("❌ Error fetching banned threads!");
        }
    },

    onReply: async ({ message, event, Reply, threadsData, getLang, usersData }) => {
        const { author, bannedThreads } = Reply;

        // শুধু যে command দিয়েছে সে reply করতে পারবে
        if (event.senderID !== author) {
            return;
        }

        const choice = parseInt(event.body.trim());

        // Invalid number check
        if (isNaN(choice) || choice < 1 || choice > bannedThreads.length) {
            return message.reply(getLang("invalidReply"));
        }

        try {
            const selectedThread = bannedThreads[choice - 1];
            const threadID = selectedThread.threadID;
            const previousReason = selectedThread.reason || "Unknown";

            // Thread unban করা
            await threadsData.set(threadID, {
                banned: false,
                reason: null,
                bannedBy: null,
                bannedAt: null
            });

            const adminName = await usersData.getName(event.senderID);
            
            message.reply(getLang("unbanned", threadID, previousReason, adminName));

            // Reply listener remove করা
            global.GoatBot.onReply.delete(Reply.messageID);

        } catch (err) {
            console.error("[unban] onReply Error:", err);
            message.reply("❌ Error unbanning thread!");
        }
    }
};