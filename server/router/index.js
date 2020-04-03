const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const config = require("../config/config");
const mongoose = require("mongoose");
const axios = require("axios");
const fs = require('fs');
// models
const User = require("../models/user");

// mongoose.connect(
//   "mongodb://admin:9vcXwS2!NUTau77@ds033059.mlab.com:33059/heroku_f021c07t"
// );

mongoose.connect(
    "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=false"
);

const router = express.Router();

router.get("/", (req, res) => {
    res.json({ message: "welcome to our api" });
});

router.route("/users").get((req, res) => {
    User.find((err, users) => {
        if (err) res.status(500).send({ error: err });

        res.json(users);
    });
});

router
    .route(`/admin/user/:id`)
    .put((req, res) => {
        User.findById(req.params.id, (err, user) => {
            if (err) res.status(500).send({ error: err });

            user.role = "1";

            user.save(err => {
                if (err) res.status(500).send({ error: err });

                res.json({ message: "User updated!" });
            });
        });
    })
    .delete((req, res) => {
        User.remove({ _id: req.params.id }, (err, user) => {
            if (err) res.status(500).send({ error: err });

            res.json({ message: "User successfully deleted!" });
        });
    });

router
    .route("/user/profile/:id")
    .get((req, res) => {
        User.findById(req.params.id, (err, user) => {
            if (err) res.status(500).send({ error: err });

            if (user) {
                res.json(user);
            }
        });
    })
    .post((req, res) => {
        User.findById(req.params.id, (err, user) => {
            if (err) res.status(500).send({ error: err });

            if (user) {
                user.nickname = req.body.nickname;
                if (user.epicname != req.body.epicname) {
                    user.account_id = null;
                    user.epicname = req.body.epicname;
                }
                user.image = req.body.image;

                user.save(err => {
                    if (err) res.status(500).send({ error: err });

                    res.json({ message: "Profile updated successfully!" });
                });
            }
        });
    });
router.route("/user/password/:id").post((req, res) => {
    User.findById(req.params.id, (err, user) => {
        if (err) res.status(500).send({ error: err });

        if (user) {
            const hashedPassword = bcrypt.hashSync(req.body.password, 10);

            user.password = hashedPassword;
            user.save(err => {
                if (err) res.status(500).send({ error: err });

                res.json({ message: "Password updated successfully!" });
            });
        }
    });
});


router.route('/daily-shop').get((req, res) => {
    axios.get(`https://fortniteapi.io/shop?lang=en`, {
        headers: {
            'Authorization': '31b3b576-68caa902-a4e3690a-902a0f7c'
        }
    }).then(response => {
        res.json(response.data);
    }).catch(err => {
        res.send({ error: err })
    })
})

router.route("/stats/:epicname").get((req, res) => {
    User.find({ epicname: req.params.epicname }, (err, users) => {
        if (err) res.json({ message: 'Something went wrong!' });

        if (users.length > 0) {
            let user = users[0];
            if (user.account_id) {
                axios.get(`https://fortniteapi.io/stats?account=${user.account_id}`, {
                    headers: {
                        'Authorization': '31b3b576-68caa902-a4e3690a-902a0f7c'
                    }
                }).then(response => {
                    res.json(response.data)
                }).catch(err => {
                    res.json(err)
                })
            } else {
                axios.get(`https://fortniteapi.io/lookup?username=${req.params.epicname}`, {
                    headers: {
                        'Authorization': '31b3b576-68caa902-a4e3690a-902a0f7c'
                    }
                }).then(response => {
                    user.account_id = response.data.account_id;
                    user.save(err => {
                        if (err) res.send({ message: 'Save failed!' });
                    });
                    axios.get(`https://fortniteapi.io/stats?account=${response.data.account_id}`, {
                        headers: {
                            'Authorization': '31b3b576-68caa902-a4e3690a-902a0f7c'
                        }
                    }).then(response => {
                        res.json(response.data)
                    }).catch(err => {
                        res.json(err)
                    });
                })
            }
        } else {
            axios.get(`https://fortniteapi.io/lookup?username=${req.params.epicname}`, {
                headers: {
                    'Authorization': '31b3b576-68caa902-a4e3690a-902a0f7c'
                }
            }).then(response => {
                axios.get(`https://fortniteapi.io/stats?account=${response.data.account_id}`, {
                    headers: {
                        'Authorization': '31b3b576-68caa902-a4e3690a-902a0f7c'
                    }
                }).then(response => {
                    res.json(response.data)
                }).catch(err => {
                    res.json(err)
                })
            });

        }
    });
});

router.route("/matches/:epicname").get((req, res) => {
    axios.get(`https://fortniteapi.io/lookup?username=${req.params.epicname}`, {
        headers: {
            'Authorization': '31b3b576-68caa902-a4e3690a-902a0f7c'
        }
    }).then(response => {
        axios.get(`https://fortniteapi.io/matches?account=${response.data.account_id}`, {
            headers: {
                'Authorization': '31b3b576-68caa902-a4e3690a-902a0f7c'
            }
        }).then(response => {
            const data = response.data.matches.filter(item => item.platform != "bp");
            res.json(data)
        }).catch(err => {
            res.json(err)
        });
    })
})

