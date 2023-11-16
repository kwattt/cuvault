import httpStatus from 'http-status';
import pick from '../utils/pick';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';
import { modelService } from '../services';
import config from './../config/config';
import prisma from '../client';

const createConcept = catchAsync(async (req, res) => {
  const { concept, definition,labels } = req.body;
  let {sources} = req.body;
  // format sources
  // calc prediction
  // print something to see if it works
  const conceptBody = await modelService.createConcept(concept, definition, labels, sources);
  res.status(httpStatus.CREATED).send(conceptBody);
});

const getConcepts = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['concept', 'definition', 'labels','sources']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await modelService.queryConcepts(filter, options);
  // format sources
  result[0].sources = modelService.formatSources(result[0].sources);
  res.send(result);
});

const getConcept = catchAsync(async (req, res) => {
  const concept = await modelService.getConceptById(req.params.conceptId);
  if (!concept) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Concept not found');
  }
  res.send(concept);
});

const updateConcept = catchAsync(async (req, res) => {

  const concept = await modelService.updateConceptById(req.params.conceptId, req.body);
  res.send(concept);
});

const deleteConcept = catchAsync(async (req, res) => {
  await modelService.deleteConceptById(req.params.conceptId);
  res.status(httpStatus.NO_CONTENT).send();
});

const trainModel = catchAsync(async (req, res) => {
  // get all concepts
  const concepts = await prisma.concept.findMany();
  // convert it to a csv, with each line being a concept
  let csv = "concept" + "," + "definition" + "," + "labels" +  "," + "sources" + "\n";

  for (let i = 0; i < concepts.length; i++) {
    const concept = concepts[i];
    csv += '"'+concept.concept + '","' + 
    concept.definition + '","' + concept.labels + '","' + concept.sources + '"\n';
  }

  // send it to the model
  const apiRes = await fetch(config.model_url+'/train', {
    method: 'POST',
    body: csv
  })

  if(apiRes.status != 200)
    throw new ApiError(httpStatus.NOT_FOUND, 'Model training failed');

  return res.send("Model trained successfully")
})

const searchConcepts = catchAsync(async (req, res) => {
  if(!req.query.query)
    throw new ApiError(httpStatus.BAD_REQUEST, 'No query provided');
  const query = req.query.query as string;
  if(query.length < 3)
    throw new ApiError(httpStatus.BAD_REQUEST, 'Query must be at least 3 characters long');


  console.log("calling api")
  const apiRes = await fetch(config.model_url+'/search?'+ 
    new URLSearchParams({
      query: query 
    })
  )
  console.log('done!')

  if(apiRes.status != 200)
    throw new ApiError(httpStatus.NOT_FOUND, 'No concepts found');
  let data = await apiRes.json() as any[];
  let resultElements = [];
  //console.log(data)
  for (let i = 0; i < data.length; i++) {
    const element = data[i];
    // add to resultEments if data['weight'] > 0.5
//    if(element['weight'] > 0.2)
      resultElements.push(element);
  }

  // order resulltElements by weight descending
  resultElements.sort((a, b) => (a.weight > b.weight) ? -1 : 1)

  return res.send(resultElements)
})

const predictConcept = catchAsync(async (req, res) => {
  if(!req.query.concept || !req.query.definition)
    throw new ApiError(httpStatus.BAD_REQUEST, 'No concept or definition provided');
  const concept = req.query.concept as string;
  const definition = req.query.definition as string;

  const apiRes = await fetch(config.model_url+'/predict?'+
    new URLSearchParams({
      concept: concept,
      definition: definition
    })
  )

  if(apiRes.status != 200)
    throw new ApiError(httpStatus.NOT_FOUND, 'Model prediction failed');
  let data = await apiRes.json() as any[];
  let labels = [];
  // returns a single label
  labels.push(data);
  return res.send(labels)
})

export default {
  createConcept,
  getConcepts,
  getConcept,
  updateConcept,
  deleteConcept,
  searchConcepts,
  trainModel,
  predictConcept
};