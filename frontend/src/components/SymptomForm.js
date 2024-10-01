import { useState } from 'react';
import { useSymptomsContext } from '../hooks/useSymptomsContext';
import { useAuthContext } from '../hooks/useAuthContext';

const SymptomForm = () => {
  const { dispatch } = useSymptomsContext();
  const { user } = useAuthContext();

  const [question, setQuestion] = useState('');
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError('You must be logged in');
      return;
    }

    const query = { question };

    try {
      // First, fetch the answer from the external API
      const answerResponse = await fetch('/api/symptoms/fetchAnswer', {
        method: 'POST',
        body: JSON.stringify(query),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        }
      });

      const answerJson = await answerResponse.json();

      if (!answerResponse.ok) {
        setError(answerJson.error);
        setEmptyFields(answerJson.emptyFields || []);
        return;
      }

      // Now, save the symptom (question) along with the fetched answer
      const saveResponse = await fetch('/api/symptoms', {
        method: 'POST',
        body: JSON.stringify({
          question: question,
          answer: answerJson.answer  // Saving the fetched answer
        }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        }
      });

      const saveJson = await saveResponse.json();

      if (!saveResponse.ok) {
        setError(saveJson.error);
        setEmptyFields(saveJson.emptyFields || []);
      } else {
        dispatch({ type: 'CREATE_SYMPTOM', payload: saveJson });
        setQuestion('');
        setError('');
        setEmptyFields([]);
      }
    } catch (error) {
      setError('Failed to save symptom. Please try again later.');
    }
  };

  return (
    <form className="create" onSubmit={handleSubmit}>
      <h3>Ask a new Question</h3>

      <label>Question:</label>
      <input
        type="text"
        onChange={(e) => setQuestion(e.target.value)}
        value={question}
        className={emptyFields.includes('question') ? 'error' : ''}
      />

      <button type="submit">Submit Question</button>

      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default SymptomForm;


