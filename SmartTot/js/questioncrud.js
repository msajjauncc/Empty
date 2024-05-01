/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
class Question {
  constructor(id, category, question, options, answer, questionImage, difficultyLevel) {
    this.id = id;
    this.category = category;
    this.question = question;
    this.options = options;
    this.answer = answer;
    this.questionImage = questionImage;
    this.difficultyLevel = difficultyLevel;
  }
}

let questionList;
let selectedAnswer = null;
let selectedCategory1 = null;
let selectedCategory2 = null;
let editedAnswer;
let questionid;
let questionListToDisplay;

$(document).ready(async function () {
  const categorylist = await getCategoryList();
  let datastring = '';
  $.each(categorylist, function (index, value) {
    const item = '<a class="dropdown-item" href="#" >' + value.categoryname + '</a>';
    datastring += item;
  });
  $('#select-category-2').html(datastring);
  datastring = '<a class="dropdown-item" href="#" >All Categories</a>' + datastring;
  $('#select-category-1').html(datastring);

  questionList = await getQuestionList();
  questionListToDisplay = questionList;

  displayQuestions(questionList);

  $('#add-question-modal').on('click', async function () {
    selectedAnswer = null;
    selectedCategory2 = null;
  });

  $('#select-category-2 a').on('click', function () {
    selectedCategory2 = this.text;
    $('#selectedCatagoryDisplay').text(this.text);
  });

  $('#select-category-1 a').on('click', function () {
    console.log(this.text);
    selectedCategory1 = this.text;
    $('#dropdownMenuButtonOutside').text(this.text);
    if (selectedCategory1 == 'All Categories') {
      displayQuestions(questionList);
    } else {
      questionListToDisplay = questionList.filter((question) => question.category === selectedCategory1);
      displayQuestions(questionListToDisplay);
    }
  });
  
  

  $('#edit-answer a').on('click', function () {
    editedAnswer = $('#' + $(this).attr('value')).val();
    $('#dropdownMenuButton').text(editedAnswer);
  });

  $('#select-answer-1 a').on('click', function () {
    selectedAnswer = $('#' + $(this).attr('value')).val();
    $('#answer').text(this.text);
  });

  $('#questionImage, #questionImageUpdate').on('change', function () {
    if (this.files[0].size > 307200) {
      alert('File is too big!');
      this.value = '';
    }
  });

  $('#question-add-form').on('submit', async function (ev) {
    ev.preventDefault();
    let category = selectedCategory2;
    if (selectedCategory2 == null) {
      $('#error-msg-add').text('Please select a category first!!');
    } else if (selectedAnswer == null) {
      $('#error-msg-add').text('Please select an option for the correct answer!!!');
    } else {
      category = selectedCategory2;
      const question = $('#question').val();
      const optionA = $('#option-1').val();
      const optionB = $('#option-2').val();
      const optionC = $('#option-3').val();
      const optionD = $('#option-4').val();
      const questionImage = $('#questionImage').prop('files')[0];
      var selectedDifficulty = $('input[name="add-level"]:checked').val();
      if(!selectedDifficulty){
        alert('Please select difficulty level');
        return;
      }
      let questionImageBase = null;
      if (questionImage) {
        const reader = new FileReader();
        reader.readAsDataURL(questionImage);
        reader.addEventListener('load', async function () {
          questionImageBase = reader.result;
          const answer = selectedAnswer;
          const options = [optionA, optionB, optionC, optionD];
          const id = 'questions-' + uuidv4();
          const questionObject = new Question(id, category, question, options, answer, questionImageBase, selectedDifficulty);
          await addQuestion(questionObject);
        }, false);
      } else {
        const answer = selectedAnswer;
        const options = [optionA, optionB, optionC, optionD];
        const id = 'questions-' + uuidv4();
        const questionObject = new Question(id, category, question, options, answer, questionImageBase, selectedDifficulty);
        await addQuestion(questionObject);
      }
    }
  });

  $('#question-update-form').on('submit', async function (ev) {
    ev.preventDefault();
    await updateQuestion();
  });

  $('#delete-question-button').on('click', async function () {
    await deleteQuestion(questionid);
  });
});

