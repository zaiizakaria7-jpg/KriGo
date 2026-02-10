require("dotenv").config({ path: "../.env" });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./src/models/user");
const Agency = require("./src/models/Agency");
const Vehicle = require("./src/models/Vehicle");
const Reservation = require("./src/models/Reservation");
const Payment = require("./src/models/Payment");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ DB connected");
    } catch (err) {
        console.error("❌ DB error", err);
        process.exit(1);
    }
};

const resetDatabase = async () => {
    try {
        await connectDB();

        // 🗑️ Delete all data
        console.log("\n🗑️  Deleting all data...");
        await User.deleteMany({});
        await Agency.deleteMany({});
        await Vehicle.deleteMany({});
        await Reservation.deleteMany({});
        await Payment.deleteMany({});
        console.log("✅ All data deleted");

        // 🏢 Create agencies
        console.log("\n🏢 Creating agencies...");
        const casaAgency = await Agency.create({
            name: "KriGo Casablanca",
            city: "Casablanca",
            phone: "+212 5 22 12 34 56"
        });

        const rabatAgency = await Agency.create({
            name: "KriGo Rabat",
            city: "Rabat",
            phone: "+212 5 37 12 34 56"
        });
        console.log("✅ Agencies created");

        // 👥 Create users with 3 roles
        console.log("\n👥 Creating users...");

        // 1. Regular User
        const userPassword = await bcrypt.hash("user123", 10);
        await User.create({
            email: "user@krigo.com",
            password: userPassword,
            role: "user",
            nom: "Doe",
            prenom: "John",
            provider: "local"
        });
        console.log("✅ User created: user@krigo.com / user123");

        // 2. Agency Admin
        const adminPassword = await bcrypt.hash("admin123", 10);
        await User.create({
            email: "admin@krigo.com",
            password: adminPassword,
            role: "admin",
            agency: casaAgency._id,
            nom: "Admin",
            prenom: "Agency",
            provider: "local"
        });
        console.log("✅ Agency Admin created: admin@krigo.com / admin123");

        // 3. Super Admin
        const superPassword = await bcrypt.hash("super123", 10);
        await User.create({
            email: "super@krigo.com",
            password: superPassword,
            role: "super",
            nom: "Admin",
            prenom: "Super",
            provider: "local"
        });
        console.log("✅ Super Admin created: super@krigo.com / super123");

        console.log("\n" + "=".repeat(60));
        console.log("✅ DATABASE RESET COMPLETED!");
        console.log("=".repeat(60));
        console.log("\n📋 Test Accounts:");
        console.log("   1. Regular User:  user@krigo.com  / user123");
        console.log("   2. Agency Admin:  admin@krigo.com / admin123");
        console.log("   3. Super Admin:   super@krigo.com / super123");
        console.log("\n💡 Next step: Run 'node seed_vehicles.js' to add vehicles");
        console.log("=".repeat(60) + "\n");

        process.exit(0);
    } catch (error) {
        console.error("❌ Error resetting database:", error);
        process.exit(1);
    }
};

resetDatabase();
