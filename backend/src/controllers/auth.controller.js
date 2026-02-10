const User = require("../models/user");
const { generateToken } = require("../utils/jwt");
const bcrypt = require("bcryptjs");

// Register User
exports.register = async (req, res) => {
  try {
    const { nom, prenom, email, CIN, city, address, phone, password } = req.body;

    if (!email || !password || !nom || !prenom) {
      return res.status(400).json({ message: "Tous les champs obligatoires (nom, prenom, email, password) doivent être remplis." });
    }

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "Email deja utilisé" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      nom,
      prenom,
      email,
      CIN,
      city,
      address,
      phone,
      password: hashedPassword
    });

    const token = generateToken(user);

    res.status(201).json({
      message: "Compte créé avec succès",
      token,
      user: {
        id: user._id,
        email: user.email,
        nom: user.nom,
        prenom: user.prenom,
        role: user.role,
        agency: user.agency,
        CIN: user.CIN,
        city: user.city,
        address: user.address,
        phone: user.phone,
        profileImage: user.profileImage,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login User
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

    // Enable for stricter checks if using social login too
    // if (user.provider !== "local")
    //   return res.status(400).json({ message: "Use social login" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Fallback for old plain text passwords during migration (optional but safe)
      if (user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
    }

    // Check if 2FA is enabled
    if (user.twoFactorEnabled) {
      return res.json({
        requires2FA: true,
        userId: user._id
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        nom: user.nom,
        prenom: user.prenom,
        role: user.role,
        agency: user.agency,
        CIN: user.CIN,
        city: user.city,
        address: user.address,
        phone: user.phone,
        profileImage: user.profileImage,
        twoFactorEnabled: user.twoFactorEnabled,
        createdAt: user.createdAt
      }
    });
  } catch (e) {
    res.status(500).json({ message: "error", error: e.message });
  }
};
