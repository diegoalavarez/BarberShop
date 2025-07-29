const PAGE_URL = process.env.NODE_ENV === 'production'
    ? 'https://proyecto-todoapp.onrender.com'
    : 'http://localhost:3000'

const MONGO_URI = process.env.NODE_ENV === 'production'
    ? process.env.MONGO_URI_PROD
    : process.env.MONGO_URI_TEST

module.exports = { MONGO_URI_TEST: process.env.MONGO_URI_TEST};