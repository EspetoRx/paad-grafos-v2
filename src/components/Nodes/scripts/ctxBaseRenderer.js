({ ctx, id, x, y, state: { selected, hover }, style, label }) => {
    const r = style.size;
    const drawNode = () => {
        ctx.beginPath();
        const sides = 6;
        const a = (Math.PI * 2) / sides;
        ctx.moveTo(x, y + r);
        for (let i = 1; i < sides; i++) {
            ctx.lineTo(x + r * Math.sin(a * i), y + r * Math.cos(a * i));
        }
        ctx.closePath();
        ctx.save();
        ctx.fillStyle = "red";
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        ctx.font = "normal 12px sans-serif";
        ctx.fillStyle = "black";
        ctx.fillText(label, x - r + 10, y, 2 * r - 20);
    };
    return {
        drawNode,
        nodeDimensions: { width: 2 * r, height: 2 * r },
    };
}