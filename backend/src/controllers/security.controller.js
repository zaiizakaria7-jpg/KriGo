const User = require('../models/user');
const bcrypt = require('bcryptjs');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const { generateToken } = require('../utils/jwt');

// Change Password
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) return res.status(404).json({ message: 'User not found' });

        // If user has a password (local auth), verify it
        if (user.password) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Incorrect current password' });
            }
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
        console.error("Change Password Error:", error);
        res.status(500).json({ message: 'Server error changing password' });
    }
};

// Initiate 2FA - Generate Secret and QR Code
exports.generate2FA = async (req, res) => {
    try {
        console.log("Generating 2FA for user ID:", req.user.id);
        const user = await User.findById(req.user.id);
        if (!user) {
            console.log("User not found for ID:", req.user.id);
            return res.status(404).json({ message: 'User not found' });
        }

        const secret = speakeasy.generateSecret({
            name: `KriGo:${user.email}`,
            issuer: "KriGo",
            otpauth_url: true
        });
        console.log("Secret generated:", secret ? "Yes" : "No");

        // Save secret temporarily (checking it later)
        user.twoFactorSecret = secret.base32;
        await user.save();
        console.log("User saved with secret");

        qrcode.toDataURL(secret.otpauth_url, (err, data_url) => {
            if (err) {
                console.error("QR Gen Error:", err);
                return res.status(500).json({ message: 'Error generating QR code' });
            }
            console.log("QR Code generated successfully");
            res.json({
                secret: secret.base32,
                qrCode: data_url
            });
        });

    } catch (error) {
        console.error("Generate 2FA Error:", error);
        res.status(500).json({ message: 'Server error generating 2FA: ' + error.message });
    }
};

// Verify 2FA to Enable It
exports.verifyAndEnable2FA = async (req, res) => {
    try {
        const { token } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (!user.twoFactorSecret) {
            return res.status(400).json({ message: '2FA not initiated' });
        }

        const verified = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: 'base32',
            token: token
        });

        if (verified) {
            user.twoFactorEnabled = true;
            await user.save();
            res.json({ success: true, message: '2FA Enabled successfully' });
        } else {
            res.status(400).json({ message: 'Invalid 2FA code' });
        }
    } catch (error) {
        console.error("Verify 2FA Error:", error);
        res.status(500).json({ message: 'Server error verifying 2FA' });
    }
};

// Disable 2FA
exports.disable2FA = async (req, res) => {
    try {
        const { password } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Security check
        if (user.password) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(401).json({ message: 'Incorrect password' });
        }

        user.twoFactorEnabled = false;
        user.twoFactorSecret = undefined;
        await user.save();

        res.json({ success: true, message: '2FA Disabled' });
    } catch (error) {
        console.error("Disable 2FA Error:", error);
        res.status(500).json({ message: 'Server error disabling 2FA' });
    }
};

// Delete Account
exports.deleteAccount = async (req, res) => {
    try {
        const { password } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Security check before deletion
        if (user.password) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(401).json({ message: 'Incorrect password' });
        }

        await User.findByIdAndDelete(req.user.id);

        // Note: In a real production app, we should also delete related data
        // For example: await Reservation.deleteMany({ user: req.user.id });

        res.json({ success: true, message: 'Account deleted successfully' });
    } catch (error) {
        console.error("Delete Account Error:", error);
        res.status(500).json({ message: 'Server error deleting account' });
    }
};

// Verify 2FA Token (Login Flow)
exports.verifyLogin2FA = async (req, res) => {
    try {
        const { userId, token } = req.body;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const verified = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: 'base32',
            token: token
        });

        if (verified) {
            // Generate JWT since auth is successful
            const newToken = generateToken(user);

            res.json({
                success: true,
                token: newToken,
                user: {
                    id: user._id,
                    email: user.email,
                    role: user.role,
                    agency: user.agency,
                    nom: user.nom,
                    prenom: user.prenom
                }
            });
        } else {
            res.status(400).json({ message: 'Invalid 2FA code' });
        }
    } catch (error) {
        console.error("Login 2FA Error:", error);
        res.status(500).json({ message: 'Server error verifying 2FA' });
    }
}
