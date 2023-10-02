import express from 'express';
import auth from '../../middlewares/auth';
import validate from '../../middlewares/validate';
import { modelValidation } from '../../validations';
import { modelController } from '../../controllers';

const router = express.Router();

router
  .route('/train')
  .post(auth('manageModel'), modelController.trainModel);

router
  .route('/search')
  .get(validate(modelValidation.searchConcepts), modelController.searchConcepts);

router
  .route('/')
  .post(auth('manageModel'), validate(modelValidation.createConcept), modelController.createConcept)
  .get(validate(modelValidation.getConcepts), modelController.getConcepts);

router
  .route('/:conceptId')
  .get(auth('manageModel'), validate(modelValidation.getConcept), modelController.getConcept)
  .patch(auth('manageModel'), validate(modelValidation.updateConcept), modelController.updateConcept)
  .delete(auth('manageModel'), validate(modelValidation.deleteConcept), modelController.deleteConcept);

export default router;

// swagger docs =========================

// swagger schema

/**
 * @swagger
 * tags:
 *  name: Concepts
 * description: Concept management and retrieval
 * /model:
 *   post:
 *     summary: Create a concept
 *     description: Only admins can create other concepts.
 *     tags: [Concepts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              properties:
 *                concept:
 *                  type: string
 *                definition:
 *                  type: string
 *                labels:
 *                  type: array
 *                  items:
 *                    type: string
 *                subjects:
 *                  type: array
 *                  items:
 *                    type: string
 *                sources:
 *                  type: array
 *                  items:
 *                    type: string
 *              required:
 *                - concept
 *                - definition
 *                - labels
 *                - subjects
 *                - sources
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Concept'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *   get: 
 *     summary: Get all concepts
 *     description: Only admins can retrieve all concepts.
 *     tags: [Concepts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: concept
 *         schema:
 *           type: string
 *         description: Concept name
 *       - in: query
 *         name: definition
 *         schema:
 *           type: string
 *         description: Concept definition
 *       - in: query
 *         name: labels
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: Concept labels
 *       - in: query
 *         name: subjects
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: Concept subjects
 *       - in: query
 *         name: sources
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: Concept sources
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Sort by field
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Maximum number of concepts per page
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Concept'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /model/{id}:
 *   get:
 *     summary: Get a concept
 *     description: Logged in concepts can fetch only their own concept information. Only admins can fetch other concepts.
 *     tags: [Concepts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Concept'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden' 
 *   patch:
 *     summary: Update a concept
 *     description: Logged in concepts can only update their own information. Only admins can update other concepts.
 *     tags: [Concepts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              properties:
 *                concept:
 *                  type: string
 *                definition:
 *                  type: string
 *                labels:
 *                  type: array
 *                  items:
 *                    type: string
 *                subjects:
 *                  type: array
 *                  items:
 *                    type: string
 *                sources:
 *                  type: array
 *                  items:
 *                    type: string
 *              required:
 *                - concept
 *                - definition
 *                - labels
 *                - subjects
 *                - sources
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Concept'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden' 
 *   delete:
 *     summary: Delete a concept
 *     description: Logged in concepts can delete only themselves. Only admins can delete other concepts.
 *     tags: [Concepts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string 
 *     responses:
 *       "204":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden' 
 */