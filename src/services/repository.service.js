const Repository = require("../models/repository.model");
const redis = require('../cache/redis.client');

async function getRepositoryById(repoId){
    return Repository.findById(repoId).lean();
}

async function getRepositoryMetrics(repoId) {
    const cacheKey = `repo:metrics:${String(repoId)}`;

    try {
        const cached = await redis.get(cacheKey);
        if (cached) return JSON.parse(cached);
    } catch (err) {
        // Redis down or error: fall back to DB
    }

    const repo = await Repository.findById(repoId, {
        commitCountLast30Days: 1,
        openIssues: 1,
        closedIssues: 1,
        contributorCount: 1,
        healthScore: 1,
        status: 1,
    }).lean();

    if (!repo) return null;

    try {
        await redis.set(cacheKey, JSON.stringify(repo), "EX", 300);
    } catch (err) {
        // Cache set failed; still return repo from DB
    }
    return repo;
}

async function getRepositoryMetricsById(repoId) {
    return Repository.findById(repoId, {
    commitCountLast30Days: 1,
    openIssues: 1,
    closedIssues: 1,
    contributorCount: 1,
    healthScore: 1,
    status: 1,
    }).lean();
    }

async function invalidateRepoMetricsCache(repoId) {
    const cacheKey = `repo:metrics:${String(repoId)}`;
    try {
        await redis.del(cacheKey);
        console.log("🧹 Cache invalidated:", cacheKey);
    } catch (err) {
        console.warn("[invalidateRepoMetricsCache]", err.message);
    }
}

module.exports = { getRepositoryById, getRepositoryMetrics, invalidateRepoMetricsCache, getRepositoryMetricsById };