const axios = require("axios");

// 💰 Standard Shorthand Parser Baby (Complete Edition)
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

// ✨ Bold Sans-Serif Font Baby (slot/spin style)
function fancy(text) {
  if (text === undefined || text === null) return "";
  const map = {
    'a': '𝐚','b': '𝐛','c': '𝐜','d': '𝐝','e': '𝐞','f': '𝐟','g': '𝐠','h': '𝐡','i': '𝐢','j': '𝐣',
    'k': '𝐤','l': '𝐥','m': '𝐦','n': '𝐧','o': '𝐨','p': '𝐩','q': '𝐪','r': '𝐫','s': '𝐬','t': '𝐭',
    'u': '𝐮','v': '𝐯','w': '𝐰','x': '𝐱','y': '𝐲','z': '𝐳',
    'A': '𝐀','B': '𝐁','C': '𝐂','D': '𝐃','E': '𝐄','F': '𝐅','G': '𝐆','H': '𝐇','I': '𝐈','J': '𝐉',
    'K': '𝐊','L': '𝐋','M': '𝐌','N': '𝐍','O': '𝐎','P': '𝐏','Q': '𝐐','R': '𝐑','S': '𝐒','T': '𝐓',
    'U': '𝐔','V': '𝐕','W': '𝐖','X': '𝐗','Y': '𝐘','Z': '𝐙',
    '0': '𝟎','1': '𝟏','2': '𝟐','3': '𝟑','4': '𝟒','5': '𝟓','6': '𝟔','7': '𝟕','8': '𝟖','9': '𝟗',
    '.': '.', ':': ':', ',': ','
  };
  return String(text).split('').map(char => map[char] || char).join('');
}

// 🏦 Standard Shorthand Formatter Baby
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
  return fancy(Math.floor(amount).toString());
}

// In-memory cache for active listings
const activeListings = new Map();

