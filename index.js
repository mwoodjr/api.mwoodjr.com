const express = require('express');
const Topgg = require("@top-gg/sdk");
const app = express();
require('dotenv').config();
const webhook = new Topgg.Webhook(process.env.TOPGG)
const port = process.env.PORT || 8080
const db = require('monk')(process.env.MONGO_URL);
const fs = require('fs');

const stats = db.get('servers');
const users = db.get('users')

app.use(express.json());
app.use(require('cors')());

app.get('/api/deeznuts/guild', async (req, res) => {
    const id = req.query.id;
    if (req.query.token !== process.env.TOKEN || !req.query.id) {
        res.status(401);
        res.json({
            error: 401,
            response: "Access Denied"
        })
    } else {
        res.status(200)
        stats.findOne({serverId: id}).then((data) => {
            res.json(data)
        })
    }
})

app.get('/api/deeznuts/user', async (req, res) => {
    const id = req.query.id;
    if (req.query.token !== process.env.TOKEN || !req.query.id) {
        res.status(401);
        res.json({
            error: 401,
            response: "Access Denied"
        })
    } else {
        res.status(200);
        stats.find({serverOwner: `${id}`}).then((data) => {
            res.status(200);
            res.json(data)
        })
    }
})

app.get('/api/deeznuts/guildcount', async (req, res) => {
    stats.count({inServer: true}).then((count) => {
        res.json({
            guildCount: count
        })
    })
});

app.post("/api/deeznuts/dblwebhook", webhook.listener(vote => {
    try {
        users.findOneAndUpdate({userId: vote.user}, { $inc: { upvoteCount: 1 } })
    } catch {
        console.log('failed to find and update user data on upvote for user ' + vote.user)
    }
}))

app.listen(port, () => {
    console.log(`Server at http://localhost:${port}`)
});