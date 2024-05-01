async function handleAuthentication() {
  const userId = localStorage.getItem('userid');

  try {
    const admin = await getAdmin(userId);

    // Display admin details
    $('#username').text(admin.name);

    // Logout button event handler
    $('#logout').on('click', function () {
      deleteSession();
      $(location).attr('href', 'login.html');
    });
  } catch (error) {
    console.error('Error retrieving admin details:', error);
  }
}

// Function to get admin details by ID
async function getAdmin(id) {
  try {
    const admin = await $.ajax({
      url: 'http://localhost:3000/admin/' + id,
      method: 'GET',
    });
    return admin;
  } catch (error) {
    console.error('Error fetching admin details:', error);
    throw error; // Rethrow the error for handling in the calling function
  }
}

// Document ready event handler
$(document).ready(function () {
  handleAuthentication();
});
