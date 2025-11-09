const Tesseract = require('tesseract.js');
const brokerList = require('./db.json'); // Replace with API integration later

async function verifyScreenshot(base64Image){
    const buffer = Buffer.from(base64Image, 'base64');
    const { data: { text } } = await Tesseract.recognize(buffer, 'eng');
    
    const found = brokerList.users.find(u => text.includes(u.email));
    
    if(found) return {verified: true, user: found};
    return {verified: false};
}

module.exports = { verifyScreenshot };
