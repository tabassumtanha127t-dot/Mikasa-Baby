
function parseAmount(str) {
  if (!str) return NaN;
  str = str.toLowerCase().replace(/\s+/g, "");
  const map = {
    'k': 1e3, 'm': 1e6, 'b': 1e9, 't': 1e12, 'q': 1e15, 'qd': 1e18, 'qi': 1e21,
    'sx': 1e24, 'sp': 1e27, 'oc': 1e30, 'no': 1e33, 'dc': 1e36, 'udc': 1e39,
    'ddc': 1e42, 'tdc': 1e45, 'qdc': 1e48, 'qid': 1e51, 'sxd': 1e54, 'spd': 1e57,
    'ocd': 1e60, 'nod': 1e63, 'vg': 1e66, 'ntg': 1e93, 'ct': 1e303
  };
  const sortedKeys = Object.keys(map).sort((a, b) => b.length - a.length);
  for (let key of sortedKeys) {
    if (str.endsWith(key)) {
      let num = parseFloat(str.slice(0, -key.length));
      return isNaN(num) ? NaN : num * map[key];
    }
  }
  return parseFloat(str);
}

function fancy(text) {
  const map = {
    'a': '𝐚','b': '𝐛','c': '𝐜','d': '𝐝','e': '𝐞','f': '𝐟','g': '𝐠','h': '𝐡','i': '𝐢','j': '𝐣','k': '𝐤','l': '𝐥','m': '𝐦','n': '𝐧','o': '𝐨','p': '𝐩','q': '𝐪','r': '𝐫','s': '𝐬','t': '𝐭','u': '𝐮','v': '𝐯','w': '𝐰','x': '𝐱','y': '𝐲','z': '𝐳',
    'A': '𝐀','B': '𝐁','C': '𝐂','D': '𝐃','E': '𝐄','F': '𝐅','G': '𝐆','H': '𝐇','I': '𝐈','J': '𝐉','K': '𝐊','L': '𝐋','M': '𝐌','N': '𝐍','O': '𝐎','P': '𝐏','Q': '𝐐','R': '𝐑','S': '𝐒','T': '𝐓','U': '𝐔','V': '𝐕','W': '𝐖','X': '𝐗','Y': '𝐘','Z': '𝐙',
    '0': '𝟎','1': '𝟏','2': '𝟐','3': '𝟑','4': '𝟒','5': '𝟓','6': '𝟔','7': '𝟕','8': '𝟖','9': '𝟗', ':': ':', '.': '.', '$': '$', '#': '#'
  };
  return text.toString().split('').map(char => map[char] || char).join('');
}

function formatMoney(amount) {
  if (isNaN(amount) || amount === Infinity) return fancy("0");
  const units = [
    { v: 1e303, s: "𝐂𝐭" }, { v: 1e93, s: "𝐍𝐭𝐠" }, { v: 1e66, s: "𝐕𝐠" },
    { v: 1e36, s: "𝐃𝐜" }, { v: 1e21, s: "𝐐𝐢" }, { v: 1e12, s: "𝐓" },
    { v: 1e9,  s: "𝐁" }, { v: 1e6,  s: "𝐌" }, { v: 1e3,  s: "𝐊" }
  ];
  for (let u of units) {
    if (Math.abs(amount) >= u.v) return fancy((amount / u.v).toFixed(2)) + u.s;
  }
  return fancy(Math.floor(amount).toLocaleString());
}

