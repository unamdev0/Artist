var express = require("express");
var router = express.Router();
const api = require("../apis/apis");

/*
-------------------------
        PARAMS
-------------------------
*/
router.param("userId", api.getUserById);
router.param("orderId", api.getOrderById);
router.param("productId", api.getProductById);

/*
------------------------------
        AUTHENTICATION
------------------------------
*/

router.post("/signup", api.validateRegistration);
router.post("/signin", api.validateLogin);
router.get("/signout", api.signout);

/*
-------------------------
        USER
-------------------------
*/

router.get("/user/:userId", api.isSignedIn, api.isAuthenticated, api.getUser);
router.put(
  "/user/:userId",
  api.isSignedIn,
  api.isAuthenticated,
  api.updateUser
);
router.get(
  "/orders/user/:userId",
  api.isSignedIn,
  api.isAuthenticated,
  api.userPurchaseList
);

/*
-------------------------
        PRODUCT
-------------------------
*/

router.post(
  "/product/create/:userId",
  api.isSignedIn,
  api.isAuthenticated,
  api.isAdmin,
  api.addProduct
);

router.get("/product/:productId", api.getProduct);

router.get("/product/photo/:productId", api.photo);

router.delete(
  "/product/:productId/:userId",
  api.isSignedIn,
  api.isAuthenticated,
  api.isAdmin,
  api.deleteProduct
);

router.get("/products", api.getAllProducts);

/*
-------------------------
        ORDER
-------------------------
*/

router.post(
  "/order/create/:userId",
  api.isSignedIn,
  api.isAuthenticated,
  api.pushOrderInPurchaseList,
  api.createOrder
);

router.get(
  "/order/all/:userId",
  api.isSignedIn,
  api.isAuthenticated,
  api.isAdmin,
  api.getAllOrders
);

router.get(
  "/order/status/:userId",
  api.isSignedIn,
  api.isAuthenticated,
  api.isAdmin,
  api.getOrderStatus
);

router.put(
  "/order/:orderId/status/:userId/",
  api.isSignedIn,
  api.isAuthenticated,
  api.isAdmin,
  api.updateStatus
);

module.exports = router;
