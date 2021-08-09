const path = require("path");

const maintenance = (app, options) => {
  var mode,
    accessKey,
    endpoint,
    filePath,
    useApi,
    statusCode,
    message,
    blockPost;

  const _resetData = () => {
    mode = false;
    accessKey;
    endpoint = "/maintenance";
    filePath = null;
    useApi = false;
    statusCode = 503;
    message = `Error ${statusCode}: Server is temporarily unavailable, please try again later.`;
    blockPost = false;
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
    blockPost = options.blockPost || blockPost;
  }

  const checkAuthentication = (req, res, next) => {
    if (!accessKey) return next();
    const isMatched = req.query.access_key === accessKey;
    return isMatched ? next() : res.sendStatus(401);
  };

  const server = (app) => {
    app.post(endpoint, checkAuthentication, (req, res) => {
      if (Object.keys(req.body).length) {
        filePath = req.body.filePath || filePath;
        useApi = req.body.useApi || useApi;
        statusCode = req.body.statusCode || statusCode;
        message =
          req.body.message ||
          `Error ${statusCode}: Server is temporarily unavailable, please try again later.`;
        blockPost = req.body.blockPost || blockPost;
      }
      mode = true;
      res.status(200).json({ success: true, mode });
    });

    app.delete(endpoint, checkAuthentication, (req, res) => {
      req.body?.reset && _resetData();
      mode = false;
      res.status(200).json({ success: true, mode, resetData: req.body?.reset });
    });

    app.get(`${endpoint}/status`, (req, res) =>
      res.status(200).json({ success: true, mode })
    );

    blockPost &&
      app.post("/*", (req, res, next) => {
        if (!mode) return next();
        return res.status(statusCode).send({ message });
      });

    app.get("/*", checkMaintenance);
  };

  const checkMaintenance = (req, res, next) => {
    if (!mode) return next();
    return useApi
      ? res.json({ statusCode, message })
      : filePath
      ? res
          .status(statusCode)
          .sendFile(path.join(__dirname, `../../${filePath}`))
      : res.send(message);
  };

  return server(app);
};

module.exports = maintenance;