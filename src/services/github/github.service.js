const Repository = require('../../models/repository.model');
const { enqueRepoAAnalysisJob } = require('../../jobs/queues/repo.queue');
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
    
    await enqueRepoAAnalysisJob({
        repositoryId: repository._id.toString(),
        fullName: repository.fullName,
    })

    return repository;
};

async function fetchRepoMetadata(repo, data){
    const url = `https://api.github.com/repos/${owner}/${repo}`;
    const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          Accept: "application/vnd.github+json",
        },
      });
      return response.data;

}

module.exports = { registerRepositoryForAnalysis,
    fetchRepoMetadata,
 };