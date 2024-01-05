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

export function polar(x, y, angle, dist) {
  let result = { x: x, y: y };
  result.x = dist * Math.cos((angle / 180) * Math.PI) + x;
  result.y = dist * Math.sin((angle / 180) * Math.PI) + y;
  return result;
}

export function randomiseArray(arr) {
  let result = [];
  let used = [];

  while (result.length < arr.length) {
    let n = Math.trunc(Math.random() * arr.length);
    if (!used.includes(n)) {
      used.push(n);
      let item = arr[n];
      result.push(item);
    }
  }
  return result;
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


