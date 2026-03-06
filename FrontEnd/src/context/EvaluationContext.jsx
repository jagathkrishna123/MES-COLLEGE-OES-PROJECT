import React, { createContext, useContext, useState, useEffect } from 'react';

const EvaluationContext = createContext();

export const useEvaluation = () => {
    const context = useContext(EvaluationContext);
    if (!context) {
        throw new Error('useEvaluation must be used within an EvaluationProvider');
    }
    return context;
};

export const EvaluationProvider = ({ children }) => {
    const [lastSchemes, setLastSchemes] = useState(() => {
        const saved = localStorage.getItem('lastEvaluationSchemes');
        return saved ? JSON.parse(saved) : {};
    });

    useEffect(() => {
        localStorage.setItem('lastEvaluationSchemes', JSON.stringify(lastSchemes));
    }, [lastSchemes]);

    const updateScheme = (examId, scheme) => {
        setLastSchemes((prev) => ({
            ...prev,
            [examId]: scheme,
        }));
    };

    return (
        <EvaluationContext.Provider value={{ lastSchemes, updateScheme }}>
            {children}
        </EvaluationContext.Provider>
    );
};
