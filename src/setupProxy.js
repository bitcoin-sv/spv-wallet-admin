const fs = require("fs");
const path = require("path");

module.exports = function(app) {
  app.use("/env-config.json", (_req, res, _next) => {
    let config;
    try {
      config = fs.readFileSync(
        path.resolve(__dirname, "../env-config.json"),
        "utf-8"
      );
    } catch (err) {
      res.send();
      return;
    }

    try {
      const jsonConfig = JSON.parse(config);
      res.status(200).send(jsonConfig);
    } catch (err) {
      res.send();
    }
  });
};
