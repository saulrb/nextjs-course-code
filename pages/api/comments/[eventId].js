import { dbConnect, insertDocument, getDocuments } from '../../../helpers/db-utils'

const handler = async (req, res) => {
  const eventId = req.query.eventId

  if (req.method === 'POST') {
    // add server-side validation
    const { email, name, text } = req.body
    if (!email.includes('@') || !name || name.trim() === '' || !text || text.trim() === '') {
      res.status(422).json({ message: 'Invalid input' })
      return
    }

    const newComment = {
      email,
      name,
      text,
      eventId
    }
    let client = null
    let insertResult = null
    try {
      client = await dbConnect()
    } catch (error) {
      res.status(500).json({ message: 'Connecting to the database failed' })
      return
    }
    try {
      insertResult = await insertDocument(client, 'comments', newComment)
      client.close()
    } catch (error) {
      res.status(500).json({ message: error.message || 'Inserting data failed' })
      return
    }

    res.status(200).json({ message: 'Successfully added', result: insertResult })
  }

  if (req.method === 'GET') {
    let client = null
    try {
      client = await dbConnect()
    } catch (error) {
      res.status(500).json({ message: 'Connecting to the database failed' })
    }
    let results = null
    try {
      results = await getDocuments(client, 'comments', eventId)
      client.close()
    } catch (error) {
      res.status(500).json({ message: 'Reading data failed' })
      return
    }

    res.status(200).json({ comments: results })
  }
}
export default handler
