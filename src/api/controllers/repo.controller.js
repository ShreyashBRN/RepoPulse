const { registerRepositoryForAnalysis } = require('../../services/github/github.service');
const { validateAndNormalizeRepo } = require('../validators/repo.validator');

const analyzeRepository = async (req, res) => {
    try{
    const normalizedRepo = validateAndNormalizeRepo(req.body);
    await registerRepositoryForAnalysis(normalizedRepo);
    return res.status(202).json({
        message: "Repository analysis queued",
        status: "pending",
    });
    } catch(error){
        if (error.message && error.message.toLowerCase().includes("repo")) {
            return res.status(400).json({
              message: error.message,
              status: "bad_request",
            });
          }
        console.error("Failed to register repository for analysis:", error);
        return res.status(500).json({
            message: "Failed to queue repository analysis",
            status: "error",
          });
    }
};

module.exports = {
    analyzeRepository,
};