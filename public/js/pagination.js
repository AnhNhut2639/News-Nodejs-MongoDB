$(document).ready(function () {
  $(".page-item").on("click", function (e) {
    e.preventDefault();
    var path = e.toElement.pathname;
    console.log(path);
    var arr = path.split("/").slice(2);
    var page = parseInt(arr);
    $.ajax({
      type: "GET",
      url: "http://localhost:3000/page/" + page,
      success: function (res) {
        // console.log(page);

        var select = $("#insertAjax");
        var newArr = res.map(function (item) {
          return `<div class="col-12 col-lg-6">
            <div class="single-blog-post d-flex style-3 mb-30">
                <div class="post-thumbnail">
                    <a href="/news/${item.id}"><img src=${item.img}></a>
                </div>
                <div class="post-content">
                    <a href="/news/${item.id}" class="post-title">${item.title}</a>
                    <p>${item.epitomize}</p>
                    <div class="post-meta d-flex">
                        <p> ${item.date} <a href="/themes/${item.idTheme}">${item.theme}</a> </p>
                    </div>
                </div>
            </div>
        </div>`;
        });
        select.html(newArr);
      },
    });
  });
});
