$(document).ready(function() {
  $("#idSelect").change(function(e) {
    e.preventDefault();
    var x = $("#idSelect").val();
    $.ajax({
      type: "GET",
      url: "http://localhost:3000/editor/getTheme/" + x,
      success: function(res) {
        console.log(res);
        var select = $("#inputThemes");

        // res.forEach(function(item) {
        //   select.append(
        //     " <option value='" +
        //       item.idChuDe +
        //       "'> " +
        //       item.tenChuDe +
        //       "</option>"
        //   );
        // });

        var newArr = res.map(function(item) {
          return (
            "<option value='" +
            item.idChuDe +
            "'> " +
            item.tenChuDe +
            "</option>"
          );
        });
        select.html(newArr);
      }
    });
  });
});
