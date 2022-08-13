const path = require("path");

const maintenance = (app, options, middleware) => {
  var mode,
    accessKey,
    endpoint,
    filePath,
    useApi,
    statusCode,
    message,
    blockMethods;

  const _resetData = () => {
    mode = false;
    accessKey;
    endpoint = "/maintenance";
    filePath = null;
    useApi = false;
    statusCode = 503;
    message = `Error ${statusCode}: Server is temporarily unavailable, please try again later.`;
    blockMethods = ["GET"];
  };

  _resetData();

  if (typeof options === "boolean") {
    mode = options;
  } else if (typeof options === "object") {
    mode = options.mode || mode;
    accessKey = options.accessKey;
    endpoint = options.endpoint || endpoint;
    filePath = options.filePath || filePath;
    message = options.message || message;
    useApi = options.useApi || useApi;
    statusCode = options.statusCode || statusCode;
    blockMethods = options.blockMethods || blockMethods;
  }

  const checkAuthentication = (req, res, next) => {
    if (!accessKey) return next();
    const isMatched = req.query.access_key === accessKey;
    return isMatched ? next() : res.sendStatus(401);
  };

  const server = (app) => {
    if (middleware) {
      app.use(endpoint, middleware);
    }

    app.post(endpoint, checkAuthentication, (req, res) => {
      if (req.body && Object.keys(req.body).length) {
        filePath = req.body.filePath || filePath;
        useApi = req.body.useApi || useApi;
        statusCode = req.body.statusCode || statusCode;
        message =
          req.body.message ||
          `Error ${statusCode}: Server is temporarily unavailable, please try again later.`;
        blockMethods = req.body.blockMethods || blockMethods;
      }
      mode = true;
      res.status(200).json({
        success: true,
        mode,
      });
    });

    app.delete(endpoint, checkAuthentication, (req, res) => {
      req.body?.reset && _resetData();
      mode = false;
      res
        .status(200)
        .json({ success: true, mode, resetData: Boolean(req.body?.reset) });
    });

    app.get(`${endpoint}/status`, (req, res) =>
      res.status(200).json({ success: true, mode })
    );

    app.use("/*", (req, res, next) => {
      if (mode && blockMethods.includes(req.method)) {
        return checkMaintenance(req, res, next);
      }
      return next();
    });
  };

  const checkMaintenance = (req, res, next) => {
    if (!mode) return next();
    const resWithCode = res.status(statusCode);
    if (useApi) return resWithCode.json({ statusCode, message });
    if (filePath)
      return resWithCode.sendFile(path.join(__dirname, `../../${filePath}`));
    return resWithCode.send(message);
  };

  return server(app);
};

module.exports = maintenance;
