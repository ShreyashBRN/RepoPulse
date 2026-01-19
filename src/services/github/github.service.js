const registerRepositoryForAnalysis = async (repodata) => {
    try{
        return {
            success: true,
            data: repoData,
        };
    } catch(error){
        console.log("Service error", error);
        throw error;
    }
}

module.exports = { registerRepositoryForAnalysis, };