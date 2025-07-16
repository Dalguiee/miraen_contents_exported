const canvas = document.querySelector(".conCanvas");
const ctx = canvas.getContext("2d");
const testObj = document.querySelectorAll(".item");

let liner = [];
let ansLiner = []; 
const animating = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  liner.forEach(item => {
    item.lining();
  });
  ansLiner.forEach(item => {
    item.draw();
  });
  requestAnimationFrame(animating);
}
animating();

function Canvas() {
this.x = canvas.width;
this.y = canvas.height;
this.w = canvas.width;
this.h = canvas.height;
this.activeBool = false;
this.lineBool = false;
this.DotBool = false;
this.testArr = [];
this.dotColor = "#E22F61";
this.pos = {};
this.sPos = {};
this.selQues = {};
this.selAns = {};
this.c = `#E22F61`;

window.requestAnimationFrame(this.ani.bind(this));

canvas.addEventListener("touchstart", this.tStart.bind(this));
canvas.addEventListener("mousedown", this.mDown.bind(this));

canvas.addEventListener("touchstart", this.dotBoundaryCheck.bind(this));
canvas.addEventListener("mousedown", this.dotBoundaryCheck.bind(this));

canvas.addEventListener("touchend", this.ansBoundaryCheck.bind(this));
canvas.addEventListener("mouseup", this.ansBoundaryCheck.bind(this));

canvas.addEventListener("touchend", this.tmEnd.bind(this));
canvas.addEventListener("mouseup", this.tmEnd.bind(this));

canvas.addEventListener("touchmove", this.tMoving.bind(this));
canvas.addEventListener("mousemove", this.mMoving.bind(this));

window.addEventListener("resize", this.resize.bind(this));
}

Canvas.prototype.lining = function(e) { 
if (this.lineBool  && this.DotBool && this.activeBool) {
  ctx.beginPath();
  ctx.lineWidth = "7";
  ctx.strokeStyle = "#C1802C";
  ctx.moveTo(this.sPos.x, this.sPos.y);
  ctx.lineTo(this.pos.x, this.pos.y);
  ctx.stroke();
}
}

Canvas.prototype.resize = function() {
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
this.w = canvas.width;
this.h = canvas.height;
};

Canvas.prototype.ani = function(ansVal) {
window.requestAnimationFrame(this.ani.bind(this));
this.testArr.forEach(function(item, key) {
  console.log("애니메이팅중");
  item.draw();
});
}

Canvas.prototype.tStart = function(e) {
console.log(e.targetTouches[0].clientX)
this.sPos.x = e.targetTouches[0].clientX;
this.sPos.y = e.targetTouches[0].clientY;
this.DotBool = true;
}

Canvas.prototype.mDown = function(e) {
this.sPos.x = e.clientX;
this.sPos.y = e.clientY;
this.DotBool = true;
}

Canvas.prototype.tmEnd = function(e) {
this.lineBool = false;
this.DotBool = false;
this.activeBool = false;
}

Canvas.prototype.tMoving = function(e) {
this.pos.x = e.targetTouches[0].clientX;
this.pos.y = e.targetTouches[0].clientY;
this.lineBool = true;
}
Canvas.prototype.mMoving = function(e) {
this.pos.x = e.clientX;
this.pos.y = e.clientY;
this.lineBool = true;
}

Canvas.prototype.clear = function(ansVal) {
console.log("초기화");
testObj.forEach(function(item, key) {
  if(item.dataset.val == ansVal) {
    item.dataset.locked = "true";
    // item.style.backgroundColor = "red"
  };
});

const aaa = Array.from(testObj).filter(item => {
  return item.dataset.locked == "true";
});
console.log(aaa);

this.pos = {};
this.sPos = {};
this.selQues = {};
this.selAns = {};
};

Canvas.prototype.dotBoundaryCheck = function(type) {
const dotRadius = 50;
testObj.forEach((item, key) => { 
  const itemRect = item.getBoundingClientRect();
  const itemCenterX = (itemRect.x + itemRect.width / 2);
  const itemCenterY = (itemRect.y + itemRect.height / 2);
  const isWithinX = this.isWithinRange(this.sPos.x, itemCenterX, dotRadius);
  const isWithinY = this.isWithinRange(this.sPos.y, itemCenterY, dotRadius);
  if (isWithinX && isWithinY) {
    if (item.dataset.type == "question" && item.dataset.locked == "false") {
      this.activeBool = true;
      console.log("문제 클릭 감지");
      this.selQues = {val: item.dataset.val, x: itemCenterX, y: itemCenterY};
    }
  }
});
};

