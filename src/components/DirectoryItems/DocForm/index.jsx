import { TextField } from "@mui/material";
import { useEffect, useState } from "react";
import DocPortDialog from "../../DocPortDialog";
import DocExplorer from "./DocExplorer";

const DocForm = ({
    id,
    title,
    description,
    curDirectoryID,
    explorer,
    nav,
    open,
    onSubmit,
    onClose,
    onExpandExplorer,
    isPost,
    docType,
}) => {
    const [docTitle, setDocTitle] = useState();
    const [docDescription, setDocDescription] = useState();
    const [directoryID, setDirectoryID] = useState(0);
    const titleMax = 50;
    const descriptionMax = 500;

    const onAction = () => {
        let onSubmitAction = onSubmit();
        if (isPost) {
            onSubmitAction(docTitle, docDescription, directoryID).then(() =>
                onClose()
            );
        } else {
            onSubmitAction(id, docTitle, docDescription, directoryID).then(() =>
                onClose()
            );
        }
    };

    useEffect(() => {
        setDocTitle(title);
        setDocDescription(description);
        setDirectoryID(curDirectoryID);
    }, [description, curDirectoryID, title]);

    // get field length
    const getTitleLength = () => {
        return docTitle?.length ?? 0;
    };

    const getDescriptionLength = () => {
        return docDescription?.length ?? 0;
    };

    // check field length
    const checkTitle = () => {
        return getTitleLength() > titleMax || getTitleLength() === 0;
    };

    const checkDescription = () => {
        return getDescriptionLength() > descriptionMax;
    };

    // build helper text
    const getTitleHelper = () => {
        return getTitleLength() === 0
            ? "Title must not be blank"
            : checkTitle()
            ? `${getTitleLength() - titleMax} character${
                  getTitleLength() - titleMax === 1 ? "" : "s"
              } exceeded`
            : `${titleMax - getTitleLength()} character${
                  titleMax - getTitleLength() === 1 ? "" : "s"
              } left`;
    };

    const getDescriptionHelper = () => {
        return checkDescription()
            ? `${getDescriptionLength() - descriptionMax} character${
                  getDescriptionLength() - descriptionMax === 1 ? "" : "s"
              } left`
            : `${descriptionMax - getDescriptionLength()} character${
                  descriptionMax - getDescriptionLength() === 1 ? "" : "s"
              } left`;
    };

    // initialize Directory path string
    const getNavigation = () => {
        return `/${nav.titles.join("/")}${nav.title ? `/${nav.title}` : ""}`;
    };

    return (
        <DocPortDialog
            open={open}
            onClose={onClose}
            onAction={onAction}
            title={isPost ? `create new ${docType}` : `update ${docType}`}
            closeWord="cancel"
            actionWord={isPost ? "create" : "update"}
            isAction={true}
            disableAction={checkTitle() || checkDescription()}
        >
            <TextField
                className="block margin-10"
                type="text"
                variant="outlined"
                label="Title*"
                defaultValue={isPost ? `New ${docType}` : title}
                onChange={(e) => setDocTitle(e.target.value)}
                error={checkTitle()}
                helperText={getTitleHelper()}
            />
            <TextField
                className="block margin-10"
                type="text"
                variant="outlined"
                label="Description"
                multiline
                defaultValue={isPost ? "" : description}
                onChange={(e) => setDocDescription(e.target.value)}
                error={checkDescription()}
                helperText={getDescriptionHelper()}
            />

            <DocExplorer
                directoryID={directoryID}
                explorer={explorer}
                nav={nav}
                navStr={getNavigation()}
                onExpandExplorer={onExpandExplorer}
                setDirectoryID={setDirectoryID}
            />
        </DocPortDialog>
    );
};

export default DocForm;
