document.getElementById("shwpwrd").addEventListener("click", () => {
  const pwd1 = document.getElementById("password1");
  const pwd2 = document.getElementById("password2");
  const type = pwd1.type === "password" ? "text" : "password";
  pwd1.type = type;
  pwd2.type = type;
});