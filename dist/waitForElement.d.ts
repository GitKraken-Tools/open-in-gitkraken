declare const waitForElement: (selector: string, controller?: AbortController) => [Promise<Element>, () => void];
export default waitForElement;
