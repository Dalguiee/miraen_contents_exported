document.addEventListener("DOMContentLoaded", () => {
  const renderLesson = (title) => {
    const warp = document.querySelector(".warp");
    const contentDiv = document.createElement("div");
    contentDiv.classList.add("content");

    const titleDiv = document.createElement("div");
    titleDiv.classList.add("title");
    titleDiv.textContent = title;

    contentDiv.appendChild(titleDiv);
    warp.appendChild(contentDiv);

    return contentDiv;
  };

  const renderList = (contentDiv) => {
    const listUl = document.createElement("ul");
    listUl.classList.add("list");
    contentDiv.appendChild(listUl);

    return listUl;
  };

  const renderItem = (listUl, item) => {
    const itemLi = document.createElement("li");
    itemLi.classList.add("item");

    const itemLink = document.createElement("a");
    itemLink.href = item.link;
    itemLink.classList.add("link");
    itemLink.target = "_blank";
    itemLink.textContent = item.title;
    itemLi.appendChild(itemLink);
    listUl.appendChild(itemLi);
  };

  data.forEach((item) => {
    const contentDiv = renderLesson(item.lesson);
    item.data.forEach((itemList) => {
      const listUl = renderList(contentDiv);
      if (itemList.length > 0) {
        itemList.forEach((item3) => renderItem(listUl, item3));
      }
    });
  });
});

// $(document).ready(function () {
//   $.each(data, function (index, item) {
//     render.lesson(item.lesson);
//     $.each(item.data, function (index2, item2) {
//       render.list(index);
//       $.each(item2, function (index3, item3) {
//         if (item2.length > 0) {
//           render.item(index, index2, item3);
//         }
//       });
//     });
//   });
// });

// const render = {
//   lesson: (title) => {
//     $(".warp").append(`
//     <div class="content">
//       <div class="title">${title}</div>
//     </div>`);
//   },
//   list: (index) => {
//     $(".content").eq(index).append(`<ul class="list"></ul>`);
//   },
//   item: (index, index2, item3) => {
//     $(".content").eq(index).find(".list").eq(index2).append(`
//         <li class="item">
//           <a
//             href="${item3.link}"
//             class="link"
//             target="_blank"
//             >${item3.title}</a
//           >
//         </li>
//       `);
//   },
// };
