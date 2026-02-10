require("dotenv").config({ path: "../.env" });
const mongoose = require("mongoose");
const Vehicle = require("./src/models/Vehicle");
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

const seedVehicles = async () => {
    try {
        await connectDB();

        // Create sample agencies
        let casaAgency = await Agency.findOne({ name: "KriGo Casablanca" });
        if (!casaAgency) {
            casaAgency = await Agency.create({
                name: "KriGo Casablanca",
                city: "Casablanca",
                phone: "+212 5 22 12 34 56"
            });
        }

        let rabatAgency = await Agency.findOne({ name: "KriGo Rabat" });
        if (!rabatAgency) {
            rabatAgency = await Agency.create({
                name: "KriGo Rabat",
                city: "Rabat",
                phone: "+212 5 37 12 34 56"
            });
        }

        console.log("✅ Agencies ready");

        // Clear existing vehicles
        await Vehicle.deleteMany({});
        console.log("🗑️  Cleared existing vehicles");

        // Sample vehicles with actual local images
        const vehicles = [
            // BMW
            {
                type: "car",
                brand: "BMW",
                model: "550",
                price_per_day: 850,
                availability: true,
                image: "/images/projet de voiture/BMW/550/550.webp",
                images: [
                    "/images/projet de voiture/BMW/550/550.webp",
                    "/images/projet de voiture/BMW/550/550.1.webp",
                    "/images/projet de voiture/BMW/550/550.2.webp",
                    "/images/projet de voiture/BMW/550/550.3.webp",
                    "/images/projet de voiture/BMW/550/550.4.webp"
                ],
                description: "Experience luxury and performance with the BMW 550. Perfect for business trips and long-distance travel across Morocco.",
                agency: casaAgency._id,
                specs: { seats: 5, fuel: "Gasoline", transmission: "Automatic", topSpeed: "250 km/h" }
            },
            {
                type: "car",
                brand: "BMW",
                model: "X5",
                price_per_day: 950,
                availability: true,
                image: "/images/projet de voiture/BMW/X5/x.webp",
                images: [
                    "/images/projet de voiture/BMW/X5/x.webp",
                    "/images/projet de voiture/BMW/X5/x.1.webp",
                    "/images/projet de voiture/BMW/X5/x.2.webp",
                    "/images/projet de voiture/BMW/X5/x.3.webp",
                    "/images/projet de voiture/BMW/X5/x.4.webp"
                ],
                description: "The ultimate SUV. BMW X5 offers spacious luxury and powerful performance.",
                agency: casaAgency._id,
                specs: { seats: 7, fuel: "Diesel", transmission: "Automatic", topSpeed: "240 km/h" }
            },

            // Mercedes
            {
                type: "car",
                brand: "Mercedes",
                model: "350",
                price_per_day: 900,
                availability: true,
                image: "/images/projet de voiture/MERCEDES/350/350.webp",
                images: [
                    "/images/projet de voiture/MERCEDES/350/350.webp",
                    "/images/projet de voiture/MERCEDES/350/350.1.webp",
                    "/images/projet de voiture/MERCEDES/350/350.2.webp",
                    "/images/projet de voiture/MERCEDES/350/350.3.webp",
                    "/images/projet de voiture/MERCEDES/350/350.4.webp"
                ],
                description: "Mercedes 350 - Elegance meets performance. Perfect for special occasions.",
                agency: rabatAgency._id,
                specs: { seats: 5, fuel: "Diesel", transmission: "Automatic", topSpeed: "245 km/h" }
            },
            {
                type: "car",
                brand: "Mercedes",
                model: "Mini",
                price_per_day: 650,
                availability: true,
                image: "/images/projet de voiture/MERCEDES/min/mi.webp",
                images: [
                    "/images/projet de voiture/MERCEDES/min/mi.webp",
                    "/images/projet de voiture/MERCEDES/min/mi.1.webp",
                    "/images/projet de voiture/MERCEDES/min/mi.2.webp",
                    "/images/projet de voiture/MERCEDES/min/mi.3.webp",
                    "/images/projet de voiture/MERCEDES/min/mi.4.webp"
                ],
                description: "Compact Mercedes - Perfect for city driving with premium features.",
                agency: rabatAgency._id,
                specs: { seats: 4, fuel: "Gasoline", transmission: "Automatic", topSpeed: "200 km/h" }
            },

            // Dacia
            {
                type: "car",
                brand: "Dacia",
                model: "Duster",
                price_per_day: 350,
                availability: true,
                image: "/images/projet de voiture/DACIA/dus/dus.jfif",
                images: [
                    "/images/projet de voiture/DACIA/dus/dus.jfif",
                    "/images/projet de voiture/DACIA/dus/dus.1.jfif",
                    "/images/projet de voiture/DACIA/dus/dus.2.jfif",
                    "/images/projet de voiture/DACIA/dus/dus.4.jfif",
                    "/images/projet de voiture/DACIA/dus/dus.5.jfif"
                ],
                description: "Rugged and reliable SUV perfect for exploring Moroccan landscapes.",
                agency: casaAgency._id,
                specs: { seats: 5, fuel: "Diesel", transmission: "Manual", topSpeed: "180 km/h" }
            },
            {
                type: "car",
                brand: "Dacia",
                model: "Sandero",
                price_per_day: 250,
                availability: true,
                image: "/images/projet de voiture/DACIA/san/san.jfif",
                images: [
                    "/images/projet de voiture/DACIA/san/san.jfif",
                    "/images/projet de voiture/DACIA/san/san.1.jfif",
                    "/images/projet de voiture/DACIA/san/san.2.jfif",
                    "/images/projet de voiture/DACIA/san/san.3.jfif",
                    "/images/projet de voiture/DACIA/san/san.4.jfif"
                ],
                description: "Economical and practical city car. Perfect for daily commutes.",
                agency: casaAgency._id,
                specs: { seats: 5, fuel: "Gasoline", transmission: "Manual", topSpeed: "170 km/h" }
            },

            // Renault
            {
                type: "car",
                brand: "Renault",
                model: "Arkana",
                price_per_day: 450,
                availability: true,
                image: "/images/projet de voiture/RENAULT/arkan/ar.jfif",
                images: [
                    "/images/projet de voiture/RENAULT/arkan/ar.jfif",
                    "/images/projet de voiture/RENAULT/arkan/ar.1.jfif",
                    "/images/projet de voiture/RENAULT/arkan/ar.2.jfif",
                    "/images/projet de voiture/RENAULT/arkan/ar.3.jfif",
                    "/images/projet de voiture/RENAULT/arkan/ar.4.jfif"
                ],
                description: "Stylish SUV coupe with modern design and comfort.",
                agency: rabatAgency._id,
                specs: { seats: 5, fuel: "Hybrid", transmission: "Automatic", topSpeed: "200 km/h" }
            },
            {
                type: "car",
                brand: "Renault",
                model: "Clio",
                price_per_day: 300,
                availability: true,
                image: "/images/projet de voiture/RENAULT/clio/cl.jfif",
                images: [
                    "/images/projet de voiture/RENAULT/clio/cl.jfif",
                    "/images/projet de voiture/RENAULT/clio/cl.1.jfif",
                    "/images/projet de voiture/RENAULT/clio/cl.2.jfif",
                    "/images/projet de voiture/RENAULT/clio/cl.3.jfif",
                    "/images/projet de voiture/RENAULT/clio/cl.4.jfif"
                ],
                description: "Compact and efficient. The perfect urban companion.",
                agency: rabatAgency._id,
                specs: { seats: 5, fuel: "Gasoline", transmission: "Manual", topSpeed: "185 km/h" }
            },

            // Cupra
            {
                type: "car",
                brand: "Cupra",
                model: "Formentor",
                price_per_day: 700,
                availability: true,
                image: "/images/projet de voiture/CUPRA/formentor/fo.jfif",
                images: [
                    "/images/projet de voiture/CUPRA/formentor/fo.jfif",
                    "/images/projet de voiture/CUPRA/formentor/fo.1.jfif",
                    "/images/projet de voiture/CUPRA/formentor/fo.2.jfif",
                    "/images/projet de voiture/CUPRA/formentor/fo.3.jfif"
                ],
                description: "Sporty SUV with cutting-edge technology and performance.",
                agency: casaAgency._id,
                specs: { seats: 5, fuel: "Gasoline", transmission: "Automatic", topSpeed: "230 km/h" }
            },
            {
                type: "car",
                brand: "Cupra",
                model: "Leon",
                price_per_day: 650,
                availability: true,
                image: "/images/projet de voiture/CUPRA/leon/le.jfif",
                images: [
                    "/images/projet de voiture/CUPRA/leon/le.jfif",
                    "/images/projet de voiture/CUPRA/leon/le.1.jfif",
                    "/images/projet de voiture/CUPRA/leon/le.2.jfif",
                    "/images/projet de voiture/CUPRA/leon/le.3.jfif"
                ],
                description: "Dynamic hatchback with sporty DNA and premium features.",
                agency: casaAgency._id,
                specs: { seats: 5, fuel: "Gasoline", transmission: "Automatic", topSpeed: "220 km/h" }
            },

            // Peugeot
            {
                type: "car",
                brand: "Peugeot",
                model: "208",
                price_per_day: 280,
                availability: true,
                image: "/images/projet de voiture/PEUGEOT/208/208.jpg",
                images: [
                    "/images/projet de voiture/PEUGEOT/208/208.jpg",
                    "/images/projet de voiture/PEUGEOT/208/20.1.jpg",
                    "/images/projet de voiture/PEUGEOT/208/208.2.jpg",
                    "/images/projet de voiture/PEUGEOT/208/208.3.jpg",
                    "/images/projet de voiture/PEUGEOT/208/208.4.jpg"
                ],
                description: "Stylish and efficient city car with modern features.",
                agency: rabatAgency._id,
                specs: { seats: 5, fuel: "Gasoline", transmission: "Manual", topSpeed: "190 km/h" }
            },
            {
                type: "car",
                brand: "Peugeot",
                model: "308",
                price_per_day: 380,
                availability: true,
                image: "/images/projet de voiture/PEUGEOT/308/308.10.jpg",
                images: [
                    "/images/projet de voiture/PEUGEOT/308/308.10.jpg",
                    "/images/projet de voiture/PEUGEOT/308/308.5.jpg",
                    "/images/projet de voiture/PEUGEOT/308/308.6.jpg",
                    "/images/projet de voiture/PEUGEOT/308/308.8.jpg",
                    "/images/projet de voiture/PEUGEOT/308/308.4.jpg"
                ],
                description: "Comfortable family car with excellent fuel economy.",
                agency: rabatAgency._id,
                specs: { seats: 5, fuel: "Diesel", transmission: "Automatic", topSpeed: "205 km/h" }
            },
            {
                type: "car",
                brand: "Volkswagen",
                model: "Touareg",
                price_per_day: 850,
                availability: true,
                image: "/images/projet de voiture/volswagen/touareg/tu.png",
                images: [
                    "/images/projet de voiture/volswagen/touareg/tu.png",
                    "/images/projet de voiture/volswagen/touareg/tu.1.png",
                    "/images/projet de voiture/volswagen/touareg/tu.2.png",
                    "/images/projet de voiture/volswagen/touareg/tu.3.png",
                    "/images/projet de voiture/volswagen/touareg/tu.4.png"
                ],
                description: "Luxury SUV offering premium comfort, advanced technology, and powerful performance.",
                agency: casaAgency._id,
                specs: { seats: 5, fuel: "Diesel", transmission: "Automatic", topSpeed: "250 km/h" }
            },
            {
                type: "car",
                brand: "Peugeot",
                model: "Rifter",
                price_per_day: 420,
                availability: true,
                image: "/images/projet de voiture/PEUGEOT/rifter/ri.jpg",
                images: [
                    "/images/projet de voiture/PEUGEOT/rifter/ri.jpg",
                    "/images/projet de voiture/PEUGEOT/rifter/ri.1.jpg",
                    "/images/projet de voiture/PEUGEOT/rifter/ri.2.jpg",
                    "/images/projet de voiture/PEUGEOT/rifter/ri.3.jpg",
                    "/images/projet de voiture/PEUGEOT/rifter/ri.4.jpg"
                ],
                description: "Spacious MPV perfect for family trips and adventures.",
                agency: casaAgency._id,
                specs: { seats: 7, fuel: "Diesel", transmission: "Manual", topSpeed: "175 km/h" }
            },

            // Volkswagen
            {
                type: "car",
                brand: "Volkswagen",
                model: "Golf 8",
                price_per_day: 500,
                availability: true,
                image: "/images/projet de voiture/volswagen/golf 8/go..png",
                images: [
                    "/images/projet de voiture/volswagen/golf 8/go..png",
                    "/images/projet de voiture/volswagen/golf 8/go.1.png",
                    "/images/projet de voiture/volswagen/golf 8/go.2.png",
                    "/images/projet de voiture/volswagen/golf 8/go.3.png",
                    "/images/projet de voiture/volswagen/golf 8/go.4.png"
                ],
                description: "The iconic Golf - Reliable, comfortable, and fun to drive.",
                agency: casaAgency._id,
                specs: { seats: 5, fuel: "Gasoline", transmission: "Automatic", topSpeed: "210 km/h" }
            },
            {
                type: "car",
                brand: "Volkswagen",
                model: "Tiguan",
                price_per_day: 600,
                availability: true,
                image: "/images/projet de voiture/volswagen/tiguan/ti.png",
                images: [
                    "/images/projet de voiture/volswagen/tiguan/ti.png",
                    "/images/projet de voiture/volswagen/tiguan/ti.1.png",
                    "/images/projet de voiture/volswagen/tiguan/ti.2.png",
                    "/images/projet de voiture/volswagen/tiguan/ti.3.png",
                    "/images/projet de voiture/volswagen/tiguan/ti.4.png"
                ],
                description: "Premium SUV with advanced safety features and comfort.",
                agency: rabatAgency._id,
                specs: { seats: 7, fuel: "Diesel", transmission: "Automatic", topSpeed: "215 km/h" }
            },

            // Yamaha Motorcycles
            {
                type: "moto",
                brand: "Yamaha",
                model: "MT-09",
                price_per_day: 400,
                availability: true,
                image: "/moto + tretinet/moto/YAMAHA/mt 900/mt.jpg",
                images: [
                    "/moto + tretinet/moto/YAMAHA/mt 900/mt.jpg",
                    "/moto + tretinet/moto/YAMAHA/mt 900/mt.1.jpg",
                    "/moto + tretinet/moto/YAMAHA/mt 900/mt.2.jpg",
                    "/moto + tretinet/moto/YAMAHA/mt 900/mt.3.jpg",
                    "/moto + tretinet/moto/YAMAHA/mt 900/mt.4.jpg"
                ],
                description: "Powerful naked bike with aggressive styling and thrilling performance.",
                agency: casaAgency._id,
                specs: { seats: 2, fuel: "Gasoline", transmission: "Manual", topSpeed: "220 km/h" }
            },
            {
                type: "moto",
                brand: "Yamaha",
                model: "R1",
                price_per_day: 600,
                availability: true,
                image: "/moto + tretinet/moto/YAMAHA/r1/r1.jpg",
                images: [
                    "/moto + tretinet/moto/YAMAHA/r1/r1.jpg",
                    "/moto + tretinet/moto/YAMAHA/r1/r1.1.jpg",
                    "/moto + tretinet/moto/YAMAHA/r1/r1.2.jpg",
                    "/moto + tretinet/moto/YAMAHA/r1/r1.3.jpg",
                    "/moto + tretinet/moto/YAMAHA/r1/r1.4.jpg"
                ],
                description: "Legendary superbike with MotoGP-derived technology.",
                agency: rabatAgency._id,
                specs: { seats: 2, fuel: "Gasoline", transmission: "Manual", topSpeed: "299 km/h" }
            },
            {
                type: "moto",
                brand: "Yamaha",
                model: "TMAX",
                price_per_day: 450,
                availability: true,
                image: "/moto + tretinet/moto/YAMAHA/tmax/tm.jpg",
                images: [
                    "/moto + tretinet/moto/YAMAHA/tmax/tm.jpg",
                    "/moto + tretinet/moto/YAMAHA/tmax/tm.1.jpg",
                    "/moto + tretinet/moto/YAMAHA/tmax/tm.2.jpg",
                    "/moto + tretinet/moto/YAMAHA/tmax/tm.3.jpg",
                    "/moto + tretinet/moto/YAMAHA/tmax/tm.4.jpg"
                ],
                description: "Premium maxi-scooter combining comfort and performance.",
                agency: casaAgency._id,
                specs: { seats: 2, fuel: "Gasoline", transmission: "Automatic", topSpeed: "180 km/h" }
            },
            {
                type: "moto",
                brand: "Yamaha",
                model: "YZ450F",
                price_per_day: 350,
                availability: true,
                image: "/moto + tretinet/moto/YAMAHA/yz450/yz.jpg",
                images: [
                    "/moto + tretinet/moto/YAMAHA/yz450/yz.jpg",
                    "/moto + tretinet/moto/YAMAHA/yz450/yz.1.jpg",
                    "/moto + tretinet/moto/YAMAHA/yz450/yz.2.jpg",
                    "/moto + tretinet/moto/YAMAHA/yz450/yz.3.jpg",
                    "/moto + tretinet/moto/YAMAHA/yz450/yz.4.jpg"
                ],
                description: "Championship-winning motocross bike for off-road adventures.",
                agency: rabatAgency._id,
                specs: { seats: 1, fuel: "Gasoline", transmission: "Manual", topSpeed: "160 km/h" }
            },
            {
                type: "moto",
                brand: "BMW",
                model: "C400",
                price_per_day: 380,
                availability: true,
                image: "/moto + tretinet/moto/BMW MOTO/C4/c.png",
                images: [
                    "/moto + tretinet/moto/BMW MOTO/C4/c.png",
                    "/moto + tretinet/moto/BMW MOTO/C4/c.1.png",
                    "/moto + tretinet/moto/BMW MOTO/C4/c.2.png"
                ],
                description: "Urban scooter with BMW quality and technology.",
                agency: casaAgency._id,
                specs: { seats: 2, fuel: "Gasoline", transmission: "Automatic", topSpeed: "140 km/h" }
            },
            {
                type: "moto",
                brand: "BMW",
                model: "GS 1300",
                price_per_day: 550,
                availability: true,
                image: "/moto + tretinet/moto/BMW MOTO/gs 1300/gs.png",
                images: [
                    "/moto + tretinet/moto/BMW MOTO/gs 1300/gs.png",
                    "/moto + tretinet/moto/BMW MOTO/gs 1300/gs.1.png",
                    "/moto + tretinet/moto/BMW MOTO/gs 1300/gs.2.png"
                ],
                description: "Legendary adventure bike for long-distance touring.",
                agency: rabatAgency._id,
                specs: { seats: 2, fuel: "Gasoline", transmission: "Manual", topSpeed: "200 km/h" }
            },
            {
                type: "moto",
                brand: "Electric",
                model: "E-Moto Pro",
                price_per_day: 320,
                availability: true,
                image: "/moto + tretinet/moto/ELECTRIQUE MOTO/electrique/el.jpg",
                images: [
                    "/moto + tretinet/moto/ELECTRIQUE MOTO/electrique/el.jpg",
                    "/moto + tretinet/moto/ELECTRIQUE MOTO/electrique/el.1.jpg",
                    "/moto + tretinet/moto/ELECTRIQUE MOTO/electrique/el.2.jpg"
                ],
                description: "Eco-friendly electric motorcycle for sustainable urban mobility.",
                agency: casaAgency._id,
                specs: { seats: 2, range: "120 km", topSpeed: "100 km/h" }
            },

            // Electric Scooters
            {
                type: "trottinette",
                brand: "Electric",
                model: "Urban Pro",
                price_per_day: 80,
                availability: true,
                image: "/moto + tretinet/tretinette/tertinet 1/1.png",
                images: [
                    "/moto + tretinet/tretinette/tertinet 1/1.png",
                    "/moto + tretinet/tretinette/tertinet 1/2.png",
                    "/moto + tretinet/tretinette/tertinet 1/3.png"
                ],
                description: "Eco-friendly urban mobility solution. Perfect for city commutes.",
                agency: casaAgency._id,
                specs: { range: "45 km", topSpeed: "25 km/h" }
            },
            {
                type: "trottinette",
                brand: "Electric",
                model: "City Cruiser",
                price_per_day: 70,
                availability: true,
                image: "/moto + tretinet/tretinette/tretinet 2/1.jpg",
                images: [
                    "/moto + tretinet/tretinette/tretinet 2/1.jpg",
                    "/moto + tretinet/tretinette/tretinet 2/2.jpg",
                    "/moto + tretinet/tretinette/tretinet 2/3.jpg"
                ],
                description: "Lightweight and portable electric scooter for daily use.",
                agency: rabatAgency._id,
                specs: { range: "35 km", topSpeed: "20 km/h" }
            },
            {
                type: "trottinette",
                brand: "Electric",
                model: "Sport Edition",
                price_per_day: 90,
                availability: true,
                image: "/moto + tretinet/tretinette/tretinet 3/1.webp",
                images: [
                    "/moto + tretinet/tretinette/tretinet 3/1.webp",
                    "/moto + tretinet/tretinette/tretinet 3/2.jpg",
                    "/moto + tretinet/tretinette/tretinet 3/3.jpg",
                    "/moto + tretinet/tretinette/tretinet 3/4.jpg"
                ],
                description: "High-performance scooter with extended range.",
                agency: casaAgency._id,
                specs: { range: "60 km", topSpeed: "30 km/h" }
            },
            {
                type: "trottinette",
                brand: "Electric",
                model: "Compact Plus",
                price_per_day: 65,
                availability: true,
                image: "/moto + tretinet/tretinette/tretinet 4/1.jpg",
                images: [
                    "/moto + tretinet/tretinette/tretinet 4/1.jpg",
                    "/moto + tretinet/tretinette/tretinet 4/2.jpg",
                    "/moto + tretinet/tretinette/tretinet 4/3.jpg"
                ],
                description: "Ultra-compact scooter ideal for short trips.",
                agency: rabatAgency._id,
                specs: { range: "30 km", topSpeed: "18 km/h" }
            }
        ];

        await Vehicle.insertMany(vehicles);
        console.log(`✅ ${vehicles.length} vehicles added successfully!`);

        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding vehicles:", error);
        process.exit(1);
    }
};

seedVehicles();
