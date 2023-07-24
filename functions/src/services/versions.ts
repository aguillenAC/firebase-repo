import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/init";

export async function getLatest() {
  const docRef = doc(db, "versions", "latest");
  const result = await getDoc(docRef);
  if (!result.exists())
    return { error: 404, message: "No version set to latest" };

  const resultData = result.data();
  const latestVersionId = resultData.versionId;
  return latestVersionId;
}
