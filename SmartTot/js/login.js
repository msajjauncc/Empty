/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
/* eslint-disable camelcase */
//const selectedRole ='';
$(document).ready(function() {

  // Get the query string from the current window location
  var queryString = window.location.search;

  // Create a URLSearchParams object
  var urlParams = new URLSearchParams(queryString);

  // Access the 'user' query parameter
  var selectedRole = urlParams.get('role'); // Returns 'JohnDoe'


  $('#loginForm').on('submit', async function(ev) {
    ev.preventDefault();
    const email = $('#email').val();
    const password = md5($('#password').val());
    console.log(selectedRole);
    console.log(email);
    if (selectedRole == 'admin' && email == 'admin@uncc.edu') {
      const admin = await getAdmin(email);
      handleLogin(admin, 'admin');
    } else if (selectedRole == 'user') {
      const user = await getUser(email);
      handleLogin(user, 'user');
    } else{
      Swal.fire({
        title: 'No Admin found with this credentials',
        icon: 'error',
        showCancelButton: true,
        cancelButtonText: 'Try Again'
      })
    }
    
  });

});

async function getUser(email) {
  try {
    const user = await $.ajax({
      url: 'http://localhost:3000/user?email=' + email,
      method: 'GET',
    });
    return user;
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function getAdmin(email) {
  try {
    const admin = await $.ajax({
      url: 'http://localhost:3000/admin?email=' + email,
      method: 'GET',
    });
    return admin;
  } catch (error) {
    console.error(error);
    return [];
  }
}

function handleLogin(userArray, role) {
  const errorElement = $('#error-msg');
  if (userArray.length === 0) {
    errorElement.text('Invalid user Id or Password');
  } else {
    const userData = userArray[0];
    if (userData.password === md5($('#password').val())) {
      createSession(userData.id, userData.email, role);
      $(location).attr('href', role === 'admin' ? 'adminhome.html' : 'userhomepage.html');
    } else {
      errorElement.text('Invalid user Id or Password');
    }
  }
}

