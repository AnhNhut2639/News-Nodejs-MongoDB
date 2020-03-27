$(document).ready(function() {
  $("#comments").submit(function(event) {
    event.preventDefault();
    var location = window.location.pathname;
    $.ajax({
      type: "POST",
      url: "http://localhost:3000" + location,
      data: $("#comments").serialize(),
      dataType: "String",
      success: function(response) {}
    });
  });
});
