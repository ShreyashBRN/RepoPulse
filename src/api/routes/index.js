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
    
    const repoController = require('../controllers/repo.controller');
    const analyzeController = require('../controllers/analyze.controller');

    router.post('/repos/analyze', repoController.analyzeRepository);
    router.get('/repos/:id', repoController.getRepository);
    router.get('/repos/:id/metrics', repoController.getRepositoryMetrics);

    // Instant analysis (no queue) for the landing UI
    router.post('/analyze', analyzeController.analyzeRepo);


    module.exports = router;