import { dbConnect, insertDocument } from '../../../helpers/db-utils'

const handler = async (req, res) => {
  if (req.method === 'POST') {
    const userEmail = req.body.email
    console.log(userEmail)
    if (!userEmail || !userEmail.includes('@')) {
      res.status(422).json({ message: 'Invalid email address' })
      return
    }

    let client = null
    let insertResult = null
    console.log(userEmail)
    try {
      client = await dbConnect()
    } catch (error) {
      res.status(500).json({ message: 'Connecting to the database failed' })
    }

    try {
      insertResult = insertDocument(client, 'emails', { email: userEmail })
      client.close()
    } catch (error) {
      res.status(500).json({ message: 'Inserting data failed' })
      return
    }

    res.status(200).json({ message: 'Succesfully created', result: insertResult })
  }
}
export default handler
