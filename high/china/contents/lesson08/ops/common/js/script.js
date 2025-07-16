let audio = new Audio();

//한자 버튼
$(".hanja_btn").on("click", function () {
  setView("hanja");
});

//병음 버튼
$(".pinyin_btn").on("click", function () {
  setView("pinyin");
});

//한자+병음 버튼
$(".combo_btn").on("click", function () {
  setView("combo");
});

//팝업 띄우기 버튼
$(".popup_btn").on("click", function () {
  setPopup($(this).data("index"));
});
//탭버튼
$(".tab_btn").on("click", function () {
  setTab($(this).data("index"));
});
//닫기 버튼1
$(".close_btn").on("click", function () {
  setPopup("");
  window.parent.postMessage({ action: "@hideVocabulary" }, "*");
});
//닫기 버튼2
$(".popupclose_btn").on("click", function () {
  setPopup("");
});

const audioComboSetter = () => {
  // 오디오 태그 호버시 클래스 추가 및 dataset audio-combo 같이 추가
  $("[data-audio]").hover(
    function () {
      let DAC = $("[data-audio-combo]");
      let selectedData = $(this).data("audioCombo");

      if (DAC.length > 0 && selectedData) {
        $("[data-audio-combo]").each(function (key, item) {
          let data = $(item).data("audioCombo");
          if (data == selectedData) {
            $(item).addClass("hoverSpeak");
          }
        });
      }
    },
    function () {
      $("[data-audio-combo]").each(function (key, item) {
        $(item).removeClass("hoverSpeak");
      });
    }
  );

  // 오디오 태그 클릭시 클래스 추가 및 dataset audio-combo 같이 추가
  $("[data-audio]").on("click", function () {
    console.log("audio click");
    try {
      setRoleStop();
    } catch (error) {}
    let DAC = $("[data-audio-combo]");
    let selectedData = $(this).data("audioCombo");
    $("[data-audio]").removeClass("speak");
    $(this).addClass("speak");

    if (DAC.length > 0 && selectedData) {
      $("[data-audio-combo]").each(function (key, item) {
        let data = $(item).data("audioCombo");
        if (data == selectedData) {
          $(item).addClass("speak");
        }
      });
    }

    audioPlay(audio, [`./media/mp3/${$(this).data("audio")}`], () => {
      $(this).removeClass("speak");
      $("[data-audio-combo]").each(function (key, item) {
        $(item).removeClass("speak");
      });
    });
  });
};

$(document).ready(function () {
  mTeacherAnswer();
  mTeacherVoca();
  init();
  textExchanger();
  audioComboSetter();
});

const init = () => {};

//엠티쳐 컨테이너 뷰어 연동 (정답)
const mTeacherAnswer = () => {
  //정답확인 노출 여부 (HTML Viewer → Container)
  let param = {
    action: "HTML-CONTENT-EVENT",
    isAnswer: page.isAnswer,
  };
  window.parent.postMessage(param, "*");
  //정답 확인/다시 하기 액션 (Container → HTML Viewer)
  window.addEventListener("message", (msg) => {
    if (msg.data?.action === "@showAnswer") {
      page.showAnswer();
    } else if (msg.data?.action === "@hideAnswer") {
      page.hideAnswer();
    }
  });
};
//엠티쳐 컨테이너 뷰어 연동 (단어장)
const mTeacherVoca = () => {
  //단어장 노출 (HTML Viewer → Container)
  let param = {
    action: "VOCABULARY-LIST-EVENT",
    isVocabulary: page.isVocabulary,
    title: "중국어 단어장",
  };
  window.parent.postMessage(param, "*");
  //단어장 노출 (Container → HTML Viewer)
  window.addEventListener("message", (msg) => {
    if (msg.data?.action === "@showVocabulary") {
      page.showVocabulary();
    } else if (msg.data?.action === "@hideVocabulary") {
      setPopup("");
    }
  });
};

