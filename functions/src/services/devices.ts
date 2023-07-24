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
  addVersion?: boolean;
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
export async function postDevice(data: PostDevice) {
  const { deviceId, version } = data;
  const result = await setDoc(doc(db, "devices", deviceId), {
    version,
    updatedAt: null,
    createdAt: new Date().valueOf(),
  });
  return result;
}
