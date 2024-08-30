import { useEffect, useState } from "react";
import {
    getByDirectoryID,
    updateIsTrashed,
    updateDirectory,
    postDoc,
    patchDoc,
    postContentHolder,
    patchContentHolder,
    getExplorer,
} from "../../../services/HomeService";
import DocRectangle from "../../../components/DirectoryItems/DocRectangle";
import NoDoc from "../../../components/DirectoryItems/NoDoc";
import DocForm from "../../../components/DirectoryItems/DocForm";
import Breadcrumbs from "../../../components/Breadcrumbs";
import DocToolBar from "../../../components/DirectoryItems/DocToolBar";
import DocToolBarUtils from "../../../components/DirectoryItems/DocToolBarHelper";
import TimeUtils from "../../../helpers/TimeHelper";
import Cat from "../../../components/Cat";
import { Paper } from "@mui/material";
import { DocType, DocTypeExpression } from "../../../constants";

const Docs = ({ directoryID, nav, setDirectoryID }) => {
    const [directoryItems, setDirectoryItems] = useState([]); // stuff in the directory
    const [reload, setReload] = useState(false);
    const [docOnHold, setDocOnHold] = useState({ type: undefined, id: 0 }); // directory patch view model
    const [titleOnHold, setTitleOnHold] = useState();
    // doc form
    const [ID, setID] = useState();
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState();
    const [description, setDescription] = useState();
    const [explorer, setExplorer] = useState();
    const [isPost, setIsPost] = useState(false);
    const [docType, setDocType] = useState();
    // focus list
    const [focused, setFocused] = useState([]);
    const [numFocused, setNumFocused] = useState(0);

    // retrieve all docs and basic explorer in a directory from API
    useEffect(() => {
        const loadData = async () => {
            let directoryItems = await getByDirectoryID(directoryID);
            directoryItems.forEach((docItem) => {
                docItem.content.lastTimeUpdated = TimeUtils.convert(
                    docItem.content.lastTimeUpdated
                );
            });
            setDirectoryItems(directoryItems);

            let explorer = await getExplorer(0); // must be 0 so the explorer starts from the root directory
            setExplorer(explorer);
        };

        loadData();
    }, [directoryID, reload]);

    // initiate directoryItems focused
    useEffect(() => {
        let focusedList = [];
        directoryItems.forEach(() => focusedList.push(false));
        setFocused(focusedList);
        setNumFocused(0);
    }, [directoryItems]);

    // doc navigation
    const onOpenUpdateDocForm = (type, id, title, description) => {
        setDocType(type);
        setIsPost(false);
        setID(id);
        setTitle(title);
        setDescription(description);
        setOpen(true);
    };

    // doc form
    const onOpenPostDocForm = (type) => {
        setDocType(type);
        setIsPost(true);
        setTitle(`new ${DocTypeExpression.get(type)}`);
        setDescription("");
        setOpen(true);
    };

    //TODO - FIX: open form ContentHolder directoryID does not change

    const onCloseDocForm = () => {
        setOpen(false);
        setReload((prev) => !prev);
        setTitle();
        setDescription();
    };

    const onSubmitDocForm = () => {
        switch (docType) {
            case DocType.Doc:
                return isPost ? onPostDoc : onUpdateDoc;
            case DocType.ContentHolder:
                return isPost ? onPostContentHolder : onUpdateContentHolder;
        }
    };

    const onExpandExplorer = (docID, nav) => {
        return new Promise((resolve) => {
            // my brain is dead on this, no pointers in JavaScript, ggwp :(
            const navigate = (obj, i) => {
                return obj.docs[i];
            };
            let destination = nav.reduce(navigate, explorer);

            // return the destinated navigation of the current Doc in Resolve()
            if (destination.docs === null)
                // console.log("start", new Date().getTime() / 1000);
                getExplorer(docID).then((res) => {
                    destination.docs = res.docs;
                    setExplorer(explorer);
                    resolve();
                });
            else resolve();
        });
    };

    const onPostDoc = (title, description, directoryID) => {
        let newDoc = {
            title: title,
            description: description,
            directoryID: directoryID,
        };
        return postDoc(newDoc);
    };

    const onUpdateDoc = (id, title, description, directoryID) => {
        let doc = {
            ID: id,
            title: title,
            description: description,
            directoryID: directoryID,
        };
        return patchDoc(id, doc);
    };
    const onPostContentHolder = (title, description, directoryID) => {
        let newCh = {
            title: title,
            description: description,
            directoryID: directoryID,
        };
        return postContentHolder(newCh);
    };

    const onUpdateContentHolder = (id, title, description, directoryID) => {
        let ch = {
            ID: id,
            title: title,
            description: description,
            directoryID: directoryID,
        };
        return patchContentHolder(id, ch);
    };

    // trash directory item
    const onTrash = (type, id) => {
        let directoryPatch = {
            type: type,
            id: id,
        };
        updateIsTrashed([directoryPatch]).then(() =>
            setReload((prev) => !prev)
        );
    };

    const onTrashs = () => {
        let itemsToTrash = [];
        focused.forEach((itemIsFocused, i) => {
            if (itemIsFocused)
                itemsToTrash.push({
                    type: directoryItems[i].type,
                    id: directoryItems[i].content.id,
                });
        });
        updateIsTrashed(itemsToTrash).then(() => setReload((prev) => !prev));
    };

    // mouse events - drag & drop

    const handleMouseDown = (ID, type, title) => {
        // on hold
        let timer = setTimeout(() => {
            setDocOnHold({ type: type, id: ID });
            setTitleOnHold(title);
            final();
        }, 200);

        // on click
        let func = () => {
            clearTimeout(timer);
            final();
        };

        // finally
        let final = () => {
            document.removeEventListener("mouseup", func);
        };

        document.addEventListener("mouseup", func);
    };

    const handleMouseUp = (ID) => {
        if (docOnHold.id > 0)
            updateDirectory(ID, docOnHold).then(() => {
                handleMouseUpDefault();
                setReload((prev) => !prev);
            });
    };

    const handleMouseUpDefault = () => {
        setDocOnHold({ type: undefined, id: 0 });
    };

    return (
        <div
            className="block column"
            onMouseUp={() => handleMouseUpDefault()}
        >
            <div className="block font-size-24 bar">
                {/* nav bar */}
                <Breadcrumbs
                    titles={nav.titles}
                    ids={nav.ids}
                    isPrimeDirectory={nav.isPrimeDirectory}
                    curTitle={nav.title}
                    onClick={setDirectoryID}
                />
                {/* tool bar */}
                <DocToolBar
                    focusedOn={numFocused}
                    onOpenDocForm={onOpenPostDocForm}
                    onFocusAll={() =>
                        DocToolBarUtils.onFocusAll(
                            directoryItems.length,
                            focused,
                            setFocused,
                            setNumFocused
                        )
                    }
                    onNeglectAll={() =>
                        DocToolBarUtils.onNeglectAll(
                            directoryItems.length,
                            focused,
                            setFocused,
                            setNumFocused
                        )
                    }
                    onTrash={onTrashs}
                />
            </div>
            
            <div className="block divider" />
            <div className="_ overflow-x-hidden overflow-y-auto directory-height">
            <div className="block column center-horizontal wizard-white-bg padding-20 border-radius-bottom-10">
                {directoryItems.length > 0 &&
                    directoryItems.map((item, i) => (
                        <DocRectangle
                            key={`${item.type}${item.content.id}`}
                            id={item.content.id}
                            type={item.type}
                            recId={item.content.id}
                            title={item.content.title}
                            lastTimeUpdated={item.content.lastTimeUpdated}
                            description={item.content.description}
                            onClick={
                                item.type === DocType.Doc
                                    ? () => setDirectoryID(item.content.id)
                                    : undefined
                            }
                            onFocus={() =>
                                docOnHold.id > 0
                                    ? undefined
                                    : DocToolBarUtils.onFocus(
                                          i,
                                          focused,
                                          setFocused,
                                          setNumFocused
                                      )
                            }
                            onOpenForm={onOpenUpdateDocForm}
                            onTrash={onTrash}
                            isFocused={focused?.at(i) ?? false}
                            docOnHold={docOnHold}
                            handleMouseDown={handleMouseDown}
                            handleMouseUp={handleMouseUp}
                        />
                    ))}
                {directoryItems.length === 0 && <NoDoc />}
                <DocForm
                    id={ID}
                    title={title}
                    description={description}
                    curDirectoryID={directoryID}
                    explorer={explorer}
                    nav={nav}
                    open={open}
                    onClose={onCloseDocForm}
                    onSubmit={onSubmitDocForm}
                    onExpandExplorer={onExpandExplorer}
                    isPost={isPost}
                    docType={DocTypeExpression.get(docType)}
                />
            </div>
            </div>
            <Cat id="docDrag" isHidden={docOnHold.id === 0}>
                <Paper
                    className="block padding-5 border-radius-5 border-transparent"
                    elevation={4}
                >
                    {titleOnHold}
                </Paper>
            </Cat>
        </div>
    );
};

export default Docs;