//팝업 보기, 닫기
const setPopup = (index = "") => {
  $(".popup").hide();
  if (index) {
    $(".popup_bg").show();
    $(`.popup[data-popup="${index}"]`).show();
  } else {
    $(".popup_bg").hide();
    $(".popup").hide();
  }
  //팝업 시 역할연습 음성 종료
  try {
    setRoleStop();
  } catch (error) {}
  // 팝업 시 음원 종료
  audioStop();
};

//설명 팝업
$(".explan_popup_btn").on("click", function () {
  let index = $(".explan_popup_btn").index(this);
  $(".explan_popup_bg").show();
  $(".popup.explan").hide();
  $(".popup.explan").eq(index).show();
  try {
    setRoleStop();
  } catch (error) {}
  audioStop();
});

// 한자, 병음, 한자 + 병음 tab
const setView = (type = "") => {
  const viewInfo = $("[data-view-info]");
  $("[data-view]").hide();
  $(`[data-view="${type}"]`).show();
  toggleViewBtn(type);
  if (viewInfo.length > 0) {
    viewInfo.each(function () {
      $(this).attr("data-view-info", type);
    });
  }
};

// 한자, 병음 버튼 토글
const toggleViewBtn = (type = "") => {
  if (type === "hanja") {
    $(".hanja_btn").hide();
    $(".pinyin_btn").show();
  }
  if (type === "pinyin") {
    $(".hanja_btn").show();
    $(".pinyin_btn").hide();
  }
};

//active 클래스 생성
const setActive = (el, className) => {
  $(`.${className}`).removeClass("active");
  el.addClass("active");
};

//탭버튼
const setTab = (index) => {
  const tabInfo = $("[data-tab-info]");
  $("[data-tab]").hide();
  $(`[data-tab="${index}"]`).show();
  if (tabInfo.length > 0) {
    tabInfo.each(function () {
      $(this).attr("data-tab-info", index);
    });
  }
};

//페이지 탭
$(".pagination .dot").on("click", function () {
  setActive($(this), "dot");
  setTab($(this).data("index"));
});

// 오디오 자동재생
const audioPlay = (audioObj, audioLs, callback) => {
  audioObj.pause();
  audioObj.onended = "";
  audioObj.src = "";
  audioObj.src = audioLs[0];

  audioObj.play();
  let nextAudioIndex = 1;
  audioObj.onended = function () {
    if (nextAudioIndex < audioLs.length) {
      audioObj.src = audioLs[nextAudioIndex];
      audioObj.play();
    }
    nextAudioIndex++;
    if (callback) {
      callback(nextAudioIndex);
    }
  };
};

//오디오 정지
const audioStop = () => {
  $("[data-audio]").removeClass("speak");
  audio.pause();
  audio.currentTime = 0;
};

// 특수문자 인식하여 변환
const textExchanger = () => {
  const allSpan = document.querySelectorAll("span");
  allSpan.forEach(function (item, key) {
    let iText = item.innerHTML;

    const replacements = [
      { regex: /\(\s*/g, replacement: `<span class="suit">(</span>` },
      { regex: /\s*\)/g, replacement: `<span class="suit">)</span>` },
      { regex: /\‘\s*/g, replacement: `<span class="notoSans">‘</span>` },
      { regex: /\“\s*/g, replacement: `<span class="notoSans">“</span>` },
      { regex: /\s*\’/g, replacement: `<span class="notoSans">’</span>` },
      { regex: /\s*\”/g, replacement: `<span class="notoSans">”</span>` },
      { regex: /\s*\,/g, replacement: `<span class="notoSans">,</span>` },
      // { regex: /\s*,\s*/g, replacement: `<span class="notoSans">, </span>` }
    ];

    replacements.forEach((item, key) => {
      iText = iText.replace(item.regex, item.replacement);
    });

    item.innerHTML = iText;
  });
};
