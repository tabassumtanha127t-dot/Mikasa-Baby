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
      const num = parseFloat(str.slice(0, -key.length));
      return isNaN(num) ? NaN : num * map[key];
    }
  }
  return parseFloat(str);
}

function fancy(text) {
  const map = {
    'a':'𝐚','b':'𝐛','c':'𝐜','d':'𝐝','e':'𝐞','f':'𝐟','g':'𝐠','h':'𝐡','i':'𝐢','j':'𝐣',
    'k':'𝐤','l':'𝐥','m':'𝐦','n':'𝐧','o':'𝐨','p':'𝐩','q':'𝐪','r':'𝐫','s':'𝐬','t':'𝐭',
    'u':'𝐮','v':'𝐯','w':'𝐰','x':'𝐱','y':'𝐲','z':'𝐳',
    'A':'𝐀','B':'𝐁','C':'𝐂','D':'𝐃','E':'𝐄','F':'𝐅','G':'𝐆','H':'𝐇','I':'𝐈','J':'𝐉',
    'K':'𝐊','L':'𝐋','M':'𝐌','N':'𝐍','O':'𝐎','P':'𝐏','Q':'𝐐','R':'𝐑','S':'𝐒','T':'𝐓',
    'U':'𝐔','V':'𝐕','W':'𝐖','X':'𝐗','Y':'𝐘','Z':'𝐙',
    '0':'𝟎','1':'𝟏','2':'𝟐','3':'𝟑','4':'𝟒','5':'𝟓','6':'𝟔','7':'𝟕','8':'𝟖','9':'𝟗',
    ':':':', '.':'.', '$':'$', '#':'#', '%':'%', '+':'+', '-':'-', '/':'/'
  };
  return text.toString().split('').map(c => map[c] || c).join('');
}

function formatMoney(amount) {
  if (isNaN(amount) || amount === Infinity || amount === undefined) return fancy("0");
  const units = [
    { v: 1e303, s: "𝐂𝐭"  },
    { v: 1e93,  s: "𝐍𝐭𝐠" },
    { v: 1e66,  s: "𝐕𝐠"  },
    { v: 1e36,  s: "𝐃𝐜"  },
    { v: 1e33,  s: "𝐍𝐨"  },
    { v: 1e30,  s: "𝐎𝐜"  },
    { v: 1e27,  s: "𝐒𝐩"  },
    { v: 1e24,  s: "𝐒𝐱"  },
    { v: 1e21,  s: "𝐐𝐢"  },
    { v: 1e18,  s: "𝐐𝐝"  },
    { v: 1e15,  s: "𝐐"   },
    { v: 1e12,  s: "𝐓"   },
    { v: 1e9,   s: "𝐁"   },
    { v: 1e6,   s: "𝐌"   },
    { v: 1e3,   s: "𝐊"   }
  ];
  for (const u of units) {
    if (Math.abs(amount) >= u.v)
      return fancy((amount / u.v).toFixed(2)) + u.s;
  }
  return fancy(Math.floor(amount).toLocaleString());
}

// ─── Medal for leaderboard ───────────────────────────────────────
function medal(rank) {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return fancy(String(rank)) + ".";
}

// ─── Resolve target from mentions / reply / UID arg ──────────────
function resolveTarget(mentions, messageReply, args, argIndex, senderID) {
  if (Object.keys(mentions).length > 0) return Object.keys(mentions)[0];
  if (messageReply) return messageReply.senderID;
  if (args[argIndex] && args[argIndex].length > 10 && !isNaN(args[argIndex]))
    return args[argIndex];
  return senderID;
}

