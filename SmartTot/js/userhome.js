/* eslint-disable max-len */
/* eslint-disable require-jsdoc */

$(document).ready(async function() {
  const userId = localStorage.getItem('userid');
  const user = await getUser(userId);
  const fullName = `${user.firstname} ${user.lastname}`;

  if (user.gender === 'Male') {
    $('#display-avatar').attr('src', '../assets/img/male.png');
  } else {
    $('#display-avatar').attr('src', '../assets/img/female.png');
  }

  $('#username').text(user.firstname);
  $('#display-name').text(fullName.toUpperCase());
  $('#username').text(user.firstname);
  $('#display-email').text(user.email);
  $('#display-mobile').text(user.mob);

  $('#myprofile-list').on('click', function() {
    $('#firstname').val(user.firstname);
    $('#lastname').val(user.lastname);
    $('#email').val(user.email);
    $('#mobile').val(user.mob);
    //$('#securityque').val(user.securityQuestion);
    //$('#securityans').val(user.securityAnswer);
  });

  $('#logout').on('click', function() {
    deleteSession();
    $(location).attr('href', 'login.html');
  });

  $('#mobile').keyup(() => {
    isValidMobile();
  });

  $('#resetpasswordbtn').on('click', function() {
    $(location).attr('href', 'resetpassword.html');
  });

  $('#updateform').on('submit', async function(ev) {
    ev.preventDefault();
    const firstname = $('#firstname').val();
    const lastname = $('#lastname').val();
    const mobile = $('#mobile').val();
    //const securityans = $('#securityans').val();
    
    const updatedUser = { ...user, firstname, lastname, mob: mobile/*, securityAnswer: securityans */};

    /*if (isValidMobile()) {
      await $.ajax({
        method: 'PUT',
        url: `http://localhost:3000/user/${userId}`,
        data: updatedUser,
        success: (x) => {
          alert('Profile Successfully updated');
          location.reload();
        },
        error: (x) => {
        },
      });
    }
  });
});*/

if (isValidMobile()) {
  await $.ajax({
    method: 'PUT',
    url: `http://localhost:3000/user/${userId}`,
    data: updatedUser,
    success: (x) => {
      Swal.fire({
        title: 'Success!',
        text: 'Profile Successfully updated',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        setTimeout(location.reload(), 1000000)
      });
    },
    error: (x) => {
      // Handle error if needed
    },
  });
}
});
});




function isValidMobile() {
  const mobile = $('#mobile');

  if (!mobile.val().match(/^[6-9]{1}[0-9]{9}$/)) {
    mobile[0].setCustomValidity('Mobile number only have 10 digits and must be valid');
    return false;
  } else {
    mobile[0].setCustomValidity('');
  }
  return true;
}

async function getUser(id) {
  try {
    const user = await $.ajax({
      url: `http://localhost:3000/user/${id}`,
      method: 'GET',
    });
    return user;
  } catch (error) {
    console.error(error);
    return null;
  }
}
