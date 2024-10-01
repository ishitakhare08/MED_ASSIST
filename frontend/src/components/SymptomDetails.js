import { useSymptomsContext } from "../hooks/useSymptomsContext";
import { useAuthContext } from "../hooks/useAuthContext";
//date fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

const SymptomDetails = ({ symptom }) => {
    const { dispatch } = useSymptomsContext();
    const { user } = useAuthContext();

    const handleClick = async () => {
        if (!user) {
            return;
        }

        const response = await fetch('/api/symptoms/' + symptom._id, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        });
        const json = await response.json();

        if (response.ok) {
            dispatch({ type: 'DELETE_SYMPTOM', payload: json });
        }
    };

    // Function to format the date safely
    const formatDate = (dateString) => {
        if (!dateString) return 'Date unavailable';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid date';
        try {
            return formatDistanceToNow(date, { addSuffix: true });
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Date error';
        }
    };

    return (
        <div className="symptom-details">
            <h4>{symptom.question}</h4>
            <p><strong>Answer:</strong></p>

            <div className="answer-content">
                {symptom.answer ? (
                    <>
                        {/* Brief summary */}
                        <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
                            Here's a quick overview of what might help with your symptoms. For many people, addressing common triggers and adopting simple remedies can bring relief. Let's dive into some specific suggestions.
                        </p>

                        {/* Detailed breakdown in points for specific advice */}
                        {symptom.answer.split('. ').map((point, index) => {
                            const trimmedPoint = point.trim();

                            // Decide whether to show as a point or a regular sentence
                            if (
                                trimmedPoint.toLowerCase().includes("try") ||
                                trimmedPoint.toLowerCase().includes("manage") ||
                                trimmedPoint.toLowerCase().includes("use") ||
                                trimmedPoint.toLowerCase().includes("consider") ||
                                trimmedPoint.toLowerCase().includes("over-the-counter") ||
                                trimmedPoint.toLowerCase().includes("limit")
                            ) {
                                // Use bullet points for specific suggestions or medication advice
                                return (
                                    <div key={index + 1} style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
                                        <strong>{`${index + 1}. ${trimmedPoint}.`}</strong>
                                    </div>
                                );
                            } else {
                                // Use paragraphs for general advice
                                return (
                                    <p key={index + 1} style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
                                        {trimmedPoint}.
                                    </p>
                                );
                            }
                        })}
                    </>
                ) : (
                    <p>No answer available</p> // Fallback if answer is not available
                )}
            </div>

            <span className="material-symbols-outlined" onClick={handleClick} style={{ cursor: 'pointer' }}>delete</span>
        </div>
    );
};

export default SymptomDetails;
