import { Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { useFloating } from "@floating-ui/react-dom";

const maxShownChars = 12;
const maxShownLinks = 3;
const linksShownEachEnd = Math.floor(maxShownLinks / 2);

const Breadcrumbs = ({ titles, ids, isPrimeDirectory, curTitle, onClick }) => {
    const [showHiddenList, setShowHiddenList] = useState(false);
    const { refs, floatingStyles } = useFloating();

    useEffect(() => {
        setShowHiddenList(false);
    }, [titles]);

    const buildLink = (key, title, id) => {
        return (
            <div key={key} className="block row">
                <Typography
                    className="block pointer margin-2 nav-link"
                    onClick={() => onClick(id)}
                >
                    {title}
                </Typography>
                {!isPrimeDirectory && (
                    <Typography className="block margin-2 nav">
                        {">"}
                    </Typography>
                )}
            </div>
        );
    };

    // titles: titles of all parent Docs
    // ids: ids of all parent Docs
    // this method combine titles[] and ids[] to one array of objects containing properties of both
    const buildLinks = (titles, ids) => {
        let linkObjects = [];
        let isHiddenListBuilt = false;

        return (
            <>
                {titles.forEach((title, i) => {
                    linkObjects.push({
                        title: hideTitle(title),
                        id: ids[i],
                        isHidden: !(
                            i < linksShownEachEnd ||
                            i >= titles.length - linksShownEachEnd
                        ),
                    });
                })}

                {linkObjects.map((linkObject, i) => {

                    if (linkObject.isHidden) {
                        if (!isHiddenListBuilt) {
                            // check if hiddenList is built already, avoid duplicates
                            isHiddenListBuilt = true;
                            return buildHiddenList(
                                linkObjects.filter((x) => x.isHidden)
                            );
                        }
                    } else {
                        return buildLink(i, linkObject.title, linkObject.id);
                    }
                })}
            </>
        );
    };

    const hideTitle = (title) => {
        if (title.length > maxShownChars) {
            return title.slice(0, 12).concat("...");
        }

        return title;
    };

    const buildHiddenList = (hiddenLinkObjects) => {
        return (
            <div
                className="block column"
                onMouseOver={() => setShowHiddenList(true)}
                onMouseLeave={() => setShowHiddenList(false)}
                ref={refs.setReference}
            >
                <div className="block row">
                    <div className="block nav-link" id="hidden-links">{`...(${hiddenLinkObjects.length})`}</div>

                    <Typography className="block margin-2 nav">
                        {">"}
                    </Typography>
                </div>
                {showHiddenList && (
                    <div
                        className="block column"
                        ref={refs.setFloating}
                        style={floatingStyles}
                    >
                        <div
                            className="block column shade-median border-radius-5"
                            style={{
                                backgroundColor: "white",
                                border: "transparent 10px solid",
                            }}
                        >
                            {hiddenLinkObjects.map((hiddenLinkObject, i) => {
                                return buildLink(
                                    i,
                                    hiddenLinkObject.title,
                                    hiddenLinkObject.id
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="block left center-vertical">
            {buildLinks(titles, ids)}
            {!isPrimeDirectory && (
                <Typography key="currentDoc" className="block margin-2 nav">
                    {hideTitle(curTitle)}
                </Typography>
            )}
        </div>
    );
};

export default Breadcrumbs;
