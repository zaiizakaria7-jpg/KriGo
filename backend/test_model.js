const mongoose = require("mongoose");
try {
    require("./src/models/user.js");
    console.log("SUCCESS: User model loaded successfully");
} catch (err) {
    console.error("FAILURE: Error loading User model");
    console.error(err);
}
process.exit(0);
