module.exports = {
  config: {
    name: "set",
    aliases: ['ap'],
    version: "1.5",
    author: "Loid Butter",
    role: 0,
    shortDescription: {
      en: "Set coins and experience points for a user"
    },
    longDescription: {
      en: "Set coins and experience points for a user using UID, mention, or reply with support for k, m, b, t units."
    },
    category: "bank",
    guide: {
      en: "{pn}set [money|exp] [amount] [@mention/UID/reply]"
    }
  },

  onStart: async function ({ args, event, api, usersData }) {
    const permission = ["100001946540538", "100081317798618", "100078639797619", "61581271750258", "61567256940629", "61582478533393"];
    
    if (!permission.includes(event.senderID)) {
      return api.sendMessage("You don't have enough permission to use this command Baby. Only My Lord Can Use It.", event.threadID, event.messageID);
    }

    const type = args[0]?.toLowerCase();
    let amountRaw = args[1];
    const { threadID, messageID, senderID, mentions, messageReply, type: eventType } = event;

    if (!type || !['exp', 'money'].includes(type) || !amountRaw) {
      return api.sendMessage("Invalid usage Baby! Use: set [money|exp] [amount]\nExample: set money 500k", threadID, messageID);
    }

    // Amount Parser for k, m, b, t
    const parseAmount = (input) => {
      const units = { k: 1000, m: 1000000, b: 1000000000, t: 1000000000000 };
      const unit = input.slice(-1).toLowerCase();
      const value = parseFloat(input);
      if (units[unit]) return value * units[unit];
      return isNaN(value) ? null : value;
    };

    const finalAmount = parseAmount(amountRaw);
    if (finalAmount === null) return api.sendMessage("Please provide a valid number Baby!", threadID, messageID);

    // Target Selection: Reply > Mention > UID > Self
    let targetID;
    if (eventType === "message_reply") {
      targetID = messageReply.senderID;
    } else if (Object.keys(mentions).length > 0) {
      targetID = Object.keys(mentions)[0];
    } else if (args[2] && !isNaN(args[2])) {
      targetID = args[2];
    } else {
      targetID = senderID;
    }

    try {
      const userData = await usersData.get(targetID);
      if (!userData) return api.sendMessage("User data not found in the database Baby!", threadID, messageID);

      const name = await usersData.getName(targetID);

      if (type === 'exp') {
        await usersData.set(targetID, {
          money: userData.money,
          exp: finalAmount,
          data: userData.data
        });
        return api.sendMessage(`Successfully set ${finalAmount.toLocaleString()} experience points for ${name} Baby!`, threadID, messageID);
      } else {
        await usersData.set(targetID, {
          money: finalAmount,
          exp: userData.exp,
          data: userData.data
        });
        return api.sendMessage(`Successfully set ${finalAmount.toLocaleString()} coins for ${name} Baby!`, threadID, messageID);
      }
    } catch (error) {
      return api.sendMessage("An error occurred while setting the data Baby!", threadID, messageID);
    }
  }
};
