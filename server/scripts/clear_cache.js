const mongoose = require("mongoose");
require("dotenv").config({ path: "../../.env" });
const Product = require("../models/Product");

const run = async () => {
    try {
        if (!process.env.MONGO_URI) {
            // Fallback or assume local if not set, though it should be
            console.error("No MONGO_URI");
            process.exit(1);
        }
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        const productName = "ROG Strix G16";
        const product = await Product.findOne({ name: new RegExp(productName, "i") });

        if (product) {
            console.log(`Found product: ${product.name}`);
            product.analysis = undefined; // Clear analysis
            product.specs = undefined; // Clear specs too just to be sure
            await product.save();
            console.log("Cleared analysis and specs cache.");
        } else {
            console.log(`Product '${productName}' not found.`);
        }
    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
};

run();
