const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };

const convert = (time) => {
    let date = new Date(time);

    let hrCorrection = date.toString().split("GMT")[1].substring(0, 3);
    date.setHours(date.getHours() + Number.parseInt(hrCorrection));

    let localeDate = date.toLocaleDateString("en-us", options);
    let localeTime = date.toLocaleTimeString("en-us");

    

    return `${localeDate} ${localeTime}`;
}

const TimeHelper = {
    convert,
}

export default TimeHelper;