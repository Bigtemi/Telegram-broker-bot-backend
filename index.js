require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { verifyScreenshot } = require('./checkReferral');

const app = express();
app.use(bodyParser.json());
app.use(require('cors')());

app.get('/', (req, res) => res.send('Bot backend is running!'));

app.post('/verify', async (req, res) => {
    const { userId, screenshotBase64 } = req.body;
    if(!userId || !screenshotBase64) return res.status(400).send({error: "Missing data"});
    
    try {
        const result = await verifyScreenshot(screenshotBase64);
        if(result.verified) {
            res.send({status: "verified", message: "User approved"});
        } else {
            res.send({status: "not_verified", message: "User not found in broker list"});
        }
    } catch(e){
        console.log(e);
        res.status(500).send({error: "Verification failed"});
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
