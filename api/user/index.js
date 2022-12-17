var express = require('express');
 
var controller = require('./user.controller');
var router = express.Router();

/**
 * @swagger
 * /api/user/getAll:
 *    get:
 *      tags: [Users]
 *      description: This should return All Users
 *      responses:
 *        "200":
 *          description: Success
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Users'
 */
router.get('/getAll',controller.getAll);
/**
 * @swagger
 * /api/user/getOne/{id}:
 *    get:
 *      tags: [Users]
 *      description: This should return An User By Id
 *      parameters:
 *      - name: "id"
 *        in: "path"
 *        required: true
 *        type: "string"
 *      responses:
 *        "200":
 *           description: "User Returned By ID"
 *           content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 */
router.get('/getOne/:id', controller.getOne);
/**
 * @swagger
 * /api/user/login:
 *    post:
 *      description: Login 
 *      summary: Login with Username And Password
 *      tags: [Users]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Login'
 *      responses:
 *        "200":
 *          description: User Created
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 *  
 * 
 */ 
router.post('/login', controller.login);
/**
 * @swagger
 * /api/user/register:
 *    post:
 *      description: Create A User
 *      summary: Create A  New User
 *      tags: [Users]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      responses:
 *        "200":
 *          description: User Created
 *          content:
 *            application/json:
 *              schema:
 *                type: string
 *  
 * 
 */ 
router.post('/register', controller.create);
/**
 * @swagger
 * /api/user/update/{id}:
 *    put:
 *      tags:  [Users]
 *      description: Update A User
 *      parameters:
 *       - name: "id"
 *         in: "path"
 *         required: true
 *         type: "string"
 *       - in: "body"
 *         name: "user"
 *         required: true
 *         schema: 
 *           $ref: '#/components/schemas/User'
 *      responses:
 *        "200":
 *          description: User Updated
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 */
router.put('/update/:id', controller.update);
//router.post('/sendEmailVerificationCode', controller.sendEmailVerificationCode);
/**
 * @swagger
 * /api/user/delete/{id}:
 *    delete:
 *      tags: [Users]
 *      description: Delete
 *      parameters:
 *       - name: "id"
 *         in: "path"
 *         required: true
 *         type: "string"
 *      responses:
 *        "200":
 *          description: Success
 *          content:
 *            application/json:
 *              schema:
 *               type: string
 *               format: application/json
 */
router.delete('/delete/:id',controller.delete);

router.get('/check-email-registration/:email',controller.emailRegistration)

router.get('/initialise-app/:id',controller.initialiseApp)


module.exports = router;
