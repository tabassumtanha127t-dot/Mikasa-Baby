const moment = require("moment-timezone");

function fancy(text) {
    const map = {'a':'𝐚','b':'𝐛','c':'𝐜','d':'𝐝','e':'𝐞','f':'𝐟','g':'𝐠','h':'𝐡','i':'𝐢','j':'𝐣','k':'𝐤','l':'𝐥','m':'𝐦','n':'𝐧','o':'𝐨','p':'𝐩','q':'𝐪','r':'𝐫','s':'𝐬','t':'𝐭','u':'𝐮','v':'𝐯','w':'𝐰','x':'𝐱','y':'𝐲','z':'𝐳','A':'𝐀','B':'𝐁','C':'𝐂','D':'𝐃','E':'𝐄','F':'𝐅','G':'𝐆','H':'𝐇','I':'𝐢','J':'𝐉','K':'𝐊','L':'𝐋','M':'𝐌','N':'𝐍','O':'𝐎','P':'𝐏','Q':'𝐐','R':'𝐑','S':'𝐬','T':'𝐭','U':'𝐮','V':'𝐯','W':'𝐰','X':'𝐱','Y':'𝐲','Z':'𝐙','0':'𝟎','1':'𝟏','2':'𝟐','3':'𝟑','4':'𝟒','5':'𝟓','6':'𝟔','7':'𝟕','8':'𝟖','9':'𝟗','$':'$','+':'+'};
    return text.toString().split('').map(char => map[char] || char).join('');
}

function formatMoney(amount) {
    const units = [{ v: 1e12, s: "𝐓" }, { v: 1e9, s: "𝐁" }, { v: 1e6, s: "𝐌" }, { v: 1e3, s: "𝐊" }];
    for (let u of units) if (Math.abs(amount) >= u.v) return fancy((amount / u.v).toFixed(2)) + u.s;
    return fancy(Math.floor(amount).toLocaleString());
}

module.exports = {
    config: {
        name: "daily",
        version: "4.0",
        author: "Saif & Gemini",
        countDown: 5,
        role: 0,
        description: "Clean daily rewards Baby",
        category: "game"
    },

    onStart: async function ({ api, event, usersData }) {
        const { senderID, threadID, messageID } = event;
        const now = moment.tz("Asia/Dhaka");
        const today = now.format("DD/MM/YYYY");
        
        const userData = await usersData.get(senderID);
        if (!userData.data) userData.data = {};

        if (userData.data.lastTimeGetReward === today) {
            return api.sendMessage(fancy("❌ 𝐘𝐨𝐮 𝐚𝐥𝐫𝐞𝐚𝐝𝐲 𝐜𝐥𝐚𝐢𝐦𝐞𝐝 𝐲𝐨𝐮𝐫 𝐫𝐞𝐰𝐚𝐫𝐝 𝐭𝐨𝐝𝐚𝐲 Baby."), threadID, messageID);
        }

        const dayIndex = new Date().getDay() || 7;
        const getCoin = Math.floor(1000 * (1.2 ** (dayIndex - 1)));
        const getExp = Math.floor(250 * (1.2 ** (dayIndex - 1)));

        userData.data.lastTimeGetReward = today;
        userData.money = (userData.money || 0) + getCoin;
        userData.exp = (userData.exp || 0) + getExp;
        await usersData.set(senderID, userData);

        // One line clean format Baby
        return api.sendMessage(fancy(`🎁 𝐃𝐚𝐢𝐥𝐲: +$${formatMoney(getCoin)} | +${getExp} 𝐄𝐱𝐩 | 𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲 Baby.`), threadID, messageID);
    }
};
