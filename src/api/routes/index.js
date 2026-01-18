const express = require('express');
    const router = express.Router();

    router.get('/', (req, res) => {
        res.send("Checking health!");
    });

    router.get('/system/health', (req, res) => {
        res.status(200).json({
            status: "ok",
            service: "RepoPulse"
        });
    });

    router.get('/repos/analyze', (req, res) => {
        
    })

    module.exports = router;