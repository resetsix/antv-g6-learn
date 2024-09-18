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

// export const measureTextWidth = memoize(
//     (text: string, font: any = {}): TextMetrics => {
//       const { fontSize, fontFamily = 'sans-serif', fontWeight, fontStyle, fontVariant } = font;
//       const ctx =  getCanvasContext();
//       // @see https://developer.mozilla.org/zh-CN/docs/Web/CSS/font
//       ctx.font = [fontStyle, fontWeight, fontVariant, `${fontSize}px`, fontFamily].join(' ');
//       return ctx.measureText(isString(text) ? text : '').width;
//     },
//     (text: string, font = {}) => [text, ...values(font)].join(''),
//   );
  
//   const graph = new G6.Graph({
//       node: {
//             style: { size: d => [measureTextWidth(d.label, {...}) , xxx] },
//       }
//   })