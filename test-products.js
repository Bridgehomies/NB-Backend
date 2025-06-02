require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");

(async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected ✅");
    const products = await Product.find();
    console.log(`Found ${products.length} product(s):`);
    console.dir(products, { depth: null });

    process.exit(0);
  } catch (error) {
    console.error("❌ Error during test:", error);
    process.exit(1);
  }
})();
