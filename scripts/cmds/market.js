const axios = require("axios");
const fs = require('fs');
const path = require('path');

// Create data directory if not exists
const dataDir = path.join(__dirname, 'market_data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Market database file
const MARKET_DB = path.join(dataDir, 'market_db.json');
const USER_STATS_DB = path.join(dataDir, 'user_stats.json');

// Initialize databases
function loadMarketDB() {
  try {
    if (fs.existsSync(MARKET_DB)) {
      return JSON.parse(fs.readFileSync(MARKET_DB, 'utf8'));
    }
  } catch (err) {
    console.error('Error loading market DB:', err);
  }
  return { listings: {}, history: [], lastID: 0 };
}

function loadUserStats() {
  try {
    if (fs.existsSync(USER_STATS_DB)) {
      return JSON.parse(fs.readFileSync(USER_STATS_DB, 'utf8'));
    }
  } catch (err) {
    console.error('Error loading user stats:', err);
  }
  return {};
}

function saveMarketDB(data) {
  try {
    fs.writeFileSync(MARKET_DB, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving market DB:', err);
  }
}

function saveUserStats(data) {
  try {
    fs.writeFileSync(USER_STATS_DB, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving user stats:', err);
  }
}

// Premium Font Helper Baby
function fancy(text) {
  const map = {
    'a': '𝒂','b': '𝒃','c': '𝒄','d': '𝒅','e': '𝒆','f': '𝒇','g': '𝒈','h': '𝒉','i': '𝒊','j': '𝒋','k': '𝒌','l': '𝒍','m': '𝒎','n': '𝒏','o': '𝒐','p': '𝒑','q': '𝗊','r': '𝒓','s': '𝒔','t': '𝒕','u': '𝒖','v': '𝒗','w': '𝒘','x': '𝒙','y': '𝒚','z': '𝒛',
    'A': '𝑨','B': '𝑩','C': '𝑪','D': '𝑫','E': '𝑬','F': '𝑭','G': '𝑮','H': '𝑯','I': '𝑰','J': '𝑱','K': '𝑲','L': '𝑳','M': '𝑴','N': '𝑵','O': '𝑶','P': '𝑷','Q': '𝑸','R': '𝑹','S': '𝑺','T': '𝑻','U': '𝑼','V': '𝑽','W': '𝒘','X': '𝑿','Y': '𝒀','Z': '𝒁',
    '0': '𝟎','1': '𝟏','2': '𝟐','3': '𝟑','4': '𝟒','5': '𝟓','6': '𝟔','7': '𝟕','8': '𝟖','9': '𝟗'
  };
  return text.toString().split('').map(char => map[char] || char).join('');
}

// Realistic Item Database with Categories
const ITEM_DATABASE = {
  common: [
    { name: "Fresh Fish", emoji: "🐟", basePrice: 50, rarity: "common" },
    { name: "Rice Bag", emoji: "🍚", basePrice: 30, rarity: "common" },
    { name: "Vegetables", emoji: "🥬", basePrice: 25, rarity: "common" },
    { name: "Milk", emoji: "🥛", basePrice: 40, rarity: "common" },
    { name: "Eggs", emoji: "🥚", basePrice: 35, rarity: "common" },
    { name: "Bread", emoji: "🍞", basePrice: 20, rarity: "common" },
    { name: "Chicken", emoji: "🐔", basePrice: 60, rarity: "common" },
    { name: "Potatoes", emoji: "🥔", basePrice: 15, rarity: "common" },
    { name: "Onions", emoji: "🧅", basePrice: 10, rarity: "common" },
    { name: "Garlic", emoji: "🧄", basePrice: 12, rarity: "common" }
  ],
  electronics: [
    { name: "Smartphone", emoji: "📱", basePrice: 15000, rarity: "rare" },
    { name: "Laptop", emoji: "💻", basePrice: 35000, rarity: "rare" },
    { name: "Headphones", emoji: "🎧", basePrice: 1200, rarity: "uncommon" },
    { name: "Smart Watch", emoji: "⌚", basePrice: 5000, rarity: "rare" },
    { name: "Bluetooth Speaker", emoji: "🔊", basePrice: 1500, rarity: "uncommon" },
    { name: "Power Bank", emoji: "🔋", basePrice: 800, rarity: "common" },
    { name: "Tablet", emoji: "📱", basePrice: 18000, rarity: "rare" },
    { name: "Gaming Console", emoji: "🎮", basePrice: 25000, rarity: "epic" }
  ],
  luxury: [
    { name: "Gold Necklace", emoji: "📿", basePrice: 50000, rarity: "epic" },
    { name: "Designer Watch", emoji: "⌚", basePrice: 75000, rarity: "legendary" },
    { name: "Diamond Ring", emoji: "💍", basePrice: 120000, rarity: "legendary" },
    { name: "Luxury Car", emoji: "🚗", basePrice: 500000, rarity: "mythic" },
    { name: "Penthouse", emoji: "🏙️", basePrice: 1000000, rarity: "mythic" },
    { name: "Private Jet", emoji: "✈️", basePrice: 5000000, rarity: "godlike" },
    { name: "Yacht", emoji: "🛥️", basePrice: 3000000, rarity: "godlike" }
  ],
  business: [
    { name: "Restaurant", emoji: "🍽️", basePrice: 200000, rarity: "epic" },
    { name: "Coffee Shop", emoji: "☕", basePrice: 80000, rarity: "rare" },
    { name: "Grocery Store", emoji: "🏪", basePrice: 120000, rarity: "epic" },
    { name: "Tech Startup", emoji: "💡", basePrice: 300000, rarity: "legendary" },
    { name: "Real Estate", emoji: "🏢", basePrice: 400000, rarity: "mythic" },
    { name: "Hotel Chain", emoji: "🏨", basePrice: 1000000, rarity: "godlike" }
  ],
  vehicles: [
    { name: "Motorcycle", emoji: "🏍️", basePrice: 150000, rarity: "rare" },
    { name: "Sedan Car", emoji: "🚘", basePrice: 350000, rarity: "epic" },
    { name: "SUV", emoji: "🚙", basePrice: 500000, rarity: "epic" },
    { name: "Sports Car", emoji: "🏎️", basePrice: 800000, rarity: "legendary" },
    { name: "Pickup Truck", emoji: "🛻", basePrice: 400000, rarity: "epic" },
    { name: "Bus", emoji: "🚌", basePrice: 1200000, rarity: "mythic" },
    { name: "Truck", emoji: "🚚", basePrice: 1500000, rarity: "mythic" }
  ],
  services: [
    { name: "Cooking Service", emoji: "👨‍🍳", basePrice: 500, rarity: "common" },
    { name: "Delivery Service", emoji: "🚚", basePrice: 300, rarity: "common" },
    { name: "Tutoring", emoji: "📚", basePrice: 400, rarity: "common" },
    { name: "IT Support", emoji: "💻", basePrice: 800, rarity: "uncommon" },
    { name: "Design Service", emoji: "🎨", basePrice: 1200, rarity: "uncommon" },
    { name: "Legal Advice", emoji: "⚖️", basePrice: 2000, rarity: "rare" },
    { name: "Medical Consultation", emoji: "🏥", basePrice: 1500, rarity: "rare" }
  ]
};

// Skill System for Users
const SKILLS = {
  trading: { name: "Trading Skill", maxLevel: 100 },
  negotiation: { name: "Negotiation Skill", maxLevel: 100 },
  investment: { name: "Investment Skill", maxLevel: 100 },
  production: { name: "Production Skill", maxLevel: 100 },
  marketing: { name: "Marketing Skill", maxLevel: 100 }
};

// Generate random item from database
function generateRandomItem(userSkills = {}) {
  const categories = Object.keys(ITEM_DATABASE);
  const category = categories[Math.floor(Math.random() * categories.length)];
  const items = ITEM_DATABASE[category];
  const item = { ...items[Math.floor(Math.random() * items.length)] };
  
  // Apply skill-based price adjustments
  const skillBonus = (userSkills.trading || 0) * 0.01; // 1% discount per skill level
  const finalPrice = Math.floor(item.basePrice * (1 - skillBonus));
  
  return {
    ...item,
    category: category,
    finalPrice: finalPrice > 0 ? finalPrice : item.basePrice,
    condition: Math.random() > 0.7 ? "Excellent" : Math.random() > 0.4 ? "Good" : "Average",
    quantity: Math.floor(Math.random() * 10) + 1
  };
}

module.exports = {
  config: {
    name: "market",
    aliases: ["trade", "p2p", "sell", "economy", "business"],
    version: "100.0",
    author: "Saif & Ultimate AI",
    countDown: 5,
    role: 0,
    category: "economy",
    description: "🏙️ 𝑼𝒍𝒕𝒊𝒎𝒂𝒕𝒆 𝑳𝒊𝒇𝒆 𝑺𝒊𝒎𝒖𝒍𝒂𝒕𝒊𝒐𝒏 𝑴𝒂𝒓𝒌𝒆𝒕 𝑺𝒚𝒔𝒕𝒆𝒎 🏙️"
  },

  onStart: async function ({ api, event, usersData, args, message }) {
    const { threadID, messageID, senderID } = event;
    const userData = await usersData.get(senderID);
    
    // Load databases
    const marketDB = loadMarketDB();
    const userStats = loadUserStats();
    
    // Initialize user stats if not exists
    if (!userStats[senderID]) {
      userStats[senderID] = {
        skills: { trading: 1, negotiation: 1, investment: 1, production: 1, marketing: 1 },
        level: 1,
        xp: 0,
        reputation: 50,
        businessCount: 0,
        totalTrades: 0,
        totalProfit: 0,
        inventory: [],
        achievements: []
      };
    }
    
    const userStat = userStats[senderID];
    const sub = args[0]?.toLowerCase();

    // ----------------- 1. HELP & DASHBOARD -----------------
    if (!sub || sub === "help") {
      let help = `🏙️ ${fancy("𝑼𝑳𝑻𝑰𝑴𝑨𝑻𝑬 𝑳𝑰𝑭𝑬 𝑺𝑰𝑴𝑼𝑳𝑨𝑻𝑰𝑶𝑵 𝑴𝑨𝑹𝑲𝑬𝑻")} 🏙️\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
      help += `📊 ${fancy("market profile")} - View your stats\n`;
      help += `🏪 ${fancy("market shop")} - Buy items\n`;
      help += `📈 ${fancy("market stock")} - Stock market\n`;
      help += `🏢 ${fancy("market business")} - Manage businesses\n`;
      help += `📦 ${fancy("market sell [item] [price]")} - List item\n`;
      help += `🛒 ${fancy("market buy [ID]")} - Buy item\n`;
      help += `💼 ${fancy("market invest [amount]")} - Invest money\n`;
      help += `📋 ${fancy("market list")} - View all listings\n`;
      help += `⚡ ${fancy("market hunt")} - Find rare items\n`;
      help += `👥 ${fancy("market partner [@mention]")} - Business partnership\n`;
      help += `🔨 ${fancy("market produce")} - Produce goods\n`;
      help += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
      help += `🏆 ${fancy("𝑳𝒆𝒗𝒆𝒍:")} ${userStat.level} | ${fancy("𝑹𝒆𝒑:")} ${userStat.reputation}\n`;
      help += `💰 ${fancy("𝑩𝒂𝒍𝒂𝒏𝒄𝒆:")} ${userData.money?.toLocaleString() || 0}`;
      
      return api.sendMessage(help, threadID, messageID);
    }

    // ----------------- 2. USER PROFILE -----------------
    if (sub === "profile" || sub === "stats") {
      const skillsText = Object.entries(userStat.skills)
        .map(([skill, level]) => `${fancy(skill)}: ${level}/100`)
        .join(' | ');
      
      let profile = `👤 ${fancy("𝑷𝑹𝑶𝑭𝑰𝑳𝑬")} 👤\n━━━━━━━━━━━━━━━━━━\n`;
      profile += `${fancy("𝑵𝒂𝒎𝒆:")} ${userData.name}\n`;
      profile += `${fancy("𝑳𝒆𝒗𝒆𝒍:")} ${userStat.level} | ${fancy("𝑿𝑷:")} ${userStat.xp}/${userStat.level * 100}\n`;
      profile += `${fancy("𝑹𝒆𝒑𝒖𝒕𝒂𝒕𝒊𝒐𝒏:")} ${userStat.reputation}/100\n`;
      profile += `${fancy("𝑺𝒌𝒊𝒍𝒍𝒔:")}\n${skillsText}\n`;
      profile += `${fancy("𝑻𝒐𝒕𝒂𝒍 𝑻𝒓𝒂𝒅𝒆𝒔:")} ${userStat.totalTrades}\n`;
      profile += `${fancy("𝑻𝒐𝒕𝒂𝒍 𝑷𝒓𝒐𝒇𝒊𝒕:")} ${userStat.totalProfit.toLocaleString()}\n`;
      profile += `${fancy("𝑩𝒖𝒔𝒊𝒏𝒆𝒔𝒔𝒆𝒔:")} ${userStat.businessCount}\n`;
      profile += `${fancy("𝑨𝒄𝒉𝒊𝒆𝒗𝒆𝒎𝒆𝒏𝒕𝒔:")} ${userStat.achievements.length}\n`;
      profile += `━━━━━━━━━━━━━━━━━━`;
      
      return api.sendMessage(profile, threadID, messageID);
    }

    // ----------------- 3. SHOP SYSTEM -----------------
    if (sub === "shop") {
      const category = args[1]?.toLowerCase();
      let shopMsg = `🛍️ ${fancy("𝑺𝑯𝑶𝑷")} 🛍️\n━━━━━━━━━━━━━━━━━━\n`;
      
      if (!category) {
        shopMsg += `${fancy("𝑪𝒂𝒕𝒆𝒈𝒐𝒓𝒊𝒆𝒔:")}\n`;
        shopMsg += `🛒 ${fancy("market shop common")} - Daily items\n`;
        shopMsg += `📱 ${fancy("market shop electronics")} - Electronics\n`;
        shopMsg += `💎 ${fancy("market shop luxury")} - Luxury goods\n`;
        shopMsg += `🏢 ${fancy("market shop business")} - Businesses\n`;
        shopMsg += `🚗 ${fancy("market shop vehicles")} - Vehicles\n`;
        shopMsg += `👨‍💼 ${fancy("market shop services")} - Services\n`;
        shopMsg += `━━━━━━━━━━━━━━━━━━\n`;
        shopMsg += `${fancy("𝑼𝒔𝒆: market buyitem [number]")}`;
        
        return api.sendMessage(shopMsg, threadID, messageID);
      }
      
      if (!ITEM_DATABASE[category]) {
        return api.sendMessage(fancy("❌ 𝑰𝒏𝒗𝒂𝒍𝒊𝒅 𝒄𝒂𝒕𝒆𝒈𝒐𝒓𝒚!"), threadID, messageID);
      }
      
      const items = ITEM_DATABASE[category];
      shopMsg += `${fancy(category.toUpperCase())}\n━━━━━━━━━━━━━━━━━━\n`;
      
      items.forEach((item, index) => {
        const priceWithDiscount = Math.floor(item.basePrice * (1 - (userStat.skills.trading * 0.01)));
        shopMsg += `${index + 1}. ${item.emoji} ${fancy(item.name)} - ${priceWithDiscount.toLocaleString()} (${item.rarity})\n`;
      });
      
      shopMsg += `━━━━━━━━━━━━━━━━━━\n`;
      shopMsg += `${fancy("𝑼𝒔𝒆: market buyitem [number]")}`;
      
      // Store shop session
      global.GoatBot.onReply.set(messageID, {
        commandName: this.config.name,
        type: "shop_selection",
        category: category,
        userID: senderID
      });
      
      return api.sendMessage(shopMsg, threadID, messageID);
    }

    // ----------------- 4. STOCK MARKET -----------------
    if (sub === "stock") {
      const stocks = [
        { name: "TechCorp", price: 1500, change: Math.random() * 10 - 5 },
        { name: "FoodChain", price: 800, change: Math.random() * 5 - 2.5 },
        { name: "AutoMotive", price: 2500, change: Math.random() * 15 - 7.5 },
        { name: "EnergyPlus", price: 3000, change: Math.random() * 20 - 10 },
        { name: "HealthCare", price: 1200, change: Math.random() * 8 - 4 }
      ];
      
      let stockMsg = `📈 ${fancy("𝑺𝑻𝑶𝑪𝑲 𝑴𝑨𝑹𝑲𝑬𝑻")} 📈\n━━━━━━━━━━━━━━━━━━\n`;
      
      stocks.forEach(stock => {
        const changeIcon = stock.change >= 0 ? "📈" : "📉";
        stockMsg += `${changeIcon} ${fancy(stock.name)}: ${stock.price.toFixed(2)} (${stock.change.toFixed(2)}%)\n`;
      });
      
      stockMsg += `━━━━━━━━━━━━━━━━━━\n`;
      stockMsg += `${fancy("𝑼𝒔𝒆: market invest [amount] [stockname]")}`;
      
      return api.sendMessage(stockMsg, threadID, messageID);
    }

    // ----------------- 5. BUSINESS MANAGEMENT -----------------
    if (sub === "business") {
      const action = args[1]?.toLowerCase();
      
      if (!action || action === "list") {
        let businessMsg = `🏢 ${fancy("𝑩𝑼𝑺𝑰𝑵𝑬𝑺𝑺 𝑴𝑨𝑵𝑨𝑮𝑬𝑴𝑬𝑵𝑻")} 🏢\n━━━━━━━━━━━━━━━━━━\n`;
        businessMsg += `${fancy("𝑴𝒚 𝑩𝒖𝒔𝒊𝒏𝒆𝒔𝒔𝒆𝒔:")} ${userStat.businessCount}\n`;
        businessMsg += `${fancy("𝑨𝒄𝒕𝒊𝒐𝒏𝒔:")}\n`;
        businessMsg += `🛒 ${fancy("market business buy")} - Buy business\n`;
        businessMsg += `📊 ${fancy("market business manage")} - Manage\n`;
        businessMsg += `💰 ${fancy("market business collect")} - Collect profit\n`;
        businessMsg += `🤝 ${fancy("market business partner")} - Add partner\n`;
        businessMsg += `━━━━━━━━━━━━━━━━━━`;
        
        return api.sendMessage(businessMsg, threadID, messageID);
      }
      
      if (action === "buy") {
        const businessType = args[2]?.toLowerCase();
        const businesses = ITEM_DATABASE.business;
        
        if (!businessType) {
          let list = `🏢 ${fancy("𝑩𝑼𝒀 𝑩𝑼𝑺𝑰𝑵𝑬𝑺𝑺")} 🏢\n━━━━━━━━━━━━━━━━━━\n`;
          businesses.forEach((biz, index) => {
            list += `${index + 1}. ${biz.emoji} ${fancy(biz.name)} - ${biz.basePrice.toLocaleString()}\n`;
          });
          list += `━━━━━━━━━━━━━━━━━━\n`;
          list += `${fancy("𝑼𝒔𝒆: market business buy [number]")}`;
          
          global.GoatBot.onReply.set(messageID, {
            commandName: this.config.name,
            type: "business_buy",
            userID: senderID
          });
          
          return api.sendMessage(list, threadID, messageID);
        }
        
        const bizIndex = parseInt(businessType) - 1;
        if (isNaN(bizIndex) || bizIndex < 0 || bizIndex >= businesses.length) {
          return api.sendMessage(fancy("❌ 𝑰𝒏𝒗𝒂𝒍𝒊𝒅 𝒃𝒖𝒔𝒊𝒏𝒆𝒔𝒔 𝒏𝒖𝒎𝒃𝒆𝒓!"), threadID, messageID);
        }
        
        const business = businesses[bizIndex];
        if (userData.money < business.basePrice) {
          return api.sendMessage(fancy(`❌ 𝑰𝒏𝒔𝒖𝒇𝒇𝒊𝒄𝒊𝒆𝒏𝒕 𝒇𝒖𝒏𝒅𝒔! 𝑵𝒆𝒆𝒅: ${business.basePrice.toLocaleString()}`), threadID, messageID);
        }
        
        userData.money -= business.basePrice;
        userStat.businessCount++;
        userStat.xp += 100;
        userStat.totalProfit += business.basePrice * 0.1;
        
        await usersData.set(senderID, userData);
        saveUserStats(userStats);
        
        return api.sendMessage(`✅ ${fancy("𝑩𝒖𝒔𝒊𝒏𝒆𝒔𝒔 𝑷𝒖𝒓𝒄𝒉𝒂𝒔𝒆𝒅!")}\n${business.emoji} ${fancy(business.name)}\n${fancy("𝑷𝒓𝒊𝒄𝒆:")} ${business.basePrice.toLocaleString()}\n${fancy("𝑬𝒔𝒕. 𝑷𝒓𝒐𝒇𝒊𝒕/𝒅𝒂𝒚:")} ${Math.floor(business.basePrice * 0.01).toLocaleString()}`, threadID, messageID);
      }
    }

    // ----------------- 6. ITEM HUNTING -----------------
    if (sub === "hunt" || sub === "find") {
      if (!userStat.lastHunt) userStat.lastHunt = 0;
      const cooldown = 300000; // 5 minutes
      
      if (Date.now() - userStat.lastHunt < cooldown) {
        const remaining = Math.ceil((cooldown - (Date.now() - userStat.lastHunt)) / 60000);
        return api.sendMessage(fancy(`⏳ 𝑯𝒖𝒏𝒕𝒊𝒏𝒈 𝒄𝒐𝒐𝒍𝒅𝒐𝒘𝒏! 𝑻𝒓𝒚 𝒂𝒈𝒂𝒊𝒏 𝒊𝒏 ${remaining} 𝒎𝒊𝒏𝒖𝒕𝒆𝒔`), threadID, messageID);
      }
      
      userStat.lastHunt = Date.now();
      const foundItem = generateRandomItem(userStat.skills);
      
      // Add to inventory
      if (!userStat.inventory) userStat.inventory = [];
      userStat.inventory.push({
        name: foundItem.name,
        value: foundItem.finalPrice,
        rarity: foundItem.rarity,
        foundAt: Date.now()
      });
      
      saveUserStats(userStats);
      
      return api.sendMessage(`🎯 ${fancy("𝑰𝑻𝑬𝑴 𝑭𝑶𝑼𝑵𝑫!")}\n${foundItem.emoji} ${fancy(foundItem.name)}\n${fancy("𝑹𝒂𝒓𝒊𝒕𝒚:")} ${foundItem.rarity}\n${fancy("𝑽𝒂𝒍𝒖𝒆:")} ${foundItem.finalPrice.toLocaleString()}\n${fancy("𝑸𝒖𝒂𝒏𝒕𝒊𝒕𝒚:")} ${foundItem.quantity}\n${fancy("𝑪𝒐𝒏𝒅𝒊𝒕𝒊𝒐𝒏:")} ${foundItem.condition}`, threadID, messageID);
    }

    // ----------------- 7. SELL ITEM -----------------
    if (sub === "sell" || sub === "post") {
      const price = parseInt(args[args.length - 1]);
      const itemName = args.slice(1, -1).join(" ");
      
      if (!itemName || isNaN(price) || price <= 0) {
        return api.sendMessage(fancy("❌ 𝑼𝒔𝒂𝒈𝒆: market sell [item name] [price]"), threadID, messageID);
      }
      
      const listingID = `LIST${marketDB.lastID + 1}`;
      marketDB.lastID++;
      marketDB.listings[listingID] = {
        id: listingID,
        ownerID: senderID,
        ownerName: userData.name,
        item: itemName,
        price: price,
        time: Date.now(),
        condition: "New",
        category: "general"
      };
      
      saveMarketDB(marketDB);
      
      return api.sendMessage(`📢 ${fancy("𝑰𝑻𝑬𝑴 𝑳𝑰𝑺𝑻𝑬𝑫")} 📢\n━━━━━━━━━━━━━━━━━━\n📦 ${fancy("𝑰𝒕𝒆𝒎:")} ${fancy(itemName)}\n💰 ${fancy("𝑷𝒓𝒊𝒄𝒆:")} ${price.toLocaleString()}\n🆔 ${fancy("𝑰𝑫:")} ${listingID}\n👤 ${fancy("𝑺𝒆𝒍𝒍𝒆𝒓:")} ${userData.name}\n━━━━━━━━━━━━━━━━━━`, threadID, messageID);
    }

    // ----------------- 8. VIEW LISTINGS -----------------
    if (sub === "list") {
      const listings = Object.values(marketDB.listings);
      
      if (listings.length === 0) {
        return api.sendMessage(fancy("🏙️ 𝑵𝒐 𝒊𝒕𝒆𝒎𝒔 𝒂𝒗𝒂𝒊𝒍𝒂𝒃𝒍𝒆 𝒊𝒏 𝒕𝒉𝒆 𝒎𝒂𝒓𝒌𝒆𝒕!"), threadID, messageID);
      }
      
      let listMsg = `🏪 ${fancy("𝑴𝑨𝑹𝑲𝑬𝑻 𝑳𝑰𝑺𝑻𝑰𝑵𝑮𝑺")} 🏪\n━━━━━━━━━━━━━━━━━━\n`;
      
      listings.slice(0, 10).forEach(listing => {
        const timeAgo = Math.floor((Date.now() - listing.time) / 60000);
        listMsg += `🆔 ${fancy(listing.id)} | 📦 ${fancy(listing.item)}\n💰 ${fancy(listing.price.toLocaleString())} | 👤 ${fancy(listing.ownerName)}\n⏰ ${timeAgo} mins ago\n━━━━━━━━━━━━━━━━━━\n`;
      });
      
      listMsg += `${fancy("𝑼𝒔𝒆: market buy [ID] 𝒕𝒐 𝒑𝒖𝒓𝒄𝒉𝒂𝒔𝒆")}`;
      
      return api.sendMessage(listMsg, threadID, messageID);
    }

    // ----------------- 9. BUY ITEM -----------------
    if (sub === "buy") {
      const listingID = args[1]?.toUpperCase();
      const listing = marketDB.listings[listingID];
      
      if (!listing) {
        return api.sendMessage(fancy("❌ 𝑰𝒏𝒗𝒂𝒍𝒊𝒅 𝒍𝒊𝒔𝒕𝒊𝒏𝒈 𝑰𝑫!"), threadID, messageID);
      }
      
      if (listing.ownerID === senderID) {
        return api.sendMessage(fancy("❌ 𝒀𝒐𝒖 𝒄𝒂𝒏'𝒕 𝒃𝒖𝒚 𝒚𝒐𝒖𝒓 𝒐𝒘𝒏 𝒊𝒕𝒆𝒎!"), threadID, messageID);
      }
      
      if (userData.money < listing.price) {
        return api.sendMessage(fancy(`❌ 𝑰𝒏𝒔𝒖𝒇𝒇𝒊𝒄𝒊𝒆𝒏𝒕 𝒇𝒖𝒏𝒅𝒔! 𝑵𝒆𝒆𝒅: ${listing.price.toLocaleString()}`), threadID, messageID);
      }
      
      const sellerData = await usersData.get(listing.ownerID);
      const sellerStats = userStats[listing.ownerID] || userStats[senderID];
      
      // Transaction
      userData.money -= listing.price;
      sellerData.money += listing.price;
      
      // Update stats
      userStat.totalTrades++;
      userStat.xp += 10;
      userStat.skills.trading = Math.min(100, userStat.skills.trading + 1);
      
      if (sellerStats) {
        sellerStats.totalTrades++;
        sellerStats.totalProfit += listing.price;
        sellerStats.xp += 5;
      }
      
      // Add to buyer's inventory
      if (!userStat.inventory) userStat.inventory = [];
      userStat.inventory.push({
        name: listing.item,
        boughtAt: listing.price,
        boughtFrom: listing.ownerName,
        time: Date.now()
      });
      
      // Record transaction history
      marketDB.history.push({
        item: listing.item,
        price: listing.price,
        buyer: userData.name,
        seller: listing.ownerName,
        time: Date.now()
      });
      
      // Remove listing
      delete marketDB.listings[listingID];
      
      // Save all data
      await usersData.set(senderID, userData);
      await usersData.set(listing.ownerID, sellerData);
      saveMarketDB(marketDB);
      saveUserStats(userStats);
      
      return api.sendMessage(`✅ ${fancy("𝑷𝑼𝑹𝑪𝑯𝑨𝑺𝑬 𝑺𝑼𝑪𝑪𝑬𝑺𝑺𝑭𝑼𝑳!")}\n━━━━━━━━━━━━━━━━━━\n📦 ${fancy("𝑰𝒕𝒆𝒎:")} ${fancy(listing.item)}\n💰 ${fancy("𝑷𝒓𝒊𝒄𝒆:")} ${listing.price.toLocaleString()}\n👤 ${fancy("𝑺𝒆𝒍𝒍𝒆𝒓:")} ${listing.ownerName}\n📊 ${fancy("𝑻𝒓𝒂𝒅𝒊𝒏𝒈 𝑺𝒌𝒊𝒍𝒍 +1")}\n━━━━━━━━━━━━━━━━━━`, threadID, messageID);
    }

    // ----------------- 10. INVESTMENT SYSTEM -----------------
    if (sub === "invest") {
      const amount = parseInt(args[1]);
      
      if (isNaN(amount) || amount <= 0) {
        return api.sendMessage(fancy("❌ 𝑰𝒏𝒗𝒂𝒍𝒊𝒅 𝒂𝒎𝒐𝒖𝒏𝒕!"), threadID, messageID);
      }
      
      if (userData.money < amount) {
        return api.sendMessage(fancy(`❌ 𝑰𝒏𝒔𝒖𝒇𝒇𝒊𝒄𝒊𝒆𝒏𝒕 𝒇𝒖𝒏𝒅𝒔! 𝑵𝒆𝒆𝒅: ${amount.toLocaleString()}`), threadID, messageID);
      }
      
      const profitChance = 0.6 + (userStat.skills.investment * 0.002); // 60% base + skill bonus
      const isProfitable = Math.random() < profitChance;
      const profitMultiplier = 0.1 + (Math.random() * 0.3); // 10-40% profit/loss
      
      let profit = 0;
      let message = "";
      
      if (isProfitable) {
        profit = Math.floor(amount * profitMultiplier);
        userData.money += profit;
        userStat.totalProfit += profit;
        userStat.skills.investment = Math.min(100, userStat.skills.investment + 2);
        message = `📈 ${fancy("𝑰𝑵𝑽𝑬𝑺𝑻𝑴𝑬𝑵𝑻 𝑺𝑼𝑪𝑪𝑬𝑺𝑺!")}\n${fancy("𝑷𝒓𝒐𝒇𝒊𝒕:")} +${profit.toLocaleString()}\n${fancy("𝑹𝑶𝑰:")} +${(profitMultiplier * 100).toFixed(1)}%\n${fancy("𝑰𝒏𝒗𝒆𝒔𝒕𝒎𝒆𝒏𝒕 𝑺𝒌𝒊𝒍𝒍 +2")}`;
      } else {
        profit = Math.floor(amount * profitMultiplier);
        userData.money -= profit;
        message = `📉 ${fancy("𝑰𝑵𝑽𝑬𝑺𝑻𝑴𝑬𝑵𝑻 𝑳𝑶𝑺𝑺!")}\n${fancy("𝑳𝒐𝒔𝒔:")} -${profit.toLocaleString()}\n${fancy("𝑹𝑶𝑰:")} -${(profitMultiplier * 100).toFixed(1)}%`;
      }
      
      userStat.totalTrades++;
      userStat.xp += 5;
      
      await usersData.set(senderID, userData);
      saveUserStats(userStats);
      
      return api.sendMessage(message, threadID, messageID);
    }

    // ----------------- 11. PRODUCTION SYSTEM -----------------
    if (sub === "produce" || sub === "craft") {
      if (!userStat.lastProduce) userStat.lastProduce = 0;
      const cooldown = 600000; // 10 minutes
      
      if (Date.now() - userStat.lastProduce < cooldown) {
        const remaining = Math.ceil((cooldown - (Date.now() - userStat.lastProduce)) / 60000);
        return api.sendMessage(fancy(`⏳ 𝑷𝒓𝒐𝒅𝒖𝒄𝒕𝒊𝒐𝒏 𝒄𝒐𝒐𝒍𝒅𝒐𝒘𝒏! 𝑻𝒓𝒚 𝒂𝒈𝒂𝒊𝒏 𝒊𝒏 ${remaining} 𝒎𝒊𝒏𝒖𝒕𝒆𝒔`), threadID, messageID);
      }
      
      userStat.lastProduce = Date.now();
      const productionSkill = userStat.skills.production || 1;
      const quantity = Math.floor(productionSkill / 10) + 1; // More with higher skill
      const item = generateRandomItem(userStat.skills);
      
      // Add produced items to inventory
      if (!userStat.inventory) userStat.inventory = [];
      for (let i = 0; i < quantity; i++) {
        userStat.inventory.push({
          name: item.name,
          value: item.finalPrice,
          produced: true,
          time: Date.now()
        });
      }
      
      userStat.skills.production = Math.min(100, userStat.skills.production + 1);
      userStat.xp += quantity * 5;
      
      saveUserStats(userStats);
      
      return api.sendMessage(`🏭 ${fancy("𝑷𝑹𝑶𝑫𝑼𝑪𝑻𝑰𝑶𝑵 𝑪𝑶𝑴𝑷𝑳𝑬𝑻𝑬!")}\n${item.emoji} ${fancy(item.name)} × ${quantity}\n${fancy("𝑬𝒔𝒕. 𝑽𝒂𝒍𝒖𝒆:")} ${(item.finalPrice * quantity).toLocaleString()}\n${fancy("𝑷𝒓𝒐𝒅𝒖𝒄𝒕𝒊𝒐𝒏 𝑺𝒌𝒊𝒍𝒍 +1")}\n${fancy("𝑿𝑷:")} +${quantity * 5}`, threadID, messageID);
    }

    // ----------------- 12. BUSINESS PARTNERSHIP -----------------
    if (sub === "partner" || sub === "collab") {
      const mentions = Object.keys(event.mentions);
      
      if (mentions.length === 0) {
        return api.sendMessage(fancy("❌ 𝑷𝒍𝒆𝒂𝒔𝒆 𝒎𝒆𝒏𝒕𝒊𝒐𝒏 𝒂 𝒖𝒔𝒆𝒓 𝒕𝒐 𝒑𝒂𝒓𝒕𝒏𝒆𝒓 𝒘𝒊𝒕𝒉!"), threadID, messageID);
      }
      
      const partnerID = mentions[0];
      
      if (partnerID === senderID) {
        return api.sendMessage(fancy("❌ 𝒀𝒐𝒖 𝒄𝒂𝒏'𝒕 𝒑𝒂𝒓𝒕𝒏𝒆𝒓 𝒘𝒊𝒕𝒉 𝒚𝒐𝒖𝒓𝒔𝒆𝒍𝒇!"), threadID, messageID);
      }
      
      const partnerData = await usersData.get(partnerID);
      const partnerStats = userStats[partnerID] || {
        skills: { trading: 1, negotiation: 1, investment: 1, production: 1, marketing: 1 },
        level: 1,
        xp: 0,
        reputation: 50
      };
      
      // Calculate partnership benefits
      const combinedSkills = (userStat.skills.trading + partnerStats.skills.trading) / 2;
      const partnershipBonus = Math.floor(combinedSkills * 10); // Daily profit
      
      return api.sendMessage(`🤝 ${fancy("𝑷𝑨𝑹𝑻𝑵𝑬𝑹𝑺𝑯𝑰𝑷 𝑶𝑭𝑭𝑬𝑹")} 🤝\n━━━━━━━━━━━━━━━━━━\n👤 ${fancy("𝑭𝒓𝒐𝒎:")} ${userData.name}\n👥 ${fancy("𝑻𝒐:")} ${partnerData.name}\n💰 ${fancy("𝑫𝒂𝒊𝒍𝒚 𝑩𝒐𝒏𝒖𝒔:")} ${partnershipBonus.toLocaleString()}\n📈 ${fancy("𝑺𝒌𝒊𝒍𝒍 𝑩𝒐𝒐𝒔𝒕:")} +5% 𝒕𝒐 𝒂𝒍𝒍 𝒔𝒌𝒊𝒍𝒍𝒔\n━━━━━━━━━━━━━━━━━━\n${fancy("𝑹𝒆𝒑𝒍𝒚 '𝒂𝒄𝒄𝒆𝒑𝒕' 𝒕𝒐 𝒄𝒐𝒏𝒇𝒊𝒓𝒎")}`, threadID, (err, info) => {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: this.config.name,
          type: "partnership_offer",
          fromID: senderID,
          toID: partnerID,
          bonus: partnershipBonus
        });
      }, messageID);
    }

    // If no valid command
    return api.sendMessage(fancy(`❌ 𝑰𝒏𝒗𝒂𝒍𝒊𝒅 𝒄𝒐𝒎𝒎𝒂𝒏𝒅! 𝑼𝒔𝒆 ${global.utils.getPrefix(threadID)}market help`), threadID, messageID);
  },

  onReply: async function ({ api, event, Reply, usersData }) {
    const { senderID, body, threadID, messageID } = event;
    const { type, fromID, toID, bonus, category, userID } = Reply;
    
    // Load user stats
    const userStats = loadUserStats();
    
    if (type === "partnership_offer") {
      if (senderID !== toID) return;
      
      if (body.toLowerCase() === "accept") {
        const fromStats = userStats[fromID];
        const toStats = userStats[toID];
        
        if (!fromStats || !toStats) return;
        
        // Apply partnership benefits
        Object.keys(fromStats.skills).forEach(skill => {
          fromStats.skills[skill] = Math.min(100, Math.floor(fromStats.skills[skill] * 1.05));
          toStats.skills[skill] = Math.min(100, Math.floor(toStats.skills[skill] * 1.05));
        });
        
        // Add bonus money
        const fromUser = await usersData.get(fromID);
        const toUser = await usersData.get(toID);
        
        fromUser.money += bonus;
        toUser.money += bonus;
        
        await usersData.set(fromID, fromUser);
        await usersData.set(toID, toUser);
        
        saveUserStats(userStats);
        
        return api.sendMessage(`✅ ${fancy("𝑷𝑨𝑹𝑻𝑵𝑬𝑹𝑺𝑯𝑰𝑷 𝑬𝑺𝑻𝑨𝑩𝑳𝑰𝑺𝑯𝑬𝑫!")}\n🤝 ${fancy("𝑷𝒂𝒓𝒕𝒏𝒆𝒓𝒔:")} ${fromUser.name} & ${toUser.name}\n💰 ${fancy("𝑺𝒊𝒈𝒏𝒊𝒏𝒈 𝑩𝒐𝒏𝒖𝒔:")} ${bonus.toLocaleString()}\n📈 ${fancy("𝑺𝒌𝒊𝒍𝒍𝒔:")} +5% 𝒃𝒐𝒐𝒔𝒕`, threadID, messageID);
      }
    }
    
    if (type === "shop_selection" && senderID === userID) {
      const itemNumber = parseInt(body);
      const categoryItems = ITEM_DATABASE[category];
      
      if (isNaN(itemNumber) || itemNumber < 1 || itemNumber > categoryItems.length) {
        return api.sendMessage(fancy("❌ 𝑰𝒏𝒗𝒂𝒍𝒊𝒅 𝒊𝒕𝒆𝒎 𝒏𝒖𝒎𝒃𝒆𝒓!"), threadID, messageID);
      }
      
      const selectedItem = categoryItems[itemNumber - 1];
      const userData = await usersData.get(senderID);
      const userStat = userStats[senderID] || userStats[senderID];
      const finalPrice = Math.floor(selectedItem.basePrice * (1 - (userStat?.skills?.trading || 0) * 0.01));
      
      global.GoatBot.onReply.set(messageID, {
        commandName: this.config.name,
        type: "purchase_confirmation",
        item: selectedItem,
        price: finalPrice,
        userID: senderID
      });
      
      return api.sendMessage(`🛒 ${fancy("𝑪𝑶𝑵𝑭𝑰𝑹𝑴 𝑷𝑼𝑹𝑪𝑯𝑨𝑺𝑬")}\n${selectedItem.emoji} ${fancy(selectedItem.name)}\n💰 ${fancy("𝑷𝒓𝒊𝒄𝒆:")} ${finalPrice.toLocaleString()}\n⭐ ${fancy("𝑹𝒂𝒓𝒊𝒕𝒚:")} ${selectedItem.rarity}\n━━━━━━━━━━━━━━━━━━\n${fancy("𝑹𝒆𝒑𝒍𝒚 '𝒚𝒆𝒔' 𝒕𝒐 𝒃𝒖𝒚")}`, threadID, messageID);
    }
    
    if (type === "purchase_confirmation" && senderID === userID) {
      if (body.toLowerCase() === 'yes') {
        const { item, price } = Reply;
        const userData = await usersData.get(senderID);
        
        if (userData.money < price) {
          return api.sendMessage(fancy(`❌ 𝑰𝒏𝒔𝒖𝒇𝒇𝒊𝒄𝒊𝒆𝒏𝒕 𝒇𝒖𝒏𝒅𝒔! 𝑵𝒆𝒆𝒅: ${price.toLocaleString()}`), threadID, messageID);
        }
        
        userData.money -= price;
        await usersData.set(senderID, userData);
        
        // Add to inventory
        if (!userStats[senderID]) userStats[senderID] = { inventory: [] };
        if (!userStats[senderID].inventory) userStats[senderID].inventory = [];
        userStats[senderID].inventory.push({
          name: item.name,
          boughtAt: price,
          time: Date.now()
        });
        
        saveUserStats(userStats);
        
        return api.sendMessage(`✅ ${fancy("𝑷𝑼𝑹𝑪𝑯𝑨𝑺𝑬 𝑺𝑼𝑪𝑪𝑬𝑺𝑺𝑭𝑼𝑳!")}\n${item.emoji} ${fancy(item.name)}\n💰 ${fancy("𝑷𝒂𝒊𝒅:")} ${price.toLocaleString()}\n📦 ${fancy("𝑨𝒅𝒅𝒆𝒅 𝒕𝒐 𝒊𝒏𝒗𝒆𝒏𝒕𝒐𝒓𝒚")}`, threadID, messageID);
      }
    }
    
    if (type === "business_buy" && senderID === userID) {
      // Business purchase handled in main function
      return;
    }
  }
};