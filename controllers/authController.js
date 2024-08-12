const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Create a new user
        const user = await User.create({ username, email, password });

        // Create a JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        // Set the JWT token in a cookie
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 3600000, // 1 hour
        });

        // Redirect to the dashboard
        res.redirect('/dashboard');

    } catch (error) {
        // Render the register page with an error message
        res.render('register', { error: error.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.render('login', { error: 'Invalid credentials' });
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.render('login', { error: 'Invalid credentials' });
        }

        // Create a JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        // Set the JWT token in a cookie
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 3600000, // 1 hour
        });

        // Redirect to the dashboard
        res.redirect('/dashboard');

    } catch (error) {
        // Render the login page with an error message
        res.render('login', { error: error.message });
    }
};

exports.logout = (req, res) => {
    // Clear the JWT token cookie
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0),
    });

    // Redirect to the login page
    res.redirect('/login');
};

exports.getUser = async (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.redirect('/login');
    }

    try {
        // Verify the JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Find the user by ID and exclude the password field
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.redirect('/login');
        }

        // Render the dashboard with the user data
        res.render('dashboard', { user });

    } catch (error) {
        // Redirect to the login page if there is an error
        res.redirect('/login');
    }
};
