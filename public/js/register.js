const shwPwrdBtn = document.getElementById("shwpwrd");
shwPwrdBtn.addEventListener('click', () => {
    const pswrdInput = document.getElementById("pswrd");
    const type = pswrdInput.getAttribute("type")
    if (type == "password") {
        pswrdInput.setAttribute("type", "text");
        shwPwrdBtn.innerHTML = "Hide Password";
    } else {
        pswrdInput.setAttribute("type", "password");
        shwPwrdBtn.innerHTML = "Show Password";
    }
});