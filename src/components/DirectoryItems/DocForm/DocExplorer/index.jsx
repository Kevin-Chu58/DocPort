import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import FolderIcon from "@mui/icons-material/Folder";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { TreeView, TreeItem } from "@mui/x-tree-view";
import { useEffect, useState } from "react";
import { TextField, Button, Box, Tooltip } from "@mui/material";
import DocPortDialog from "../../../DocPortDialog";

const DocExplorer = ({
    directoryID,
    explorer,
    nav,
    navStr,
    onExpandExplorer,
    setDirectoryID,
}) => {
    const [updatedExplorer, setUpdatedExplorer] = useState(explorer);
    const [navigation, setNavigation] = useState(navStr);
    const [reload, setReolad] = useState();
    // explorer form
    const [open, setOpen] = useState(false);
    const [hasSelected, setHasSelected] = useState(false);
    const [formNavigation, setFormNavigation] = useState(navStr);

    // reload the UI when explorer is updated
    useEffect(() => {
        setUpdatedExplorer(explorer);
    }, [explorer, reload]);

    // given the doc id and nav [indexes of explorer],
    // send API request to get the sub explorer of the doc id,
    // then replace the original sub explorer with the new one
    const handleExpandExplorer = (id, title, nav) => {
        onExpandExplorer(id, nav).then(() => {
            // console.log("end", new Date().getTime() / 1000);
            setReolad((prev) => !prev);
            setFormNavigation(unpackNavigation(nav, title));
            setDirectoryID(id);
            if (!hasSelected) setHasSelected(true);
        });
    };

    // given the nav [indexes of explorer] and doc title,
    // return a string combined by the titles of each level of navigated explorer
    const unpackNavigation = (nav, title) => {
        let curExplorer = explorer;
        let navStr = [];
        nav.forEach((index) => {
            navStr.push(curExplorer.title);
            curExplorer = curExplorer.docs[index];
        });

        return navStr.length > 0 ? `/${navStr.join("/")}/${title}` : "/Docs";
    };

    // form actions
    const handleFormConfirm = () => {
        setNavigation(formNavigation);
        setOpen(false);
        setHasSelected(false);
    };

    const addTreeItem = (explorer, navList, nav = []) => {
    
        return explorer.subDocsInside > 0 ? (
            <TreeItem
                className="_ MuiTreeItem-root"
                key={explorer.id}
                nodeId={`${explorer.id}`}
                label={
                    <div>
                        <strong>{`(${explorer.subDocsInside})`}</strong>
                        {` ${explorer.title}`}
                    </div>
                }
                onClick={() =>
                    handleExpandExplorer(explorer.id, explorer.title, nav)
                }
            >
                {explorer.docs ? (
                    explorer.docs.map((doc, i) =>
                        addTreeItem(doc, navList, [...nav, i])
                    )
                ) : (
                    <TreeItem
                        key="loading"
                        nodeId="loading"
                        icon={<MoreHorizIcon />}
                        label="loading"
                    />
                )}
            </TreeItem>
        ) : (
            <TreeItem
                key={explorer.id}
                nodeId={`${explorer.id}`}
                icon={<FolderIcon />}
                label={explorer.title}
                onClick={() =>
                    handleExpandExplorer(explorer.id, explorer.title, nav)
                }
            />
        );
    };

    return (
        <div>
            <Tooltip title={navigation}>
                <TextField
                    className="block margin-10"
                    type="text"
                    variant="outlined"
                    label="Directory*"
                    InputProps={{
                        readOnly: true,
                    }}
                    value={navigation}
                />
            </Tooltip>
            <Button
                className="block margin-10 border-radius-20 border-transparent font-size-10"
                variant="contained"
                onClick={() => setOpen(true)}
            >
                Change
            </Button>

            <DocPortDialog
                title="change directory"
                open={open}
                closeWord="cancel"
                actionWord="confirm"
                onClose={() => setOpen(false)}
                onAction={() => handleFormConfirm()}
                isAction={true}
                disableAction={!hasSelected}
            >
                <Tooltip title={formNavigation}>
                    <TextField
                        className="block margin-10"
                        type="text"
                        variant="outlined"
                        label="Directory*"
                        InputProps={{
                            readOnly: true,
                        }}
                        value={formNavigation}
                    />
                </Tooltip>
                <Box sx={{ maxHeight: 300, width: 500, overflow: "auto" }}>
                    <TreeView
                        className="_ margin-20"
                        defaultExpanded={["0"]}
                        defaultSelected={["0"]}
                        defaultCollapseIcon={<ExpandMoreIcon />}
                        defaultExpandIcon={<ChevronRightIcon />}
                    >
                        {addTreeItem(updatedExplorer, [...nav.ids, directoryID])}
                    </TreeView>
                </Box>
            </DocPortDialog>
        </div>
    );
};

export default DocExplorer;
