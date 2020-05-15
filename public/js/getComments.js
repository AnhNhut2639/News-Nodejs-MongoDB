$(document).ready(function () {
  $("#comments").submit(function (event) {
    event.preventDefault();
    var location = window.location.pathname;
    $.ajax({
      type: "GET",
      url: "http://localhost:3000" + location + "/comments",
      dataType: "json",
      success: function (response) {
        var commentsArea = $("#commented");
        var newArr = response.map(function (item) {
          return `  
            <li class="single_comment_area">
            <div class="comment-content d-flex">
            <div class="comment-author">
                <p>${item.firstChart}</p>
              </div>
              <div class="comment-meta">
                  <a href="#" class="comment-date">${item.date}</a>
                  <h6>${item.fullname}</h6>
                  <p>${item.content}</p>
              </div>
              </div>
          </li>`;
        });
        commentsArea.html(newArr);
        clearInputs();
      },
    });
  });
});
function clearInputs() {
  $("#name").val("");
  $("#email").val("");
  $("#phone").val("");
  $("#message").val("");
}
