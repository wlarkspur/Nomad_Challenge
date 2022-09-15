/*
You DONT have to import the User with your username.
Because it's a default export we can nickname it whatever we want.
So import User from "./models"; will work!
You can do User.find() or whatever you need like normal!
*/
import User from "./models/User";
import bcrypt from "bcrypt";
// Add your magic here!

export const home = (req, res) => {
  return res.status(400).render("home", { pageTitle: "Home" });
};

export const getJoin = (req, res) => {
  return res.render("join", { pageTitle: "Join" });
};

export const postJoin = async (req, res) => {
  const { username, name, password, password2 } = req.body;
  const pageTitle = "Join";
  if (password !== password2) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "Password confirmation does not match."
    });
  }

  const exists = await User.findOne({ $or: [{ username }, { name }] });

  if (exists) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "username/name already taken.!"
    });
  }
  try {
    await User.create({
      name,
      username,
      password
    });
    return res.status(400).redirect("/login");
  } catch (error) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: error._message
    });
  }
};

export const getLogin = (req, res) => {
  return res.status(404).render("login", { pageTitle: "Login" });
};

export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  const pageTitle = "Login";
  console.log(username);
  if (!user) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "The user is not exist"
    });
  }
  console.log(user.password);
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.render("login", {
      pageTitle,
      errorMessage: "The password is not correct."
    });
  }
  console.log(req.session);
  return res.redirect("/");
};
