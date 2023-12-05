function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

export function fixUserData(user) {
  user.firstName = user.firstName.trim();
  user.firstName = capitalize(user.firstName);
  user.userName = user.userName.trim();
  user.userName = capitalize(user.userName);
  user.email = user.email.trim().toLowerCase();
  user.password = user.password.trim();
  user.password2 = user.password2.trim();
}

export function validateUserData(user) {
  let msg = "";

  function addEnter() {
    if (msg !== "") {
      msg += "\n";
    }
  }

  if (user.firstName.length < 2) {
    msg += "First Name is too short!";
  }
  if (user.userName.length < 2) {
    addEnter();
    msg += "User Name is too short!";
  }
  if (user.password.length < 4) {
    addEnter();
    msg += "Password is too short!";
  }
  if (user.password !== user.password2) {
    addEnter();
    msg += "Confirm Password does not match!";
  }
  return msg;
}
