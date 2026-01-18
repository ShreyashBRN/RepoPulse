const express = require('express');
const app = express();

app.use(express.json());
const repoHealth = require('./api/routes');
const controllerFunction = require('./api/routes');

app.use('/api/v1', repoHealth);
app.use('/api/v1', controllerFunction);
app.get('/', (req, res) => {
    res.send("RepoPulse API");
});


module.exports = app;