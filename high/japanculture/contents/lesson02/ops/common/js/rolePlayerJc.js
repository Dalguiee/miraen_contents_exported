// 음성재생에 따른 text active
let roleData = rolePlayerAudio[0].data;
// 현재 역할
let role = 0;
// 스크롤 영역
let containerScroll = 1;
// 마지막 스크롤 적용한 구간 인덱스
let lastScrollTriggeredIndex = -1;
// 마지막 페이지 적용한 구간 인덱스
let lastPageTriggeredIndex = -1;

let roleAudio = new Howl({
  src: [`./media/mp3/${rolePlayerAudio[0].audio}`],
  html5: true,
  onplay: () => {
    updateInterval = setInterval(updateSeek, 50);
  },
  onload: () => {
    roleAudioLoad();
  },
  onpause: () => {
    clearInterval(updateInterval);
    updateSeek();
  },
  onstop: () => {
    try {
      clearInterval(updateInterval);
    } catch (error) {}
    updateSeek();
  },
  onend: () => {
    clearInterval(updateInterval);
    roleAudioEnd();
  },
});

//스크롤 위치 테스트
// $(`[data-scroll="${containerScroll}"]`).on("scroll", function () {
//   var scrollTopValue = $(this).scrollTop();
//   console.log("Scroll Top:", scrollTopValue);
// });

//오디오 전환
$(`[data-audio-play]`).on("click", function () {
  setRoleAudio($(this).data("audio-play"));
  //스크롤영역 전환
  containerScroll =
    rolePlayerAudio[Number($(this).data("audio-play")) - 1].containerScroll;
  // 재생 없이 전환
  if ($(this).data("name") !== "btn-pagination") {
    roleAudio.play();
  }
});

//역할 부여
$(`[data-role]`).on("click", function () {
  role = $(this).data("role");
});

// 사운드바 역할선택 active
$(".rolePlayer .txt_btn").on("click", function () {
  setRoleBtnActive($(this));
});
$(".rolePlayer .img_btn").on("click", function () {
  setRoleBtnActive($(this));
});

// 재생/일시정지 버튼
$(".rolePlayer_play-btn").on("click", function () {
  setRolePlay();
});
// 정지 버튼
$(".rolePlayer_stop-btn").on("click", function () {
  setRoleStop();
  $(`[data-audio]`).removeClass("speak");
});

// 슬라이더, 오디오 동기화
$(".rolePlayer_duration_range").on("input", function () {
  let seekTime = roleAudio.duration() * ($(this).val() / 100);
  roleAudio.seek(seekTime);
  rolePlayerRender.setRangeDesign();
});

// 롤플레이 관련 버튼 활성화
const setRoleBtnActive = (el) => {
  $(".rolePlayer .txt_btn").removeClass("active");
  $(".rolePlayer .img_btn").removeClass("active");
  el.addClass("active");
};

// 오디오 변경
const setRoleAudio = (index) => {
  audioStop();
  roleAudio.stop();
  roleData = rolePlayerAudio[Number(index) - 1].data;
  roleAudio = new Howl({
    src: [`./media/mp3/${rolePlayerAudio[Number(index) - 1].audio}`],
    html5: true,
    onplay: () => {
      updateInterval = setInterval(updateSeek, 50);
      playBtnSwitch("pause");
    },
    onload: () => {
      roleAudioLoad();
    },
    onpause: () => {
      clearInterval(updateInterval);
      updateSeek();
    },
    onstop: () => {
      try {
        clearInterval(updateInterval);
      } catch (error) {}
      updateSeek();
    },
    onend: () => {
      clearInterval(updateInterval);
      roleAudioEnd();
    },
  });
};

//플레이 버튼 함수
const setRolePlay = () => {
  audioStop();
  if (!roleAudio) return;
  if (roleAudio.playing()) {
    roleAudio.pause();
    playBtnSwitch("play");
  } else {
    roleAudio.play();
    playBtnSwitch("pause");
  }
};

//정지 버튼 함수
const setRoleStop = () => {
  roleAudio.stop();
  playBtnSwitch("play");
  lastScrollTriggeredIndex = -1;
};

// 플레이, 일시정지 버튼 전환
const playBtnSwitch = (type = "play") => {
  if (type === "play") {
    $(".rolePlayer_play-btn").removeClass("pause");
    $(".rolePlayer_play-btn").addClass("play");
  }
  if (type === "pause") {
    $(".rolePlayer_play-btn").removeClass("play");
    $(".rolePlayer_play-btn").addClass("pause");
  }
};
//오디오가 로드 될 때 실행
const roleAudioLoad = () => {
  if (!roleAudio.duration()) {
    $(".rolePlayer_duration_text.duration").html("00:00");
    $(".rolePlayer_duration_text.seek").html("00:00");
    return;
  }

  $(".rolePlayer_duration_range-ui_bar").css("width", 0 + "%");
  rolePlayerRender.setDuration();
};
//음원 종료 시
const roleAudioEnd = () => {
  playBtnSwitch("play");
  updateSeek();
};

