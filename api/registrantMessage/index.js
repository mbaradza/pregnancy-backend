var express = require('express');
 
var controller = require('./registrant_message.controller');
var router = express.Router();

/**
 * @swagger
 * /api/registrantMessage/getAll:
 *    get:
 *      tags: [Registrant Messages]
 *      description: This should return All Registrant Messages
 *      responses:
 *        "200":
 *          description: Success
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/RegistrantMessages'
 */
router.get('/getAll',controller.getAll);
/**
 * @swagger
 * /api/registrantMessage/getOne/{id}:
 *    get:
 *      tags: [Registrant Messages]
 *      description: This should return An Registrant Messages By Id
 *      parameters:
 *      - name: "id"
 *        in: "path"
 *        required: true
 *        type: "string"
 *      responses:
 *        "200":
 *           description: "Registrant Message Returned By ID"
 *           content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/RegistrantMessage'
 */
router.get('/getOne/:id', controller.getOne);

/**
 * @swagger
 * /api/registrantMessage/create:
 *    post:
 *      description: Create A Registrant Message
 *      summary: Create A  New Registrant Message
 *      tags: [Registrants]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/RegistrantMessage'
 *      responses:
 *        "200":
 *          description: Registrant Message Created
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
 * /api/registrantMessage/update/{id}:
 *    put:
 *      tags:  [Registrant Messages]
 *      description: Update A Registrant Messages
 *      parameters:
 *       - name: "id"
 *         in: "path"
 *         required: true
 *         type: "string"
 *       - in: "body"
 *         name: "registrant"
 *         required: true
 *         schema: 
 *           $ref: '#/components/schemas/RegistrantMessage'
 *      responses:
 *        "200":
 *          description: Registrant Message Updated
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/RegistrantMessage'
 */
router.put('/update/:id', controller.update);
/**
 * @swagger
 * /api/registrantMessage/delete/{id}:
 *    delete:
 *      tags: [Registrant Messages]
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
