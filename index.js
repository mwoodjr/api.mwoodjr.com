const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000
const db = require('monk')(process.env.MONGO_URL || 'localhost/skyblock');
const fs = require('fs');

const stats = db.get('servers');

app.use(express.json());
app.use(require('cors')());

app.get('/api/guild', async (req, res) => {
    const id = req.query.id;
    if(req.query.id) {
        console.log(id)
        stats.findOne({serverId: id}).then((data) => {
        res.json(data)
    })
    } else {
        res.status(401)
        res.json({
            error: 401,
            response: 'Please provide a Guild ID.'
        })
    }
})

app.get('/api/guilds')

app.listen(port, () => {
    console.log(`Server at http://localhost:${port}`)
});