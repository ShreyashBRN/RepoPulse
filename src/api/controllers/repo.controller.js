const { registerRepositoryForAnalysis } = require('../../services/github/github.service');

const analyzeRepository = async (req, res) => {
    const repoData = req.body;
    try{
    await registerRepositoryForAnalysis(repodata);
    return res.status(202).json({
        message: "Repository analysis queued",
        status: "pending",
    });
    } catch(err){
        console.log("Failed to register repository for analysis:", error);
        return res.status(500).json({
            message: "Failed to queue repository analysis",
            status: "error",
          });
    }
};

module.exports = {
    analyzeRepository,
};