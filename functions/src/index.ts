/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onRequest } from "firebase-functions/v2/https";
import { getDevice, patchDevice, postDevice } from "./services/devices";
import { getLatest } from "./services/versions";
import { corsHandler } from "./cors";
import { ErrorResponse } from "./types/api.types";
import { logger } from "firebase-functions/v1";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const checkVersion = onRequest(async (request, response) => {
  corsHandler(request, response, async () => {
    const { body, method } = request;

    if (method !== "POST") {
      response.send("HTTP Method Not supported");
      return;
    }

    const { deviceId, version } = body;

    if (!deviceId) {
      response.send({
        error: 400,
        message: "No deviceId provided",
      } as ErrorResponse);
      return;
    }

    const existsDevice = await getDevice({ deviceId });
    if (existsDevice.type === "error") {
      response.send(existsDevice);
      return;
    }
    if (!existsDevice.data) {
      let insertVersion = "unknown";
      if (version) {
        insertVersion = version;
      }
      logger.info("Inserting new device");
      await postDevice({
        deviceId,
        version: insertVersion,
      });
    }

    if (
      existsDevice.type === "success" &&
      existsDevice.data &&
      version !== existsDevice.data.version
    ) {
      // Have to update version on firebase
      logger.info("Updating device");
      await patchDevice({ deviceId, version });
    }

    const latestVersion = await getLatest();
    if (latestVersion.error) {
      logger.info("Getting latest version");
      response.send(latestVersion);
      return;
    }

    const upToDate = version === latestVersion;
    if (upToDate) {
      logger.info("Up to date");
      response.send({
        upToDate,
        message: "Your app is up to date",
      });
      return;
    }

    logger.info("Not up to date");
    response.send({
      upToDate,
      message: "Your app is not up to date",
    });
  });
});
