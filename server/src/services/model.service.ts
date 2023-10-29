import {  Prisma, Concept } from '@prisma/client';
import httpStatus from 'http-status';
import prisma from '../client';
import ApiError from '../utils/ApiError';

/**
 * Create a concept
 * @param {Object} conceptBody
 * @returns {Promise<Concept>}
 */
const createConcept = async (
  concept: string,
  definition: string,
  labels: string[],
  sources: string[]
): Promise<Concept> => {
  if (await getConceptByName(concept)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Concept already exists');
  }
  // join lists into strings with , as separator
  return prisma.concept.create({
    data: {
      concept,
      definition,
      labels: labels.join(','),
      sources: sources.join(',')
    }
  });
};

/**
 * Query for concept
 * @param {Object} filter - sqlite filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryConcepts = async <Key extends keyof Concept>(
  filter: Prisma.ConceptWhereInput,
  options: {
    limit?: number;
    page?: number;
    sortBy?: string;
    sortType?: 'asc' | 'desc';
  },
  keys: Key[] = [
    'id',
    'concept',
    'definition',
    'labels',
    'sources',
    'createdAt',
    'updatedAt',
  ] as Key[]
): Promise<Pick<Concept, Key>[]> => {
  const page = options.page ?? 0;
  const limit = options.limit ?? 10;
  const sortBy = options.sortBy ?? 'id';
  const sortType = options.sortType ?? 'desc';

  // if any of the filter is an array, join them into strings with , as separator.

  for (const key in filter) {
    if (Array.isArray(filter[key as keyof typeof filter])) {
      filter[key as keyof typeof filter] = { 
        // like and contains
          contains: (filter[key as keyof typeof filter] as string[]).join(',')
      };
    }
    // if its just a string, use like and contains
    if (typeof filter[key as keyof typeof filter] === 'string') {
      filter[key as keyof typeof filter] = {
        contains: filter[key as keyof typeof filter] as string
      };
    }
  }

  const concepts = await prisma.concept.findMany({
    where: filter,
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
    skip: page * limit,
    take: limit,
    orderBy: sortBy ? { [sortBy]: sortType } : undefined
  });
  return concepts as Pick<Concept, Key>[];
};

/**
 * Get concept by id
 * @param {ObjectId} id
 * @param {Array<Key>} keys
 * @returns {Promise<Pick<User, Key> | null>}
 */
const getConceptById = async <Key extends keyof Concept>(
  id: number,
  keys: Key[] = [
    'id',
    'concept',
    'definition',
    'labels',
    'sources',
    'createdAt',
    'updatedAt',
  ] as Key[]
): Promise<Pick<Concept, Key> | null> => {
  return prisma.concept.findUnique({
    where: { id },
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
  }) as Promise<Pick<Concept, Key> | null>;
};

/**
 * Get user by email
 * @param {string} email
 * @param {Array<Key>} keys
 * @returns {Promise<Pick<User, Key> | null>}
 */
const getConceptByName = async <Key extends keyof Concept>(
  concept: string,
  keys: Key[] = [
    'id',
    'concept',
    'definition',
    'labels',
    'sources',
    'createdAt',
    'updatedAt',
  ] as Key[]
): Promise<Pick<Concept, Key> | null> => {
  return prisma.concept.findFirst({
    where: { concept },
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
  }) as Promise<Pick<Concept, Key> | null>;
};

/**
 * Update concept by id
 * @param {ObjectId} conceptId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateConceptById = async <Key extends keyof Concept>(
  conceptId: number,
  updateBody: Prisma.UserUpdateInput,
  keys: Key[] = ['id', 'email', 'name', 'role'] as Key[]
): Promise<Pick<Concept, Key> | null> => {
  const concept = await getConceptById(conceptId, ['id', 'definition', 'labels','sources']);
  if (!concept) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Concept not found');
  }
  const updatedConcept = await prisma.concept.update({
    where: { id: concept.id },
    data: updateBody,
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
  });
  return updatedConcept as Pick<Concept, Key> | null;
};

/**
 * Delete concept by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteConceptById = async (conceptId: number): Promise<Concept> => {
  const concept = await getConceptById(conceptId);
  if (!concept) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Concept not found');
  }
  await prisma.concept.delete({ where: { id: concept.id } });
  return concept;
};



export default {
  createConcept,
  queryConcepts,
  getConceptById,
  getConceptByName,
  updateConceptById,
  deleteConceptById
};
