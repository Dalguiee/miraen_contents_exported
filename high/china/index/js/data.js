const data = [
  // {
  //   lesson: "lesson01",
  //   data: [
  //     {
  //       title: "",
  //       link: "",
  //     },
  //   ],
  // },
  // {
  //   lesson: "lesson02",
  //   data: [
  //     {
  //       title: "",
  //       link: "",
  //     },
  //   ],
  // },
  {
    lesson: "lesson03",
    data: [
      //42 ~ 43 (주교과서 페이지)
      [
        {
          title: "제목",
          link: "https://contents.m-teacher.co.kr/cms/smartppt/onflou/high/china/contents/lesson03/ops/3/3_01_01.html",
        },
        {
          title: "학습 목표, 표현, 문화",
          link: "https://contents.m-teacher.co.kr/cms/smartppt/onflou/high/china/contents/lesson03/ops/3/3_01_02.html",
        },
        {
          title: "[도입] 문화",
          link: "https://contents.m-teacher.co.kr/cms/smartppt/onflou/high/china/contents/lesson03/ops/3/3_01_03.html",
        },
      ],
      // 44
      [
        {
          title: "대화문",
          link: "https://contents.m-teacher.co.kr/cms/smartppt/onflou/high/china/contents/lesson03/ops/3/3_01_04.html",
        },
        {
          title: "1 这·那",
          link: "https://contents.m-teacher.co.kr/cms/smartppt/onflou/high/china/contents/lesson03/ops/3/3_01_05.html",
        },
        {
          title: "2 多",
          link: "https://contents.m-teacher.co.kr/cms/smartppt/onflou/high/china/contents/lesson03/ops/3/3_01_06.html",
        },
      ],
      // 45
      [
        {
          title: "1 소개하기",
          link: "https://contents.m-teacher.co.kr/cms/smartppt/onflou/high/china/contents/lesson03/ops/3/3_01_07.html",
        },
        {
          title: "2 나이 묻기",
          link: "https://contents.m-teacher.co.kr/cms/smartppt/onflou/high/china/contents/lesson03/ops/3/3_01_08.html",
        },
        {
          title: "哥哥·姐姐",
          link: "https://contents.m-teacher.co.kr/cms/smartppt/onflou/high/china/contents/lesson03/ops/3/3_01_09.html",
        },
      ],
      // 46
      [
        {
          title: "대화문",
          link: "https://contents.m-teacher.co.kr/cms/smartppt/onflou/high/china/contents/lesson03/ops/3/3_01_10.html",
        },
        {
          title: "1 一의 성조 변화",
          link: "https://contents.m-teacher.co.kr/cms/smartppt/onflou/high/china/contents/lesson03/ops/3/3_01_11.html",
        },
        {
          title: "2 个",
          link: "https://contents.m-teacher.co.kr/cms/smartppt/onflou/high/china/contents/lesson03/ops/3/3_01_12.html",
        },
      ],
      // 47
      [
        {
          title: "1 소유 묻기",
          link: "https://contents.m-teacher.co.kr/cms/smartppt/onflou/high/china/contents/lesson03/ops/3/3_01_13.html",
        },
        {
          title: "2 학년 말하기",
          link: "https://contents.m-teacher.co.kr/cms/smartppt/onflou/high/china/contents/lesson03/ops/3/3_01_14.html",
        },
        {
          title: "외동아들·외동딸",
          link: "https://contents.m-teacher.co.kr/cms/smartppt/onflou/high/china/contents/lesson03/ops/3/3_01_15.html",
        },
      ],
      //48
      [
        {
          title: "동아리 신청서 작성하기",
          link: "https://contents.m-teacher.co.kr/cms/smartppt/onflou/high/china/contents/lesson03/ops/3/3_01_16.html",
        },
        {
          title: "가상 가족 만들기",
          link: "https://contents.m-teacher.co.kr/cms/smartppt/onflou/high/china/contents/lesson03/ops/3/3_01_17.html",
        },
      ],
      //49
      [
        {
          title: "1번",
          link: "https://contents.m-teacher.co.kr/cms/smartppt/onflou/high/china/contents/lesson03/ops/3/3_01_18.html",
        },
        {
          title: "2번",
          link: "https://contents.m-teacher.co.kr/cms/smartppt/onflou/high/china/contents/lesson03/ops/3/3_01_19.html",
        },
        {
          title: "3번",
          link: "https://contents.m-teacher.co.kr/cms/smartppt/onflou/high/china/contents/lesson03/ops/3/3_01_20.html",
        },
        {
          title: "4번",
          link: "https://contents.m-teacher.co.kr/cms/smartppt/onflou/high/china/contents/lesson03/ops/3/3_01_21.html",
        },
        {
          title: "5번",
          link: "https://contents.m-teacher.co.kr/cms/smartppt/onflou/high/china/contents/lesson03/ops/3/3_01_22.html",
        },
        {
          title: "6번",
          link: "https://contents.m-teacher.co.kr/cms/smartppt/onflou/high/china/contents/lesson03/ops/3/3_01_23.html",
        },
      ],
      //50
      [
        {
          title: "고등학교 생활",
          link: "https://contents.m-teacher.co.kr/cms/smartppt/onflou/high/china/contents/lesson03/ops/3/3_01_24.html",
        },
        {
          title: "대학 입시와 시험",
          link: "https://contents.m-teacher.co.kr/cms/smartppt/onflou/high/china/contents/lesson03/ops/3/3_01_25.html",
        },
        {
          title: "낮잠 시간, 눈 보호 체조",
          link: "https://contents.m-teacher.co.kr/cms/smartppt/onflou/high/china/contents/lesson03/ops/3/3_01_26.html",
        },
        {
          title: "댓글 작성하기",
          link: "https://contents.m-teacher.co.kr/cms/smartppt/onflou/high/china/contents/lesson03/ops/3/3_01_27.html",
        },
      ],
      //51
      [
        {
          title: "눈 보호 체조",
          link: "https://contents.m-teacher.co.kr/cms/smartppt/onflou/high/china/contents/lesson03/ops/3/3_01_28.html",
        },
      ],
      //52
      [
        {
          title: "대학 입학 시험 비교",
          link: "https://contents.m-teacher.co.kr/cms/smartppt/onflou/high/china/contents/lesson03/ops/3/3_01_29.html",
        },
      ],
    ],
  },
];