function displayQuestions(questions) {
  let datastring = '';
  const questionlistbody = $('#questionlistbody');
  $.each(questions, function (index, value) {
    const srno = '<td>' + (parseInt(index + 1)) + '</td>';
    const que = '<td>' + value.question + '</td>';
    const categoryname = '<td>' + value.category + '</td>';
    const editbutton = '<a data-bs-target="#editQuestionModal" onclick="updateModal(' + index + ')" class="edit" data-bs-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>';
    const deletebutton = '  <a data-bs-target="#deleteQuestionModal" onclick="deleteModal(\'' +

 value.id + '\')" class="delete" data-bs-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>';
    datastring += '<tr>' + srno + que + categoryname + '<td>' + editbutton + deletebutton + '</td></tr>';
  });
  if (datastring.length != 0) {
    questionlistbody.html(datastring);
  } else {
    questionlistbody.html('<td colspan=\'4\' >Add Questions to create a valid QUIZ!!!</td>');
  }
}

function deleteModal(id) {
  questionid = id;
}

function updateModal(index) {
  const currentQuestion = questionListToDisplay[index];
  $('#edit-question-id').val(questionListToDisplay[index].id);
  $('#edit-question').val(questionListToDisplay[index].question);
  $('#edit-option-1').val(questionListToDisplay[index]['options[]'][0]);
  $('#edit-option-2').val(questionListToDisplay[index]['options[]'][1]);
  $('#edit-option-3').val(questionListToDisplay[index]['options[]'][2]);
  $('#edit-option-4').val(questionListToDisplay[index]['options[]'][3]);
  $('#dropdownMenuButton').text(questionListToDisplay[index].answer);
  editedAnswer = currentQuestion.answer;
  $('input[name="edit-level"]').each(function() {
    if ($(this).val() === currentQuestion.difficultyLevel) {
      $(this).prop('checked', true);
    }
  });
}

function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16),
  );
}

function addQuestion(question) {
  $.ajax({
    method: 'POST',
    url: 'http://localhost:3000/questions/',
    data: question,
    success: function (response) {
      location.reload();
    },
  });
}

async function getQuestionList() {
  const questionList = await $.ajax({
    method: 'GET',
    url: 'http://localhost:3000/questions/',
    success: function (x) {
      return x;
    },
  });
  return questionList;
}

async function deleteQuestion(id) {
  await $.ajax({
    method: 'DELETE',
    url: 'http://localhost:3000/questions/' + id,
    success: function (x) {
      location.reload();
    },
    error: function (e) {
    },
  });
}

async function updateQuestion() {
  const id = $('#edit-question-id').val();
  const question = $('#edit-question').val();
  const optionA = $('#edit-option-1').val();
  const optionB = $('#edit-option-2').val();
  const optionC = $('#edit-option-3').val();
  const optionD = $('#edit-option-4').val();
  const options = [optionA, optionB, optionC, optionD];
  var selectedDifficulty = $('input[name="edit-level"]:checked').val();

  const questionImage = $('#questionImageUpdate').prop('files')[0];
  let questionImageBase = null;
  if (questionImage) {
    const reader = new FileReader();
    reader.readAsDataURL(questionImage);
    reader.addEventListener('load', async function () {
      questionImageBase = reader.result;
      const data = {
        'question': question,
        'options': options,
        'answer': editedAnswer,
        'questionImage': questionImageBase,
        'difficultyLevel': selectedDifficulty
      };
      await $.ajax({
        method: 'PATCH',
        url: 'http://localhost:3000/questions/' + id,
        data: data,
        success: function (x) {

        },
      });
      location.reload();
    }, false);
  } else {
    const data = {
      'question': question,
      'options': options,
      'answer': editedAnswer,
      'difficultyLevel': selectedDifficulty
    };
    await $.ajax({
      method: 'PATCH',
      url: 'http://localhost:3000/questions/' + id,
      data: data,
      success: function (x) {

      },
    });
    location.reload();
  }
}

async function getCategoryList() {
  const categoryList = await $.ajax({
    method: 'GET',
    url: 'http://localhost:3000/category/',
    success: function (x) {
      return x;
    },
  });
  return categoryList;
}