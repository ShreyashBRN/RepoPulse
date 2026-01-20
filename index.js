const mongoose = require('mongoose');
const app = require('./src/app');
const { PORT, MONGO_URI } = require('./src/config/env');
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Atlas connected");

    // 🚀 Start server ONLY after DB is ready
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1); // crash app if DB fails
  });