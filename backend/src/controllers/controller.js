const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {

    try {
        const { nom, prenom, email, CIN, city, address, phone, password } = req.body;

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

        res.status(201).json({
            message: "Compte créé avec succès",
            user: { id: user._id, email: user.email, role: user.role }
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.login = async (req, res) => {

  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mot de passe incorrect" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login réussi",
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
