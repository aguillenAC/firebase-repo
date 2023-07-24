import {
  DocumentData,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase/init";
import { logger } from "firebase-functions/v1";

export interface GetDevice {
  deviceId: string;
  addVersion: boolean;
}
/**
 *
 * @param {string} deviceId El id del dispositivo
 * @return {Promise<DocumentData | null>} Documento de firebase del dispositivo
 */
export async function getDevice(options: GetDevice) {
  const { deviceId, addVersion } = options;
  const docRef = doc(db, "devices", deviceId);
  const result = await getDoc(docRef);
  if (!result.exists()) return null;

  const data = result.data();
  let version = null;

  if (addVersion && data.version) {
    logger.info("data.version", data.version);
    const versionSnap = await getDoc(data.version);
    if (versionSnap.exists()) version = versionSnap.data();
  }

  return { ...data, version };
}

/**
 *
 * @returns test
 */
export async function test() {
  const q = query(collection(db, "devices"));
  const snapshot = await getDocs(q);
  return snapshot;
}