router.route("/login").post((req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.send({ error: "Please fill out the required fields!" });
    } else {
        User.find({ email: email }, (err, user) => {
            if (err) res.status(500).send({ error: err });

            if (user.length > 0) {
                user = user[0];
                if (bcrypt.compareSync(password, user.password)) {
                    const tokenUser = {
                        id: user._id,
                        email: user.email,
                        nickname: user.nickname,
                        epicname: user.epicname,
                        image: user.image,
                        role: user.role
                    };

                    jwt.sign(
                        tokenUser,
                        config.secret, { expiresIn: 180 },
                        (err, token) => {
                            res.json({ token });
                        }
                    );
                } else {
                    res.send({ error: "Password does not match." });
                }
            } else {
                res.send({ error: "There is no account with that email address!" });
            }
        });
    }
});

router.route("/register").post((req, res) => {
    const { email, password, nickname, epicname } = req.body;
    if (!email || !password || !nickname || !epicname) {
        res.status(400).send({ error: "Please fill out the required fields!" });
    } else {
        User.find({ email: email }, (err, user) => {
            if (err) res.status(500).send({ error: err });

            if (user.length > 0)
                res.status(400).send({ error: "Email already in use!" });
        });

        const hashedPassword = bcrypt.hashSync(password, 10);

        const user = new User();
        user.email = email;
        user.password = hashedPassword;
        user.nickname = nickname;
        user.epicname = epicname;
        user.image = "data: image / png; base64, iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABGdBTUEAALGPC / xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QA / wD / AP + gvaeTAAAAB3RJTUUH5AMbBAsdBkJEtAAAFAZJREFUaN7FmXmQXVWdx79nufe + e9 / eW3rfkk6nm5CdABIStkAiiCxuuKGWoMW4luWKOs7oSCnjiCOWuzLMiCCUAyqKyCYIBkJCVpJ0Ot2dTu + v33Lfe3e / 55z5g6kpqamCJEwxv7 / Pqfv91Pd7fme5BK + xrtx + KaoxRUMwgbhhKcouJTDTLJlKo78hgXzvCrT2LsPSni7R1NKspk5MwfV8vPuSs1 / rp19W7LVMvvGdb0XoFmGSEMnsEqrqRZpKmtJisaRjO + R / 3P + QHBxcLUf37pd / ffQx0tDUzHr6etCQzeLKt70HFUUwuuf5 / xMQcroTP3HjB + Ef3wnKDZB8Ny1U6mp6alGlVqxqCSW9MJnLr + ppzi5p6Og93jV45oErLlr1iCNQe / Se37DpHY9JI5VRoVPFY3d8F3 + pyv8fkC999otYPLEfRElE4Cx05oWgyfbFcu3rBRdv9YLAas5n1ZndjQRGUqVaukn7inWz3cuHv / Pmswdv1QlRt936bex64B4VRSH + /dndrxnktKJ16dZtyObb4NbKTIa+0KzGy02N/JlTsnH8xAwPHUfmDMjeJkuSsK5kZVbNHt6TqtjO1mOL / tr8xK6HGA08q2OQTE3UcOHQAJ6fOPb6gmy7ZBuWr9mI6UM7qCRMJjINFyGs / 9bk0iyVa / HodIH6YUSThkY1KuliuUbrvqCO56jJw / sit + 4M9w6u6f3U7T + 4b7Sk2Oi9 / 6waLnkbKod2oRhEpw1yStH6u498EYuzk / jQDdfhom3biVIKn / zAdTtLcxProzCOBc / wskvQv3Qp + pcuhYh81N0AiiWgmRYyjQ2YHdkf09lp7lSr15rZ7K / DKKTOU0 / KnxWLr8mRUwK5 / vqPQ8QxOruaeWt7WxwLtWVk52NPiEjJiKVoa0cPspkcBocH8cILOzF5YgqcMyilwCmDaZmAlFD7npSiuZc6dv0D6aa2nzNI9vDjvxOHC6cPc0rR2rv3WaxfvY5Ui2W5MDPfWliYv8MTevti1Vf7XtxDypUi + gcGEQQBxo4exuTxCWicQcoIdqWChx / 6PfR8A3oGBsXozDSdLNqzh46PPzhtV1haBnLKrp42CD + VwTfc8GmaTmZkGAXdQsZ / OHBw9 / DM1ISEiqmm6YjjGLHvoFJdxOo167GwWACnDKlUCqZhIZNJgugJHJi3SZxthm425Vog4FWKKnfWhcBPv / n6gOzb95zizICuJ + rl0lSmWqvANCwiBIXneVi / bAiTY6MgXhVl28am8y + CVARxFCH0PbQs6YDjBqhMjKjhC7dj / Tmbg2XrzkZp6jh + ddstpw0BnGK04thDOpXkQgSOVLKNEnqe5zrCSCTpxjdcBCIl5idGsPfwizg2OoqpsTHMz05h / PgEShUbPT396F22HONH9ivdSNDVG86qMML + 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";
        user.role = 2;

        user.save(err => {
            if (err) res.status(500).send({ error: err });

            res.status(200).send({ message: "Account was successfully created!" });
        });
    }
});

module.exports = router;