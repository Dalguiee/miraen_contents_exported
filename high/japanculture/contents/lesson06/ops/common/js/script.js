let audio = new Audio();

//음성 데이터 가지고 있는 요소
$("[data-audio]").on("click", function () {
  runSentenceAudio($(this));
  audioGroupClick($(this));
});
//음성 그룹 hover
$("[data-group]").hover(
  function () {
    $(`[data-group="${$(this).data("group")}"]`).addClass("hover");
  },
  function () {
    $(`[data-group="${$(this).data("group")}"]`).removeClass("hover");
  }
);
// 페이지네이션 버튼 클릭
$(`[data-name="btn-pagination"]`).on("click", function () {
  contentUtil.setPage($(this).index() + 1);
});

$(document).ready(function () {
  init();
});

const init = () => {
  mTeacherAnswer();
  mTeacherVoca();
  $("#wrap").show();
};

/********** contentUtil **********/
const contentUtil = {
  //팝업 보기, 닫기
  setPopup: (index = "") => {
    if (index) {
      $("#popup-wrap").show();
      $(`[data-name="popup"][data-popup="${index}"]`).show();
    } else {
      popupScrollTop();
      $("#popup-wrap").hide();
      $(`[data-name="popup"]`).hide();
    }
    //팝업 토글 시 음성 종료
    try {
      setRoleStop();
    } catch (error) {}
    audioStop();
  },
  //페이지 설정
  setPage: (index) => {
    try {
      setRoleStop();
    } catch (error) {}
    audioStop();
    $('[data-name="btn-pagination"]').removeClass("active");
    $('[data-name="btn-pagination"]')
      .eq(index - 1)
      .addClass("active");
    $('[data-name="page"]').hide();
    $('[data-name="page"]')
      .eq(index - 1)
      .show();
  },
  //사진팝업 설정
  setPhotoPopup: (index) => {
    $(`[data-name="btn-popup_photo"]`).removeClass("active");
    $(`[data-name="btn-popup_photo"]`)
      .eq(index - 1)
      .addClass("active");
    $(`[data-name="popup_photo"]`).hide();
    $(`[data-name="popup_photo"]`)
      .eq(index - 1)
      .show();
    $(`[data-name="popup_photo_text"]`).hide();
    $(`[data-name="popup_photo_text"]`)
      .eq(index - 1)
      .show();
    popupScrollTop();
  },
  //개별/전체 정답 보기
  showAnswer: (index = "") => {
    audioStop();
    audioPlay(audio, [`./../common/media/mp3/showAnswer.mp3`]);
    if (index) {
      $(`[data-answer="${index}"]`).show();
      $(`[data-reset="${index}"]`).hide();
    } else {
      $(`[data-answer]`).show();
      $(`[data-reset]`).hide();
    }
  },
  //개별/전체 정답 숨기기
  hideAnswer: (index = "") => {
    if (index) {
      $(`[data-reset="${index}"]`).show();
      $(`[data-answer="${index}"]`).hide();
    } else {
      $(`[data-reset]`).show();
      $(`[data-answer]`).hide();
    }
  },
  //개별/전체 해석 보기
  showExplan: (index = "") => {
    if (index) {
      $(`[data-explan="${index}"]`).show();
      $(`[data-exreset="${index}"]`).hide();
    } else {
      $(`[data-explan]`).show();
      $(`[data-exreset]`).hide();
    }
  },
  //개별/전체 해석 숨기기
  hideExplan: (index = "") => {
    if (index) {
      $(`[data-exreset="${index}"]`).show();
      $(`[data-explan="${index}"]`).hide();
    } else {
      $(`[data-exreset]`).show();
      $(`[data-explan]`).hide();
    }
  },
};

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
    title: "일본어 단어장",
    code: "JL",
  };
  window.parent.postMessage(param, "*");
  //단어장 노출 (Container → HTML Viewer)
  window.addEventListener("message", (msg) => {
    if (msg.data?.action === "@showVocabulary") {
      page.showVocabulary();
    } else if (msg.data?.action === "@hideVocabulary") {
      contentUtil.setPopup("");
    }
  });
};

//팝업 스크롤 초기화
const popupScrollTop = () => {
  $(`[data-name="popup-body"]`).animate({ scrollTop: 0 }, 0);
  $(`[data-name="popup_photo_wrap"]`).animate({ scrollTop: 0 }, 0);
  $(`[data-name="popup_photo_wrap"] div`).animate({ scrollTop: 0 }, 0);
};

// 문장 클릭하여 오디오 재생
const runSentenceAudio = (el) => {
  try {
    setRoleStop();
  } catch (error) {}
  $("[data-audio]").removeClass("speak");
  el.addClass("speak");
  audioPlay(audio, [`./media/mp3/${el.data("audio")}`], () => {
    $("[data-audio]").removeClass("speak");
  });
};
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
// 오디오 그룹 클릭
const audioGroupClick = (el) => {
  $(`[data-group="${el.data("group")}"]`).addClass("speak");
};

//임시 버튼 ==========================================
$(".btn-all-answer").on("click", function () {
  $(this).hide();
  $(".btn-all-reset").show();
  page.showAnswer();
});
$(".btn-all-reset").on("click", function () {
  $(this).hide();
  $(".btn-all-answer").show();
  page.hideAnswer();
});
$(".btn-show-vocabulary").on("click", function () {
  page.showVocabulary();
});
//========================================================
