import {
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from "@mui/material";
import BackpackIcon from "@mui/icons-material/Backpack";
import DeleteIcon from "@mui/icons-material/Delete";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import React from "react";
import Docs from "./Docs";
import Bin from "./Bin";
import { getNavigation } from "../../services/HomeService";
import { DocType } from "../../constants";

const Home = (props) => {
    const navigate = useNavigate();

    const [directoryID, setDirectoryID] = useState(0);
    const [nav, setNav] = useState({
        titles: [],
        ids: [],
        isPrimeDirectory: true,
        title: "",
    });

    // retrieve the navigation info from API
    useEffect(() => {
        const loadData = async () => {
            let navs = await getNavigation(DocType.Doc, directoryID);
            setNav(navs);
        };

        loadData();
    }, [directoryID]);

    const pageNav = [
        {
            name: "docs",
            element: (
                <Docs
                    directoryID={directoryID}
                    nav={nav}
                    setDirectoryID={setDirectoryID}
                />
            ),
        },
        {
            name: "bin",
            element: <Bin />,
        },
    ];

    const sidebarItems = [
        {
            name: "Docs",
            element: <BackpackIcon />,
            onClick: () => navigate("/"),
        },
        {
            name: "Bin",
            element: <DeleteIcon />,
            onClick: () => navigate("/bin"),
        },
        {
            name: "Settings",
            element: <SettingsIcon />,
            onClick: () => navigate("/login"),
        },
        {
            name: "Logout",
            element: <LogoutIcon />,
            onClick: () => navigate("/login"),
        },
    ];

    return (
        <div className="block row views">
            {/* sidebar */}
            <div className="block row sidebar">
                <List>
                    {sidebarItems.map((item) => (
                        <ListItem
                            key={item.name}
                            style={{ padding: 0 }}
                            onClick={item.onClick}
                        >
                            <ListItemButton
                                style={{
                                    maxWidth: "15vw",
                                    minWidth: "100px",
                                    border: "transparent 2px solid",
                                    borderRadius: "20px",
                                }}
                            >
                                <ListItemIcon style={{ color: "#404756" }}>
                                    {item.element}
                                </ListItemIcon>
                                <ListItemText>{item.name}</ListItemText>
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </div>

            {/* directory view */}
            <div className="block 80vw">
                {pageNav.map(
                    (page) =>
                        props.page === page.name && (
                            <React.Fragment key={page.name}>
                                {page.element}
                            </React.Fragment>
                        )
                )}
            </div>
        </div>
    );
};

export default Home;
