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
import {
  GetDevice,
  getDevice,
  getAll,
  postDevice,
  PostDevice,
} from "./services/devices";
import { getLatest } from "./services/versions";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const devices = onRequest(async (request, response) => {
  const { method, query, body } = request;

  switch (method) {
    case "GET": {
      logger.info({ ...query, message: "query" });

      if (!query) {
        response.send("No params");
        return;
      }

      if (!(query && query.deviceId && typeof query.deviceId === "string")) {
        response.send(await getAll());
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
      if (!body) {
        response.send("No body");
        return;
      }
      if (!body.deviceId) {
        response.send("Insufficient Data");
        return;
      }

      const options: PostDevice = {
        ...body,
        version: body.version || "unknown",
      };

      const insertResult = await postDevice(options);
      response.send(insertResult);

      break;
    }
    case "PUT": {
      break;
    }
    case "PATCH": {
      const { deviceId } = body;
      const options: GetDevice = {
        deviceId: deviceId,
      };
      const existsDevice = await getDevice(options);
      if (!existsDevice)
        response.send("No existe el dispositivo con el id: " + deviceId);
      break;
    }
    default: {
      logger.info("Unsupported HTTP Method from IP - ", request.ip);
    }
  }

  response.send(method);
});

export const checkVersion = onRequest(async (request, response) => {
  const { body, method } = request;

  if (method !== "POST") {
    response.send("HTTP Method Not supported");
    return;
  }
  const { deviceId, version } = body;

  if (deviceId) {
    response.send("No device id");
    return;
  }

  const options: GetDevice = {
    deviceId: deviceId,
  };
  const existsDevice = await getDevice(options);
  if (!existsDevice) {
    let insertVersion = "unknown";
    if (version) {
      insertVersion = version;
    }
    const insertResult = await postDevice({ deviceId, version: insertVersion });
    response.send(insertResult);
    return;
  }

  const latestVersion = await getLatest();
  if (latestVersion.error) {
    response.send(latestVersion);
    return;
  }

  if (existsDevice.version === latestVersion) {
    response.send("No update needed");
  }

  response.send("Update needed");
});
