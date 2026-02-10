const jwt = require("jsonwebtoken");

/**
 * Generate a JWT token for a user
 * @param {Object} user - User object containing _id, role, etc.
 * @returns {string} - Signed JWT token
 */
const generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            role: user.role,
            email: user.email,
            nom: user.nom,
            prenom: user.prenom,
            agency: user.agency || null,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "30d", // Token expires in 30 days
        }
    );
};

/**
 * Verify a JWT token
 * @param {string} token - The token to verify
 * @returns {Object} - Decoded payload
 */
const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = {
    generateToken,
    verifyToken,
};
