import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
    Tooltip,
    IconButton,
    Menu,
    MenuItem,
    Paper,
    // Checkbox, ---- BUG: mui-checkbox has the issue of overlaying the floating components,
    //                the trigger also behaves the same
} from "@mui/material";
import { useState } from "react";
import { DocType } from "../../../constants";

const DocRectangle = ({
    id,
    type,
    title,
    lastTimeUpdated,
    description,
    onClick,
    onFocus,
    onOpenForm,
    onTrash,
    onDeleteTrash,
    isTrashed = false,
    isFocused,
    docOnHold = { type: undefined, id: 0 },
    handleMouseDown = () => {},
    handleMouseUp = () => {},
}) => {
    const [openMenu, setOpenMenu] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleOnFocus = () => {
        onFocus(id);
    };

    const handleOpenMenu = (event) => {
        event.stopPropagation();
        setOpenMenu(true);
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = (event) => {
        event.stopPropagation();
        setOpenMenu(false);
        setAnchorEl(null);
    };

    const handleOpenForm = (event) => {
        onOpenForm(type, id, title, description);
        handleMenuClose(event);
    };

    const handleTrashDoc = (event) => {
        onTrash(type, id);
        handleMenuClose(event);
    };

    const handleDeleteTrash = (event) => {
        onDeleteTrash(type, id);
        handleMenuClose(event);
    };

    // styling for different types
    const getBorderRadius = () => {
        switch (type) {
            case DocType.Doc:
                return "border-radius-10";
            case DocType.ContentHolder:
                return "border-radius-0";
        }
    };

    const getElevation = () => {
        switch (type) {
            case DocType.Doc:
                return 2;
            case DocType.ContentHolder:
                return 1;
        }
    };

    return (
        <div
            className="block row"
            onMouseDown={() => handleMouseDown(id, type, title)}
            onMouseUp={() =>
                // prevent drag & drop on itself
                docOnHold.id === id ? undefined : handleMouseUp(id)
            }
        >
            {/* <Checkbox
                className="block center-vertical"
                checked={isFocused}
                onChange={handleOnFocus}
            /> */}
            <div className="block center-vertical">
                <input type="checkbox" id={id} checked={isFocused} onChange={handleOnFocus}/>
            </div>
            <Paper
                className={`block margin-5 ${getBorderRadius()} border-transparent border-no-width`}
                elevation={getElevation()}
            >
                <div
                    className={`block column left vw76 ${
                        docOnHold.id === id && docOnHold.type === type
                            ? `golden-impression-bg`
                            : `white-bg`
                    } ${
                        docOnHold.id !== id || docOnHold.type !== type
                            ? `lilac-time-bg-hover`
                            : ""
                    } ${getBorderRadius()} ${
                        isFocused ? `border-black` : `border-transparent`
                    } padding-5`}
                    onDoubleClick={onClick}
                    // did not use onClick because that messes up DocToolBar behavior when drag & drop
                    onMouseUp={() => handleOnFocus()}
                >
                    <div className="block row font-size-24 space-between">
                        <div className="block center-vertical">{title}</div>
                        {description.trim() &&
                            <Tooltip title={description}>
                            <IconButton size="small">
                                <InfoOutlinedIcon
                                    fontSize="small"
                                    htmlColor="black"
                                />
                            </IconButton>
                        </Tooltip>}
                    </div>
                    <div className="block row space-between">
                        <div className="block center-vertical">
                            {lastTimeUpdated}
                        </div>
                            <IconButton size="small" onClick={handleOpenMenu}>
                                <MoreVertIcon />
                            </IconButton>

                        {/** menu after clicked MoreVertIcon */}
                        {isTrashed ? (
                            <Menu
                                id="doc-more-menu"
                                open={openMenu}
                                anchorEl={anchorEl}
                                onClose={handleMenuClose}
                            >
                                <MenuItem onClick={handleTrashDoc}>
                                    Restore
                                </MenuItem>
                                <MenuItem
                                    className="block warning"
                                    onClick={handleDeleteTrash}
                                >
                                    Delete
                                </MenuItem>
                            </Menu>
                        ) : (
                            <Menu
                                id="doc-more-menu"
                                open={openMenu}
                                anchorEl={anchorEl}
                                onClose={handleMenuClose}
                            >
                                <MenuItem onClick={handleOpenForm}>
                                    Edit
                                </MenuItem>
                                <MenuItem onClick={handleTrashDoc}>
                                    Trash
                                </MenuItem>
                            </Menu>
                        )}
                    </div>
                </div>
            </Paper>
        </div>
    );
};

export default DocRectangle;
