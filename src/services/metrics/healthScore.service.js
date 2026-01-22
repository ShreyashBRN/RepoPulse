function computeCommitScore(commitCount){
    if(commitCount <= 0) return 0;
    if(commitCount >= 30) return 100;
    return Math.round((commitCount / 30) * 100); 
}

function computeIssueScore(openIssues, closedIssues){
    const total = openIssues + closedIssues;
    if (total === 0) return 100;
    return Math.round((closedIssues / total) * 100);
}

function computeContributorScore(contributorCount){
    if(contributorCount <= 1) return 20;
    if(contributorCount >= 10) return 100;
    return Math.round((contributorCount / 10) * 100);
}

function computeHealthScore({
    commitCount,
    openIssues,
    closedIssues,
    contributorCount,
  }) {

const commitScore = computeCommitScore(commitCount);
const issueScore = computeIssueScore(openIssues, closedIssues);
const contributorScore = computeContributorScore(contributorCount);

const finalScore =
    commitScore * 0.4 +
    issueScore * 0.4 +
    contributorScore * 0.2;

    return Math.round(finalScore);
  }


  module.exports = {
    computeHealthScore,
  };
