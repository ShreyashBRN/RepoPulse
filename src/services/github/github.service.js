const Repository = require('../../models/repository.model');

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

    return repository;
};

module.exports = { registerRepositoryForAnalysis, };