export const createAPIDTO = <T>(data: T, error?: any) => {
  return {
    data,
    isError: !!error,
    error: error || "",
  };
};
