export const throttle = (callback: () => void, wait: number) => {
  let timeStamp = 0;
  return function (...args) {
    if (Date.now() - timeStamp > wait) {
      callback.apply(this, args);
      timeStamp = Date.now();
    }
  };
};
