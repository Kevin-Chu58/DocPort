import AddIcon from "@mui/icons-material/Add";
import { Button } from "@mui/material";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import { DocType } from "../../../constants";

const DocToolBar = ({
    focusedOn,
    onOpenDocForm,
    onFocusAll,
    onNeglectAll,
    onTrash,
    onDeleteTrashs,
    onDleteAll,
    inBin = false,
}) => {
    return (
        <div className="block row center-vertical margin-left-max">
            {focusedOn > 0 ? (
                inBin ? (
                    <>
                        <Button
                            className="block margin-10 border-radius-20 border-transparent"
                            variant="contained"
                            startIcon={<CheckBoxIcon />}
                            onClick={onFocusAll}
                        >
                            Select All
                        </Button>
                        <Button
                            className="block margin-10 border-radius-20"
                            variant="outlined"
                            startIcon={<CheckBoxOutlineBlankIcon />}
                            onClick={onNeglectAll}
                        >
                            Deselect All
                        </Button>
                        <Button
                            className="block margin-10 border-radius-20 border-transparent serious-bg"
                            variant="contained"
                            startIcon={<DeleteOutlinedIcon />}
                            onClick={onTrash}
                        >
                            Restore
                        </Button>
                        <Button
                            className="block margin-10 border-radius-20 border-transparent warning-bg"
                            variant="contained"
                            startIcon={<DeleteForeverOutlinedIcon />}
                            onClick={onDeleteTrashs}
                        >
                            Delete
                        </Button>
                    </>
                ) : (
                    <>
                        <Button
                            className="block margin-10 border-radius-20 border-transparent"
                            variant="contained"
                            startIcon={<CheckBoxIcon />}
                            onClick={onFocusAll}
                        >
                            Select All
                        </Button>
                        <Button
                            className="block margin-10 border-radius-20"
                            variant="outlined"
                            startIcon={<CheckBoxOutlineBlankIcon />}
                            onClick={onNeglectAll}
                        >
                            Deselect All
                        </Button>
                        <Button
                            className="block margin-10 border-radius-20 border-transparent serious-bg"
                            variant="contained"
                            startIcon={<DeleteOutlinedIcon />}
                            onClick={onTrash}
                        >
                            Trash
                        </Button>
                    </>
                )
            ) : (
                <>
                    {inBin ? (
                        <Button
                            className="block margin-10 border-radius-20 border-transparent warning-bg"
                            variant="contained"
                            startIcon={<DeleteForeverOutlinedIcon />}
                            onClick={onDleteAll}
                        >
                            Delete All
                        </Button>
                    ) : (
                        <>
                            <Button
                                className="block margin-10 border-radius-20 border-transparent"
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => onOpenDocForm(DocType.Doc)}
                            >
                                Doc
                            </Button>
                            <Button
                                className="block margin-10 border-radius-20 border-transparent"
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() =>
                                    onOpenDocForm(DocType.ContentHolder)
                                }
                            >
                                Content
                            </Button>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default DocToolBar;
