var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/pushstate-js/dist/index.js
var require_dist = __commonJS({
  "node_modules/pushstate-js/dist/index.js"(exports, module2) {
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps2 = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
    var src_exports = {};
    __export(src_exports, {
      default: () => src_default
    });
    module2.exports = __toCommonJS(src_exports);
    var initializePushstateEvent2 = () => {
      const getCurrentUrl = () => {
        var _a;
        return ((_a = window == null ? void 0 : window.location) == null ? void 0 : _a.href) ?? "";
      };
      let currentUrl = getCurrentUrl();
      const observer = new MutationObserver(() => {
        const newUrl = getCurrentUrl();
        if (newUrl !== currentUrl) {
          const previousUrl = currentUrl;
          currentUrl = newUrl;
          const event = new Event("pushstate", {
            previous: previousUrl,
            current: currentUrl
          });
          window.dispatchEvent(event);
          if (typeof window.onpushstate === "function") {
            window.onpushstate(event);
          }
        }
      });
      observer.observe(document, { subtree: true, childList: true });
    };
    var src_default = initializePushstateEvent2;
  }
});

// src/index.ts
var import_pushstate_js = __toESM(require_dist());

// src/waitForElement.ts
var waitForElement = (selector, controller = new AbortController()) => {
  const promise = new Promise((resolve, reject) => {
    controller.signal.addEventListener("abort", () => {
      reject();
    });
    const element = document.querySelector(selector);
    if (element) {
      resolve(element);
      return;
    }
    let timeout;
    const observer = new MutationObserver(() => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        const element2 = document.querySelector(selector);
        if (element2) {
          observer.disconnect();
          resolve(element2);
          return;
        }
      }, 50);
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  });
  const cancel = () => {
    controller.abort();
  };
  return [promise, cancel];
};
var waitForElement_default = waitForElement;

// src/getGkLogo.ts
var darkModeSupported = window.matchMedia("(prefers-color-scheme: dark)").matches;
var isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
var gkBrandColor = "#179287";
var responsiveColor = `var(--color-fg-default, ${darkModeSupported ? isDarkMode ? "#fff" : "#000" : gkBrandColor})`;
var __getGkLogo_default_options = {
  fill: responsiveColor,
  size: 16,
  className: ""
};
var getGkLogo = (options) => {
  options = {
    ...__getGkLogo_default_options,
    ...options
  };
  const { fill, size, className } = options;
  return `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 184 184" width="${size}" height="${size}" class="${className}" style="enable-background:new 0 0 184 184;" xml:space="preserve">
    <g>
      <path style="fill: ${fill}" d="M177.2,48.4c-0.8-1.9-2.9-2.7-4.8-2c-1.3,0.5-2.2,1.8-2.2,3.2c0,0.4,0.1,0.9,0.2,1.3
        c16.3,43.3-5.7,91.6-49,107.9c-6,2.2-12.2,3.8-18.5,4.6v-39.1c2.5-0.5,4.9-1.1,7.3-1.9v32.9c41.3-10.1,66.7-51.7,56.6-93
        c-5.1-20.9-18.7-38.8-37.6-49.2c-1.8-1-4-0.3-4.9,1.4c0,0-0.1,0.1-0.1,0.1c-0.2,0.5-0.4,1.1-0.4,1.6c0,1.3,0.7,2.5,1.9,3.2
        c33.7,18.7,45.9,61.1,27.2,94.8c-7.8,14.2-20.4,25.2-35.4,31.1v-29.1c4.6-1.4,7.8-5.7,7.9-10.6c0-4-2-7.6-5.5-9.6
        c2.6-25.1,14.1-18.5,14.1-26.5v-4.7c0-12-27.8-51.1-40.8-52c-0.4,0-0.8,0-1.2,0s-0.8,0-1.2,0c-13,0.9-40.8,40-40.8,52.1v4.6
        c0,8,11.4,1.4,14.1,26.5c-3.4,2-5.5,5.7-5.5,9.6c0,4.9,3.2,9.1,7.9,10.6v29.1C30.7,131.2,13,90.8,27.2,54.9
        c5.9-15.1,16.9-27.6,31.1-35.5c1.8-1,2.4-3.2,1.4-5c-0.6-1.2-1.9-1.9-3.2-1.9c-0.6,0-1.2,0.2-1.7,0.5C17.5,33.6,4,80.5,24.6,117.7
        c10.4,18.9,28.3,32.5,49.2,37.6v-32.9c2.4,0.8,4.8,1.5,7.3,1.9v39.1c-45.9-6.1-78.1-48.2-72-94.1c0.8-6.3,2.4-12.5,4.6-18.4
        c0.7-1.8-0.2-3.9-2-4.6c-0.4-0.2-0.9-0.3-1.4-0.3c-1.5,0-2.9,0.9-3.4,2.4C-10.9,95.5,12.9,148,60,165.7c9.1,3.4,18.6,5.3,28.3,5.7
        v-46.1c1.3,0.1,3.7,0.1,3.7,0.1s2.4,0,3.7-0.1v46.1c50.2-2.1,89.3-44.5,87.2-94.7C182.5,67,180.6,57.5,177.2,48.4L177.2,48.4z
        M108.8,100.3c2.9-2.9,7.7-2.9,10.6,0c2.9,2.9,2.9,7.7,0,10.6c-2.9,2.9-7.7,2.9-10.6,0c-1.4-1.4-2.2-3.3-2.2-5.3
        C106.6,103.6,107.4,101.7,108.8,100.3L108.8,100.3z M75.2,110.9c-2.9,2.9-7.7,2.9-10.6,0s-2.9-7.7,0-10.6c2.9-2.9,7.7-2.9,10.6,0
        c1.4,1.4,2.2,3.3,2.2,5.3C77.4,107.6,76.6,109.5,75.2,110.9z"/>
    </g>
  </svg>`;
};
var getGkLogo_default = getGkLogo;

