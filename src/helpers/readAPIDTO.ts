import { APIDTO } from "../types/APIDTO.type";

export const readAPIDTO = <T>(dto: APIDTO<T>): T => {
  if (dto.isError) {
    switch (true) {
      case dto.error instanceof Error:
        throw new Error(dto.error.message ?? "Unknown error");
      case typeof dto.error === "string":
        throw new Error(dto.error);
      default:
        console.error(dto.error);
        throw new Error("Unknown error");
    }
  }
  return dto.data;
};
