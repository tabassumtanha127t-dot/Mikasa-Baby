const { getTime, getStreamFromURL } = global.utils;

module.exports = {
    config: {
        name: "leave",
        version: "3.0",
        author: "SAIF",
        category: "events"
    },

    onStart: async ({ threadsData, message, event, api, usersData }) => {
        if (event.logMessageType !== "log:unsubscribe") return;

        const { threadID } = event;
        const threadData = await threadsData.get(threadID);

        if (!threadData.settings.sendLeaveMessage) return;

        const { leftParticipantFbId } = event.logMessageData;
        if (leftParticipantFbId == api.getCurrentUserID()) return;

        const userName = await usersData.getName(leftParticipantFbId) || "Someone";
        const isKicked = leftParticipantFbId != event.author;

        let leaveMessage;

        if (isKicked) {
            const kickerName = await usersData.getName(event.author) || "Admin";
            leaveMessage = `${userName} was kicked by ${kickerName}.`;
        } else {
            leaveMessage = `${userName} left from the group.`;
        }

        const form = { body: leaveMessage };

        try {
            const gifUrl = isKicked
                ? "https://files.catbox.moe/iddtvw.gif"
                : "https://files.catbox.moe/fypke2.gif";

            const attachment = await getStreamFromURL(gifUrl);
            if (attachment) form.attachment = [attachment];
        } catch (err) {
            console.error("Gif error:", err);
        }

        return message.send(form);
    }
};
