// localStorage에서 진행중인 설문조사 얻기.
let poll = localStorage.getItem("poll");
let pollBtnDiv = document.querySelector(".poll-make");
let pollViewDiv = document.querySelector(".poll");

let pollContent;

if (poll) {
  // 진행중인 투표가 있다면.
  let pollJson = JSON.parse(poll);
  let pollView = `
            <h2>[ 선택해 주세요 ]</h2>
            <h4>${pollJson.question}</h4>
            <div class="poll-answer-list">
         `;
  let answers = pollJson.answers;
  for (let answer of answers) {
    pollView += `
            <label><input type="radio" name="poll-answer" value="${answer}" /> ${answer}</label>
            `;
  }
  pollView += `
        </div>
        <div class="poll-btn-list">
          <button id="polling-btn" class="btn btn-primary">투표하기</button>
          <button class="btn">결과보기</button>
        </div>
        <div class="poll-date">투표기간 : 23.03.01 ~ 25.12.31</div>
        `;
  pollViewDiv.innerHTML = pollView;

  pollBtnDiv.style.display = "none";
  pollViewDiv.style.display = "";
} else {
  // 진행중인 투표가 없다면.
  pollContent = `진행중인 투표가 없습니다.`;
  pollViewDiv.innerHTML = pollContent;

  pollBtnDiv.style.display = "";
  pollViewDiv.setAttribute("style", "text-align: center; display: block;");
}

// 투표 만들기 버튼 클릭.
// document.getElementById("poll-make-btn").onclick = function () {

// }
document.getElementById("poll-make-btn").addEventListener("click", function () {
  window.open("makepoll.html", "mkpoll", "width=600, height=400, left=300, top=200");
});

// 투표하기 버튼 클릭
if (document.querySelector("#polling-btn")) {
  document.querySelector("#polling-btn").addEventListener("click", function () {
    let id = prompt("아이디입력", "아이디");
    console.log(id);
    let pwd = prompt("비밀번호입력", "비밀번호");
    console.log(pwd);

    let answers = document.getElementsByName("poll-answer");
    let val = "";
    for (let answer of answers) {
      if (answer.checked) {
        val = answer.value;
        break;
      }
    }
    if (val) alert(val + "을 선택!!!!");
    else alert("답변 항목 하나를 선택 해 주세요!!!");
  });
}
