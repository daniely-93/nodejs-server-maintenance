const path = require('path');

const maintenance = (app, options) => {
    var mode = false;
    var accessKey;
    var endpoint = '/maintenance';
    var filePath = '/views/maintenance.html';
    var forceMessage = false;
    var message = 'Error 503: Server is temporarily unavailable, please try again lager.';
    var useApi = false;
    var statusCode = 503;
    var blockPost = false;

    if (typeof (options) === 'boolean') {
        mode = options;
    } else if (typeof (options) === "object") {
        mode = options.mode || mode;
        accessKey = options.accessKey;
        endpoint = options.endpoint || endpoint;
        filePath = options.filePath || filePath;
        forceMessage = options.forceMessage || forceMessage;
        message = options.message || message;
        useApi = options.useApi || useApi;
        statusCode = options.statusCode || statusCode;
        blockPost = options.blockPost || blockPost;
    }

    const checkAuthentication = (req, res, next) => {
        if (!accessKey) return next();

        const isMatched = req.query.access_key === accessKey;
        if (isMatched) {
            return next();
        }

        res.sendStatus(401);
    }

    const server = app => {
        app.post(endpoint, checkAuthentication, (req, res) => {
            mode = true;
            res.status(200).json({ success: true, maintenance: true });
        })
        app.delete(endpoint, checkAuthentication, (req, res) => {
            mode = false;
            res.status(200).json({ success: true, maintenance: false });
        })
        app.get(`${endpoint}/status`, (req, res) => res.status(200).json({ success: true, maintenance: mode }))
        blockPost && app.post('/*', (req, res, next) => {
            if (mode) {
                return res.status(statusCode).send({ message })
            }
            next();
        });
        app.get('/*', middleware);
    }

    const middleware = (req, res, next) => {
        if (!mode) return next();
        return useApi ?
            res.json({ statusCode, message })
            : forceMessage ?
                res.send({ message })
                : res.status(statusCode).sendFile(path.join(__dirname, `../../${filePath}`));
    }

    return server(app);
}

module.exports = maintenance;