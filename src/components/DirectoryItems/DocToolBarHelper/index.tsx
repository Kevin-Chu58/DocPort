/// focused list actions

const onFocus = (
    i: number,
    focused: [boolean],
    setFocused: (arg: [boolean]) => void,
    setNumFocused: (arg: number) => void,
    isManipulated = false,
    checked = false,
) => {
    let focusedList = focused;
    if (isManipulated) {
        focusedList[i] = checked;
    } else {
        focusedList[i] = !focusedList[i];
    }
    setFocused(focusedList);

    setNumFocused(focusedList.filter((x) => x).length);
};

const onFocusAll = (
    numItems: number,
    focused: [boolean],
    setFocused: (arg: [boolean]) => void,
    setNumFocused: (arg: number) => void
) => {
    for (let i = 0; i < numItems; i++) 
        onFocus(i, focused, setFocused, setNumFocused, true, true);
};

const onNeglectAll = (
    numItems: number,
    focused: [boolean],
    setFocused: (arg: [boolean]) => void,
    setNumFocused: (arg: number) => void
) => {
    for (let i = 0; i < numItems; i++) 
        onFocus(i, focused, setFocused, setNumFocused, true, false);
};

const DocToolBarHelper = {
    onFocus,
    onFocusAll,
    onNeglectAll,
};

export default DocToolBarHelper;
