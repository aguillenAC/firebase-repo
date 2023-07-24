import {
  DocumentData,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/init";
import { logger } from "firebase-functions/v1";
import {
  DeviceDocument,
  ErrorResponse,
  GetDeviceResponse,
} from "../types/api.types";

export interface GetDevice {
  deviceId: string;
  addVersion?: boolean;
}
/**
 *
 * @param {string} deviceId El id del dispositivo
 * @return {Promise<DocumentData | null>} Documento de firebase del dispositivo
 */
export async function getDevice(
  options: GetDevice
): Promise<GetDeviceResponse> {
  const { deviceId } = options;
  const docRef = doc(db, "devices", deviceId);
  try {
    const result = await getDoc(docRef);
    const data = result.data() as DeviceDocument;
    if (!result.exists()) return { type: "success", data: null };
    return { type: "success", data };
  } catch (error) {
    return { type: "error", error: 500, message: "Internal error" };
  }
}

/**
 *
 * @returns all devices and version
 */
export async function getAll() {
  return "Not supported yet";
  const q = query(collection(db, "devices"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(async (doc) => {
    const documentData = doc.data();
    let version = null;
    if (documentData.version) {
      const versionSnap = await getDoc(documentData.version);
      if (versionSnap.exists()) {
        version = versionSnap.data();
      }
    }
    logger.info("document", documentData);
    logger.info("version", version);
    const returnObj = { ...documentData, version };
    logger.info("returnObj", returnObj);
    return returnObj;
  });
}

export interface PostDevice {
  deviceId: string;
  version: string;
}
export type PostDeviceResponse =
  | {
      type: "success";
      data: DeviceDocument;
    }
  | ErrorResponse;

export async function postDevice(
  data: PostDevice
): Promise<PostDeviceResponse> {
  const { deviceId, version } = data;

  const createdAt = new Date().valueOf();
  try {
    const body = {
      version,
      createdAt,
    };
    await setDoc(doc(db, "devices", deviceId), body);
    return { type: "success", data: body };
  } catch (error) {
    return { type: "error", error: 500, message: "Internal error" };
  }
}

export interface PatchDevice {
  deviceId: string;
  version: string;
}
export type PatchDeviceResponse =
  | {
      type: "success";
      data: Partial<DeviceDocument>;
    }
  | ErrorResponse;
export async function patchDevice(
  data: PatchDevice
): Promise<PatchDeviceResponse> {
  const { deviceId, version } = data;
  const updateVersion = version || "unknown";
  try {
    const documentRef = doc(db, "devices", deviceId);
    await updateDoc(documentRef, {
      version: updateVersion,
      updatedAt: new Date().valueOf(),
    });
    return {
      type: "success",
      data: { version: updateVersion, updatedAt: new Date().valueOf() },
    };
  } catch (error) {
    return { type: "error", error: 500, message: "Internal error" };
  }
}
