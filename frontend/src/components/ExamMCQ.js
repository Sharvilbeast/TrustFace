
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

// Styled Components
const ExamContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  animation: ${fadeIn} 0.5s ease-out;
`;

const Header = styled.header`
  background: rgba(21, 25, 53, 0.7);
  backdrop-filter: blur(10px);
  padding: 15px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    padding: 10px 15px;
    flex-direction: column;
    gap: 10px;
  }
`;

const Logo = styled.div`
  font-size: 20px;
  font-weight: 700;
  background: linear-gradient(90deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const MainContent = styled.main`
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  max-width: 1000px;
  margin: 0 auto;
  width: 100%;

  @media (max-width: 768px) {
    padding: 15px;
  }
`;

const ExamHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const ExamTitle = styled.h1`
  font-size: 24px;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const Timer = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const QuestionCounter = styled.div`
  font-size: 16px;
  color: ${props => props.theme.colors.textSecondary};

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const QuestionCard = styled.div`
  background: rgba(21, 25, 53, 0.7);
  backdrop-filter: blur(10px);
  border-radius: ${props => props.theme.borderRadius};
  box-shadow: ${props => props.theme.shadows.lg};
  padding: 25px;
  margin-bottom: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const QuestionText = styled.h2`
  font-size: 18px;
  margin-bottom: 20px;
  line-height: 1.5;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const OptionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const OptionItem = styled.label`
  display: flex;
  align-items: flex-start;
  padding: 12px 15px;
  background: rgba(30, 35, 65, 0.5);
  border-radius: ${props => props.theme.borderRadius};
  cursor: pointer;
  transition: ${props => props.theme.transitions.normal};
  border: 1px solid rgba(255, 255, 255, 0.1);

  &:hover {
    background: rgba(74, 158, 255, 0.1);
    border-color: ${props => props.theme.colors.primary};
  }

  ${props => props.selected && `
    background: rgba(74, 158, 255, 0.2);
    border-color: ${props.theme.colors.primary};
  `}
`;

const OptionRadio = styled.input`
  margin-right: 12px;
  margin-top: 3px;

  @media (max-width: 768px) {
    margin-right: 10px;
  }
`;

const OptionText = styled.span`
  font-size: 16px;
  line-height: 1.5;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 30px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
  }
`;

const Button = styled.button`
  background: linear-gradient(90deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
  border: none;
  border-radius: ${props => props.theme.borderRadius};
  padding: 12px 20px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: ${props => props.theme.transitions.normal};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.md};
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 14px;
  }
`;

const ButtonOutline = styled(Button)`
  background: transparent;
  border: 1px solid ${props => props.theme.colors.primary};

  &:hover {
    background: rgba(74, 158, 255, 0.1);
  }
`;

const ButtonDanger = styled(Button)`
  background: linear-gradient(90deg, ${props => props.theme.colors.error}, #ff5252);

  &:hover {
    box-shadow: 0 4px 6px -1px rgba(248, 113, 113, 0.3), 0 2px 4px -1px rgba(248, 113, 113, 0.2);
  }
`;

const QuestionNavigation = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
  justify-content: center;
`;

const NavButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: ${props => props.current 
    ? 'linear-gradient(90deg, ' + props.theme.colors.primary + ', ' + props.theme.colors.secondary + ')' 
    : 'rgba(21, 25, 53, 0.7)'};
  color: ${props => props.current ? 'white' : props.theme.colors.textSecondary};
  font-weight: 600;
  cursor: pointer;
  transition: ${props => props.theme.transitions.normal};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.md};
  }

  ${props => props.answered && !props.current && `
    background: rgba(74, 222, 128, 0.2);
    border-color: ${props.theme.colors.success};
    color: ${props.theme.colors.success};
  `}
`;

const SubmitConfirmation = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(10, 14, 39, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ConfirmationCard = styled.div`
  background: rgba(21, 25, 53, 0.9);
  backdrop-filter: blur(10px);
  border-radius: ${props => props.theme.borderRadius};
  box-shadow: ${props => props.theme.shadows.xl};
  padding: 30px;
  width: 90%;
  max-width: 400px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
`;

const ConfirmationTitle = styled.h2`
  font-size: 22px;
  margin-bottom: 15px;
`;

const ConfirmationMessage = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 25px;
  line-height: 1.5;
`;

const ConfirmationButtons = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
`;

// Mock exam questions data
const examQuestions = {
  math101: [
    {
      id: 1,
      question: "What is the value of π (pi) approximately?",
      options: [
        "3.14159",
        "2.71828",
        "1.61803",
        "1.41421"
      ],
      correctAnswer: 0
    },
    {
      id: 2,
      question: "What is the derivative of x² with respect to x?",
      options: [
        "2x",
        "x²",
        "x",
        "1/2x"
      ],
      correctAnswer: 0
    },
    {
      id: 3,
      question: "What is the area of a circle with radius r?",
      options: [
        "πr²",
        "2πr",
        "πd",
        "4πr²"
      ],
      correctAnswer: 0
    },
    {
      id: 4,
      question: "What is the Pythagorean theorem?",
      options: [
        "a² + b² = c²",
        "a + b = c",
        "a² - b² = c²",
        "a × b = c²"
      ],
      correctAnswer: 0
    },
    {
      id: 5,
      question: "What is the value of i² in complex numbers?",
      options: [
        "-1",
        "1",
        "0",
        "i"
      ],
      correctAnswer: 0
    }
  ],
  phys201: [
    {
      id: 1,
      question: "What is the SI unit of force?",
      options: [
        "Newton",
        "Joule",
        "Watt",
        "Pascal"
      ],
      correctAnswer: 0
    },
    {
      id: 2,
      question: "What is the speed of light in vacuum?",
      options: [
        "299,792,458 m/s",
        "150,000,000 m/s",
        "3,000,000 m/s",
        "299,792 km/s"
      ],
      correctAnswer: 0
    },
    {
      id: 3,
      question: "What is the formula for kinetic energy?",
      options: [
        "½mv²",
        "mgh",
        "mc²",
        "F×d"
      ],
      correctAnswer: 0
    },
    {
      id: 4,
      question: "What is the law of conservation of energy?",
      options: [
        "Energy cannot be created or destroyed",
        "Energy is always increasing",
        "Energy can be destroyed but not created",
        "Energy is constant in a closed system"
      ],
      correctAnswer: 0
    },
    {
      id: 5,
      question: "What is the gravitational constant G approximately equal to?",
      options: [
        "6.674×10⁻¹¹ N·m²/kg²",
        "9.8 m/s²",
        "3.14159",
        "1.602×10⁻¹⁹ C"
      ],
      correctAnswer: 0
    }
  ],
  chem301: [
    {
      id: 1,
      question: "What is the atomic number of Carbon?",
      options: [
        "6",
        "12",
        "4",
        "8"
      ],
      correctAnswer: 0
    },
    {
      id: 2,
      question: "What is the chemical formula for water?",
      options: [
        "H₂O",
        "CO₂",
        "NaCl",
        "O₂"
      ],
      correctAnswer: 0
    },
    {
      id: 3,
      question: "What is the pH value of a neutral solution?",
      options: [
        "7",
        "0",
        "14",
        "1"
      ],
      correctAnswer: 0
    },
    {
      id: 4,
      question: "What is the most abundant gas in Earth's atmosphere?",
      options: [
        "Nitrogen",
        "Oxygen",
        "Carbon Dioxide",
        "Argon"
      ],
      correctAnswer: 0
    },
    {
      id: 5,
      question: "What is the chemical symbol for Gold?",
      options: [
        "Au",
        "Ag",
        "Fe",
        "Gd"
      ],
      correctAnswer: 0
    }
  ]
};

const ExamMCQ = () => {
  const { examId } = useParams();
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes in seconds
  const [timerActive, setTimerActive] = useState(true);
  const [showSubmitConfirmation, setShowSubmitConfirmation] = useState(false);

  const questions = examQuestions[examId] || examQuestions.math101;

  // Timer effect
  useEffect(() => {
    let interval;

    if (timerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      // Time's up
      handleSubmitExam();
    }

    return () => clearInterval(interval);
  }, [timerActive, timeRemaining]);

  // Format time for display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOptionSelect = (questionId, optionIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleJumpToQuestion = (index) => {
    setCurrentQuestion(index);
  };

  const handleShowSubmitConfirmation = () => {
    setShowSubmitConfirmation(true);
  };

  const handleSubmitExam = () => {
    setTimerActive(false);

    // Calculate score
    let correctAnswers = 0;
    questions.forEach(question => {
      if (answers[question.id] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / questions.length) * 100);

    // In a real app, you would submit the answers to the backend here
    // For now, we'll just show the results

    alert(`Exam submitted! Your score: ${score}% (${correctAnswers}/${questions.length})`);

    // Navigate to dashboard
    navigate('/dashboard');
  };

  const handleCancelSubmit = () => {
    setShowSubmitConfirmation(false);
  };

  // Check if current question is answered
  const isCurrentQuestionAnswered = answers.hasOwnProperty(questions[currentQuestion].id);

  return (
    <ExamContainer>
      <Header>
        <Logo>TrustFace</Logo>
        <Timer>
          <span>⏱️</span>
          {formatTime(timeRemaining)}
        </Timer>
      </Header>

      <MainContent>
        <ExamHeader>
          <div>
            <ExamTitle>{examId === 'math101' ? 'Mathematics 101' : 
                          examId === 'phys201' ? 'Physics Advanced' : 
                          'Chemistry Final'}</ExamTitle>
            <QuestionCounter>
              Question {currentQuestion + 1} of {questions.length}
            </QuestionCounter>
          </div>
        </ExamHeader>

        <QuestionCard>
          <QuestionText>
            {questions[currentQuestion].question}
          </QuestionText>

          <OptionsList>
            {questions[currentQuestion].options.map((option, index) => (
              <OptionItem 
                key={index}
                selected={answers[questions[currentQuestion].id] === index}
              >
                <OptionRadio
                  type="radio"
                  name={`question-${questions[currentQuestion].id}`}
                  checked={answers[questions[currentQuestion].id] === index}
                  onChange={() => handleOptionSelect(questions[currentQuestion].id, index)}
                />
                <OptionText>{option}</OptionText>
              </OptionItem>
            ))}
          </OptionsList>
        </QuestionCard>

        <NavigationButtons>
          <ButtonOutline 
            onClick={handlePrevQuestion}
            disabled={currentQuestion === 0}
          >
            Previous
          </ButtonOutline>

          {currentQuestion < questions.length - 1 ? (
            <Button 
              onClick={handleNextQuestion}
            >
              Next
            </Button>
          ) : (
            <Button onClick={handleShowSubmitConfirmation}>
              Submit Exam
            </Button>
          )}
        </NavigationButtons>

        <QuestionNavigation>
          {questions.map((_, index) => (
            <NavButton
              key={index}
              current={index === currentQuestion}
              answered={answers.hasOwnProperty(questions[index].id)}
              onClick={() => handleJumpToQuestion(index)}
            >
              {index + 1}
            </NavButton>
          ))}
        </QuestionNavigation>
      </MainContent>

      {showSubmitConfirmation && (
        <SubmitConfirmation>
          <ConfirmationCard>
            <ConfirmationTitle>Submit Exam?</ConfirmationTitle>
            <ConfirmationMessage>
              Are you sure you want to submit your exam? You cannot change your answers after submission.
              {Object.keys(answers).length < questions.length && (
                <span> You have {questions.length - Object.keys(answers).length} unanswered questions.</span>
              )}
            </ConfirmationMessage>
            <ConfirmationButtons>
              <ButtonOutline onClick={handleCancelSubmit}>
                Cancel
              </ButtonOutline>
              <Button onClick={handleSubmitExam}>
                Submit Exam
              </Button>
            </ConfirmationButtons>
          </ConfirmationCard>
        </SubmitConfirmation>
      )}
    </ExamContainer>
  );
};

export default ExamMCQ;
