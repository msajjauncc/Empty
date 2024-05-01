/* eslint-disable max-len */
/* eslint-disable require-jsdoc */

// Ensure that the code is encapsulated within an immediately invoked function expression (IIFE)
(function () {
  $(document).ready(async function () {
    const users = await getUsers();
    const questionList = await getQuestionList();
    const quizResult = await getQuizResult();

    updateStatistics(users, questionList, quizResult);
  });

  async function updateStatistics(users, questionList, quizResult) {
    $('#total-user').text(users.length);
    $('#total-question').text(questionList.length);
    $('#total-quiz').text(quizResult.length);

    if (quizResult.length !== 0) {
      $('#charts').show();
      await renderPieChart(quizResult);
    } else {
      $('#charts').hide();
    }
  }

  async function renderPieChart(quizResult) {
    const categoryPieChart = {};

    $.each(quizResult, function (i, n) {
      if (categoryPieChart[n['categoryname']] === undefined) {
        categoryPieChart[n['categoryname']] = 1;
      } else {
        categoryPieChart[n['categoryname']] = parseInt(categoryPieChart[n['categoryname']]) + 1;
      }
    });

    const categoryPieChartArray = Object.keys(categoryPieChart).map(function (key) {
      return [key, categoryPieChart[key]];
    });

    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
      categoryPieChartArray.unshift(['Category', 'Quiz Taken']);
      const data = google.visualization.arrayToDataTable(
        categoryPieChartArray,
      );

      const options = {
        title: 'Category Wise Quiz Taken',
        x: 0,
        y: 0,
        height: 300,
        chartArea: {
          left: 10,
          top: 20,
          width: '100%',
          height: '80%',
        },
        pieHole: 0.3,
      };

      const chart = new google.visualization.PieChart($('#piechart')[0]);

      chart.draw(data, options);
    }
  }
})();