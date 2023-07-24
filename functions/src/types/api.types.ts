export interface DeviceDocument {
  version: string;
  createdAt: number;
  updatedAt?: number;
}

export interface ErrorResponse {
  type: "error";
  error: number;
  message: string;
}

export type GetDeviceResponse =
  | {
      type: "success";
      data: DeviceDocument | null;
    }
  | ErrorResponse;

export type ResponseVMS<T> = T | ErrorResponse;
