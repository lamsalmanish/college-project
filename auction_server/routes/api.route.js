const router = require("express").Router();
const AuthRoute = require("../controllers/auth.controller");
const UserRoute = require("../controllers/user.controller");
const ItemRoute = require("../modules/items/item.controller");
const AdminRoute = require("../controllers/admin.controller");
const BuyerRoute = require("../modules/buyer/buyer.controller");

router.use("/auth", AuthRoute);
router.use("/user", UserRoute);
router.use("/item", ItemRoute);
router.use("/admin", AdminRoute);
router.use("/buyer", BuyerRoute);

module.exports = router;
