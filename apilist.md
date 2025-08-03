# Devtinder APi

authRouter
-POST /signup
-POST /login
-POST /logout

profileRouter
-GET /profile/view
-PATCH /profile/edit
-PATCH /profile/password

connectionRequestRouter
-POST /request/send/interested/:userId
-POST /request/send/ignored/:userId
-POST /request/review/accepted/:requestId
-POST /request/review/rejected/:requestId

userRouter
-GET user/connections
-GET user/requests
-GET user/feed -Gets you the profile of other user on platform

//Order of routing is important
// | Pattern | Meaning | Example | Matches |
// | ------- | -------------------------------- | -------- | -------------------- |
// | `?` | 0 or 1 occurrence | `/ab?cd` | `/acd`, `/abcd` |
// | `+` | 1 or more occurrences | `/ab+cd` | `/abcd`, `/abbbbbcd` |
// | `*` | Wildcard (any chars, any length) | `/ab*cd` | `/abcd`, `/ab123cd` |

// app.use("/hello", (req, res) => {
// res.send("Hello ");
// });
// app.use("/", (req, res) => {
// res.send("Hello World");
// });
