/* eslint-disable guard-for-in */
/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
let questions = [];
let quiz;
var showAlert = true;
const categoryName = localStorage.getItem('categoryname');
class QuestionObject {
  constructor(question, options, answer, questionImage, userAnswer) {
    this.question = question;
    this.options = options;
    this.answer = answer;
    this.userAnswer = userAnswer;
    this.questionImage=questionImage;
  }
  isCorrectAnswer(choice) {
    return this.answer === choice;
  }
}


class Quiz {
  constructor(score, questions, questionIndex) {
    this.score = score;
    this.questions = questions;
    this.questionIndex = questionIndex;
  }
  getQuestionIndex() {
    return this.questions[this.questionIndex];
  }
  guess(choice) {
    if (this.getQuestionIndex().isCorrectAnswer(choice)) {
      this.score[this.questionIndex] = 1;
    } else {
      this.score[this.questionIndex] = 0;
    }
  }
  isEnded() {
    return this.questionIndex === this.questions.length;
  }
}


function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16),
  );
}

// Display Questoins
function displayQuiz() {
  if (quiz.isEnded()) {
    showScores();
  } else {
    const questionOptions = quiz.getQuestionIndex().options;
    if (quiz.questionIndex == 0) {
      $('#prevQuestion').attr('disabled', true);
    } else {
      $('#prevQuestion').attr('disabled', false);
    }
    if (quiz.questionIndex == quiz.questions.length - 1) {
      $('#nextQuestion').text('Finish');
    } else {
      $('#nextQuestion').text('Next');
    }
    const que=quiz.getQuestionIndex().question;
    // if(que.length>80)
    // {
    //     que= que.substring(0,50)+"<br>"+que.substring(50);
    // }
    $('#question').html(que);
    $('#option1').attr('value', questionOptions[0]);
    $('#option2').attr('value', questionOptions[1]);
    $('#option3').attr('value', questionOptions[2]);
    $('#option4').attr('value', questionOptions[3]);
    $('#label1').html(questionOptions[0]);
    $('#label2').html(questionOptions[1]);
    $('#label3').html(questionOptions[2]);
    $('#label4').html(questionOptions[3]);
    if (quiz.getQuestionIndex().questionImage!='') {
      $('#questionImageShow').show();
      $('#questionImageShow').attr('src', quiz.getQuestionIndex().questionImage);
    } else {
      $('#questionImageShow').hide();
    }
    if (quiz.getQuestionIndex().userAnswer != null) {
      const id = '#' + quiz.getQuestionIndex().userAnswer;
      $(id).prop('checked', true);
    } else {
      $('input[name="options"]').prop('checked', false);
    }
    showProgress();
  }
}


// show question number like Question 1 of 3
function showProgress() {
  const currentQuestionNumber = quiz.questionIndex + 1;
  $('#progress').html('Question ' + currentQuestionNumber + ' of ' + quiz.questions.length);
}


