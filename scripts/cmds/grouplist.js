module.exports = {
  config: {
    name: "grouplist",
    aliases: ["gl", "groups", "mygroups"],
    version: "1.4.0",
    author: "Saif",
    role: 2,
    description: "Show current bot groups and reply to view full group info",
    category: "admin",
    usage: "grouplist / gl",
    countDown: 3
  },

  onStart: async function ({ api, event }) {
    try {
      const botID = api.getCurrentUserID();
      const threadList = await api.getThreadList(200, null, ["INBOX"]);

      const groups = threadList.filter(t =>
        t.isGroup &&
        Array.isArray(t.participantIDs) &&
        t.participantIDs.includes(botID)
      );

      if (!groups.length)
        return api.sendMessage(
          "❌ 𝑵𝒐 𝒄𝒖𝒓𝒓𝒆𝒏𝒕 𝒈𝒓𝒐𝒖𝒑𝒔 𝒇𝒐𝒖𝒏𝒅 𝒇𝒐𝒓 𝒕𝒉𝒆 𝒃𝒐𝒕",
          event.threadID,
          event.messageID
        );

      let msg = "📋 𝑴𝑰𝑲𝑨𝑺𝑨 𝑩𝑶𝑻 – 𝑪𝑼𝑹𝑹𝑬𝑵𝑻 𝑮𝑹𝑶𝑼𝑷𝑺\n\n";
      let groupMap = [];

      groups.forEach((g, i) => {
        msg += `${i + 1}️⃣ 𝑮𝒓𝒐𝒖𝒑: ${g.name || "Unnamed Group"}\n`;
        groupMap.push({
          index: i + 1,
          threadID: g.threadID
        });
      });

      msg += "\n↩️ 𝑹𝒆𝒑𝒍𝒚 𝒘𝒊𝒕𝒉 𝒕𝒉𝒆 𝒔𝒆𝒓𝒊𝒂𝒍 𝒏𝒖𝒎𝒃𝒆𝒓";

      api.sendMessage(
        msg,
        event.threadID,
        (err, info) => {
          if (err) return;
          global.GoatBot.onReply.set(info.messageID, {
            commandName: "grouplist",
            author: event.senderID,
            groupMap,
            editMsgID: info.messageID
          });
        },
        event.messageID
      );

    } catch (err) {
      api.sendMessage(
        "❌ 𝑭𝒂𝒊𝒍𝒆𝒅 𝒕𝒐 𝒍𝒐𝒂𝒅 𝒈𝒓𝒐𝒖𝒑 𝒍𝒊𝒔𝒕",
        event.threadID,
        event.messageID
      );
    }
  },

  onReply: async function ({ api, event, Reply }) {
    try {
      if (event.senderID !== Reply.author) return;

      const num = parseInt(event.body);
      if (isNaN(num)) return;

      const target = Reply.groupMap.find(g => g.index === num);
      if (!target) return;

      const info = await api.getThreadInfo(target.threadID);

      // Admin list
      const admins = info.adminIDs.map(a => {
        const u = info.userInfo.find(x => x.id == a.id);
        return u ? `• ${u.name}` : "• Unknown";
      }).join("\n");

      // Member preview (15)
      const members = info.userInfo
        .slice(0, 15)
        .map((u, i) => `${i + 1}. ${u.name}`)
        .join("\n");

      const more =
        info.userInfo.length > 15
          ? `\n…𝑨𝒏𝒅 ${info.userInfo.length - 15} 𝒎𝒐𝒓𝒆`
          : "";

      const text =
`📊 𝑮𝑹𝑶𝑼𝑷 𝑰𝑵𝑭𝑶

📛 𝑵𝒂𝒎𝒆: ${info.threadName}
🆔 𝑻𝒉𝒓𝒆𝒂𝒅 𝑰𝑫: ${info.threadID}
👥 𝑻𝒐𝒕𝒂𝒍 𝑴𝒆𝒎𝒃𝒆𝒓𝒔: ${info.participantIDs.length}

👑 𝑨𝒅𝒎𝒊𝒏𝒔:
${admins || "• None"}

👥 𝑴𝒆𝒎𝒃𝒆𝒓𝒔 (Preview):
${members}${more}

🤖 𝑩𝒐𝒕 𝑺𝒕𝒂𝒕𝒖𝒔: Active
📌 𝑨𝒑𝒑𝒓𝒐𝒗𝒂𝒍 𝑴𝒐𝒅𝒆: ${info.approvalMode ? "ON" : "OFF"}
🖼️ 𝑮𝒓𝒐𝒖𝒑 𝑷𝒉𝒐𝒕𝒐: ${info.imageSrc ? "Available" : "Not Available"}
`;

      // ✨ Edit previous message
      api.editMessage(text, Reply.editMsgID);

      // 🖼️ Send group photo as attachment (reply chain)
      if (info.imageSrc) {
        api.sendMessage(
          {
            body: "🖼️ 𝑮𝒓𝒐𝒖𝒑 𝑷𝒉𝒐𝒕𝒐",
            attachment: await global.utils.getStreamFromURL(info.imageSrc)
          },
          event.threadID,
          null,
          event.messageID
        );
      }

    } catch (err) {
      api.sendMessage(
        "❌ 𝑪𝒐𝒖𝒍𝒅 𝒏𝒐𝒕 𝒇𝒆𝒕𝒄𝒉 𝒈𝒓𝒐𝒖𝒑 𝒊𝒏𝒇𝒐",
        event.threadID,
        event.messageID
      );
    }
  }
};
