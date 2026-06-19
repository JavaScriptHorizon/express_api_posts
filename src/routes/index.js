const exp = require("express");
const router = exp.Router();


router.use("/auth", require("./auth"));
router.use("/users", require("./user"));
router.use("/posts", require("./post"));
router.use("/comments", require("./comment"));
router.use("/likes", require("./comment_like"));



module.exports = router;