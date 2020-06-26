const Validator = require("validator");
const isEmpty = require("is-empty");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const formidable=require('formidable')
const expressJwt = require("express-jwt");
const User = require("../models/User");
const Product = require("../models/product");
const { Order } = require("../models/order");

/*
-----------------------------
          USER APIS
-----------------------------
*/

function validateLoginDetails(data) {
  let errors = {};
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  if (Validator.isEmpty(data.email)) {
    errors.username = "Email field is required";
  }
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }
  return {
    errors,
    isValid: isEmpty(errors),
  };
}

function validRegistrationDetails(data) {
  let errors = {};
  data.name = !isEmpty(data.name) ? data.name : "";
  data.address = !isEmpty(data.address) ? data.address : "";
  data.phone = !isEmpty(data.phone) ? data.phone : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.confirmPassword = !isEmpty(data.confirmPassword)
    ? data.confirmPassword
    : "";

  if (Validator.isEmpty(data.name)) {
    errors.name = "Name field is required";
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  } else if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }

  if (Validator.isEmpty(data.address)) {
    errors.password = "Address field is required";
  }

  if (Validator.isEmpty(data.phone)) {
    errors.password = "Phone field is required";
  }

  if (Validator.isEmpty(data.confirmPassword)) {
    errors.confirmPassword = "Confirm password field is required";
  }
  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "Password must be at least 6 characters";
  }
  if (!Validator.equals(data.password, data.confirmPassword)) {
    errors.confirmPassword = "Passwords must match";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
}

exports.validateRegistration = (req, res) => {
  try {
    const { errors, isValid } = validRegistrationDetails(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    User.findOne({
      $or: [{ email: req.body.email }],
    }).then((user) => {
      if (user) {
        return res.status(400).json({ email: "Email is already registered" });
      } else {
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          username: req.body.username,
          password: req.body.password,
          address: req.body.address,
          phone: req.body.phone,
        });
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) {
              console.log(err);
              throw err;
            }
            newUser.password = hash;
            newUser
              .save()
              .then((user) => {
                const payload = {
                  id: user.id,
                  name: user.name,
                };
                jwt.sign(
                  payload,
                  process.env.secretOrKey,
                  {
                    expiresIn: 31556926,
                  },
                  (err, token) => {
                    res.json({
                      success: true,
                      token: token,
                    });
                  }
                );
              })
              .catch((err) => {
                res.json({ err });
              });
          });
        });
      }
    });
  } catch (e) {
    console.log("error", e);
    res.json({ e });
  }
};

exports.validateLogin = (req, res) => {
  const form = JSON.parse(JSON.stringify(req.body));
  const { errors, isValid } = validateLoginDetails(form);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = form.email;
  const password = form.password;
  User.findOne({
    email: email,
  }).then((user) => {
    if (!user) {
      return res.status(404).json({ error: "Email does not exists" });
    }
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (!isMatch) {
        return res.status(400).json({ error: "Wrong password" });
      } else {
        const payload = {
          id: user.id,
          name: user.name,
        };
        jwt.sign(
          payload,
          process.env.secretOrKey,
          {
            expiresIn: 31556926,
          },
          (err, token) => {
            res.json({
              token,
              user: {
                _id:user._id,
                name:user.name,
                email,
                role:user.role
              }
            });
          }
        );
      }
    });
  });
}

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "User Signout Successful" });
};

exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((error, user) => {
    if (error || !user) {
      return res.status(400).json({
        message: "No user found"
      });
    }

    req.profile = user;
    next();
  });
};

exports.getUser = (req, res) => {
  req.profile.password =undefined;
  req.profile.createdAt = undefined;
  req.profile.updatedAt = undefined;
  return res.json(req.profile);
};

exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true, useFindAndModify: false },
    (error, user) => {
      if (error) {
        return res.status(400).json({
          message: "Updating not successful"
        });
      }
      user.password = undefined;
      user.createdAt = undefined;
      user.updatedAt = undefined;
      res.json(user);
    }
  );
};

