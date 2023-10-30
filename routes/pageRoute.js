import express from "express"
import * as pageController from "../controllers/pageController.js"
// import * as authMiddleware from "../middlewares/authMiddleware.js"
import * as userController from "../controllers/userController.js"
const router = express.Router()


router
.route('/')
 .get(/*authMiddleware.authenticateToken,*/pageController.getIndexPage)


router.route('/about').get(pageController.getAboutPage)
router.route('/register').get(pageController.getRegisterPage)
router.route('/login').get(pageController.getLoginPage)
router.route('/logout').get(pageController.getLogout)
router.route('/contact').get(pageController.getContactPage)
router.route('/contact').post(pageController.sendMail)

export default router


