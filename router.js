 exports.register = (app) => {
    app.use('/api/user',require('./api/user'));
    app.use('/api/stripe/',require('./api/stripe'));
};