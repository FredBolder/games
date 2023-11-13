export function drawFilledBox(canvas, x1, y1, x2, y2, color) {
    canvas.fillStyle = color;
    canvas.fillRect(x1, y1, x2, y2);
    canvas.strokeStyle = color;
    canvas.strokeRect(x1, y1, x2, y2);
}

export function drawFilledCircle(canvas, xc, yc, radius, color) {
    canvas.fillStyle = color;
    canvas.beginPath();
    canvas.arc(xc, yc, radius, 0, 2 * Math.PI, false);
    canvas.fill();
}

export function drawLine(canvas, x1, y1, x2, y2, color) {
    canvas.strokeStyle = color;
    canvas.beginPath();
    canvas.moveTo(x1, y1);
    canvas.lineTo(x2, y2);
    canvas.stroke();
}