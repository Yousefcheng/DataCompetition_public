$(function() {
  $("#saveForm").click(function() {
    username = $("#text1").val();
    phone = $("#text2").val();
    password = $("#password-field-1").val();
    password_again = $("#password-field-2").val();
    console.log(username);
    if (username == "" || password == "") {
      alert("填写信息不能为空")
    }
    if (password != password_again) {
      alert("两次输入的密码不一致")
    }
    $.ajax({
      type: "POST",
      url: "/doregister",
      data: {
        username: username,
        phone: phone,
        password: password
      },
      success: function(result) {
        console.log(result);
        window.location.href="/login"
        if (result.code == 0) {
          message = result.message;
          alert(message)
        } else {
          message = result.message;
          alert(message)
        }
      }
    })
  })
});
