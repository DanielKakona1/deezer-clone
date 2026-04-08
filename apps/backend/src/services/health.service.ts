export const getHealthPayload = () => {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
  };
};