// 현재 재생 시간
const updateSeek = () => {
  rolePlayerRender.setSeek();
  updateSlider();

  if (roleData.length > 0 && roleAudio.playing()) {
    const currentTime = roleAudio.seek();
    // 역할 정보 있으면 해당구간 뮤트
    const hasRoleInfo = roleData.some(
      (item) => typeof item.role !== "undefined"
    );
    if (hasRoleInfo) {
      const isCurrentRoleSpeaking = roleData.some(
        (item) =>
          item.role === role &&
          currentTime >= item.start &&
          currentTime <= item.end
      );
      roleAudio.mute(isCurrentRoleSpeaking);
    } else {
      roleAudio.mute(false);
    }

    // 스크롤 정보 있으면 해당 스크롤로 이동
    const hasScrollInfo = roleData.some(
      (item) => typeof item.scroll !== "undefined"
    );
    if (hasScrollInfo) {
      const currentSegmentIndex = roleData.findIndex(
        (item) => currentTime >= item.start && currentTime <= item.end
      );
      if (
        currentSegmentIndex !== -1 &&
        currentSegmentIndex !== lastScrollTriggeredIndex
      ) {
        const currentSegment = roleData[currentSegmentIndex];
        if (typeof currentSegment.scroll !== "undefined") {
          $(`[data-scroll="${containerScroll}"]`).animate(
            { scrollTop: currentSegment.scroll },
            100
          );
          lastScrollTriggeredIndex = currentSegmentIndex;
        }
      }
    } else {
      lastScrollTriggeredIndex = -1;
    }

    // 페이지 정보 있으면 해당 페이지로 이동
    const hasPageInfo = roleData.some(
      (item) => typeof item.page !== "undefined"
    );
    if (hasPageInfo) {
      const currentSegmentIndex = roleData.findIndex(
        (item) => currentTime >= item.start && currentTime <= item.end
      );
      if (
        currentSegmentIndex !== -1 &&
        currentSegmentIndex !== lastPageTriggeredIndex
      ) {
        const currentSegment = roleData[currentSegmentIndex];
        if (typeof currentSegment.page !== "undefined") {
          $('[data-name="btn-pagination"]').removeClass("active");
          $('[data-name="btn-pagination"]')
            .eq(currentSegment.page - 1)
            .addClass("active");
          $('[data-name="page"]').hide();
          $('[data-name="page"]')
            .eq(currentSegment.page - 1)
            .show();
          lastPageTriggeredIndex = currentSegmentIndex;
        }
      }
    } else {
      lastPageTriggeredIndex = -1;
    }

    // 현재 활성화해야 할 음원 텍스트
    const activeValues = roleData
      .filter((item) => currentTime >= item.start && currentTime <= item.end)
      .map((item) => item.value);

    $("[data-audio]").each(function () {
      const value = $(this).data("audio");
      if (activeValues.includes(value)) {
        $(this).addClass("speak");
      } else {
        $(this).removeClass("speak");
      }
    });
  }
};

//range 슬라이더 업데이트
const updateSlider = () => {
  let seek = roleAudio.seek() || 0;
  $(".rolePlayer_duration_range").val((seek / roleAudio.duration()) * 100);
  rolePlayerRender.setRangeDesign();
};

// 초를 mm:ss 형식으로 변환하는 함수
const formatTime = (sec) => {
  if (!sec || isNaN(sec)) return "00:00";

  let minutes = Math.floor(sec / 60);
  let remainingSeconds = Math.floor(sec % 60);
  return `${minutes < 10 ? "0" : ""}${minutes}:${
    remainingSeconds < 10 ? "0" : ""
  }${remainingSeconds}`;
};

//랜더링
const rolePlayerRender = {
  //듀레이션 (duration) 텍스트 mm:ss
  setDuration: () => {
    $(".rolePlayer_duration_text.duration").html(
      `${formatTime(roleAudio.duration())}`
    );
  },
  //현재 시간 (seek) 텍스트 mm:ss
  setSeek: () => {
    $(".rolePlayer_duration_text.seek").html(`${formatTime(roleAudio.seek())}`);
  },
  // range bar 디자인 랜더링
  setRangeDesign: () => {
    let widthPercentage =
      ($(".rolePlayer_duration_range").val() /
        $(".rolePlayer_duration_range").attr("max")) *
      100;
    $(".rolePlayer_duration_range-ui_bar").css("width", widthPercentage + "%");
  },
};
