localStorage.setItem("id" , "ssafy")
localStorage.setItem("pw" , "123123")
localStorage.setItem("name" , "민혁")
localStorage.setItem("address" , "서울특별시 종로구 내수동 71")


function login() {
    if (localStorage.getItem("id")) {
        alert("로그인 성공!!")
    signInBtn.innerText = localStorage.getItem("name") + "님 안녕하세요"
    signUpBtn.innerText = "로그아웃"
    }   
};

let signInBtn = document.getElementById("signIn")
let signUpBtn = document.getElementById("signUp")
signInBtn.addEventListener("click", login)

signUpBtn.addEventListener("click", function () {
    alert("로그아웃 성공!!")
    signInBtn.innerText = "로그인"
    signUpBtn.innerText = "회원가입"
})