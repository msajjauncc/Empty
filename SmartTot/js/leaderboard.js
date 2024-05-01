/* eslint-disable require-jsdoc */
/* eslint-disable max-len */

$(document).ready(async function() {
  $('#leaderboard-list').on('click', async function() {
    const leaderboardData = await getLeaderBoard();
    const leaderboardTable = $('#leaderboardbody');
    let dataString = '';
    let categorydatastring = '';

    leaderboardData.sort((a, b) => parseInt(b.score) - parseInt(a.score));

    let categories = ['All Categories','Science','Literature','General Knowledge','Numbers','Sports','Entertainment'];
    categories.forEach((value,index) => {
      const item = '<a class="dropdown-item" href="#" >' + value + '</a>';
      categorydatastring += item;  
    });

    $('#select-category-3').html(categorydatastring);

    $.each(leaderboardData, function(index, value) {
      const rank = '<td>#' + (parseInt(index + 1)) + '</td>';
      const name = '<td>' + value.name + '</td>';
      const email = '<td>' + value.email + '</td>';
      const percentage = '<td>' + value.score + '</td>';
      const category = '<td>' + value.category + '</td>';
      dataString += '<tr>' + rank + name + email + percentage + category + '</tr>';
    });



    if (dataString.length !== 0) {
      leaderboardTable.html(dataString);
    } else {
      leaderboardTable.html('<td colspan=\'3\' >Be the first one to be on the leaderboard!!!</td>');
    }
  });
});

async function getLeaderBoard() {
  const users = await getUsers();
  const quizResult = await getQuizResult();

  let leaderboardData = [];  // Changed from {} to []
  let userDetails = {};
  // Count the percentage of the user based on quiz count and score count
  $.each(users, function(index, value) {
    userDetails[value.email] = value;
  });

  $.each(quizResult, function(index, value) {
    const userQuizEmail = value.email;  // Direct access instead of quizResult[index].email

    if (userDetails[userQuizEmail]) {  // Check if user detail exists to avoid undefined errors
      const combination = {
        email: userDetails[userQuizEmail].email,
        name: userDetails[userQuizEmail].firstname + ' ' + userDetails[userQuizEmail].lastname,
        score: value.score,
        category: value.categoryname
      };
      leaderboardData.push(combination);
    }
  });
  return leaderboardData;
}


// Get users for the leaderboard
async function getUsers() {
  const users = await $.ajax({
    url: 'http://localhost:3000/user/',
    method: 'GET',
    success: function(x) {
      return x;
    },
    error: function(x) {
      console.error(x);
    },
  });

  return users;
}

// Get quiz results of all users for the leaderboard
async function getQuizResult() {
  const quizResultList = await $.ajax({
    method: 'GET',
    url: 'http://localhost:3000/quizresult',
    success: function(x) {
      return x;
    },
    error: function(x) {
      console.error(x);
    },
  });
  return quizResultList;
}


// Function to fetch and display leaderboard data based on category
async function updateLeaderboard(category) {
  const leaderboardData = await getLeaderBoard();  // Pass the selected category to the function
  const leaderboardTable = $('#leaderboardbody');
  let dataString = '';
  let ranks = 0;
  leaderboardData.sort((a, b) => parseInt(b.score) - parseInt(a.score));

  $.each(leaderboardData, function(index, value) {
    const rank = '<td>#' + (parseInt(ranks + 1)) + '</td>';
    const name = '<td>' + value.name + '</td>';
    const email = '<td>' + value.email + '</td>';
    const percentage = '<td>' + value.score + '</td>';
    const current_category = '<td>' + value.category + '</td>';

    if( category == 'All Categories' || category == value.category ){
      dataString += '<tr>' + rank + name + email + percentage + current_category + '</tr>';
      ranks++;
    }
  });

  if (dataString.length !== 0) {
    leaderboardTable.html(dataString);
  } else {
    leaderboardTable.html('<td colspan=\'5\' >Be the first one to be on the leaderboard!!!</td>');
  }
}

// Correct event delegation for dynamically added elements
$(document).on('click', '#select-category-3 a', function(e) {
  e.preventDefault();  // Prevent the default anchor click behavior
  var selectedCategory = $(this).text();
  $('#dropdownMenuButtonOutsideLeaderboard').text(selectedCategory);  // Update the button text to the selected category

  updateLeaderboard(selectedCategory);  // Call the update function with the selected category
});
