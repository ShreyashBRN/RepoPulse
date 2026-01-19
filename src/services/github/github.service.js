const registerRepositoryForAnalysis = async (repodata) => {
    try{
        return {
            success: true,
            data: repodata,
        };
    } catch(error){
        console.log("Service error", error);
        throw error;
    }
}

module.exports = { registerRepositoryForAnalysis, };