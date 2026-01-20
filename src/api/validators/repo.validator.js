function validateAndNormalizeRepo(input) {
    if (!input || typeof input !== "object") {
      throw new Error("Request body is required");
    }
    const { repoUrl } = input;
    if (!repoUrl) {
      throw new Error("repoUrl is required");
    }
  
    if (typeof repoUrl !== "string") {
      throw new Error("repoUrl must be a string");
    }
  
    let url = repoUrl.trim();
    if (!url) {
      throw new Error("repoUrl cannot be empty");
    }
    url = url.toLowerCase();
    if (url.startsWith("http://")) {
      url = url.slice(7);
    } else if (url.startsWith("https://")) {
      url = url.slice(8);
    }
    if (!url.startsWith("github.com/")) {
      throw new Error("Only GitHub repositories are supported");
    }
    url = url.replace("github.com/", "");
  
    if (url.endsWith("/")) {
      url = url.slice(0, -1);
    }
  
    if (url.endsWith(".git")) {
      url = url.slice(0, -4);
    }
  
    const parts = url.split("/");
  
    if (parts.length !== 2) {
      throw new Error("Invalid GitHub repository format");
    }
  
    const [owner, repo] = parts;
  
    if (!owner || !repo) {
      throw new Error("Invalid GitHub repository format");
    }
  
    if (owner.includes(" ") || repo.includes(" ")) {
      throw new Error("Repository owner and name cannot contain spaces");
    }
    return {
      owner,
      repo,
      fullName: `${owner}/${repo}`,
      url: `https://github.com/${owner}/${repo}`,
    };
  }
  module.exports = {
    validateAndNormalizeRepo,
  };
  