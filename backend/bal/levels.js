import fs from "fs";

function loadFromFile(n) {
  let fn = `./bal/${n}.dat`;
  let d = "";
  let data = [];

  try {
    d = fs.readFileSync(fn, { encoding: 'utf8', flag: 'r' });
    data = d.split("\n");
  } catch (error) {
    console.log(error);
    data = [];
    data.push("11111");
    data.push("17141");
    data.push("11111");
  }
  return data;
}

function getLevel(n) {
  let data = [];

  if ((n >= 200 && n <=221) || (n >= 700 && n <=700)) {
    data = loadFromFile(n);
  } else {
    data = loadFromFile(1000);
  }
  return data;
}

export { getLevel };
