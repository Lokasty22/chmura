const router = require("express").Router();
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error)
            return res.status(400).send({ message: error.details[0].message });

        const user = await User.findOne({ email: req.body.email });
        if (user)
            return res.status(409).send({ message: "User with given email already exists!" });

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        await new User({ ...req.body, password: hashPassword }).save();

        res.status(201).send({ message: "User created successfully" });
    } catch (error) {
        console.error(error.message); // Log the error message
        res.status(500).send({ message: "Internal Server Error" });
    }
});
router.post("/register", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) return res.status(409).send("User exists");

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = new User({
    firstName,
    lastName,
    email,
    password: hash,
  });

  await user.save();
  res.status(201).send("User registered");
});

module.exports = router;
