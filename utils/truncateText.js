export const truncateText = (str) => {
    if (str.length < 25) return str;

    return str.substring(0,20) + "...";
};