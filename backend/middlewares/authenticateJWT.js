const jwt = require('jsonwebtoken');

// JWT authentication middleware function
const authenticateJWT = (req, res, next) => {
    const token = req.headers['authorization'];
    // Check if the token exists
    if (!token) {
        // If no token is provided, return a 403 (Forbidden) status
        return res.status(403).json({ message: 'No token provided. Access denied.' });
    }

    // Verify the token using the secret key defined in the environment variables
    jwt.verify(token.split(' ')[1], process.env.JWT_SECRET, (err, user) => {
        // If the token is invalid, return a 403 (Forbidden) status
        if (err) {
            return res.status(403).json({ message: 'Invalid token. Access denied.' });
        }

        // Attach the decoded user information to the request object
        req.user = user; // `user` contains the decoded JWT payload (_id, email)
        
        next();
    });
};

module.exports = authenticateJWT;