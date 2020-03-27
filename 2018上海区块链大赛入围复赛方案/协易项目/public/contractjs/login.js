$(function() {
  $("#saveForm").click(function() {
    username = $("#text1").val();
    password = $("#password-field").val();
    console.log(username);
    if (username == "" || password == "") {
      alert("填写信息不能为空")
    }
    $.ajax({
      type: "POST",
      url: "/dologin",
      data: {
        username: username,
        password: password
      },
      success: function(result) {
        console.log(result);
        window.location.href="/"
        if (result.code == 0) {
          message = result.message;
          alert(message)
        } else if (result.code == 1) {
          message = result.message;
          alert(message)
        }
      }
    })
  })
});
