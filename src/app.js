const express = require("express");
const app = express();

//Order of routing is important
// | Pattern | Meaning                          | Example  | Matches              |
// | ------- | -------------------------------- | -------- | -------------------- |
// | `?`     | 0 or 1 occurrence                | `/ab?cd` | `/acd`, `/abcd`      |
// | `+`     | 1 or more occurrences            | `/ab+cd` | `/abcd`, `/abbbbbcd` |
// | `*`     | Wildcard (any chars, any length) | `/ab*cd` | `/abcd`, `/ab123cd`  |

app.use("/hello", (req, res) => {
  res.send("Hello ");
});
app.use("/", (req, res) => {
  res.send("Hello World");
});
app.listen(7777, () => {
  console.log("Server is running on port 7777");
});
