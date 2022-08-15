const bodyParser = require("body-parser");
const express = require("express");
const logger = require("../utils/logger");
const config = require("../config");
const { ValidationError, RequestError } = require("../utils/error");
const validationErrorHandler = require("../utils/validation-error");
const TelegramBot = require("../bot/index");

class ExpressLoader {
  constructor() {
    const app = express();
    app.use(
      bodyParser.urlencoded({
        extended: false,
        limit: "20mb",
      })
    );
    app.use(bodyParser.json({ limit: "20mb" }));

    // catch 404 and forward to error handler
    app.use((req, res, next) => {
      const err = new Error(`Not Found ${req.path}.`);
      err.status = 404;
      next(err);
    });

    app.use((error, req, res, next) => {
      // this middleware for status code - 400
      if (error instanceof ValidationError) {
        error.errors = validationErrorHandler(error.errors);
      } else if (error instanceof RequestError) {
        error.errors = validationErrorHandler({ RequestError: error.toJSON() });
      } else if (error.name === "MongoError") {
        error.errors = validationErrorHandler({ MongoError: error });
      } else if (error.errors) {
        error.errors = validationErrorHandler(error.errors);
      }
      next(error);
    });

    app.use((error, req, res, next) => {
      logger.error(error);
      if (error.errors) {
        console.log("ERROR", error);
        try {
          return res.status(error.status ? error.status : 400).json({
            error: {
              name: error.name,
              errors: error.errors,
            },
          });
        } catch (e) {
          return res.status(400).json({
            error: {
              name: "Server error",
              errors: "Server error. Please, contact support.",
            },
          });
        }
      }
      next(error);
    });

    app.use((err, req, res) => {
      const errStatus = err.status || 500;
      if (errStatus === 500) {
        if (config.error.sendFullErrors) {
          console.error("server error", err.message, err);
        } else {
          console.error("server error", err.message);
        }
      }
      const errorRender = {
        error: {
          name: "Server error",
          errors: err.message,
        },
      };
      res.status(errStatus).json(errorRender);
    });

    // Start application
    app.listen(config.app.port, async () => {
      logger.info(`Express running, now listening on port ${config.app.port}`);
    }).setTimeout(120000);

    TelegramBot.launch().then(res => {
      logger.info(`Telegram BOT has been lunched!`);
    })
  }
}

module.exports = ExpressLoader;
