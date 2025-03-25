// JWT configuration
module.exports = {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '2400000000000h',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
};