Canvas.prototype.ansBoundaryCheck = function(type) {
const dotRadius = 50;
testObj.forEach((item, key) => { 
  const itemRect = item.getBoundingClientRect();
  const itemCenterX = (itemRect.x + itemRect.width / 2);
  const itemCenterY = (itemRect.y + itemRect.height / 2);
  const isWithinX = this.isWithinRange(this.pos.x, itemCenterX, dotRadius);
  const isWithinY = this.isWithinRange(this.pos.y, itemCenterY, dotRadius);
  // item.style.backgroundColor = "red";
  if (isWithinX && isWithinY) {
    if (item.dataset.type == "answer" && this.activeBool) {
      console.log("문제 끌림 감지");
      this.selAns = {val: item.dataset.val, x: itemCenterX, y: itemCenterY};
      this.activeBool = false;
      console.log(this.selQues, this.selAns);
      if(this.selQues.val == this.selAns.val) {
        console.log("정답 감지");
        // 애니메이션 함수로 작동
        ansLiner[item.dataset.val] = (new AnsLine(this.selQues.x, this.selQues.y, this.selAns.x, this.selAns.y, true, item.dataset.val));
        // Canvas 생성자 함수 내부에 선언된 애니메이션 함수로 작동, 이렇게 되면 그리는 데이터가 두 개로 나뉜다.
        // this.testArr[item.dataset.val - 1] = (new AnsLine(this.selQues.x, this.selQues.y, this.selAns.x, this.selAns.y));
        this.clear(item.dataset.val);
        $(`.reset_btn[data-d-index=${item.dataset.val}]`).show();
        $(`.answer_btn[data-d-index=${item.dataset.val}]`).hide();
      }
    }
  }
});
};

Canvas.prototype.isWithinRange = function(coord, center, radius) {
  return coord >= center - radius && coord <= center + radius;
};

liner[0] = (new Canvas());

function AnsLine(sX, sY, x, y, ansBoolean, val) {
this.x = sX;
this.y = sY;
this.sX = x;
this.sY = y;
this.val = val;
this.corrected = ansBoolean;
this.width = 50;
this.height = 50;
this.color = "#E22F61";
this.dx = 2;
this.dy = 2;
}

AnsLine.prototype.draw = function() {
ctx.beginPath();
ctx.strokeStyle = this.color;
ctx.lineWidth = "7";
ctx.globalAlpha = 1;
ctx.moveTo(this.sX, this.sY);
ctx.lineTo(this.x, this.y);
ctx.stroke();
}

let quesInfo = [];
let ansInfo = [];

const resizing = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  testObj.forEach((item, key) => {
    if(item.dataset.type == "question") {
      const itemRect = item.getBoundingClientRect();
      const itemCenterX = (itemRect.x + itemRect.width / 2);
      const itemCenterY = (itemRect.y + itemRect.height / 2);
      quesInfo[item.dataset.val] = {val: item.dataset.val, x: itemCenterX, y: itemCenterY};
    } else {
      const itemRect = item.getBoundingClientRect();
      const itemCenterX = (itemRect.x + itemRect.width / 2);
      const itemCenterY = (itemRect.y + itemRect.height / 2);
      ansInfo[item.dataset.val] = {val: item.dataset.val, x: itemCenterX, y: itemCenterY};
    };
    // quesInfo = quesInfo.sort((a, b) =>{
    //   return a.val - b.val;
    // });
    // ansInfo = ansInfo.sort((a, b) =>{
    //   return a.val - b.val;
    // });
  });
};

document.addEventListener("DOMContentLoaded", function() {
  resizing();
});

window.addEventListener("resize", function() {
  resizing();
  ansLiner.forEach(function(item, key) {
    if(item.corrected) {
      ansLiner[item.val] = (new AnsLine(quesInfo[item.val].x, quesInfo[item.val].y, ansInfo[item.val].x, ansInfo[item.val].y, true, item.val));
    };
  });
});

// const answering = () => {
//   quesInfo.forEach((item, key) => {
  // ansLiner[item.val - 1] = (new AnsLine(quesInfo[item.val - 1].x, quesInfo[item.val - 1].y, ansInfo[item.val - 1].x, ansInfo[item.val - 1].y))
//   });

  // ansLiner[0] = (new AnsLine(quesInfo[0].x, quesInfo[0].y, ansInfo[0].x, ansInfo[0].y))
  // quesInfo.forEach((item, key) => {
  //   ansLiner[item.val - 1] = (new AnsLine(quesInfo[item.val - 1].x, quesInfo[item.val - 1].y, ansInfo[item.val - 1].x, ansInfo[item.val - 1].y))
  // });

// }
// answering();
