const mongoose = require("mongoose");

const repositorySchema = new mongoose.Schema({
    owner: {
        type: String,
        required: true,
    },

    name: {
        type: String,
        required: true,
    },

    fullName: {
        type: String,
      required: true,
      unique: true,
    },

    url: {
        type: String,
        required: true,
    },

    status: {
        type: String,
        enum: ["pending", "processing", "completed", "failed"],
        default: "pending",
      },

    commitCountLast30Days: { type: Number },
    openIssues: { type: Number },
    closedIssues: { type: Number },
    contributorCount: { type: Number },
    healthScore: { type: Number },
},
{
    timestamps: true,
}
);

const Repository = mongoose.model("Repository", repositorySchema);

module.exports = Repository;