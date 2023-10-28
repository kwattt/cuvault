import Joi from 'joi';
import { password } from './custom.validation';
import { Role } from '../services/user.service';

const createConcept = {
  body: Joi.object().keys({
    concept: Joi.string().required(),
    definition: Joi.string().required(),
    labels: Joi.array().items(Joi.string()).required(),
    sources: Joi.array().items(Joi.string()).required(),
  })
};

const getConcepts = {
  query: Joi.object().keys({
    concept: Joi.string(),
    definition: Joi.string(),
    labels: Joi.alternatives().try(Joi.array().items(Joi.string()), Joi.string()),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer()
  })
};

const getConcept = {
  params: Joi.object().keys({
    conceptId: Joi.number().integer()
  })
};

const updateConcept = {
  params: Joi.object().keys({
    conceptId: Joi.number().integer()
  }),
  body: Joi.object()
    .keys({
      concept: Joi.string(),
      definition: Joi.string(),
      labels: Joi.array().items(Joi.string()),
      sources: Joi.array().items(Joi.string()),
    })
    .min(1)
};

const deleteConcept = {
  params: Joi.object().keys({
    conceptId: Joi.number().integer()
  })
};

const searchConcepts = {
  // query required
  query: Joi.object().keys({
    query: Joi.string().required()
  })
}

export default {
  createConcept,
  getConcepts,
  getConcept,
  updateConcept,
  deleteConcept,
  searchConcepts
};
