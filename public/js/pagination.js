$(document).ready(function() {
  $(".page-item").on("click", function(e) {
    e.preventDefault();
    var path = e.toElement.pathname;
    var arr = path.split("/").slice(2);
    var page = parseInt(arr);
    $.ajax({
      type: "GET",
      url: "http://localhost:3000/page/" + page,
      success: function(res) {
        // console.log(page);

        var select = $("#insertAjax");
        var newArr = res.map(function(item) {
          return `<div class="col-12 col-lg-6">
            <div class="single-blog-post d-flex style-3 mb-30">
                <div class="post-thumbnail">
                    <a href="/news/${item.id}"><img src=${item.img}></a>
                </div>
                <div class="post-content">
                    <a href="/news/${item.id}" class="post-title">${item.title}</a>

                    <div class="post-meta d-flex">
                        <p> ${item.date}: ${item.time} <a href="#">${item.theme}</a> </p>
                    </div>
                    <div class="post-meta d-flex justify-content-between">
                        <a href="#"><i class="fa fa-eye" aria-hidden="true"></i>${item.viewsCount}</a>
                        <a href="#"><i class="fa far fa-comments" aria-hidden="true"></i>5</a>
                        <a></a>
                    </div>
                </div>
            </div>
        </div>`;
        });
        select.html(newArr);
      }
    });
  });
});
