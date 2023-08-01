export interface DeviceDocument {
  version: string;
  createdAt: number;
  updatedAt?: number;
  user?: string;
}

export interface ErrorResponse {
  type: "error";
  error: number;
  message: string;
}

type FirebaseFetch<T> = { type: "success"; data: T } | ErrorResponse;

export interface GetDevice {
  deviceId: string;
  addVersion?: boolean;
}
export type GetDeviceResponse = FirebaseFetch<DeviceDocument | null>;

export interface PostDevice {
  deviceId: string;
  version: string;
  user?: string;
}
export type PostDeviceResponse = FirebaseFetch<DeviceDocument>;

export interface PatchDevice {
  deviceId: string;
  version: string;
  user?: string;
}
export type PatchDeviceResponse = FirebaseFetch<Partial<DeviceDocument>>;
