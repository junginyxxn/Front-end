// 답변 추가하기 버튼
document.querySelector("#btn-add").addEventListener("click", function () {
  let pollAnswerListDiv = document.querySelector("#poll-answer-list");

  let divEl = document.createElement("div"); // <div></div>
  divEl.setAttribute("class", "poll-answer-list-item"); // <div class="poll-answer-item"></div>

  let inputEl = document.createElement("input"); // <input/>
  inputEl.setAttribute("type", "text"); // <input type="text"/>
  inputEl.setAttribute("name", "answer"); // <input type="text" name="answer"/>

  let buttonEl = document.createElement("button");
  buttonEl.setAttribute("type", "button");
  buttonEl.setAttribute("class", "button");
  buttonEl.appendChild(document.createTextNode("삭제"));
  buttonEl.addEventListener("click", function () {
    let parentEl = this.parentNode;
    pollAnswerListDiv.removeChild(parentEl);
  });

  divEl.appendChild(inputEl);
  divEl.appendChild(buttonEl);

  pollAnswerListDiv.appendChild(divEl);
});

// 투표 생성하기 버튼
document.querySelector("#btn-make").addEventListener("click", function () {
  let question = document.querySelector("#question").value;
  if (!question) {
    alert("질문은 필수!!!");
    return;
  }

  // let answers = document.querySelectorAll("input[name='answer']");
  let answers = document.getElementsByName("answer");
  // for (let i = 0; i < answers.length; i++) {
  //     console.log(answers[i].value);
  // }
  for (const answer of answers) {
    if (!answer.value) {
      alert("답변 필수!!!");
      return;
    }
  }

  // answers.forEach(answer => {
  //     console.log("> " + answer.value);
  // });

  let answerArr = [];
  for (const answer of answers) {
    answerArr.push(answer.value);
  }

  let poll = {
    question: question,
    answers: answerArr,
  };

  if (confirm("정말로 투표 생성???")) {
    localStorage.setItem("poll", JSON.stringify(poll));
    opener.location.reload();
    self.close();
  }
});
