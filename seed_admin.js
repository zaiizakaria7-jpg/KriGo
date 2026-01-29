import "dotenv/config";
import mongoose from "mongoose";
import User from "./src/models/User.js";

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI); // Mongoose 6+ defaults are fine
        console.log("Connected to MongoDB");

        const adminEmail = "admin@test.com";
        const existingUser = await User.findOne({ email: adminEmail });

        if (existingUser) {
            console.log("Admin user already exists");
        } else {
            const user = new User({
                email: adminEmail,
                password: "password123",
                role: "super-admin",
                provider: "local"
            });
            await user.save();
            console.log("Admin user created successfully!");
            console.log("Email:", adminEmail);
            console.log("Password: password123");
        }
        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error("Error seeding admin:", error);
        process.exit(1);
    }
}

seed();
