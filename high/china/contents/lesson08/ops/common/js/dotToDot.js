let anwerCount1 = 0;
let anwerCount2 = 0;

$(document).ready(() => {
  dotToDotActivate();
});
const dotToDotActivate = () => {
  const canvas = $("#canvas")[0];
  const ctx = canvas.getContext("2d");
  let startX,
    startY,
    startDot,
    isDragging = false,
    endDot;
  const lines = []; // 선의 시작과 끝 점을 저장할 배열
  const connectedDots = new Set(); // 이미 짝지어진 점을 저장할 Set
  const totalConnections = {}; // 각 start_dot에 대한 end_dot을 추적하기 위한 객체

  const startDots = $(".start_dot");
  const endDots = $(".end_dot");

  // 캔버스에서 마우스, 터치 이벤트
  const getClientCoords = (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;
    return { x, y };
  };

  // start_dot을 클릭했는지 확인하는 함수
  const handleStartDotClick = (x, y) => {
    startDots.each((_, dot) => {
      if (connectedDots.has(dot)) return; // 이미 짝지어진 점은 무시

      const $dot = $(dot);
      const dotRect = dot.getBoundingClientRect();
      const dotX =
        dotRect.left + dotRect.width / 2 - canvas.getBoundingClientRect().left;
      const dotY =
        dotRect.top + dotRect.height / 2 - canvas.getBoundingClientRect().top;

      if (Math.abs(x - dotX) < 20 && Math.abs(y - dotY) < 20) {
        startX = dotX;
        startY = dotY;
        startDot = dot; // 클릭한 start_dot 저장
        isDragging = true;
      }
    });
  };

  // end_dot을 클릭했는지 확인
  const handleEndDotClick = (x, y) => {
    endDots.each((_, dot) => {
      if (connectedDots.has(dot)) return;

      const $dot = $(dot);
      const dotRect = dot.getBoundingClientRect();
      const dotX =
        dotRect.left + dotRect.width / 2 - canvas.getBoundingClientRect().left;
      const dotY =
        dotRect.top + dotRect.height / 2 - canvas.getBoundingClientRect().top;

      if (Math.abs(x - dotX) < 20 && Math.abs(y - dotY) < 20) {
        startX = dotX;
        startY = dotY;
        endDot = dot; // 클릭한 end_dot 저장
        isDragging = true;
      }
    });
  };

  // 마우스, 터치 시작
  const handleStart = (e) => {
    if (!isDragging) {
      const { x, y } = getClientCoords(e);
      handleStartDotClick(x, y);
      handleEndDotClick(x, y);
    }
  };

  // 마우스, 터치 이동
  const handleMove = (e) => {
    if (isDragging) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawLines(); // 이전에 그린 선을 다시 그립니다
      const { x, y } = getClientCoords(e);
      if (startDot) {
        drawLine(startX, startY, x, y, "#BABBBD", 5);
      } else if (endDot) {
        drawLine(x, y, startX, startY, "#BABBBD", 5);
      }
    }
  };

  // 마우스, 터치 종료
  const handleEnd = (e) => {
    if (isDragging) {
      const { x, y } = getClientCoords(e);
      let connected = false;

      // 연결 시도
      if (startDot) {
        endDots.each((_, dot) => {
          const $dot = $(dot);
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
            if (startDot.dataset.start === dot.dataset.end) {
              //정답 확인====================================================
              console.log(dot.dataset.end);

              $(`.answer_btn[data-index="${dot.dataset.end}"]`).hide();
              $(`.reset_btn[data-index="${dot.dataset.end}"]`).show();

              $(`.answer[data-answer="${dot.dataset.end}"]`).show();
              try {
                // audioPlay(audio, [`./media/mp3/showAnswer.mp3`]);
              } catch (error) {}
              //=============================================================
              // 이미 연결된 선이 아닌 경우에만 추가
              const alreadyConnected = lines.some(
                (line) =>
                  (line.startDot === startDot && line.endDot === dot) ||
                  (line.startDot === dot && line.endDot === startDot)
              );

              if (!alreadyConnected) {
                lines.push({
                  startDot,
                  endDot: dot,
                  startX,
                  startY,
                  endX: dotCenterX,
                  endY: dotCenterY,
                });
                connectedDots.add(startDot); // 짝이 지어진 점을 기록
                connectedDots.add(dot); // 짝이 지어진 점을 기록
                totalConnections[startDot.dataset.start] = dot.dataset.end; // 연결된 점 추적
                drawLines();
                checkCompletion();
              }
              connected = true;
            } else {
              try {
                // audioPlay(audio, [`./media/mp3/dragInCorrect.mp3`]);
              } catch (error) {}
            }
          }
        });
      } else if (endDot) {
        startDots.each((_, dot) => {
          const $dot = $(dot);
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
            if (endDot.dataset.end === dot.dataset.start) {
              //정답 확인====================================================
              console.log(dot.dataset.start);

              $(`.answer_btn[data-index="${dot.dataset.start}"]`).hide();
              $(`.reset_btn[data-index="${dot.dataset.start}"]`).show();

              $(`.answer[data-answer="${dot.dataset.start}"]`).show();
              try {
                // audioPlay(audio, [`./media/mp3/showAnswer.mp3`]);
              } catch (error) {}
              //=============================================================
              // 이미 연결된 선이 아닌 경우에만 추가
              const alreadyConnected = lines.some(
                (line) =>
                  (line.startDot === dot && line.endDot === endDot) ||
                  (line.startDot === endDot && line.endDot === dot)
              );

              if (!alreadyConnected) {
                lines.push({
                  startDot: dot,
                  endDot: endDot,
                  startX: dotCenterX,
                  startY: dotCenterY,
                  endX: startX,
                  endY: startY,
                });
                connectedDots.add(dot); // 짝이 지어진 점을 기록
                connectedDots.add(endDot); // 짝이 지어진 점을 기록
                totalConnections[endDot.dataset.end] = dot.dataset.start; // 연결된 점 추적
                drawLines();
                checkCompletion(); // 완료 여부 체크
              }
              connected = true;
            } else {
              try {
                // audioPlay(audio, [`./media/mp3/dragInCorrect.mp3`]);
              } catch (error) {}
            }
          }
        });
      }

      if (!connected) {
        drawLines();
      }

      // reset
      isDragging = false;
      startDot = null;
      endDot = null;
    }
  };

  // 모든 점이 연결되었는지 확인
  const checkCompletion = () => {
    const totalStartDots = startDots.length;
    const totalEndDots = endDots.length;
    const totalExpectedConnections = totalStartDots; // 각 start_dot에 대해 하나의 end_dot 연결 필요

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

  // 점 그리는 함수
  const drawDots = () => {
    startDots.each((_, dot) => {
      const $dot = $(dot);
      const dotRect = dot.getBoundingClientRect();
      const dotX =
        dotRect.left + dotRect.width / 2 - canvas.getBoundingClientRect().left;
      const dotY =
        dotRect.top + dotRect.height / 2 - canvas.getBoundingClientRect().top;

      ctx.beginPath();
      ctx.arc(dotX, dotY, 8, 0, 2 * Math.PI);
      // ctx.fillStyle = connectedDots.has(dot) ? "#E6002D" : "#84A2B2";
      ctx.fillStyle = connectedDots.has(dot)
        ? "rgba(0,0,0,0)"
        : "rgba(0,0,0,0)"; // 점 색깔
      ctx.fill();
    });

    endDots.each((_, dot) => {
      const $dot = $(dot);
      const dotRect = dot.getBoundingClientRect();
      const dotX =
        dotRect.left + dotRect.width / 2 - canvas.getBoundingClientRect().left;
      const dotY =
        dotRect.top + dotRect.height / 2 - canvas.getBoundingClientRect().top;

      ctx.beginPath();
      ctx.arc(dotX, dotY, 8, 0, 2 * Math.PI);
      // ctx.fillStyle = connectedDots.has(dot) ? "#E6002D" : "#84A2B2";
      ctx.fillStyle = connectedDots.has(dot)
        ? "rgba(0,0,0,0)"
        : "rgba(0,0,0,0)";
      ctx.fill();
    });
  };

  // 선을 그리는 함수
  const drawLine = (x1, y1, x2, y2, color, width) => {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
  };

  // 저장된 모든 선을 다시 그리는 함수
  const drawLines = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawDots();
    lines.forEach((line) => {
      // drawLine(line.startX, line.startY, line.endX, line.endY, "#E6002D", 6); // 연결된 선 색상과 굵기
      drawLine(
        line.startX,
        line.startY,
        line.endX,
        line.endY,
        "rgba(0,0,0,0)",
        2
      ); // 연결된 선 색상과 굵기
    });
  };

  drawDots();
};

const canversReset = () => {
  // 가장 상단에 있는 <canvas> 요소를 제거
  $("canvas").first().remove();
  // <canvas> 요소를 다시 생성하여 .line-content-wrap의 맨 위에 추가
  $(
    '<canvas class="canvas" width="480" height="400" id="canvas"></canvas>'
  ).insertBefore(".line-content-wrap");
};
