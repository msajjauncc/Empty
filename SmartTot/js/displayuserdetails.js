$(document).ready(function () {
  $('#user-profile-list').on('click', async function () {
    try {
      const users = await getUsers();

      const userDetailTable = $('#user-profile-table');
      let dataString = '';

      $('#usercount').text('Total Users: ' + users.length);

      $.each(users, function (index, value) {
        const srNo = '<td>' + (parseInt(index + 1)) + '</td>';
        const name = '<td>' + value.firstname + ' ' + value.lastname + '</td>';
        const email = '<td>' + value.email + '</td>';
        const gender = '<td>' + value.gender + '</td>';
        const mobile = '<td>' + value.mob + '</td>';

        dataString += '<tr>' + srNo + name + email + gender + mobile + '</tr>';
      });

      if (dataString.length !== 0) {
        userDetailTable.html(dataString);
      } else {
        // eslint-disable-next-line max-len
        userDetailTable.html('<td colspan=\'3\'>Be patient, someone will come around soon!!!</td>');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Handle the error, e.g., show an error message to the user
    }
  });
});