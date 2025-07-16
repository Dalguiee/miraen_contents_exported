// ---------------------------------------
// 역할 연습 사운드 재생 스크립트
// ---------------------------------------
// 음성재생에 따른 text active
let roleTextActiveData = rolePlayerAudio[0].data;

let roleAudio = new Howl({
  src: [`./media/mp3/${rolePlayerAudio[0].audio}`],
  html5: true,
  onplay: () => {
    updateInterval = setInterval(updateSeek, 200);
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

//오디오 전환 버튼
$(".role-audio-set_btn").on("click", function () {
  setRoleAudio($(this).data("index"));
  setActive($(this), "role-audio-set_btn");
  roleAudio.play();
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

// 오디오 변경
const setRoleAudio = (index) => {
  audioStop();
  roleAudio.stop();
  roleTextActiveData = rolePlayerAudio[Number(index) - 1].data;
  roleAudio = new Howl({
    src: [`./media/mp3/${rolePlayerAudio[Number(index) - 1].audio}`],
    html5: true,
    onplay: () => {
      updateInterval = setInterval(updateSeek, 200);
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
  // 재생 시간에 따라 대사 텍스트 active 변경
  if (roleTextActiveData.length > 0 && roleAudio.playing()) {
    $.each(roleTextActiveData, function (index, item) {
      if (roleAudio.seek() >= item.start && roleAudio.seek() <= item.end) {
        $(`[data-audio="${item.value}"]`).addClass("speak");
      } else {
        $(`[data-audio="${item.value}"]`).removeClass("speak");
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
  let minutes = Math.floor(sec / 60); // 분
  let remainingSeconds = Math.floor(sec % 60); // 초
  return (
    (minutes < 10 ? "0" : "") +
    minutes +
    ":" +
    (remainingSeconds < 10 ? "0" : "") +
    remainingSeconds
  );
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
