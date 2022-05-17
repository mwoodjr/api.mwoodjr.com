const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 8080
const db = require('monk')(process.env.MONGO_URL);
const fs = require('fs');

const stats = db.get('servers');
const discordstats = db.get('api')

app.use(express.json());
app.use(require('cors')());

app.get('/api/deeznuts/guild', async (req, res) => {
    const id = req.query.id;
    if (req.query.token !== process.env.SECRET || !req.query.id) {
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
    if (req.query.token !== process.env.SECRET || !req.query.id) {
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

app.post('/api/deeznuts', async (req, res) => {
    if (req.query.token !== process.env.SECRET ) {
        res.status(401);
        res.json({
            error: 401,
            response: 'Access Denied'
        });
    } else {
        res.status(200)
        discordstats.insert(req.body)
        res.json({
            response: 'POST was successful',
            data: req.body
        })
    }
})

app.get('/api/deeznuts', async (req, res) => {
    if (req.query.token !== process.env.SECRET ) {
        res.status(401);
        res.json({
            error: 401,
            response: 'Access Denied'
        });
    } else {
        res.status(200)
        discordstats.find().then((data) => {
            res.json(data)
        })
    }
})

app.listen(port, () => {
    console.log(`Server at http://localhost:${port}`)
});