// showing result as division && post to database
function showScores() {
  $('#showQuestionsDiv').hide();
  $('#showResultDiv').show();
  $('#showAnswersDiv').show();
  const time = $('#time').text();
  const id = 'quizresult-' + uuidv4();
  let scoreValue = 0;
  for (let i = 0; i < quiz.score.length; i++) {
    scoreValue += quiz.score[i];
  }
  const totalquestions = quiz.questions.length;
  const sessionData = getUserSessionData();
  const userId = sessionData.userid; const email = sessionData.useremail;
  const quizresult = {
    'userid': userId,
    'email': email,
    'id': id,
    'categoryname': categoryName,
    'score': scoreValue,
    'totalquestions': totalquestions,
    'correct': scoreValue,
    'totaltime': time,
    'timestamp': new Date(),
  };
  const per = parseInt((scoreValue / totalquestions) * 100) + ' %';
  $('#totalQuestions').text(totalquestions);
  $('#correctQuestions').text(scoreValue);
  $('#wrongQuestions').text(totalquestions - scoreValue);
  $('#percentage').text(per);
  $('#score').text(scoreValue + ' out of ' + totalquestions);
  let gameOverHTML = '<h1>Result</h1>';
  gameOverHTML += '<h2 id=\'score\'> Your scores: ' + scoreValue + '</h2>';
  $('#result').html(gameOverHTML);
  $.each(quiz.questions, function(i, n) {
    const optionsForAnswer = n['options'];
    let label1 = '<label class="option radio btn" id="label1" for="option1">' + optionsForAnswer[0] + '</label><br>';
    let label2 = '<label class="option radio btn" id="label2" for="option2">' + optionsForAnswer[1] + '</label><br>';
    let label3 = '<label class="option radio btn" id="label3" for="option3">' + optionsForAnswer[2] + '</label><br>';
    let label4 = '<label class="option radio btn" id="label4" for="option4">' + optionsForAnswer[3] + '</label><br></div>';
    let que=n['question'];
    // if (que.length>50) {
    //   que= que.substring(0, 50)+'<br>'+que.substring(50);
    // }
    const questionAnswerShow = '<h4 class="card-subtitle mb-2 text-muted" id="question">' + (i + 1) + ' . ' + que + '</h4><br><div class="container" role="group" aria-label="Basic radio toggle button group">';


    let userAnswerIndex = -1;
    if (n.userAnswer != undefined) {
      userAnswerIndex = parseInt(n.userAnswer.charAt(6)) - 1;
    }

    let index = 0;
    $.each(n.options, function(j, m) {
      if (m == n.answer) {
        index = j;
      }
    });


    if (index == userAnswerIndex) {
      if (index == 0) {
        label1 = '<label class="option radio btn" id="label1" for="option1" style="background-color:#92f081;">' + optionsForAnswer[0] + '</label><br>';
      } else if (index == 1) {
        label2 = '<label class="option radio btn" id="label2" for="option2" style="background-color:#92f081;">' + optionsForAnswer[1] + '</label><br>';
      } else if (index == 2) {
        label3 = '<label class="option radio btn" id="label3" for="option3" style="background-color:#92f081;">' + optionsForAnswer[2] + '</label><br>';
      } else if (index == 3) {
        label4 = '<label class="option radio btn" id="label4" for="option4" style="background-color:#92f081;">' + optionsForAnswer[3] + '</label><br></div>';
      }
    } else {
      if (index == 0) {
        label1 = '<label class="option radio btn" id="label1" for="option1" style="background-color:#92f081;">' + optionsForAnswer[0] + '</label><br>';
      } else if (index == 1) {
        label2 = '<label class="option radio btn" id="label2" for="option2" style="background-color:#92f081;">' + optionsForAnswer[1] + '</label><br>';
      } else if (index == 2) {
        label3 = '<label class="option radio btn" id="label3" for="option3" style="background-color:#92f081;">' + optionsForAnswer[2] + '</label><br>';
      } else if (index == 3) {
        label4 = '<label class="option radio btn" id="label4" for="option4" style="background-color:#92f081;">' + optionsForAnswer[3] + '</label><br></div>';
      }
      if (userAnswerIndex == 0) {
        label1 = '<label class="option radio btn" id="label1" for="option1" style="background-color:#f07373;">' + optionsForAnswer[0] + '</label><br>';
      } else if (userAnswerIndex == 1) {
        label2 = '<label class="option radio btn" id="label2" for="option2" style="background-color:#f07373;">' + optionsForAnswer[1] + '</label><br>';
      } else if (userAnswerIndex == 2) {
        label3 = '<label class="option radio btn" id="label3" for="option3" style="background-color:#f07373;">' + optionsForAnswer[2] + '</label><br>';
      } else if (userAnswerIndex == 3) {
        label4 = '<label class="option radio btn" id="label4" for="option4" style="background-color:#f07373;">' + optionsForAnswer[3] + '</label><br></div>';
      }
    }
    const fullDiv = questionAnswerShow + label1 + label2 + label3 + label4;
    $('#showAnswersList').append(fullDiv);
  });
  addQuizResult(quizresult);
};

function addQuizResult(data) {
  callItSelf(data);
}
/*function callItSelf(data){
  var response = confirm("Your quiz is completed. Do you want to exit the quiz.");
  if( response === true ){
    $.ajax({
      method: 'POST',
      url: 'http://localhost:3000/quizresult',
      data: data,
      success: function(response) {
        window.location.replace("./userhomepage.html");
      },
    });
  } else{
    if( showAlert ){
      showAlert = false;
      alert("You can see your results now");
    }
    setTimeout(function () {    
    callItSelf(data);
  }, 10000);
}
}*/

