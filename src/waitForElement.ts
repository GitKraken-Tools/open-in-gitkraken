// built using `waitForElement` function by Paul Kinlan:
// https://paul.kinlan.me/waiting-for-an-element-to-be-created/
const waitForElement = (
  selector: string,
  controller = new AbortController(),
): [Promise<Element>, () => void] => {
  const promise: Promise<Element> = new Promise((resolve, reject) => {
    controller.signal.addEventListener('abort', () => {
      reject();
    });
    const element = document.querySelector(selector);
    if (element) {
      resolve(element);
      return;
    }
    let timeout: ReturnType<typeof setTimeout>;
    const observer = new MutationObserver(() => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        const element = document.querySelector(selector);
        if (element) {
          observer.disconnect();
          resolve(element);
          return;
        }
      }, 50);
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  });
  const cancel = () => {
    controller.abort();
  }
  return [promise, cancel];
}

export default waitForElement;