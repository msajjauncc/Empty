/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
$(document).ready(function() {
  $('#resetpassword').hide();

  $('#confirmnewpassword').keyup(function(e) {
    isConfirmPasswordValid();
  });

  if (checkSession()) {
    const user = getUserSessionData();
    $('#securityemail').val(user.useremail);
    $('#securityemail').attr('disabled', true);
  }

  $('#securityQuesForm').on('submit', async function(ev) {
    ev.preventDefault();

    const email = $('#securityemail').val();
    const question = $('#secuityquestion').val();
    const answer = $('#answer').val();

    $('#emailforreset').val(email);

    try {
      const user = await getUser(email);

      if (user.length > 0) {
        if (
          user[0].securityQuestion == question &&
          user[0].securityAnswer == answer
        ) {
          $('#securityquestiondiv').hide();
          $('#resetpassword').show();
        } else {
          $('#security-error-msg').text('Wrong Credentials!!');
        }
      } else {
        $('#security-error-msg').text('User does not exist');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  });

  $('#resetPasswordForm').on('submit', async function(ev) {
    ev.preventDefault();

    const email = $('#emailforreset').val();
    const newPassword = md5($('#newpassword').val());

    if (isConfirmPasswordValid()) {
      try {
        const user = await getUser(email);
        user[0].password = newPassword;

        const id = user[0].id;

        $.ajax({
          method: 'PUT',
          url: 'http://localhost:3000/user/' + id,
          data: user[0],
          success: (x) => {
            deleteSession();
            $(location).attr('href', 'login.html');
          },
          error: (x) => {
            console.error('Error updating user password:', x);
          },
        });
      } catch (error) {
        console.error('Error fetching user for password reset:', error);
      }
    }
  });
});

function isConfirmPasswordValid() {
  const password = $('#newpassword');
  const confirmPass = $('#confirmnewpassword');
  if (password.val() != confirmPass.val()) {
    confirmPass[0].setCustomValidity('Password and confirm password do not match!');
    return false;
  } else {
    confirmPass[0].setCustomValidity('');
    return true;
  }
}

async function getUser(email) {
  try {
    const user = await $.ajax({
      url: 'http://localhost:3000/user?email=' + email,
      method: 'GET',
    });
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}