// src/index.ts
var dropdownLinkClass = "gk-link";
var alreadyInjected = () => document.getElementsByClassName(dropdownLinkClass).length > 0;
var cancelRender = void 0;
var render = async () => {
  var _a, _b, _c, _d, _e;
  if (alreadyInjected())
    return;
  console.log();
  if (typeof cancelRender === "function")
    cancelRender();
  const controller = new AbortController();
  cancelRender = () => controller.abort();
  const modal = await waitForElement_default('div [data-target="get-repo.modal"] ul', controller)[0];
  const modalChildren = modal ? Array.from(modal.children) : [];
  if (!modalChildren.length)
    return;
  const repoUrl = ((_b = (_a = modalChildren.find((elem) => elem.matches("li:first-of-type"))) == null ? void 0 : _a.querySelector("input[data-autoselect]")) == null ? void 0 : _b.value) || "";
  const repoUrlParts = repoUrl.split("/");
  const numCommits = Number((((_e = (_d = (_c = document.querySelector("svg.octicon-history")) == null ? void 0 : _c.nextElementSibling) == null ? void 0 : _d.querySelector("strong")) == null ? void 0 : _e.textContent) ?? "").replace(/,/g, ""));
  if (repoUrlParts.length < 4 || numCommits === 0)
    return;
  const user = repoUrl.split("/")[3];
  const repo = repoUrl.split("/")[4].replace(".git", "");
  const sha = await getFirstCommit(user, repo, numCommits, controller);
  if (sha) {
    const secondFromLast = modalChildren.reverse().find((elem) => elem.matches("li:nth-last-child(1)"));
    if (!secondFromLast || alreadyInjected())
      return;
    secondFromLast.insertAdjacentHTML("beforebegin", createLink(repoUrl, sha));
  }
};
var getFirstCommit = async (user, repo, numCommits, controller) => {
  if (numCommits === 0) {
    return null;
  }
  const fetchUrl = `https://api.github.com/repos/${user}/${repo}/commits?per_page=1&page=${numCommits}`;
  return await fetch(fetchUrl, { signal: controller.signal }).then((res) => res.json()).catch((error) => console.error(`Error fetching ${fetchUrl}
${error}`)).then(([commit]) => commit == null ? null : commit.sha);
};
var createLink = (repo, sha, commit = "") => {
  return `<li class="Box-row Box-row--hover-gray p-3 mt-0 rounded-0 ${dropdownLinkClass}">
    <a target="_blank" href="gitkraken://repolink/${sha}${commit ? `/commit/${commit}` : ""}?url=${repo}" class="d-flex flex-items-center color-fg-default text-bold no-underline">
      ${getGkLogo_default({ className: "mr-2" })} Open in GitKraken
    </a>
  </li>`;
};
(0, import_pushstate_js.default)();
render();
window.addEventListener("pushstate", render);
//# sourceMappingURL=index.js.map