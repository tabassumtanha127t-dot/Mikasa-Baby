// ✨ Bold Sans-Serif Font Baby (same as slot/spin)
const fancy = (text) => {
  if (text === undefined || text === null) return "";
  const map = {
    'a': '𝐚','b': '𝐛','c': '𝐜','d': '𝐝','e': '𝐞','f': '𝐟','g': '𝐠','h': '𝐡','i': '𝐢','j': '𝐣','k': '𝐤','l': '𝐥','m': '𝐦','n': '𝐧','o': '𝐨','p': '𝐩','q': '𝐪','r': '𝐫','s': '𝐬','t': '𝐭','u': '𝐮','v': '𝐯','w': '𝐰','x': '𝐱','y': '𝐲','z': '𝐳',
    'A': '𝐀','B': '𝐁','C': '𝐂','D': '𝐃','E': '𝐄','F': '𝐅','G': '𝐆','H': '𝐇','I': '𝐈','J': '𝐉','K': '𝐊','L': '𝐋','M': '𝐌','N': '𝐍','O': '𝐎','P': '𝐏','Q': '𝐐','R': '𝐑','S': '𝐒','T': '𝐓','U': '𝐔','V': '𝐕','W': '𝐖','X': '𝐗','Y': '𝐘','Z': '𝐙',
    '0': '𝟎','1': '𝟏','2': '𝟐','3': '𝟑','4': '𝟒','5': '𝟓','6': '𝟔','7': '𝟕','8': '𝟖','9': '𝟗', '.': '.', ':': ':'
  };
  return String(text).split('').map(char => map[char] || char).join('');
};

module.exports = {
  config: {
    name: "help2",
    version: "3.0",
    author: "Saif / Gemini Fix",
    role: 0,
    category: "system",
    description: "💖 Interactive category help with love font Baby"
  },

  onStart: async function ({ api, event, args, role }) {
    const { threadID, messageID } = event;
    const prefix = global.utils.getPrefix(threadID);
    const commands = global.GoatBot.commands;
    const categories = {};

    for (const [name, value] of commands) {
      if (value.config.role > role) continue;
      const cat = value.config.category || "Uncategorized";
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(name);
    }

    const sortedCats = Object.keys(categories).sort();
    const input = args.join(" ").toLowerCase();

    // Direct category name
    if (input) {
      const categoryName = sortedCats.find(c => c.toLowerCase() === input);
      if (categoryName) {
        let msg = `╭───✦ ${fancy(categoryName.toUpperCase())} ✦───╮\n`;
        const cmds = categories[categoryName].sort();
        for (let i = 0; i < cmds.length; i += 2) {
          const row = cmds.slice(i, i + 2).map(x => `⭔ ${fancy(x)}`).join("   ");
          msg += `│ ${row}\n`;
        }
        msg += "╰────────────────────╯\n";
        msg += `💖 ${fancy("Powered by Mikasa")}`;
        return api.sendMessage(msg, threadID, messageID);
      }
    }

    let helpMsg = `╭───✦ ${fancy("HELP CATEGORIES")} ✦───╮\n`;
    sortedCats.forEach((cat, index) => {
      helpMsg += `│ ${index + 1}． ${fancy(cat.toUpperCase())}\n`;
    });
    helpMsg += "╰────────────────────╯\n";
    helpMsg += `📝 ${fancy("Reply with serial or category name")}\n`;
    helpMsg += `⏳ ${fancy("Auto unsend after 2 minutes")}`;

    return api.sendMessage(helpMsg, threadID, (err, info) => {
      if (err) return;
      
      global.GoatBot.onReply.set(info.messageID, {
        commandName: this.config.name,
        messageID: info.messageID,
        author: event.senderID,
        categories: categories,
        sortedCats: sortedCats
      });

      setTimeout(() => { api.unsendMessage(info.messageID); }, 120000);
    }, messageID);
  },

  onReply: async function ({ api, event, Reply }) {
    const { threadID, messageID, body, senderID } = event;
    if (senderID != Reply.author) return;

    let categoryName;
    const num = parseInt(body);

    if (!isNaN(num) && num > 0 && num <= Reply.sortedCats.length) {
      categoryName = Reply.sortedCats[num - 1];
    } else {
      categoryName = Reply.sortedCats.find(c => c.toLowerCase() === body.toLowerCase());
    }

    if (!categoryName) return;

    const cmds = Reply.categories[categoryName].sort();
    let msg = `╭───✦ ${fancy(categoryName.toUpperCase())} ✦───╮\n`;
    for (let i = 0; i < cmds.length; i += 2) {
      const row = cmds.slice(i, i + 2).map(x => `⭔ ${fancy(x)}`).join("   ");
      msg += `│ ${row}\n`;
    }
    msg += "╰────────────────────╯\n";
    msg += `✨ ${fancy("Total Commands")}: ${cmds.length}\n`;
    msg += `💖 ${fancy("Powered by Mikasa")}`;

    // Unsend reply and edit the original category list message
    api.unsendMessage(messageID);
    return api.editMessage(msg, Reply.messageID);
  }
};
