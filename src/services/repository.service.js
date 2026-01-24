const Repository = require("../models/repository.model");
const redis = require('../cache/redis.client');

async function getRepositoryById(repoId){
    return Repository.findById(repoId).lean();
}

async function getRepositoryMetrics(repoId){
    const caacheKey = `repo:metrics:${repoId}`;
    const cached = await redis.get(caacheKey);
    if(cached){
        return JSON.parse(cached);
    }
    const repo = await Repository.findById(repoId, {
        commitCountLast30Days: 1,
        openIssues: 1,
        closedIssues: 1,
        contributorCount: 1,
        healthScore: 1,
        status: 1,
      }).lean();
      
      if(!repo) return null;
      await redis.set(caacheKey, JSON.stringify(repo), "EX", 120);
      
      return repo;
    }

    async function invalidateRepoMetricsCache(repoId){
        const caacheKey = `repo:metrics:${repoId}`;
        await redis.del(cacheKey);
    }
    module.exports = {getRepositoryById, getRepositoryMetrics, invalidateRepoMetricsCache };