module.exports = {
  config: {
    name: "balance",
    aliases: ["bal", "money"],
    version: "24.0",
    author: "Saif",
    countDown: 5,
    role: 0,
    category: "bank",
    description: "𝐔𝐥𝐭𝐢𝐦𝐚𝐭𝐞 𝐁𝐚𝐧𝐤 𝐒𝐲𝐬𝐭𝐞𝐦"
  },

  onStart: async function ({ api, usersData, event, args }) {
    const { senderID, threadID, messageID, messageReply, mentions } = event;
    const ADMIN_IDS    = ["61567256940629"];
    const CHANDA_UID   = "61567256940629";
    const TRANSFER_MAX = 10_000_000;
    const TRANSFER_LIMIT = 5;
    const TAX_RATE     = 0.02;

    // Ensure admin wallet exists
    let adminData = await usersData.get(CHANDA_UID);
    if (!adminData) {
      await usersData.set(CHANDA_UID, { money: 0, name: "Admin" });
      adminData = { money: 0 };
    }

    const sub = (args[0] || "").toLowerCase();

    // ─────────────────────────── HELP ──────────────────────────────
    if (sub === "help") {
      const help =
        `🎀 𝐁𝐚𝐥𝐚𝐧𝐜𝐞 𝐂𝐨𝐦𝐦𝐚𝐧𝐝𝐬\n` +
        `━━━━━━━━━━━━━━━━\n` +
        `• bal — Check your balance\n` +
        `• bal @user — Check someone's balance\n` +
        `• bal top — Top 10 richest users\n` +
        `• bal t [amount] @user — Transfer money\n` +
        `• bal req [amount] @user — Request money\n` +
        `• bal help — Show this menu\n` +
        `━━━━━━━━━━━━━━━━\n` +
        `• Transfer limit: $${fancy("10M")} per tx\n` +
        `• Daily transfers: ${fancy(String(TRANSFER_LIMIT))} per day\n` +
        `• Tax: ${fancy("2%")} per transfer Baby.`;
      return api.sendMessage(fancy(help), threadID, messageID);
    }

    // ─────────────────────────── TOP ───────────────────────────────
    if (sub === "top") {
      const allUsers = await usersData.getAll();
      const sorted = allUsers
        .filter(u => u.money !== undefined && u.money > 0)
        .sort((a, b) => b.money - a.money)
        .slice(0, 10);

      if (!sorted.length)
        return api.sendMessage(fancy("❌ No users found Baby."), threadID, messageID);

      let board = `🏆 𝐓𝐨𝐩 𝐑𝐢𝐜𝐡𝐞𝐬𝐭 𝐔𝐬𝐞𝐫𝐬\n━━━━━━━━━━━━━━━━\n`;
      for (let i = 0; i < sorted.length; i++) {
        const u = sorted[i];
        const name = u.name || u.userID || "Unknown";
        board += `${medal(i + 1)} ${fancy(name)}\n   ${fancy("Balance")}: ${formatMoney(u.money)}\n`;
      }
      board += `━━━━━━━━━━━━━━━━`;
      return api.sendMessage(board, threadID, messageID);
    }

    // ─────────────────────────── ADMIN ADD / SET ───────────────────
    if (["add", "set"].includes(sub) && ADMIN_IDS.includes(senderID)) {
      const targetID = resolveTarget(mentions, messageReply, args, 1, senderID);
      const hasTarget = Object.keys(mentions).length > 0 || messageReply ||
                        (args[1] && args[1].length > 10 && !isNaN(args[1]));
      const amountStr = hasTarget ? args[2] : args[1];
      const amount    = parseAmount(amountStr);

      if (isNaN(amount) || amount <= 0)
        return api.sendMessage(
          fancy(`❌ Usage: bal ${sub} [amount] [@tag / reply / UID] Baby.`),
          threadID, messageID
        );

      let targetData = await usersData.get(targetID) || { money: 0 };
      const targetName = targetData.name ||
                         (await api.getUserInfo(targetID))[targetID]?.name || targetID;

      targetData.money = sub === "add"
        ? (targetData.money || 0) + amount
        : amount;
      await usersData.set(targetID, targetData);

      return api.sendMessage(
        fancy(`✅ ${sub === "add" ? "Added" : "Set"} $${formatMoney(amount)} for ${targetName} Baby.`),
        threadID, messageID
      );
    }

    // ─────────────────────────── TRANSFER ─────────────────────────
    if (["t", "transfer", "give"].includes(sub)) {
      const targetID = resolveTarget(mentions, messageReply, args, 1, senderID);

      if (targetID === senderID)
        return api.sendMessage(fancy("❌ Cannot transfer to yourself Baby."), threadID, messageID);

      let senderData = await usersData.get(senderID);
      let targetData = await usersData.get(targetID) || { money: 0 };

      const amountStr = Object.keys(mentions).length > 0
        ? args[args.length - 1]
        : args[1];
      const amount = parseAmount(amountStr);

      if (isNaN(amount) || amount <= 0)
        return api.sendMessage(fancy("❌ Enter a valid amount Baby."), threadID, messageID);
      if (amount > TRANSFER_MAX)
        return api.sendMessage(
          fancy(`⚠️ Max transfer is $${formatMoney(TRANSFER_MAX)} Baby.`),
          threadID, messageID
        );

      // Daily limit tracking
      const today = new Date().toDateString();
      if (!senderData.data) senderData.data = {};
      if (senderData.data.lastTransferDate !== today) {
        senderData.data.transferCount    = 0;
        senderData.data.lastTransferDate = today;
      }
      if (senderData.data.transferCount >= TRANSFER_LIMIT)
        return api.sendMessage(
          fancy(`⚠️ Daily ${TRANSFER_LIMIT}-transfer limit reached Baby.`),
          threadID, messageID
        );

      const tax   = amount * TAX_RATE;
      const total = amount + tax;

      if ((senderData.money || 0) < total)
        return api.sendMessage(
          fancy(`⚠️ Insufficient balance. Need $${formatMoney(total)} (incl. 2% tax) Baby.`),
          threadID, messageID
        );

      const targetName = targetData.name ||
                         (await api.getUserInfo(targetID))[targetID]?.name || targetID;
      const remaining  = TRANSFER_LIMIT - senderData.data.transferCount - 1;

      senderData.money = (senderData.money || 0) - total;
      targetData.money = (targetData.money || 0) + amount;
      senderData.data.transferCount++;
      adminData.money  = (adminData.money || 0) + tax;

      await usersData.set(CHANDA_UID, adminData);
      await usersData.set(senderID, senderData);
      await usersData.set(targetID, targetData);

      const msg =
        ` • ✅ Sent $${formatMoney(amount)} to ${fancy(targetName)} Baby.\n` +
        ` • Total 2% Charge Deducted: $${formatMoney(tax)}\n` +
        ` • 🇧🇩 1% Chanda + 1% Send Money Charge (chandabaz ‎Śā īfシ : ${CHANDA_UID})\n` +
        ` • ☑️ 2% টাকা (1% চান্দা এবং 1% সেন্ড মানি চার্জ) কাটা হয়েছে!\n` +
        ` • Transfers left today: ${fancy(String(remaining))}`;
      return api.sendMessage(fancy(msg), threadID, messageID);
    }

    // ─────────────────────────── REQUEST ──────────────────────────
    if (["req", "request", "r"].includes(sub)) {
      const targetID = resolveTarget(mentions, messageReply, args, 1, null);

      if (!targetID || targetID === senderID)
        return api.sendMessage(fancy("❌ Cannot request from yourself Baby."), threadID, messageID);

      let senderData = await usersData.get(senderID) || {};
      let targetData = await usersData.get(targetID) || { money: 0 };

      const senderName = senderData.name ||
                         (await api.getUserInfo(senderID))[senderID]?.name || senderID;
      const targetName = targetData.name ||
                         (await api.getUserInfo(targetID))[targetID]?.name || targetID;

      const reqBody =
        `💰 𝐌𝐨𝐧𝐞𝐲 𝐑𝐞𝐪𝐮𝐞𝐬𝐭\n` +
        `━━━━━━━━━━━━━━━━\n` +
        `• From : ${fancy(senderName)}\n` +
        `• To   : ${targetName}\n` +
        `━━━━━━━━━━━━━━━━\n` +
        `${fancy("Reply with the amount to send.")}\n` +
        `${fancy("Note: 2% tax will be deducted.")}`;

      api.sendMessage(
        { body: reqBody, mentions: [{ tag: targetName, id: targetID }] },
        threadID,
        (err, info) => {
          if (err || !info?.messageID) return;
          global.client.handleReply.push({
            name: "balance",
            messageID:     info.messageID,
            author:        targetID,
            requesterID:   senderID,
            requesterName: senderName,
            targetID:      targetID,
            targetName:    targetName,
            threadID:      threadID
          });
        }
      );
      return;
    }

    // ─────────────────────────── BALANCE DISPLAY ──────────────────
    const targetID = resolveTarget(mentions, messageReply, args, 0, senderID);
    let targetData  = await usersData.get(targetID) || { money: 0 };
    const targetName = targetData.name ||
                       (await api.getUserInfo(targetID))[targetID]?.name || targetID;

    const allUsers  = await usersData.getAll();
    const sorted    = allUsers.filter(u => u.money !== undefined).sort((a, b) => b.money - a.money);
    const globalRank = sorted.findIndex(u => (u.userID || u.id) == targetID) + 1;

    const bal = targetData.money || 0;
    const msg =
      `🎀\n` +
      ` > ${fancy("Hey")} "${fancy(targetName)}"\n` +
      `━━━━━━━━━━━━━━━━\n` +
      `• ${fancy("Balance")} : ${formatMoney(bal)}\n` +
      `• ${fancy("Rank")}    : ${fancy(globalRank > 0 ? String(globalRank) : "N/A")}\n` +
      `━━━━━━━━━━━━━━━━\n` +
      `${fancy("Type bal help for all commands Baby.")}`;

    return api.sendMessage(
      { body: msg, mentions: [{ tag: targetName, id: targetID }] },
      threadID, messageID
    );
  },

  // ─────────────────────────── ON REPLY ─────────────────────────────
  onReply: async function ({ api, usersData, event, handleReply }) {
    const { senderID, threadID, messageID, body } = event;
    const CHANDA_UID = "61567256940629";
    const TAX_RATE   = 0.02;

    const { requesterID, requesterName, targetID, targetName } = handleReply;
    if (!requesterID || !targetID) return;
    if (senderID !== targetID) return;

    const amount = parseAmount(body?.trim());
    if (isNaN(amount) || amount <= 0)
      return api.sendMessage(fancy("❌ Reply with a valid amount Baby."), threadID, messageID);

    if (amount > 10_000_000)
      return api.sendMessage(fancy("⚠️ Maximum $10M transfer limit Baby."), threadID, messageID);

    const tax          = amount * TAX_RATE;
    const totalDeduct  = amount + tax;
    const receiverGets = amount;                // requester receives full amount; payer pays amount + tax

    let payerData    = await usersData.get(targetID);
    let receiverData = await usersData.get(requesterID) || { money: 0 };
    let adminData    = await usersData.get(CHANDA_UID)  || { money: 0 };

    if ((payerData?.money || 0) < totalDeduct)
      return api.sendMessage(
        fancy(`❌ ${targetName} has insufficient balance. Need $${formatMoney(totalDeduct)} Baby.`),
        threadID, messageID
      );

    payerData.money    = (payerData.money || 0) - totalDeduct;
    receiverData.money = (receiverData.money || 0) + receiverGets;
    adminData.money    = (adminData.money || 0) + tax;

    await usersData.set(targetID,    payerData);
    await usersData.set(requesterID, receiverData);
    await usersData.set(CHANDA_UID,  adminData);

    const msg =
      ` • ✅ Request Completed Baby!\n` +
      ` • ${fancy(targetName)} sent  : $${formatMoney(amount)}\n` +
      ` • Total 2% Charge Deducted: $${formatMoney(tax)}\n` +
      ` • 🇧🇩 1% Chanda + 1% Send Money Charge (chandabaz ‎Śā īfシ : ${CHANDA_UID})\n` +
      ` • ☑️ 2% টাকা (1% চান্দা এবং 1% সেন্ড মানি চার্জ) কাটা হয়েছে!\n` +
      ` • ${fancy(requesterName)} received: $${formatMoney(receiverGets)}`;
    return api.sendMessage(fancy(msg), threadID, messageID);
  }
};
