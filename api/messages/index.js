var express = require('express');
 
var controller = require('./message.controller');
var router = express.Router();

/**
 * @swagger
 * /api/message/getAll:
 *    get:
 *      tags: [Messages]
 *      description: This should return All Messages
 *      responses:
 *        "200":
 *          description: Success
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Messages'
 */
router.get('/getAll',controller.getAll);
/**
 * @swagger
 * /api/message/getOne/{id}:
 *    get:
 *      tags: [Messages]
 *      description: This should return An Messages By Id
 *      parameters:
 *      - name: "id"
 *        in: "path"
 *        required: true
 *        type: "string"
 *      responses:
 *        "200":
 *           description: "Message Returned By ID"
 *           content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Message'
 */
router.get('/getOne/:id', controller.getOne);

/**
 * @swagger
 * /api/message/create:
 *    post:
 *      description: Create A Message
 *      summary: Create A  New Message
 *      tags: [Messages]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Message'
 *      responses:
 *        "200":
 *          description: Message Created
 *          content:
 *            application/json:
 *              schema:
 *                type: string
 *  
 * 
 */ 
router.post('/create', controller.create);
/**
 * @swagger
 * /api/message/update/{id}:
 *    put:
 *      tags:  [Messages]
 *      description: Update A Message
 *      parameters:
 *       - name: "id"
 *         in: "path"
 *         required: true
 *         type: "string"
 *       - in: "body"
 *         name: "message"
 *         required: true
 *         schema: 
 *           $ref: '#/components/schemas/Message'
 *      responses:
 *        "200":
 *          description: Message Updated
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Message'
 */
router.put('/update/:id', controller.update);
/**
 * @swagger
 * /api/message/delete/{id}:
 *    delete:
 *      tags: [Messages]
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


module.exports = router;
