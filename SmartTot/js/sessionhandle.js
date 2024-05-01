/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable require-jsdoc */

function createSession(id, email, role) {
  localStorage.setItem('userid', id);
  localStorage.setItem('email', email);
  localStorage.setItem('role', role);
}

function deleteSession() {
  localStorage.clear();
}


function checkSession() {
  const sessionuserid = localStorage.getItem('userid');
  const sessionEmail = localStorage.getItem('email');

  if (sessionuserid == null && sessionEmail == null) {
    return false;
  } else {
    return true;
  }
}

function getUserSessionData() {
  if (checkSession()) {
    const sessionuserid = localStorage.getItem('userid');
    const sessionEmail = localStorage.getItem('email');
    const sessionrole = localStorage.getItem('role');

    return {userid: sessionuserid, useremail: sessionEmail, userrole: sessionrole};
  }

  return null;
}


