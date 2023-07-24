/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { GetDevice, getDevice, test } from "./services/devices";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const devices = onRequest(async (request, response) => {
  const { method, query } = request;

  switch (method) {
    case "GET": {
      logger.info(query);

      if (!query) {
        response.send("No params");
        return;
      }

      if (!(query && query.deviceId && typeof query.deviceId === "string")) {
        response.send(await test());
        return;
      }

      const options: GetDevice = {
        deviceId: query.deviceId,
        addVersion: query.addVersion ? true : false,
      };
      response.send(await getDevice(options));
      return;
    }
    case "POST": {
      break;
    }
    default: {
      logger.info("Unsupported HTTP Method from IP - ", request.ip);
    }
  }

  response.send(method);
});
