/* eslint-disable require-jsdoc */
/* eslint-disable max-len */

let usersession;

$(document).ready(function () {
  usersession = getUserSessionData();

  $('#mystats-list').on('click', async function () {
    const quizHistory = await getUserQuizHistory();

    if (quizHistory.length !== 0) {
      $('#charts').show();
      getPieChart(quizHistory);
      getBarChart(quizHistory);
    } else {
      $('#charts').hide();
    }

    quizHistory.sort((a, b) => {
      return new Date(b.timestamp) - new Date(a.timestamp);
    });

    const historyTable = $('#history-body');
    let datastring = '';

    $.each(quizHistory, function (index, value) {
      const datetime = new Date(value.timestamp);
      const per = (parseInt(value.score) * 100) / parseInt(value.totalquestions);

      const srno = '<td>' + (parseInt(index + 1)) + '</td>';
      const category = '<td>' + value.categoryname + '</td>';
      const timeofattempt = '<td>' + datetime.toLocaleString('en-GB') + '</td>';
      const percentage = '<td>' + per.toPrecision(4) + '%</td>';

      datastring += '<tr>' + srno + category + timeofattempt + percentage + '</tr>';
    });

    if (datastring.length !== 0) {
      historyTable.html(datastring);
    } else {
      historyTable.html('<td colspan=\'3\' >Give your first quiz from category tab!!!</td>');
    }
  });
});

/** get quiz result of all users in the leader board */
async function getUserQuizHistory() {
  try {
    const quizResultList = await $.ajax({
      method: 'GET',
      url: 'http://localhost:3000/quizresult?userid=' + usersession.userid,
    });

    return quizResultList;
  } catch (error) {
    console.error('Error getting quiz history:', error);
    return [];
  }
}

async function getPieChart(quizHistory) {
  const categoryPieChart = {};

  $.each(quizHistory, function (i, n) {
    if (categoryPieChart[n.categoryname] === undefined) {
      categoryPieChart[n.categoryname] = 1;
    } else {
      categoryPieChart[n.categoryname] = parseInt(categoryPieChart[n.categoryname]) + 1;
    }
  });

  const categoryPieChartArray = Object.keys(categoryPieChart).map(function (key) {
    return [key, categoryPieChart[key]];
  });

  google.charts.load('current', { 'packages': ['corechart'] });

  google.charts.setOnLoadCallback(drawChart);

  function drawChart() {
    categoryPieChartArray.unshift(['Category', 'Quiz Given']);

    const data = google.visualization.arrayToDataTable(
      categoryPieChartArray,
    );

    const options = {
      title: 'Category Wise Quiz Given',
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

async function getBarChart(quizHistory) {
  const categoryBarChart = {};

  $.each(quizHistory, function (i, n) {
    if (categoryBarChart[n.categoryname] === undefined) {
      categoryBarChart[n.categoryname] = parseInt(n.score);
    } else {
      categoryBarChart[n.categoryname] = parseInt(categoryBarChart[n.categoryname]) + parseInt(n.score);
    }
  });

  let flag = 0;

  const categoryBarChartArray = Object.keys(categoryBarChart).map(function (key) {
    if (flag === 0) {
      flag = 1;
      return [key, categoryBarChart[key], 'green'];
    } else {
      flag = 0;
      return [key, categoryBarChart[key], 'blue'];
    }
  });

  categoryBarChartArray.unshift(['Element', 'Score', { role: 'style' }]);

  google.charts.load('current', { packages: ['corechart'] });

  google.charts.setOnLoadCallback(drawChart);

  function drawChart() {
    const data = google.visualization.arrayToDataTable(
      categoryBarChartArray,
    );

    const view = new google.visualization.DataView(data);
    view.setColumns([0, 1,
      {
        calc: 'stringify',
        sourceColumn: 1,
        type: 'string',
        role: 'annotation',
      },
      2]);

    const options = {
      title: 'Category Wise Score',
      bar: { groupWidth: '60%' },
      legend: { position: 'none' },
      chartArea: {
        left: 10,
        top: 20,
        width: '100%',
        height: '80%',
      },
    };

    const chart = new google.visualization.ColumnChart($('#barchart')[0]);

    chart.draw(view, options);
  }
}
