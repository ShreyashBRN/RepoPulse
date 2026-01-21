const Repository = require('../../models/repository.model');
const { enqueRepoAAnalysisJob } = require('../../jobs/queues/repo.queue');

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

module.exports = { registerRepositoryForAnalysis, };