export const getTextWidth = (
    text: string,
    font = "14px sans-serif"
): number => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (context) {
        context.font = font;
        return context.measureText(text).width;
    }
    return 0;
};
