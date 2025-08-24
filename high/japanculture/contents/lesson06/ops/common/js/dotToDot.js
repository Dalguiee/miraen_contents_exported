$(document).ready(() => {
  dotToDotActivate();
  drawAnswerLines();
});
const dotToDotActivate = () => {
  const canvas = $(`[data-name="canvas"]`)[0];
  const ctx = canvas.getContext("2d");
  let startX,
    startY,
    startDot,
    isDragging = false,
    endDot;
  const lines = [];
  const connectedDots = new Set();
  const totalConnections = {};

  const startDots = $(`[data-name="start_dot"]`);
  const endDots = $(`[data-name="end_dot"]`);

  const getClientCoords = (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;
    return { x, y };
  };

  const handleStartDotClick = (x, y) => {
    startDots.each((_, dot) => {
      if (connectedDots.has(dot)) return;
      const dotRect = dot.getBoundingClientRect();
      const dotX =
        dotRect.left + dotRect.width / 2 - canvas.getBoundingClientRect().left;
      const dotY =
        dotRect.top + dotRect.height / 2 - canvas.getBoundingClientRect().top;

      if (Math.abs(x - dotX) < 20 && Math.abs(y - dotY) < 20) {
        startX = dotX;
        startY = dotY;
        startDot = dot;
        isDragging = true;
      }
    });
  };

  const handleEndDotClick = (x, y) => {
    endDots.each((_, dot) => {
      if (connectedDots.has(dot)) return;
      const dotRect = dot.getBoundingClientRect();
      const dotX =
        dotRect.left + dotRect.width / 2 - canvas.getBoundingClientRect().left;
      const dotY =
        dotRect.top + dotRect.height / 2 - canvas.getBoundingClientRect().top;

      if (Math.abs(x - dotX) < 20 && Math.abs(y - dotY) < 20) {
        startX = dotX;
        startY = dotY;
        endDot = dot;
        isDragging = true;
      }
    });
  };

  const handleStart = (e) => {
    if (!isDragging) {
      const { x, y } = getClientCoords(e);
      handleStartDotClick(x, y);
      handleEndDotClick(x, y);
    }
  };

  const handleMove = (e) => {
    if (isDragging) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawLines();
      const { x, y } = getClientCoords(e);
      if (startDot) {
        drawLine(startX, startY, x, y, "#557EE8", 4);
      } else if (endDot) {
        drawLine(x, y, startX, startY, "#557EE8", 4);
      }
    }
  };

  const handleEnd = (e) => {
    if (isDragging) {
      const { x, y } = getClientCoords(e);
      let connected = false;

      if (startDot) {
        endDots.each((_, dot) => {
          if (connectedDots.has(dot)) return;
          const dotRect = dot.getBoundingClientRect();
          const dotCenterX =
            dotRect.left +
            dotRect.width / 2 -
            canvas.getBoundingClientRect().left;
          const dotCenterY =
            dotRect.top +
            dotRect.height / 2 -
            canvas.getBoundingClientRect().top;

          if (Math.abs(x - dotCenterX) < 20 && Math.abs(y - dotCenterY) < 20) {
            const alreadyConnected = lines.some(
              (line) =>
                (line.startDot === startDot && line.endDot === dot) ||
                (line.startDot === dot && line.endDot === startDot)
            );

            if (!alreadyConnected) {
              const isCorrect = startDot.dataset.value === dot.dataset.value;

              lines.push({
                startDot,
                endDot: dot,
                startX,
                startY,
                endX: dotCenterX,
                endY: dotCenterY,
                isCorrect,
              });
              connectedDots.add(startDot);
              connectedDots.add(dot);
              totalConnections[startDot.dataset.value] = dot.dataset.value;
              drawLines();
              checkCompletion();
            }
            connected = true;
          }
        });
      } else if (endDot) {
        startDots.each((_, dot) => {
          if (connectedDots.has(dot)) return;
          const dotRect = dot.getBoundingClientRect();
          const dotCenterX =
            dotRect.left +
            dotRect.width / 2 -
            canvas.getBoundingClientRect().left;
          const dotCenterY =
            dotRect.top +
            dotRect.height / 2 -
            canvas.getBoundingClientRect().top;

          if (Math.abs(x - dotCenterX) < 20 && Math.abs(y - dotCenterY) < 20) {
            const alreadyConnected = lines.some(
              (line) =>
                (line.startDot === dot && line.endDot === endDot) ||
                (line.startDot === endDot && line.endDot === dot)
            );

            if (!alreadyConnected) {
              const isCorrect = endDot.dataset.value === dot.dataset.value;

              lines.push({
                startDot: dot,
                endDot: endDot,
                startX: dotCenterX,
                startY: dotCenterY,
                endX: startX,
                endY: startY,
                isCorrect,
              });
              connectedDots.add(dot);
              connectedDots.add(endDot);
              totalConnections[endDot.dataset.value] = dot.dataset.value;
              drawLines();
              checkCompletion();
            }
            connected = true;
          }
        });
      }

      if (!connected) {
        drawLines();
      }

      isDragging = false;
      startDot = null;
      endDot = null;
    }
  };

  const checkCompletion = () => {
    const totalExpectedConnections = startDots.length;
    if (Object.keys(totalConnections).length === totalExpectedConnections) {
      console.log("완료");
      $(canvas).off("mousedown touchstart");
      $(canvas).off("mousemove touchmove");
      $(canvas).off("mouseup touchend");
    }
  };

  $(canvas).on("mousedown touchstart", handleStart);
  $(canvas).on("mousemove touchmove", handleMove);
  $(canvas).on("mouseup touchend", handleEnd);

  const drawDots = () => {
    startDots.each((_, dot) => {
      const dotRect = dot.getBoundingClientRect();
      const dotX =
        dotRect.left + dotRect.width / 2 - canvas.getBoundingClientRect().left;
      const dotY =
        dotRect.top + dotRect.height / 2 - canvas.getBoundingClientRect().top;

      ctx.beginPath();
      ctx.arc(dotX, dotY, 8, 0, 2 * Math.PI);
      ctx.fillStyle = "rgba(0,0,0,0)";
      ctx.fill();
    });

    endDots.each((_, dot) => {
      const dotRect = dot.getBoundingClientRect();
      const dotX =
        dotRect.left + dotRect.width / 2 - canvas.getBoundingClientRect().left;
      const dotY =
        dotRect.top + dotRect.height / 2 - canvas.getBoundingClientRect().top;

      ctx.beginPath();
      ctx.arc(dotX, dotY, 8, 0, 2 * Math.PI);
      ctx.fillStyle = "rgba(0,0,0,0)";
      ctx.fill();
    });
  };

  const drawLine = (x1, y1, x2, y2, color, width) => {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
  };

  const drawLines = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawDots();
    lines.forEach((line) => {
      // const color = line.isCorrect ? "#F13920" : "#888"; // 정답은 주황, 오답은 회색
      const color = line.isCorrect ? "#557EE8" : "#557EE8";
      drawLine(line.startX, line.startY, line.endX, line.endY, color, 4);
    });
  };

  drawDots();
};

//정답 캔버스
const drawAnswerLines = () => {
  const canvasAnswer = $(`[data-name="canvas_answer"]`)[0];
  const ctx = canvasAnswer.getContext("2d");
  const canvasRect = canvasAnswer.getBoundingClientRect();

  const startDots = $(`[data-name="start_dot"]`);
  const endDots = $(`[data-name="end_dot"]`);

  const getCanvasRelativeCoords = (dot) => {
    const dotRect = dot.getBoundingClientRect();
    return {
      x: dotRect.left + dotRect.width / 2 - canvasRect.left,
      y: dotRect.top + dotRect.height / 2 - canvasRect.top,
    };
  };

  const drawLine = (x1, y1, x2, y2, color, width) => {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
  };

  startDots.each((_, startDot) => {
    const startKey = startDot.dataset.value;
    endDots.each((_, endDot) => {
      if (endDot.dataset.value === startKey) {
        const { x: startX, y: startY } = getCanvasRelativeCoords(startDot);
        const { x: endX, y: endY } = getCanvasRelativeCoords(endDot);
        drawLine(startX, startY, endX, endY, "#E6002D", 4);
      }
    });
  });
};
