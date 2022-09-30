/// <reference types="chrome" />
declare const PULL_REQUEST_PATH_REGEXP: RegExp;
declare class OptionValidationError extends Error {
    constructor(message: any);
}
declare function getOptions(): Promise<{
    [key: string]: any;
}>;
declare function getVscodeLink({ repo, file, isFolder, line, }: {
    repo: any;
    file: any;
    isFolder: any;
    line: any;
}, { remoteHost, insidersBuild, basePath, debug, }: {
    remoteHost: any;
    insidersBuild: any;
    basePath: any;
    debug: any;
}): string;
declare function isPR(linkUrl: any): boolean;
declare function parseLink(linkUrl: any, selectionText: any, pageUrl: any): {
    repo: string;
    file: any;
    isFolder: boolean;
    line: any;
};
declare function getCurrentTab(): Promise<chrome.tabs.Tab>;
declare function injectedAlert(message: any): void;
declare function injectedWindowOpen(url: any): void;
declare function openInVscode({ linkUrl, selectionText, pageUrl }: {
    linkUrl: any;
    selectionText: any;
    pageUrl: any;
}): Promise<void>;
declare const contextMenuId = "open-in-vscode-context-menu";
