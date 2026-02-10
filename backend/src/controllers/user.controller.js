const User = require('../models/user');
const bcrypt = require('bcryptjs');

/**
 * @desc    Récupérer le profil de l'utilisateur connecté
 * @route   GET /api/users/profile
 * @access  Private
 */
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password -mot_de_passe');
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.json({ success: true, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error retrieving profile.' });
    }
};

/**
 * @desc    Get all users (Super Admin)
 * @route   GET /api/users
 * @access  Private/SuperAdmin
 */
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password -mot_de_passe').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error retrieving users.' });
    }
};

/**
 * @desc    Create a new user (Super Admin)
 * @route   POST /api/users
 * @access  Private/SuperAdmin
 */
const createUser = async (req, res) => {
    try {
        const { name, email, password, role, agencyId } = req.body;

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Handle name splitting for compatibility
        const nameParts = name ? name.split(' ') : ['User'];
        const prenom = nameParts[0];
        const nom = nameParts.slice(1).join(' ') || '';

        user = new User({
            email,
            password: hashedPassword,
            role: role || 'user',
            agency: ((role === 'admin' || role === 'admin_agency') && agencyId) ? agencyId : null,
            nom,
            prenom,
            provider: 'local',
            status: 'active'
        });

        await user.save();

        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(201).json(userResponse);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error creating user.' });
    }
};

/**
 * @desc    Update a user
 * @route   PUT /api/users/:id
 * @access  Private/SuperAdmin
 */
const updateUser = async (req, res) => {
    try {
        const { name, email, password, role, agencyId, status } = req.body;
        const user = await User.findById(req.params.id);

        if (user) {
            user.email = email || user.email;
            user.role = role || user.role;
            user.status = status || user.status;

            // Handle agency assignment
            if (role === 'super' || role === 'admin_super') {
                user.agency = null;
            } else if ((role === 'admin' || role === 'admin_agency') && agencyId) {
                user.agency = agencyId;
            }

            if (name) {
                const nameParts = name.split(' ');
                user.prenom = nameParts[0];
                user.nom = nameParts.slice(1).join(' ') || '';
            }

            if (password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(password, salt);
            }

            await user.save();

            const userResponse = user.toObject();
            delete userResponse.password;

            res.json(userResponse);
        } else {
            return res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error("Update User Error:", error);
        res.status(500).json({ message: 'Server error updating user.', error: error.message });
    }
};

/**
 * @desc    Delete a user
 * @route   DELETE /api/users/:id
 * @access  Private/SuperAdmin
 */
const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.sendStatus(204);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error deleting user.' });
    }
};

/**
 * @desc    Update current user's profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
const updateProfile = async (req, res) => {
    try {
        const { prenom, nom, cin, phone, city, address, profileImage } = req.body;
        const user = await User.findById(req.user.id);

        if (user) {
            user.prenom = prenom || user.prenom;
            user.nom = nom || user.nom;
            user.CIN = cin || user.CIN;
            user.phone = phone || user.phone;
            user.city = city || user.city;
            user.address = address || user.address;
            user.profileImage = profileImage || user.profileImage;

            await user.save();

            const userResponse = user.toObject();
            delete userResponse.password;

            res.json({ success: true, user: userResponse });
        } else {
            return res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error("Update Profile Error:", error);
        res.status(500).json({ message: 'Server error updating profile.', error: error.message });
    }
};

module.exports = {
    getProfile,
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
    updateProfile
};
