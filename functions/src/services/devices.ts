import { logger } from "firebase-functions/v1";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/init";
import {
  DeviceDocument,
  GetDevice,
  GetDeviceResponse,
  PatchDevice,
  PatchDeviceResponse,
  PostDevice,
  PostDeviceResponse,
} from "../types/api.types";

/**
 * Busca dispositivo por mobile identification number en firestore
 * @param {GetDevice} options El id del dispositivo
 * @return {Promise<GetDeviceResponse>} Documento de firebase del dispositivo
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
 * Inserta un nuevo dispositivo en firestore
 * @param {PostDevice} data El id del dispositivo y la version por agregar del apk
 * @return {Promise<PostDeviceResponse>} Documento de firebase agregado
 */
export async function postDevice(
  data: PostDevice
): Promise<PostDeviceResponse> {
  const { deviceId, version, user } = data;
  const createdAt = new Date().valueOf();
  try {
    const body: DeviceDocument = {
      version,
      createdAt,
    };
    if (user) body.user = user;
    logger.info({ ...body, message: "Inserting new device" });
    await setDoc(doc(db, "devices", deviceId), body);
    return { type: "success", data: body };
  } catch (error) {
    return { type: "error", error: 500, message: "Internal error" };
  }
}

/**
 * Actualiza la versión y actualiza el campo updatedAt
 * @param {PatchDevice} data El id del dispositivo y la version actual del apk
 * @return {Promise<PatchDeviceResponse>} Documento de firebase actualizado
 */
export async function patchDevice(
  data: PatchDevice
): Promise<PatchDeviceResponse> {
  const { deviceId, version, user } = data;
  const updateVersion = version || "unknown";
  try {
    const documentRef = doc(db, "devices", deviceId);
    const updatePayload: Partial<DeviceDocument> = {
      version: updateVersion,
      updatedAt: new Date().valueOf(),
    };
    if (user) updatePayload.user = user;
    logger.info({ ...updatePayload, message: "Updating device" });
    await updateDoc(documentRef, updatePayload);
    return {
      type: "success",
      data: { version: updateVersion, updatedAt: new Date().valueOf() },
    };
  } catch (error) {
    return { type: "error", error: 500, message: "Internal error" };
  }
}
