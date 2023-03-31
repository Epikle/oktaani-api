export const fakeDelay = (delay: number) => {
  if (process.env.NODE_ENV === 'development') {
    return new Promise((resolve) => setTimeout(resolve, delay));
  }
  return null;
};
