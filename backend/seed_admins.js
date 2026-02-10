require("dotenv").config({ path: "../.env" });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./src/models/user");
const Agency = require("./src/models/Agency");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ DB connected");
    } catch (err) {
        console.error("❌ DB error", err);
        process.exit(1);
    }
};

const seedAdmins = async () => {
    try {
        await connectDB();

        // Create agencies first
        let casaAgency = await Agency.findOne({ name: "KriGo Casablanca" });
        if (!casaAgency) {
            casaAgency = await Agency.create({
                name: "KriGo Casablanca",
                city: "Casablanca",
                phone: "+212 5 22 12 34 56"
            });
        }

        // Create super admin
        const superAdminExists = await User.findOne({ email: "super@krigo.com" });
        if (!superAdminExists) {
            const hashedPassword = await bcrypt.hash("super123", 10);
            await User.create({
                email: "super@krigo.com",
                password: hashedPassword,
                role: "super",
                nom: "Admin",
                prenom: "Super",
                provider: "local"
            });
            console.log("✅ Super admin created: super@krigo.com / super123");
        } else {
            console.log("ℹ️  Super admin already exists");
        }

        // Create agency admin
        const agencyAdminExists = await User.findOne({ email: "admin@krigo.com" });
        if (!agencyAdminExists) {
            const hashedPassword = await bcrypt.hash("admin123", 10);
            await User.create({
                email: "admin@krigo.com",
                password: hashedPassword,
                role: "admin",
                agency: casaAgency._id,
                nom: "Admin",
                prenom: "Agency",
                provider: "local"
            });
            console.log("✅ Agency admin created: admin@krigo.com / admin123");
        } else {
            console.log("ℹ️  Agency admin already exists");
        }

        console.log("\n✅ Admin seeding completed!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding admins:", error);
        process.exit(1);
    }
};

seedAdmins();