exports.userPurchaseList = (req, res) => {
  Order.find({ user: req.profile._id })
    .populate("user", "_id name")
    .exec((error, order) => {
      if (error) {
        return res.status(400).json({
          message: "No order in this account"
        });
      }
      res.json(order);
    });
};

exports.pushOrderInPurchaseList = (req, res, next) => {
  let purchases = [];
  req.body.order.products.forEach(element => {
    purchases.push({
      _id: element._id,
      name: element.name,
      description: element.description,
      amount: req.body.order.amount,
      transaction_id: req.body.order.transaction_id
    });
  });

  User.findOneAndUpdate(
    { _id: req.profile._id },
    { $push: { purchases: purchases } },
    { new: true },
    (error, purchases) => {
      if (error) {
        return res.status(400).json({
          error: "Unable to save purchase"
        });
      }
      next();
    }
  );
};


exports.isAuthenticated = (req, res, next) => {
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!checker) {
    return res.status(403).json({
      error: "access denied"
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    res.status(403).json({
      message: "You are not an admin, access denied"
    });
  }
  next();
};

exports.isSignedIn = expressJwt({
  secret: process.env.secretOrKey,
  userProperty: "auth"
});


/*
-----------------------------
          ORDER APIS
-----------------------------
*/

exports.getOrderById = (req, res, next, id) => {
  Order.findById(id)
    .populate("products.product", "name price")
    .exec((error, order) => {
      if (error) {
        res.statis(400).json({
          error: "No order found",
        });
      }
      req.order = order;
      next();
    });
};


exports.createOrder = (req, res) => {
  req.body.order.user = req.profile;
  const order = new Order(req.body.order);

  order.save((error, order) => {
    if (error) {
      return res.status(400).json({
        error: error,
      });
    }
    res.json(order);
  });
};

exports.getAllOrders = (req, res) => {
  Order.find()
    .populate("user", "_id name")
    .exec((error, orders) => {
      if (error) {
        return res.status(400).json({
          error: "No order found",
        });
      }
      res.json(orders);
    });
};

exports.getOrderStatus = (req, res) => {
  res.json(Order.schema.path("status").enumValues);
};

exports.updateStatus = (req, res) => {
  Order.update(
    { _id: req.body.orderId },
    { $set: { status: req.body.status } },
    (error, order) => {
      if (error) {
        return res.status(400).json({
          error: "Cannot update order status",
        });
      }
      res.json(order);
    }
  );
};


/*
-----------------------------
          PRODUCT APIS
-----------------------------
*/


exports.addProduct = (req, res) => {
  let form = formidable.IncomingForm();
  form.keepExtension = true;
  form.parse(req, (error, fields, file) => {
    if (error) {
      return res.status(400).json({
        error: "problem with image",
      });
    }
   
    var name=fields.name
    var subtitle=fields.subtitle
    var descripition=fields.descripiton
    var price=fields.price

    if (!name || !price) {
      return res.status(400).json({
        error: "Please include all necessary fields",
      });
    }

    let product = new Product(fields);

    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "file size too big",
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    product.save((error, product) => {
      if (error) {
        return res.status(400).json({
          error: "Saving product failed",
        });
      }
      res.json(product);
    });
  });
};


exports.getAllProducts = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 8;
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";

  Product.find()
    .select("-photo")
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exec((error, products) => {
      if (error) {
        return res.status(400).json({
          error: "No product found",
        });
      }
      res.json(products);
    });
};


exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
    .exec((error, product) => {
      if (error) {
        return res.staus(400).json({
          error: "Product not found",
        });
      }
      req.product = product;
      next();
    });
};

exports.deleteProduct = (req, res) => {
  let product = req.product;
  product.remove((error, deletedProduct) => {
    if (error) {
      return res.status(400).json({
        error: "Product couldn't be deleted",
      });
    }
    res.json({
      message: `Successfully deleted ${deletedProduct.name}`,
    });
  });
};

exports.getProduct = (req, res) => {
  req.product.photo = undefined;
  return res.json(req.product);
};

exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};
