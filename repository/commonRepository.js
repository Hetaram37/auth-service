'use strict'

exports.aggregate = async (query, collection) => {
  console.debug('Find data with aggregate query: %j, collection: ', query, collection)
  try {
    const doc = await collection.aggregate(query)
    return doc
  } catch (error) {
    console.error(`Error while getting data from ${collection}: %s %j`, error, error)
    throw error
  }
}

exports.findOne = async (query, projection, collection) => {
  console.debug('Find one data: query: %j, projection: %j, collection: ', query, projection, collection)
  try {
    const doc = await collection.findOne(query, projection).lean()
    return doc
  } catch (error) {
    console.error(`Error while getting data from ${collection}: %s %j`, error, error)
    throw error
  }
}

exports.find = async (query, projection, collection) => {
  console.debug('Find data: query: %j, projection: %j, collection: ', query, projection, collection)
  try {
    const doc = await collection.find(query, projection).lean()
    return doc
  } catch (error) {
    console.error(`Error while getting data from ${collection}: %s %j`, error, error)
    throw error
  }
}

exports.updateOne = async (query, data, projection, collection) => {
  console.debug('Update one data: query: %j, data: %j, projection: %j, collection: ', query, data, projection, collection)
  try {
    const doc = await collection.updateOne(query, data, projection)
    return doc
  } catch (error) {
    console.error(`Error while updating data in ${collection} collection: %s %j`, error, error)
    throw error
  }
}

exports.findByIdAndUpdate = async (id, data, collection) => {
  console.debug('Update one data: id: %s, data: %j, collection: ', id, data, collection)
  try {
    const doc = await collection.findByIdAndUpdate(id, data, { new: true })
    return doc
  } catch (error) {
    console.error(`Error while updating data in ${collection} collection: %s %j`, error, error)
    throw error
  }
}

exports.createOne = async (data, collection) => {
  try {
    const doc = await collection.create(data)
    return doc
  } catch (error) {
    console.error(`Error while saving data to ${collection}: %s %j`, error, error)
    throw error
  }
}