module.exports = {
  config: {
    name: "market",
    aliases: ["trade", "p2p", "sell", "economy"],
    version: "101.0",
    author: "Saif",
    countDown: 5,
    role: 0,
    category: "game",
    description: "🏙️ 𝐔𝐥𝐭𝐢𝐦𝐚𝐭𝐞 𝐌𝐚𝐫𝐤𝐞𝐭 𝐒𝐲𝐬𝐭𝐞𝐦"
  },

  onStart: async function ({ api, event, usersData, args, message, role }) {
    const { threadID, messageID, senderID, mentions, messageReply } = event;
    const now = Date.now();
    const TWELVE_HOURS = 12 * 60 * 60 * 1000;
    const DAILY_LIMIT = 10;
    const MAX_AMOUNT = 10_000_000; // 10M

    // ── Admin Refresh ──
    if (args[0] === "refresh" && role >= 2) {
      let targetID = messageReply ? messageReply.senderID
        : (Object.keys(mentions).length > 0 ? Object.keys(mentions)[0] : args[1]);
      if (!targetID) return api.sendMessage(fancy("❌ Usage: market refresh @tag or UID Baby"), threadID, messageID);
      let tData = await usersData.get(targetID);
      if (!tData.data) tData.data = {};
      tData.data.marketLimit = { lastReset: now, count: 0 };
      await usersData.set(targetID, { data: tData.data });
      return api.sendMessage(fancy("✅ MARKET LIMIT REFRESHED BABY! 🎀"), threadID, messageID);
    }

    let user = await usersData.get(senderID);
    if (!user.data) user.data = {};
    if (!user.data.marketStats) {
      user.data.marketStats = {
        level: 1,
        xp: 0,
        reputation: 50,
        skills: {
          trading: 1,
          negotiation: 1,
          investment: 1,
          production: 1,
          marketing: 1
        },
        totalTrades: 0,
        totalProfit: 0,
        inventory: [],
        businessCount: 0,
        achievements: []
      };
    }

    // ── 12-Hour Limit ──
    if (!user.data.marketLimit || !user.data.marketLimit.lastReset) {
      user.data.marketLimit = { lastReset: now, count: 0 };
    } else if (now - user.data.marketLimit.lastReset >= TWELVE_HOURS) {
      user.data.marketLimit = { lastReset: now, count: 0 };
    }

    const userStats = user.data.marketStats;
    const sub = args[0]?.toLowerCase();

    // ── HELP ──
    if (!sub || sub === "help") {
      let help = `🏙️ ${fancy("ULTIMATE MARKET")} 🏙️\n━━━━━━━━━━━━━━━━━━━━\n`;
      help += `📊 ${fancy("market profile")} - Stats\n`;
      help += `🏪 ${fancy("market shop")} - Buy items\n`;
      help += `📦 ${fancy("market sell [item] [price]")} - List item\n`;
      help += `🛒 ${fancy("market buy [ID]")} - Purchase\n`;
      help += `📋 ${fancy("market list")} - All listings\n`;
      help += `💼 ${fancy("market invest [amount]")} - Invest\n`;
      help += `⚡ ${fancy("market hunt")} - Find items\n`;
      help += `👥 ${fancy("market partner @tag")} - Partnership\n`;
      help += `━━━━━━━━━━━━━━━━━━━━\n`;
      help += `${fancy("Daily Limit:")} ${user.data.marketLimit.count}/10\n`;
      help += `${fancy("Balance:")} ${formatMoney(user.money || 0)}\n`;
      help += `${fancy("Max listing:")} ${formatMoney(MAX_AMOUNT)}`;
      return api.sendMessage(help, threadID, messageID);
    }

    // ── PROFILE ──
    if (sub === "profile" || sub === "stats") {
      let profile = `👤 ${fancy("PROFILE")} 👤\n━━━━━━━━━━━━━━━━━━\n`;
      profile += `${fancy("Name:")} ${fancy(user.name || senderID)}\n`;
      profile += `${fancy("Level:")} ${userStats.level} | ${fancy("XP:")} ${userStats.xp}/${userStats.level * 100}\n`;
      profile += `${fancy("Reputation:")} ${userStats.reputation}/100\n`;
      profile += `${fancy("Total Trades:")} ${userStats.totalTrades}\n`;
      profile += `${fancy("Total Profit:")} ${formatMoney(userStats.totalProfit)}\n`;
      profile += `${fancy("Inventory:")} ${userStats.inventory.length} items\n`;
      profile += `━━━━━━━━━━━━━━━━━━`;
      return api.sendMessage(profile, threadID, messageID);
    }

    // ── ITEM DATABASE ──
    const ITEM_DB = {
      common: [
        { name: "Fresh Fish", emoji: "🐟", price: 50 },
        { name: "Rice Bag", emoji: "🍚", price: 30 },
        { name: "Vegetables", emoji: "🥬", price: 25 },
        { name: "Milk", emoji: "🥛", price: 40 },
        { name: "Eggs", emoji: "🥚", price: 35 }
      ],
      electronics: [
        { name: "Smartphone", emoji: "📱", price: 15000 },
        { name: "Laptop", emoji: "💻", price: 35000 },
        { name: "Headphones", emoji: "🎧", price: 1200 }
      ],
      luxury: [
        { name: "Gold Necklace", emoji: "📿", price: 50000 },
        { name: "Diamond Ring", emoji: "💍", price: 120000 }
      ]
    };

    // ── DAILY LIMIT CHECK (for actions) ──
    if (user.data.marketLimit.count >= DAILY_LIMIT) {
      const timeLeft = TWELVE_HOURS - (now - user.data.marketLimit.lastReset);
      const h = Math.floor(timeLeft / 3600000);
      const m = Math.floor((timeLeft % 3600000) / 60000);
      return api.sendMessage(
        fancy(`⚠️ Daily limit reached! 10/10 actions used.\n⏰ Reset in: ${h}h ${m}m`),
        threadID, messageID
      );
    }

    // ── SHOP ──
    if (sub === "shop") {
      const category = args[1]?.toLowerCase();
      let shopMsg = `🛍️ ${fancy("SHOP")} 🛍️\n━━━━━━━━━━━━━━━━━━\n`;
      if (!category) {
        shopMsg += `${fancy("Categories:")} common, electronics, luxury\n`;
        shopMsg += `━━━━━━━━━━━━━━━━━━\n${fancy("Use: market shop [category]")}`;
        return api.sendMessage(shopMsg, threadID, messageID);
      }

      if (!ITEM_DB[category])
        return api.sendMessage(fancy("❌ Invalid category!"), threadID, messageID);

      const items = ITEM_DB[category];
      shopMsg += `${fancy(category.toUpperCase())}\n━━━━━━━━━━━━━━━━━━\n`;
      items.forEach((item, idx) => {
        const discount = Math.floor(item.price * (userStats.skills.trading * 0.01));
        const finalPrice = item.price - discount;
        shopMsg += `${idx + 1}. ${item.emoji} ${fancy(item.name)} - ${formatMoney(finalPrice)}\n`;
      });
      shopMsg += `━━━━━━━━━━━━━━━━━━\n${fancy("Reply with number to buy.")}`;

      global.GoatBot.onReply.set(messageID, {
        commandName: this.config.name,
        type: "shop_selection",
        category,
        userID: senderID
      });
      return api.sendMessage(shopMsg, threadID, messageID);
    }

    // ── SELL ──
    if (sub === "sell" || sub === "post") {
      const priceInput = args[args.length - 1];
      const price = parseAmount(priceInput);
      const itemName = args.slice(1, -1).join(" ");
      if (!itemName || isNaN(price) || price <= 0)
        return api.sendMessage(fancy("❌ Usage: market sell [item] [price] (shorthand OK: 5k, 2m)"), threadID, messageID);
      if (price > MAX_AMOUNT)
        return api.sendMessage(fancy(`❌ Max listing price is ${formatMoney(MAX_AMOUNT)}`), threadID, messageID);

      const listingID = Math.random().toString(36).substring(2, 7).toUpperCase();
      activeListings.set(listingID, {
        id: listingID,
        ownerID: senderID,
        ownerName: user.name || senderID,
        item: itemName,
        price,
        time: now
      });

      return api.sendMessage(
        `📢 ${fancy("ITEM LISTED")} 📢\n━━━━━━━━━━━━━━━━━━\n📦 ${fancy("Item:")} ${fancy(itemName)}\n💰 ${fancy("Price:")} ${formatMoney(price)}\n🆔 ${fancy("ID:")} ${listingID}\n━━━━━━━━━━━━━━━━━━`,
        threadID, messageID
      );
    }

    // ── LIST ──
    if (sub === "list") {
      if (activeListings.size === 0)
        return api.sendMessage(fancy("📋 No active listings."), threadID, messageID);

      let listMsg = `🏪 ${fancy("MARKET LISTINGS")} 🏪\n━━━━━━━━━━━━━━━━━━\n`;
      activeListings.forEach((listing, id) => {
        const ago = Math.floor((now - listing.time) / 60000);
        listMsg += `🆔 ${fancy(id)} | 📦 ${fancy(listing.item)}\n💰 ${formatMoney(listing.price)} | 👤 ${fancy(listing.ownerName)}\n⏰ ${ago}m ago\n━━━━━━━━━━━━━━━━━━\n`;
      });
      listMsg += `${fancy("Use: market buy [ID]")}`;
      return api.sendMessage(listMsg, threadID, messageID);
    }

    // ── BUY ──
    if (sub === "buy") {
      const listingID = args[1]?.toUpperCase();
      const listing = activeListings.get(listingID);
      if (!listing) return api.sendMessage(fancy("❌ Invalid listing ID!"), threadID, messageID);
      if (listing.ownerID === senderID)
        return api.sendMessage(fancy("❌ Can't buy your own item!"), threadID, messageID);
      if ((user.money || 0) < listing.price)
        return api.sendMessage(fancy(`❌ Insufficient funds. Need ${formatMoney(listing.price)}`), threadID, messageID);
      if (listing.price > MAX_AMOUNT)
        return api.sendMessage(fancy(`❌ This item exceeds max purchase limit.`), threadID, messageID);

      const seller = await usersData.get(listing.ownerID);
      user.money -= listing.price;
      seller.money += listing.price;

      userStats.totalTrades++;
      userStats.xp += 10;
      userStats.skills.trading = Math.min(100, userStats.skills.trading + 1);
      if (!seller.data) seller.data = {};
      if (!seller.data.marketStats) seller.data.marketStats = { ...userStats };
      seller.data.marketStats.totalTrades++;
      seller.data.marketStats.totalProfit += listing.price;

      userStats.inventory.push({
        name: listing.item,
        boughtAt: listing.price,
        boughtFrom: listing.ownerName,
        time: now
      });

      await usersData.set(senderID, user);
      await usersData.set(listing.ownerID, seller);
      activeListings.delete(listingID);
      user.data.marketLimit.count++;

      return api.sendMessage(
        `✅ ${fancy("PURCHASE SUCCESSFUL")}!\n━━━━━━━━━━━━━━━━━━\n📦 ${fancy(listing.item)}\n💰 ${fancy("Price:")} ${formatMoney(listing.price)}\n👤 ${fancy("Seller:")} ${listing.ownerName}\n📈 ${fancy("Trading Skill +1")}`,
        threadID, messageID
      );
    }

    // ── HUNT ──
    if (sub === "hunt" || sub === "find") {
      if (!userStats.lastHunt) userStats.lastHunt = 0;
      const cooldown = 300000;
      if (now - userStats.lastHunt < cooldown) {
        const remaining = Math.ceil((cooldown - (now - userStats.lastHunt)) / 60000);
        return api.sendMessage(fancy(`⏳ Hunting cooldown! Try again in ${remaining} min`), threadID, messageID);
      }
      userStats.lastHunt = now;

      const categories = Object.keys(ITEM_DB);
      const cat = categories[Math.floor(Math.random() * categories.length)];
      const items = ITEM_DB[cat];
      const found = items[Math.floor(Math.random() * items.length)];

      userStats.inventory.push({
        name: found.name,
        value: found.price,
        foundAt: now
      });
      userStats.xp += 5;
      user.data.marketLimit.count++;
      await usersData.set(senderID, user);

      return api.sendMessage(
        `🎯 ${fancy("ITEM FOUND!")}\n${found.emoji} ${fancy(found.name)}\n💰 ${fancy("Value:")} ${formatMoney(found.price)}\n⭐ ${fancy("XP +5")}`,
        threadID, messageID
      );
    }

    // ── INVEST ──
    if (sub === "invest") {
      const amount = parseAmount(args[1]);
      if (isNaN(amount) || amount <= 0)
        return api.sendMessage(fancy("❌ Invalid amount. Use shorthand: 5k, 2m"), threadID, messageID);
      if (amount > MAX_AMOUNT)
        return api.sendMessage(fancy(`❌ Max investment is ${formatMoney(MAX_AMOUNT)}`), threadID, messageID);

      const chance = 0.6 + (userStats.skills.investment * 0.002);
      const win = Math.random() < chance;
      const mult = 0.1 + Math.random() * 0.3;
      let profit = Math.floor(amount * mult);

      if (win) {
        user.money += profit;
        userStats.totalProfit += profit;
        userStats.skills.investment = Math.min(100, userStats.skills.investment + 2);
      } else {
        user.money -= profit;
        userStats.totalProfit -= profit;
      }

      userStats.totalTrades++;
      userStats.xp += 5;
      user.data.marketLimit.count++;
      await usersData.set(senderID, user);

      const msg = win
        ? `📈 ${fancy("INVESTMENT WIN!")}\n💰 ${fancy("Profit:")} +${formatMoney(profit)}\n📊 ${fancy("Investment Skill +2")}`
        : `📉 ${fancy("INVESTMENT LOSS!")}\n💸 ${fancy("Lost:")} -${formatMoney(profit)}`;
      return api.sendMessage(msg, threadID, messageID);
    }

    // ── PARTNER ──
    if (sub === "partner" || sub === "collab") {
      const mention = Object.keys(mentions)[0];
      if (!mention) return api.sendMessage(fancy("❌ Please mention a user."), threadID, messageID);
      if (mention === senderID) return api.sendMessage(fancy("❌ Can't partner with yourself."), threadID, messageID);

      const partnerData = await usersData.get(mention);
      const bonus = Math.floor(((userStats.skills.trading + (partnerData.data?.marketStats?.skills?.trading || 1)) / 2) * 10);

      api.sendMessage(
        `🤝 ${fancy("PARTNERSHIP OFFER")}\n━━━━━━━━━━━━━━━━━━\n👤 ${fancy(user.name)} → 👥 ${fancy(partnerData.name)}\n💰 ${fancy("Signing Bonus:")} ${formatMoney(bonus)}\n━━━━━━━━━━━━━━━━━━\n${fancy("Reply 'accept' to confirm")}`,
        threadID,
        (err, info) => {
          if (err) return;
          global.GoatBot.onReply.set(info.messageID, {
            commandName: this.config.name,
            type: "partnership",
            fromID: senderID,
            toID: mention,
            bonus
          });
        },
        messageID
      );
      return;
    }

    // Fallback
    return api.sendMessage(fancy("❌ Invalid command. Use market help"), threadID, messageID);
  },

  // ── ON REPLY ──
  onReply: async function ({ api, event, Reply, usersData }) {
    const { senderID, body, threadID, messageID } = event;
    const { type } = Reply;

    if (type === "partnership") {
      if (senderID !== Reply.toID) return;
      if (body.toLowerCase() !== "accept") return;

      const from = await usersData.get(Reply.fromID);
      const to = await usersData.get(Reply.toID);
      from.money += Reply.bonus;
      to.money += Reply.bonus;
      await usersData.set(Reply.fromID, from);
      await usersData.set(Reply.toID, to);

      return api.sendMessage(
        `✅ ${fancy("PARTNERSHIP ACCEPTED!")}\n🤝 ${fancy(from.name)} & ${fancy(to.name)}\n💰 ${fancy("Bonus:")} ${formatMoney(Reply.bonus)} each`,
        threadID, messageID
      );
    }

    if (type === "shop_selection" && senderID === Reply.userID) {
      const num = parseInt(body);
      const ITEM_DB = {
        common: [
          { name: "Fresh Fish", emoji: "🐟", price: 50 },
          { name: "Rice Bag", emoji: "🍚", price: 30 },
          { name: "Vegetables", emoji: "🥬", price: 25 },
          { name: "Milk", emoji: "🥛", price: 40 },
          { name: "Eggs", emoji: "🥚", price: 35 }
        ],
        electronics: [
          { name: "Smartphone", emoji: "📱", price: 15000 },
          { name: "Laptop", emoji: "💻", price: 35000 },
          { name: "Headphones", emoji: "🎧", price: 1200 }
        ],
        luxury: [
          { name: "Gold Necklace", emoji: "📿", price: 50000 },
          { name: "Diamond Ring", emoji: "💍", price: 120000 }
        ]
      };
      const items = ITEM_DB[Reply.category];
      if (!items || isNaN(num) || num < 1 || num > items.length)
        return api.sendMessage(fancy("❌ Invalid item number."), threadID, messageID);

      const selected = items[num - 1];
      const user = await usersData.get(senderID);
      const discount = Math.floor(selected.price * (user.data.marketStats.skills.trading * 0.01));
      const finalPrice = selected.price - discount;

      if ((user.money || 0) < finalPrice)
        return api.sendMessage(fancy(`❌ Insufficient funds. Need ${formatMoney(finalPrice)}`), threadID, messageID);

      user.money -= finalPrice;
      user.data.marketStats.inventory.push({ name: selected.name, boughtAt: finalPrice, time: Date.now() });
      user.data.marketStats.totalTrades++;
      user.data.marketLimit.count++;
      await usersData.set(senderID, user);

      return api.sendMessage(
        `✅ ${fancy("PURCHASED!")}\n${selected.emoji} ${fancy(selected.name)}\n💰 ${fancy("Paid:")} ${formatMoney(finalPrice)}`,
        threadID, messageID
      );
    }
  }
};
