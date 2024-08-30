import { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import DocRectangle from "../../../components/DirectoryItems/DocRectangle";
import NoDoc from "../../../components/DirectoryItems/NoDoc";
import { getBinDir, updateIsTrashed, deleteTrashes, deleteAllDir } from "../../../services/HomeService";
import DocToolBar from "../../../components/DirectoryItems/DocToolBar";
import DocToolBarUtils from "../../../components/DirectoryItems/DocToolBarHelper";
import TimeUtils from "../../../helpers/TimeHelper";

const Bin = () => {
    const [directoryItems, setDirectoryItems] = useState([]);
    const [reload, setReload] = useState(false);
    // focus list
    const [focused, setFocused] = useState([]);
    const [numFocused, setNumFocused] = useState(0);

    // retrieve all docs in Bin
    useEffect(() => {
        const loadData = async () => {
            let bin = await getBinDir();
            bin.forEach((binItem) => {
                binItem.content.lastTimeUpdated = TimeUtils.convert(binItem.content.lastTimeUpdated);
            })
            setDirectoryItems(bin);
        };

        loadData();
    }, [reload]);
    
    // initiate item focused
    useEffect(() => {
        let focusedList = [];
        directoryItems.forEach(() => focusedList.push(false));
        setFocused(focusedList);
        setNumFocused(0);
    }, [directoryItems]);

    // restore trashed directory item back to Docs
    let onTrash = (type, id) => {
        let itemToTrash = {
            type: type,
            id: id,
        }
        updateIsTrashed([itemToTrash]).then(() => setReload((prev) => !prev));
    };

    const onTrashs = () => {
        let itemsToTrash = [];
        focused.forEach((itemIsFocused, i) => {
            if (itemIsFocused) 
                itemsToTrash.push({
                    type: directoryItems[i].type,
                    id: directoryItems[i].content.id
                });
        });
        updateIsTrashed(itemsToTrash).then(() => setReload((prev) => !prev));
    }

    // on delete trashs
    const onDeleteTrash = (type, id) => {
        let itemToDelete = {
            type: type,
            id: id,
        }
        deleteTrashes([itemToDelete]).then(() => setReload((prev) => !prev));
    }

    const onDeleteTrashs = () => {
        let itemsToDelete = [];
        focused.forEach((isFocused, i) => {
            if(isFocused)
                itemsToDelete.push({
                    type: directoryItems[i].type,
                    id: directoryItems[i].content.id,
                });
        })

        deleteTrashes(itemsToDelete).then(() => setReload((prev) => !prev));
    }

    const onDeleteAll = () => {
        deleteAllDir().then(() => setReload((prev) => !prev));
    }

    return (
        <div className="block column margin-top-20">
            <div className="block row padding-10 font-size-24">
                <div className="block left center-vertical">
                    <Typography className="block pointer margin-2 nav-link">
                        Bin
                    </Typography>
                </div>
                {/* tool bar */}
                <DocToolBar
                    focusedOn={numFocused}
                    onFocusAll={() =>
                        DocToolBarUtils.onFocusAll(directoryItems.length, focused, setFocused, setNumFocused)
                    }
                    onNeglectAll={() =>
                        DocToolBarUtils.onNeglectAll(directoryItems.length, focused, setFocused, setNumFocused)
                    }
                    onTrash={onTrashs}
                    onDeleteTrashs={onDeleteTrashs}
                    onDleteAll={onDeleteAll}
                    inBin
                />
            </div>
            <div className="block divider" />
            <div className="block column center-horizontal wizard-white-bg padding-20 border-radius-bottom-10 overflow-y-auto directory-height">
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
                            onFocus={() =>
                                DocToolBarUtils.onFocus(
                                    i,
                                    focused,
                                    setFocused,
                                    setNumFocused
                                )
                            }
                            onTrash={onTrash}
                            onDeleteTrash={onDeleteTrash}
                            isTrashed={true}
                            isFocused={focused?.at(i) ?? false}
                        />
                    ))}
                {directoryItems.length === 0 && <NoDoc />}
            </div>
        </div>
    );
};

export default Bin;
