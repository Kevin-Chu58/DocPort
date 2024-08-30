import { useEffect, useState } from "react";

// because cat chases after mouse, lol
const Cat = ({ children, id, isHidden }) => {
    const [x, setX] = useState();
    const [y, setY] = useState();

    const setPos = (e) => {
        setX(e.clientX);
        setY(e.clientY);
    };

    useEffect(() => {
        // avoid creating duplicate event listener
        if (isHidden) document.removeEventListener("mousemove", setPos);
        else document.addEventListener("mousemove", setPos);
    }, [isHidden]);

    return isHidden ? (
        <></>
    ) : (
        <div id={id} style={{ top: y + 5, left: x + 5, position: "absolute" }}>
            {children}
        </div>
    );
};

export default Cat;
