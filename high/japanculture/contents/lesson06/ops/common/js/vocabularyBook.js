// 단어장 뜻 보기
$(".vocabularyBook .show_defi").on("click", function () {
  $(this).hide();
  $(this).next().show();
  $(`.vocabularyBook [data-name="definition"]`).show();
});
//  단어장 뜻 감추기
$(".vocabularyBook .hide_defi").on("click", function () {
  $(this).hide();
  $(this).prev().show();
  $(`.vocabularyBook [data-name="definition"]`).hide();
});

//단어장 리스트
$(`[data-name="vocabulary-list"] button`).on("click", function () {
  const index = $(this).index();
  $(this).siblings().removeClass("text-red");
  $(this).addClass("text-red");

  $(`.vocabularyBook [data-name="word"]`).children().hide();
  $(`.vocabularyBook [data-name="word"]`).children().eq(index).show();
  $(`.vocabularyBook [data-name="definition"]`).children().hide();
  $(`.vocabularyBook [data-name="definition"]`).children().eq(index).show();
  //뜻 감추기
  $(".vocabularyBook .hide_defi").hide();
  $(".vocabularyBook .show_defi").show();
  $(`.vocabularyBook [data-name="definition"]`).hide();
});
