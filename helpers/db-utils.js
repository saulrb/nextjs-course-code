import { MongoClient } from 'mongodb'

export const dbConnect = async () => {
  const url = 'mongodb://localhost:27017'
  const client = new MongoClient(url)
  return await client.connect()
}

export const insertDocument = async (client, collectionName, document) => {
  const dbName = 'events'
  const db = client.db(dbName)
  const collection = db.collection(collectionName)
  const inserResult = await collection.insertOne(document)
  return inserResult
}

export const getDocuments = async (client, collectionName, eventId) => {
  const dbName = 'events'
  const db = client.db(dbName)
  const collection = db.collection(collectionName)
  return await collection.find({ eventId }).sort({ _id: -1 }).toArray()
}
