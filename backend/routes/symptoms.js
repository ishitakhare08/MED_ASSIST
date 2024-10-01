const express=require('express')
const {
  createQuestion,
  getSymptoms,
  getSymptom,
  deleteQuestion,
  updateConversation,
  fetchAnswer
}=require('../controllers/symptomController')

const requireAuth = require('../middleware/requireAuth')
const router = express.Router();

// Logging middleware 
router.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

//require auth for all workout routes
router.use(requireAuth)

// GET all symptoms
router.get('/',getSymptoms)

// GET a single symptom
router.get('/:id',getSymptom)

// POST a new question
router.post('/', createQuestion)

// POST request to fetch an answer from an external API (Groq API)
router.post('/fetchAnswer', (req, res, next) => {
  console.log('fetchAnswer route accessed');
  fetchAnswer(req, res).catch(next); // Calls the fetchAnswer function and handles any errors
});

// DELETE a question (might not be applicable for a chatbot)
router.delete('/:id', deleteQuestion)

// UPDATE a conversation 
router.patch('/:id', updateConversation)

// Error handling middleware
router.use((err, req, res, next) => {
  console.error('An error occurred:', err);
  res.status(500).json({ error: 'An unexpected error occurred', details: err.message });
});

module.exports = router;