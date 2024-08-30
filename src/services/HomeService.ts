import httpUtils from "./http";

type DocPost = {
    title: string;
    description?: string;
    directoryID: number;
};

type Doc = DocPost & {
    id: number;
    isTrashed: boolean;
    isTrashedPrime: boolean;
};

type ContentHolderPost = {
    title: string;
    description?: string;
    directoryID: number;
};

type ContentHolder = ContentHolderPost & {
    id: number;
    isTrashed: boolean;
    isTrashedPrime: boolean;
};

type DocNav = {
    ids: number[];
    titles: string[];
    isPrimeDirectory: boolean;
    title: string;
};

type DocExplorer = {
    id: number;
    title: string;
    docs: DocExplorer[];
    SubDocsInside: number;
};

type Directory = {
    type: string;
    content: Doc | ContentHolder;
};

type DirectoryPatch = {
    type: string;
    id: number;
};

// directory routes

const getByDirectoryID = (directoryID: number): Promise<Directory[]> => {
    return httpUtils.get(`Directory/${directoryID}`);
};

const getBinDir = (): Promise<Directory[]> => {
    return httpUtils.get("Directory/bin");
};

const getNavigation = (type: string, id: number): Promise<DocNav> => {
    return httpUtils.get(`Directory/nav/type=${type}&id=${id}`);
};

const updateDirectory = (
    directoryID: number,
    updateInfo: DirectoryPatch
): Promise<Directory> => {
    return httpUtils.patch(`Directory/${directoryID}`, updateInfo);
};

const updateIsTrashed = (
    updateInfo: DirectoryPatch[]
): Promise<Directory[]> => {
    return httpUtils.patch("Directory/trash", updateInfo);
};

const deleteTrashes = (deleteList: DirectoryPatch[]): Promise<Directory[]> => {
    return httpUtils.del("Directory", deleteList);
};

// (test route)
const deleteAllDir = (): Promise<Directory[]> => {
    return httpUtils.del("all");
};

// doc routes

const postDoc = (doc: DocPost): Promise<Doc> => {
    return httpUtils.post("Docs", doc);
};

const patchDoc = (docID: number, doc: DocPost): Promise<Doc> => {
    return httpUtils.patch(`Docs/${docID}`, doc);
};

const getExplorer = (docID: number): Promise<DocExplorer> => {
    return httpUtils.get(`Docs/explorer/${docID}`);
};

// content holders

const postContentHolder = (ch: ContentHolderPost): Promise<ContentHolder> => {
    return httpUtils.post("ContentHolders", ch);
};

const patchContentHolder = (
    chID: number,
    chToUpdate: ContentHolderPost
): Promise<ContentHolder> => {
    return httpUtils.patch(`ContentHolders/${chID}`, chToUpdate);
};

export {
    getByDirectoryID,
    getBinDir,
    getNavigation,
    updateDirectory,
    updateIsTrashed,
    deleteTrashes,
    deleteAllDir,
    // docs
    postDoc,
    patchDoc,
    getExplorer,
    // contentHolders
    postContentHolder,
    patchContentHolder,
    Doc,
    ContentHolder,
    Directory,
    DirectoryPatch,
};
