// 단어장 뜻 보기
$(".vocabularyBook .show_btn").on("click", function () {
  $(this).hide();
  $(this).next().show();
  $(".voca_warp").show();
});
//  단어장 뜻 감추기
$(".vocabularyBook .hide_btn").on("click", function () {
  $(this).hide();
  $(this).prev().show();
  $(".voca_warp").hide();
});

//병음 보기
$(".vocabularyBook .show_pinyin_btn").on("click", function () {
  $(this).hide();
  $(this).next().show();
  $(".voca_popup_tab .gRegula").show();
});
//  병음 가리기
$(".vocabularyBook .hide_pinyin_btn").on("click", function () {
  $(this).hide();
  $(this).prev().show();
  $(".voca_popup_tab .gRegula").hide();
});

//단어장 리스트
$(".voca_popup_btn").on("click", function () {
  let index = $(".voca_popup_btn").index(this);
  setActive($(this), "voca_popup_btn");
  $(".voca_popup_tab").hide();
  $(".voca_popup_tab").eq(index).show();
  $(".voca_warp > span").hide();
  $(".voca_warp > span").eq(index).show();
});
