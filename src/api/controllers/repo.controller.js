const mongoose = require('mongoose');
const { registerRepositoryForAnalysis } = require('../../services/github/github.service');
const { validateAndNormalizeRepo } = require('../validators/repo.validator');
const { getRepositoryById, getRepositoryMetrics: fetchRepositoryMetrics } = require('../../services/repository.service');

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

const getRepository = async (req, res) => {
  try{
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
      message: "Invalid repository id",
      });
      }
    const repo = await getRepositoryById(id);
    if(!repo){
      return res.status(404).json({ message: "Repository not found" });
    }
    return res.json({
      id: repo._id,
      fullName: repo.fullName,
      url: repo.url,
      status: repo.status,
      createdAt: repo.createdAt,
      updatedAt: repo.updatedAt,
    });

  } catch(err){
    return res.status(500).json({ message: "Failed to fetch repository" });
  }
}

const getRepositoryMetrics = async (req, res) => {
  try{
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
      message: "Invalid repository id",
      });
      }
    const repo = await fetchRepositoryMetrics(id);
    if(!repo){
      return res.status(404).json({ message: "Repository not found" });
    }
    if(repo.status !== "completed"){
      return res.status(409).json({
        message: "Repository analysis not completed yet",
        status: repo.status,
      });
    }
    return res.json({
      commitCount: repo.commitCountLast30Days,
      openIssues: repo.openIssues,
      closedIssues: repo.closedIssues,
      contributorCount: repo.contributorCount,
      healthScore: repo.healthScore,
    });
  } catch(err){
    return res.status(500).json({ message: "Failed to fetch metrics" });

  }
}

module.exports = {
    analyzeRepository, getRepository, getRepositoryMetrics,
};