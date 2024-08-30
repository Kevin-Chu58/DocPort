import { Dialog, DialogTitle, FormControl, Button, FormHelperText } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import SendIcon from '@mui/icons-material/Send';

const DocPortDialog = ({
    title,
    open,
    closeWord,
    actionWord = null,
    isDelete = false,
    isSend = false,
    isAction = false,
    disableAction = false,
    onClose,
    onAction,
    children,
    ...props
}) => {

    return (
        <Dialog open={open} onClose={onClose} props={props}>
            <div className="block column parachuting-bg">
                {/* title */}
                <DialogTitle className="block center-horizontal white bold">
                    {title.toUpperCase()}
                </DialogTitle>
                <FormControl className="block padding-20 white-bg">
                    {/* input fields inside the form */}
                    <FormHelperText className="block margin-left-max">* Required</FormHelperText>
                    {children}
                    {/* buttons */}
                    <div className="block margin-10 row space-between">
                        <Button variant="outlined" onClick={onClose}>
                            {closeWord}
                        </Button>
                        {actionWord && 
                            (isDelete && 
                                <Button
                                    variant="contained"
                                    onClick={onAction}
                                    startIcon={actionWord === "trash" ? <DeleteIcon /> : <DeleteForeverIcon />}
                                    color="warning"
                                    disabled={disableAction}
                                >
                                    {actionWord}
                                </Button>    
                            ) ||
                            (isSend && 
                                <Button
                                    variant="contained"
                                    onClick={onAction}
                                    endIcon={<SendIcon />}
                                    color="info"
                                    disabled={disableAction}
                                >
                                    {actionWord}
                                </Button>    
                            ) || 
                            (isAction &&
                                <Button
                                    variant="contained"
                                    onClick={onAction}
                                    disabled={disableAction}
                                >
                                    {actionWord}
                                </Button> 
                            )
                        }
                    </div>
                </FormControl>
            </div>
        </Dialog>
    );
};

export default DocPortDialog;