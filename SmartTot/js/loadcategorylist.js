/* eslint-disable require-jsdoc */
/* eslint-disable max-len */

$(document).ready(async function () {
  const categories = await getCategoryList();

  let categoryComponentString = '<h4 class="h4">Quiz Categories</h4>';
  $.each(categories, function (index, value) {
    const categoryTitle = '<h5 class="card-title category-title">' + value.categoryname + '</h5>';
    const categoryDescription = '<p class="card-text category-desc">' + value.categorydescription.substring(0, 100) + '...</p>';
    const startButton = '<button id="start-quiz-button" onclick="onStartQuiz(\'' + value.categoryname + '\')" class="btn btn-primary start-quiz">Start Quiz</button>';

    categoryComponentString += '<div class="category card my-5">' +
      '<div class="card-body row">' +
      '<div class="col-md-12 col-lg-4 odd-left-container">' +
      categoryTitle +
      '</div> <div class="col-md-12 col-lg-8 odd-right-container">' +
      categoryDescription +
      startButton +
      '</div> </div> </div>';
  });

  if (categories.length === 0) {
    categoryComponentString += '<div>Categories not available currently !!!<br>Please be patient!!</div>';
  }

  $('#list-category').html(categoryComponentString);
});

function onStartQuiz(categoryname) {


    Swal.fire({
      title: 'Select Difficulty Level',
      input: 'select',
      inputOptions: {
          'Easy': 'Easy',
          'Medium': 'Medium',
          'Hard': 'Hard'
      },
      inputPlaceholder: 'Select Difficulty Level',
      showCancelButton: true,
      confirmButtonText: 'Submit',
      cancelButtonText: 'Cancel',
      inputValidator: (value) => {
          if (!value) {
            console.log(value);
              return 'Please Select Difficulty Level'
          }
      }
  }).then((result) => {
      if (result.isConfirmed) {
        localStorage.setItem('categoryname', categoryname);
        localStorage.setItem('difficultyLevel', result.value);
        $(location).attr('href', 'quizpage.html');
      }
  });

}

/** Fetch Category List */
async function getCategoryList() {
  try {
    const categoryList = await $.ajax({
      method: 'GET',
      url: 'http://localhost:3000/category/',
    });
    return categoryList;
  } catch (error) {
    console.error('Error fetching category list:', error);
    return [];
  }
}