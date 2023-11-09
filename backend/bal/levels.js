function getLevel(n) {
    let data = [];
    switch (n) {
      case 1:
        data.push("11111111111111111111111111111111");
        data.push("1            3                 1");
        data.push("1 4   2                        1");
        data.push("111111111111111       1111111111");
        data.push("111111111111111       1111111111");
        data.push("1        111111       1111111111");
        data.push("1                          3   1");
        data.push("1                              1");
        data.push("1    111111111111111111111111111");
        data.push("1    111111111111111111111111111");
        data.push("1    1111111111             3  1");
        data.push("1    111111111                 1");
        data.push("1    11111111        11111111111");
        data.push("1    1111111        111111111111");
        data.push("1    111111        1111111111111");
        data.push("1       3         11111111111111");
        data.push("1            4   111111111111111");
        data.push("1    111111111111111111111111111");
        data.push("1    111111111111111111111111111");
        data.push("11111111111111111111111111111111");
        break;
      case 2:
        data.push("11111111111111111111111111111111");
        data.push("1                              1");
        data.push("1                              1");
        data.push("1   2                          1");
        data.push("1 1 1 1 4             1 1 1 1  1");
        data.push("1 1111111             1111111  1");
        data.push("1  11111               11111   1");
        data.push("1  11 11               11111   1");
        data.push("1  11111               11411   1");
        data.push("1  11118               11311   1");
        data.push("1  11111 1 1 1 4 4 1 1     4   1");
        data.push("1  111111111111111 111111111   1");
        data.push("1  111111111111111  11111111   1");
        data.push("1  1111111111111111  1111111   1");
        data.push("1  111111111     111  111311   1");
        data.push("1  111111111     1111          1");
        data.push("1  1111111113    11111111111   1");
        data.push("1      3                       1");
        data.push("1  8                           1");
        data.push("11111111111111111111111111111111");
        break;
      case 3:
        data.push("11111111111111111111111111111111");
        data.push("111111111                  3   1");
        data.push("1   3                          1");
        data.push("1                       111111 1");
        data.push("1     4                1111111 1");
        data.push("1  1111111111111111111         1");
        data.push("18                 11111111    1");
        data.push("11             4               1");
        data.push("11            111111111111111111");
        data.push("11       4 2 4                 1");
        data.push("11      1111111                1");
        data.push("11                             1");
        data.push("1                              1");
        data.push("1               1111111111111111");
        data.push("1     1 1111111 1111111111111311");
        data.push("1    11 1111111 1111111        1");
        data.push("1   111             4     111111");
        data.push("1  1111 1111111 11111 1111113111");
        data.push("1                              1");
        data.push("11111111111111111111111111111111");
        break;
      default:
        break;
    }
    return data;
  }

export {
    getLevel
}