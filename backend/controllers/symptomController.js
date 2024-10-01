const Medical = require('../models/MedicalModel');
const mongoose = require('mongoose');

// Get all symptoms (now questions and answers)
const getSymptoms = async (req, res) => {
    const user_id = req.user._id;

    const symptoms = await Medical.find({ user_id }).sort({ createdAt: -1 });

    res.status(200).json(symptoms);
};

// Get a single symptom (now a question)
const getSymptom = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such symptom' });
    }

    const symptom = await Medical.findById(id);

    if (!symptom) {
        return res.status(404).json({ error: 'No such symptom' });
    }

    res.status(200).json(symptom);
};

// Create a new question (now only the question and answer fields)
const createQuestion = async (req, res) => {
    const { question, answer } = req.body;

    let emptyFields = [];
    if (!question) {
        emptyFields.push('question');
    }
    if (!answer) {
        emptyFields.push('answer');
    }
    if (emptyFields.length > 0) {
        return res.status(400).json({ error: 'Please fill in all the fields', emptyFields });
    }

    // Add doc to db
    try {
        const user_id = req.user._id;
        const symptom = await Medical.create({ question, answer, user_id });
        res.status(200).json(symptom);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a question
const deleteQuestion = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such symptom' });
    }

    const symptom = await Medical.findOneAndDelete({ _id: id });

    if (!symptom) {
        return res.status(400).json({ error: 'No such symptom' });
    }

    res.status(200).json(symptom);
};

// Update a conversation (update a question or answer)
const updateConversation = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such symptom' });
    }

    const symptom = await Medical.findOneAndUpdate({ _id: id }, {
        ...req.body
    });

    if (!symptom) {
        return res.status(400).json({ error: 'No such symptom' });
    }

    res.status(200).json(symptom);
};

// Fetch the answer from external API
const fetchAnswer = async (req, res) => {
    console.log('fetchAnswer function called');
    const { question } = req.body;

    // Use dynamic import for node-fetch
    const fetch = (await import('node-fetch')).default;

    if (!question) {
        console.log('No question provided');
        return res.status(400).json({ error: "Question is required" });
    }

    console.log('Question received:', question);

    // Debug: Check if API key is loaded
    console.log('API Key:', process.env.GROQ_API_KEY ? 'Loaded' : 'Not loaded');

    try {
        console.log('Sending request to Groq API...');
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
            },
            body: JSON.stringify({
                messages: [
                    {
                        role: "system",
                        content: "Your role is to assist users in managing their health by providing accurate and practical medical guidance. Start by greeting the user with a friendly message such as, 'Hello! How can I assist you today?' When the user describes their symptoms or asks a medical question, suggest basic remedies or lifestyle adjustments they can follow. Additionally, where appropriate, recommend over-the-counter medicines or treatments that may help alleviate their symptoms. Always provide accurate, user-friendly, and medically sound advice based on the user’s query, and encourage them to reach out if they need further assistance.",
                    },
                    {
                        role: "user",
                        content: question,
                    },
                ],
                model: "mixtral-8x7b-32768",
            }),
        });

        // Debug: Log the response status and body
        console.log('Response status:', response.status);
        const responseBody = await response.text();
        console.log('Response body:', responseBody);

        if (!response.ok) {
            console.log('Error response from API');
            return res.status(response.status).json({ error: `Failed to fetch answer: ${responseBody}` });
        }

        const data = JSON.parse(responseBody);
        console.log('Parsed data:', data);

        if (data.choices && data.choices.length > 0 && data.choices[0].message) {
            const answer = data.choices[0].message.content;
            console.log('Answer:', answer);
            res.status(200).json({ answer: answer });
        } else {
            console.log('Unexpected response structure:', data);
            res.status(500).json({ error: 'Unexpected response structure from API' });
        }
    } catch (error) {
        console.error('Error details:', error);
        res.status(500).json({ error: 'Something went wrong', details: error.message });
    }
};

module.exports = {
    getSymptoms,
    getSymptom,
    createQuestion,
    deleteQuestion,
    updateConversation,
    fetchAnswer
};