function callItSelf(data) {
  Swal.fire({
    title: 'Your quiz is completed. What do you want to do?',
    icon: 'question',
    showCancelButton: true,
    cancelButtonText: 'Exit',
    confirmButtonText: 'See Score'
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: 'You can see your results now',
        icon: 'success',
        confirmButtonText: 'OK'
      });
      /*setTimeout(function () {    
        callItSelf(data);
      }, 10000);*/
    }
     else {
      $.ajax({
        method: 'POST',
        url: 'http://localhost:3000/quizresult',
        data: data,
        success: function(response) {
          window.location.replace("./userhomepage.html");
        }
      });
     }  
})
}


function randomQuestions(questionsDemo) {
  const randomQuestions=[];
  max=questionsDemo.length;
  const n = max > 10 ? 10 : max;
  for (let i=0; i<n; i++) {
    let flag=0;
    b=parseInt(Math.random()*max);
    for (let j=0; j<=randomQuestions.length; j++) {
      if (b===randomQuestions[j]) {
        flag=1;
        i--;
        break;
      }
    }
    if (flag==0) {
      randomQuestions[i]=b;
    }
  }

  $(randomQuestions).each(function(i) {
    questions.push(questionsDemo[randomQuestions[i]]);
  });


  return questions;
}


$(document).ready(async function() {
  $('#showResultDiv').hide();
  $('#showAnswersDiv').hide();
  $('#goHomeButtonId').on('click', function() {
    $(location).attr('href', 'userhomepage.html');
  });

  // Go to next questions
  $('#nextQuestion').on('click', function(e) {
    e.preventDefault();
    const choice = $('input[name="options"]:checked');
    quiz.getQuestionIndex().userAnswer = choice.attr('id');
    // quiz.getQuestionIndex().userAnswer = choice.val();
    quiz.guess(choice.val());
    quiz.questionIndex += 1;
    displayQuiz();
  });

  // Go to prev questions
  $('#prevQuestion').on('click', function() {
    const choice = $('input[name="options"]:checked').val();
    quiz.guess(choice);
    quiz.questionIndex -= 1;
    displayQuiz();
  });


  const category = localStorage.getItem('categoryname');
  const difficultyLevel = localStorage.getItem('difficultyLevel');
  const questionList = await getQuestionList(category, difficultyLevel);
  const questionsDemo=[];
  let optionList = [];
  for (const question in questionList) {
    const optionArray = questionList[question]['options[]'];
    for (const optionArray1 in optionArray) {
      optionList.push(optionArray[optionArray1]);
    }
    let q;
    if (questionList[question]['questionImage']==undefined) {
      q = new QuestionObject(questionList[question]['question'], optionList, questionList[question]['answer'], null, null);
    } else {
      q = new QuestionObject(questionList[question]['question'], optionList, questionList[question]['answer'], questionList[question]['questionImage'], null);
    }
    questionsDemo.push(q);
    optionList = [];
  }

  questions=randomQuestions(questionsDemo);

  const scoreArray = [];
  for (let i = 0; i < questions.length; i++) {
    scoreArray[i] = 0;
  }
  quiz = new Quiz(scoreArray, questions, 0);
  const quizTime = 15 * quiz.questions.length; const display = $('#time');
  startTimer(quizTime, display);
  displayQuiz();
});

async function getQuestionList(category, difficultyLevel) {
  console.log(category, difficultyLevel);
  // let category = "category3";
  const current_url = 'http://localhost:3000/questions?category=' + category + '&difficultyLevel=' + difficultyLevel;
  console.log( current_url );
  const questionList = await $.ajax({
    method: 'GET',
    url: current_url,
    success: function(x) {
      return x;
    },
  });
  console.log( questionList )
  return questionList;
}

function startTimer(duration, display) {
  let timer = duration; let minutes; let seconds;
  const x = setInterval(function() {
    minutes = parseInt(timer / 60, 10);
    seconds = parseInt(timer % 60, 10);

    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    display.text(minutes + ':' + seconds);
    if (timer <= 60) {
      $('#time').css('color', 'red');
    }
    if (--timer < 0) {
      // timer = duration;
      $('#timer').hide();
      showScores();
      clearInterval(x);
    } else if (quiz.isEnded()) {
      $('#timer').hide();
      // showScores();
      clearInterval(x);
    }
  }, 1000);
}
