// api-routes.js
// Initialize express router
let router = require("express").Router();
const validator = require('express-validator');

// Set default API response
router.get("/", function (req, res) {
  res.json({
    status: "API Its Working",
    message: "Welcome to RESTHub crafted with love!",
  });
});
// Import trackingController
var trackingController = require("../controllers/trackingController");
var initialDetailController = require("../controllers/initialDetailController");
const userController = require('../controllers/accountcontroller');

// track routes
router
  .route("/track")
  .get(trackingController.index) //====================================
  .post(trackingController.new) //===================================
  .put(trackingController.call); //====================================

router
  .route("/track/:track_id")
  .get(trackingController.view)
  .delete(trackingController.delete);

router
  .route("/detail")
  .get(initialDetailController.getAll)
  .post(initialDetailController.postInitialDetails);

router
  .route("/detail/:user_id")
  .get(initialDetailController.getById)
  .delete(initialDetailController.deleteInitialDetails)
  .put(initialDetailController.updateInitialDetails);

// user 
router
  .route('/users')
  .get(userController.getUsers);

router
  .route('/users/login')
  .post(userController.loginUser);

router
  .route('/users/register')
  .post([
    validator.check('firstname').not().isEmpty(),
    validator.check('lastname').not().isEmpty(),
    validator.check('email').normalizeEmail().isEmail(),
    validator.check('password').isLength({ min: 8 }),
    validator.check('telephone').not().isEmpty()
  ],
    userController.registerUser);

router
  .route('/users/remove')
  .delete(userController.deleteUser);

router
  .route('/users/modify')
  .put(userController.modifyUser);

// Export API routes
module.exports = router;
