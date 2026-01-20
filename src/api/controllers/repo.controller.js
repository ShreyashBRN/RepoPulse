const { registerRepositoryForAnalysis } = require('../../services/github/github.service');
const { validateAndNormalizeRepo } = require('../validators/repo.validator');

const analyzeRepository = async (req, res) => {
    try{
    const normalizedRepo = validateAndNormalizeRepo(req.body);
    const repository = await registerRepositoryForAnalysis(normalizedRepo);
    return res.status(202).json({
      repositoryId: repository._id,
      status: repository.status,
    });
    } catch(error){
        if (error.message && error.message.toLowerCase().includes("repo")) {
            return res.status(400).json({
              message: error.message,
              status: "bad_request",
            });
          }
    }
};

module.exports = {
    analyzeRepository,
};