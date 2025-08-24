let url;

$(document).ready(function () {
  $.each(data, function (index, item) {
    url = item.url;
    render.lesson(item.lesson);
    $.each(item.data, function (index2, item2) {
      render.list(index);
      $.each(item2.data, function (index3, item3) {
        if (item2.data.length > 0) {
          render.item(index, index2, item3);
        }
      });
    });
  });
});

const render = {
  lesson: (title) => {
    $('.warp').append(`
    <div class="content">
      <div class="title">${title}</div>
    </div>`);
  },
  list: (index) => {
    $('.content').eq(index).append(`<ul class="list"></ul>`);
  },
  item: (index, index2, item3) => {
    $('.content').eq(index).find('.list').eq(index2).append(`
        <li class="item">
          <a
            href="${url + item3.link}"
            class="link"
            target="_blank"
            >${item3.title}</a
          >
        </li>
      `);
  },
};
