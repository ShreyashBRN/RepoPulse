const Repository = require('../../models/repository.model');
const { enqueueRepoAnalysisJob } = require('../../jobs/queues/repo.queue');
const axios = require('axios');

const registerRepositoryForAnalysis = async (repodata) => {
    const { owner, repo, fullName, url } = repodata;
    let repository = await Repository.findOne({ fullName });
    if(repository){
        return repository;
    }

    repository = new Repository({
        owner,
        name: repo,
        fullName,
        url,
        status: "pending",
    });

    await repository.save();
    
    await enqueueRepoAnalysisJob({
        repositoryId: repository._id.toString(),
        fullName: repository.fullName,
    })

    return repository;
};

async function fetchRepoMetadata(owner, repo){
    const url = `https://api.github.com/repos/${owner}/${repo}`;
    const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          Accept: "application/vnd.github+json",
        },
      });
      return response.data;

}

async function fetchCommitsLast30Days(owner, repo){
    const perPage = 100;
    let page = 1;
    let commitCount = 0;
    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - '30');
    const sinceISO = sinceDate.toISOString();

    while(true){
        const response = await axios.get(
            `https://api.github.com/repos/${owner}/${repo}/commits`, {
            params: {
                since: sinceISO,
                per_page: perPage,
                page,
              },
              headers: {
                Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                Accept: "application/vnd.github+json",
              },
            }
            
        );
        const commits = response.data;

        commitCount += commits.length;
        if(commits.length < perPage){
            break;
        }
        page++;
    }
    return commitCount;
}

async function fetchIssueStats(owner, repo){
    const perPage = 100;

    async function fetchIssuesByState(state){
        let page = 1;
        let count = 0;
        while(true){
            const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/commits`, {
                params: {
                    state,
                    per_page: perPage,
                    page,
                  },
                  headers: {
                    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                    Accept: "application/vnd.github+json",
                  }
            }
        );
        const issues = response.data;

        const realIssue = issues.filter(
            (issue) => !issue.pull_request
        );
        count += realIssue.length;
        if (issues.length < perPage) {
            break;
          }
          page++;
        }
        return count;
    }
    const openIssues = await fetchIssuesByState("open");
    const closeIssues = await fetchIssuesByState("closed");
    return {
        openIssues, closeIssues,
    };
    
}

async function fetchContributorCount(owner, repo){
    const perPage = 100;
    let page = 1;
    let contributorCount = 0;

    while(true){
        const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/contributors`, {
            params: {
                per_page: perPage,
                page,
              },
              headers: {
                Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                Accept: "application/vnd.github+json",
              },
        });
        const contributors = response.data;
        contributorCount += contributors.length;
        if (contributors.length < perPage) {
            break;
          }
          page++;

    }
    return contributorCount;
}

module.exports = { registerRepositoryForAnalysis,
    fetchRepoMetadata, fetchCommitsLast30Days,
    fetchIssueStats, fetchContributorCount,
 };