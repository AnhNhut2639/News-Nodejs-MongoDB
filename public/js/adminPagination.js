$(document).ready(function() {
  $(".page-item").on("click", function(e) {
    e.preventDefault();
    var path = e.toElement.pathname;
    var arr = path.split("/").slice(4);
    var page = parseInt(arr);
    $.ajax({
      type: "GET",
      url: "http://localhost:3000/admin/posted/page/" + page,
      success: function(res) {
        var select = $("#ajax");
        var newArr = res.map(function(item) {
          return `<div class="single-catagory-post d-flex flex-wrap">
          <div class="post-thumbnail bg-img" style="background-image: url(${item.img});">
          </div>

          <div class="post-content">
              <div class="post-meta">
                  <a href="#">${item.date}</a>
                  <a href="#">${item.theme}</a>
              </div>
              <a href="/news/${item.id}" class="post-title">${item.title}</a>
              <p>Người Đăng: <b>${item.postedBy}</b> </p>
              <p>Người Duyệt: <b>${item.approvedBy}</b> Ngày: ${item.dateApproved}</p>
              <p>Người Cập Nhật: <b>${item.editedBy}</b> Ngày: ${item.dateEdited} </p>


              <div class="post-meta d-flex justify-content-between">
                  <a href="#"><i class="fa fa-eye" aria-hidden="true"></i> ${item.viewsCount}</a>
                  <a href="#"><i class="fa far fa-comments" aria-hidden="true"></i>5</a>
                  <a></a>
              </div>
          </div>
          <button type="button" class="btn btn-success mt-3 mr-2"><a href="edit/${item.id}"> Chỉnh
          Sửa</a></button>

          <button type="button" class="btn btn-danger mt-3"><a href="#">Xóa</a></button>

      </div>`;
        });
        console.log(newArr);
        select.html(newArr);
      }
    });
  });
});
