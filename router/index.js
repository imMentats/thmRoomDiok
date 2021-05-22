const routes = [
    require('./routes/users'),
    require('./routes/notes')
];

module.exports = function router(app, db) {
    return routes.forEach((route) => {
        route(app, db);
    });
};