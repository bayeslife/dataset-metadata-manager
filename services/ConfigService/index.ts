import { createAzureFunctionHandler } from "azure-function-express";
import bodyparser from "body-parser";
import Debug from "debug";
import express from "express";
import passport from "passport";
import { authorizationStrategy } from "../src/auth";
import { config } from "../src/config";

const debug = Debug("ConfigService");

const app = express();
app.use(bodyparser.urlencoded({ extended: true }));
app.use(passport.initialize());
passport.use(authorizationStrategy(config));

app.get(
  "/api/ConfigService",  
  async (req, res) => {
    res.status(200).send({
      style: {
        endpoint: config.style.endpoint,
      },
      authentication: {
        clientId: config.authentication.clientId,
        tenantId: config.authentication.tenantId,
        scopes: config.authentication.scopes,
        redirectUri: config.authentication.redirectUri,
      }
    });
  }
);
export default createAzureFunctionHandler(app);

