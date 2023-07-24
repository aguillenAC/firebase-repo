/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onRequest } from "firebase-functions/v2/https";
import {
  GetDevice,
  getDevice,
  patchDevice,
  postDevice,
} from "./services/devices";
import { getLatest } from "./services/versions";
import { corsHandler } from "./cors";
import { ErrorResponse, ResponseVMS } from "./types/api.types";

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

    const options: GetDevice = {
      deviceId: deviceId,
    };
    const existsDevice = await getDevice(options);

    if (existsDevice.type === "error") {
      response.send(existsDevice);
      return;
    }

    if (!existsDevice.data) {
      let insertVersion = "unknown";
      if (version) {
        insertVersion = version;
      }
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
      //Have to update version on firebase
      await patchDevice({ deviceId, version });
    }

    const latestVersion = await getLatest();
    if (latestVersion.error) {
      response.send(latestVersion);
      return;
    }

    const upToDate = version === latestVersion;
    if (upToDate) {
      response.send({
        upToDate,
        message: "Your app is up to date",
      });
      return;
    }

    response.send({
      upToDate,
      message: "Your app is not up to date",
    });
  });
});