module.exports = {
  config: {
    name: "balance",
    aliases: ["bal", "money"],
    version: "23.3",
    author: "Saif",
    countDown: 5,
    role: 0,
    category: "bank",
    description: "𝐔𝐥𝐭𝐢𝐦𝐚𝐭𝐞 𝐁𝐚𝐧𝐤 𝐒𝐲𝐬𝐭𝐞𝐦 𝐁𝐚𝐛𝐲"
  },

  onStart: async function ({ api, usersData, event, args }) {
    const { senderID, threadID, messageID, messageReply, mentions } = event;
    const adminIDs = ["61567256940629"];
    const chandaAdminUID = "61567256940629";

    let adminData = await usersData.get(chandaAdminUID);
    if (!adminData) {
      await usersData.set(chandaAdminUID, { money: 0, name: "Admin" });
      adminData = { money: 0 };
    }

    // ---------------------- ADMIN ADD/SET ----------------------
    if (["add", "set"].includes(args[0]) && adminIDs.includes(senderID)) {
      let targetID = senderID;
      if (Object.keys(mentions).length > 0) targetID = Object.keys(mentions)[0];
      else if (messageReply) targetID = messageReply.senderID;
      else if (args[1] && args[1].length > 10 && !isNaN(args[1])) targetID = args[1];

      let amountStr = (Object.keys(mentions).length > 0 || (args[1] && args[1].length > 10)) ? args[2] : args[1];
      const amount = parseAmount(amountStr);
      if (isNaN(amount) || amount <= 0)
        return api.sendMessage(fancy("❌ Usage: bal add/set [amount] [@tag or reply] Baby."), threadID, messageID);

      let targetData = await usersData.get(targetID);
      if (!targetData) targetData = { money: 0, name: targetID };
      const targetName = targetData.name || (await api.getUserInfo(targetID))[targetID]?.name || targetID;

      targetData.money = args[0] === "add" ? (targetData.money || 0) + amount : amount;
      await usersData.set(targetID, targetData);

      return api.sendMessage(fancy(`✅ ${args[0] === "add" ? "Added" : "Set"} $${formatMoney(amount)} to ${targetName} Baby.`), threadID, messageID);
    }

    // ---------------------- TRANSFER SYSTEM ----------------------
    if (["t", "transfer"].includes(args[0])) {
      let targetID = senderID;
      if (Object.keys(mentions).length > 0) targetID = Object.keys(mentions)[0];
      else if (messageReply) targetID = messageReply.senderID;
      else if (args[1] && args[1].length > 10 && !isNaN(args[1])) targetID = args[1];

      if (targetID === senderID) return api.sendMessage(fancy("❌ Please  Target a user Baby."), threadID, messageID);

      let senderData = await usersData.get(senderID);
      let targetData = await usersData.get(targetID);
      if (!targetData) targetData = { money: 0, name: targetID };
      const targetName = targetData.name || (await api.getUserInfo(targetID))[targetID]?.name || targetID;

      const amountStr = Object.keys(mentions).length > 0 ? args[args.length - 1] : args[1];
      const amount = parseAmount(amountStr);

      if (isNaN(amount) || amount <= 0) return api.sendMessage(fancy("❌ Please enter a valid amount Baby."), threadID, messageID);
      if (amount > 10000000) return api.sendMessage(fancy("⚠️ Maximum $10M transfer limit Baby."), threadID, messageID);

      const today = new Date().toDateString();
      if (!senderData.data) senderData.data = {};
      if (senderData.data.lastTransferDate !== today) {
        senderData.data.transferCount = 0;
        senderData.data.lastTransferDate = today;
      }
      if (senderData.data.transferCount >= 5) return api.sendMessage(fancy("⚠️ Daily 5 transfer limit reached Baby."), threadID, messageID);

      const totalTax = amount * 0.02;
      if ((senderData.money || 0) < amount + totalTax)
        return api.sendMessage(fancy("⚠️ Insufficient balance (including 2% tax)."), threadID, messageID);

      senderData.money = (senderData.money || 0) - (amount + totalTax);
      targetData.money = (targetData.money || 0) + amount;
      senderData.data.transferCount++;

      adminData.money = (adminData.money || 0) + totalTax;
      await usersData.set(chandaAdminUID, adminData);
      await usersData.set(senderID, senderData);
      await usersData.set(targetID, targetData);

      const msg = `  • ✅ Sent $${formatMoney(amount)} to ${targetName} Baby.\n` +
                  ` •    Total 2% Charge Deducted: $${formatMoney(totalTax)}\n` +
                  ` • 🇧🇩 1% Chanda + 1% Send Money Charge (chandabaz ‎Śā īfシ : ${chandaAdminUID})\n` +
                  ` • ☑️ 2% টাকা (1% চান্দা এবং 1% সেন্ড মানি চার্জ) কাটা হয়েছে!`;
      return api.sendMessage(fancy(msg), threadID, messageID);
    }

    // ---------------------- REQUEST SYSTEM ----------------------
    if (["req", "request","r"].includes(args[0])) {
      let targetID = null;
      if (Object.keys(mentions).length > 0) targetID = Object.keys(mentions)[0];
      else if (messageReply) targetID = messageReply.senderID;
      else if (args[1] && args[1].length > 10 && !isNaN(args[1])) targetID = args[1];

      if (!targetID || targetID === senderID)
        return api.sendMessage(fancy("❌ Cannot request from yourself Baby."), threadID, messageID);

      let senderData = await usersData.get(senderID);
      let targetData = await usersData.get(targetID);
      if (!targetData) targetData = { money: 0, name: targetID };

      const senderName = senderData?.name || (await api.getUserInfo(senderID))[senderID]?.name || senderID;
      const targetName = targetData?.name || (await api.getUserInfo(targetID))[targetID]?.name || targetID;

      // ✅ targetName must appear in body for mention to work in fca-unofficial
      const reqBody = `💰 ${fancy("Money Request")}\n• ${fancy(senderName)} ${fancy("is requesting money from")} ${targetName}${fancy(" Baby!")}\n\n${fancy("Reply to this message with the amount you want to send.")}\n${fancy("Note: 2% tax will be deducted from your balance.")}`;

      api.sendMessage(
        { body: reqBody, mentions: [{ tag: targetName, id: targetID }] },
        threadID,
        (err, info) => {
          if (err || !info?.messageID) return;

          // ✅ Store all data directly in handleReply — no Map needed
          global.client.handleReply.push({
            name: "balance",
            messageID: info.messageID,
            author: targetID,
            requesterID: senderID,
            requesterName: senderName,
            targetID: targetID,
            targetName: targetName,
            threadID: threadID
          });
        }
      );
      return;
    }

    // ---------------------- BALANCE DISPLAY ----------------------
    let targetID = senderID;
    if (Object.keys(mentions).length > 0) targetID = Object.keys(mentions)[0];
    else if (messageReply) targetID = messageReply.senderID;
    else if (args[0] && args[0].length > 10 && !isNaN(args[0])) targetID = args[0];

    let targetData = await usersData.get(targetID);
    if (!targetData) targetData = { money: 0, name: targetID };
    const targetName = targetData.name || (await api.getUserInfo(targetID))[targetID]?.name || targetID;

    const allUsers = await usersData.getAll();
    const sortedUsers = allUsers.filter(u => u.money !== undefined).sort((a, b) => b.money - a.money);
    const globalRank = sortedUsers.findIndex(u => (u.userID || u.id) == targetID) + 1;

    const resultMsg = `🎀\n > ${fancy("Hey")} "${fancy(targetName)}"\n• ${fancy("Balance")} : ${formatMoney(targetData.money || 0)}\n• ${fancy("Rank")} : ${fancy(globalRank > 0 ? String(globalRank) : "NA")} Baby.`;
    return api.sendMessage({ body: resultMsg, mentions: [{ tag: targetName, id: targetID }] }, threadID, messageID);
  },

  onReply: async function ({ api, usersData, event, handleReply }) {
    const { senderID, threadID, messageID, body } = event;
    const chandaAdminUID = "61567256940629";

    // ✅ Data comes directly from handleReply — no Map lookup needed
    const { requesterID, requesterName, targetID, targetName } = handleReply;
    if (!requesterID || !targetID) return;
    if (senderID !== targetID) return;

    const replyAmount = parseAmount(body?.trim());

    if (isNaN(replyAmount) || replyAmount <= 0) {
      return api.sendMessage(fancy("❌ Reply with a valid amount Baby."), threadID, messageID);
    }

    const totalTax = replyAmount * 0.02;
    const senderReceives = replyAmount - totalTax;

    let payerData = await usersData.get(targetID);
    let receiverData = await usersData.get(requesterID);
    let adminData = await usersData.get(chandaAdminUID);

    if ((payerData.money || 0) < replyAmount) {
      return api.sendMessage(fancy(`❌ ${targetName} has insufficient balance Baby.`), threadID, messageID);
    }

    payerData.money = (payerData.money || 0) - replyAmount;
    receiverData.money = (receiverData.money || 0) + senderReceives;
    adminData.money = (adminData.money || 0) + totalTax;

    await usersData.set(targetID, payerData);
    await usersData.set(requesterID, receiverData);
    await usersData.set(chandaAdminUID, adminData);

    const msg = `✅ Request Completed Baby!\n• ${targetName} sent: $${formatMoney(replyAmount)}\n• 2% Tax: $${formatMoney(totalTax)} → Admin\n• ${requesterName} received: $${formatMoney(senderReceives)}`;
    return api.sendMessage(fancy(msg), threadID, messageID);
  }
};
