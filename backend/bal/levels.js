import fs from "fs";

function loadFromFile(n) {
  let error = false;
  let fn = `./bal/${n}.dat`;
  let d = "";
  let n1 = -1;
  let n2 = -1;
  let s = "";
  let data = [];
  let fixedData = [];

  try {
    d = fs.readFileSync(fn, { encoding: 'utf8', flag: 'r' });
    data = d.split("\n");
    if (data.length === 0) {
      error = true;
    } else {
      fixedData = [];
      for (let i = 0; i < data.length; i++) {
        s = data[i].trim();
        n1 = s.length;
        if (n1 > 0) {
          fixedData.push(s);
          if (n2 === -1) {
            n2 = n1;
          } else {
            if (n2 !== n1) {
              error = true;
            }
          }
        }
      }
      data = fixedData;
    }
  } catch (err) {
    error = true;
    console.log(err);
  }
  if (error) {
    data = [];
    data.push("11111111111111111111111111111111111111111");
    data.push("1                                       1");
    data.push("1   55555  5555   5555    555   5555    1");
    data.push("1   5      5   5  5   5  5   5  5   5   1");
    data.push("1   555    5555   5555   5   5  5555    1");
    data.push("1   5      5  5   5  5   5   5  5  5    1");
    data.push("1   55555  5   5  5   5   555   5   5  31");
    data.push("1 2                                     1");
    data.push("11111111111111111111111111111111111111111");
  }
  return data;
}

function getLevel(n) {
  let data = [];

  if ((n >= 200 && n <= 219) || (n >= 700 && n <= 711) || (n >= 750 && n <= 759)) {
    data = loadFromFile(n);
  } else {
    data = loadFromFile(1000);
  }
  return data;
}

export { getLevel };
