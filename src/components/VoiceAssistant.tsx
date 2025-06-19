import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Mic, MicOff, Volume2 } from 'lucide-react';

interface VoiceAssistantProps {
  currentStep: number;
  instructions: string[];
  onNextStep: () => void;
  onPreviousStep: () => void;
}

export function VoiceAssistant({ currentStep, instructions, onNextStep, onPreviousStep }: VoiceAssistantProps) {
  const [isListening, setIsListening] = useState(false);
  
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable
  } = useSpeechRecognition({
    commands: [
      {
        command: ['next', 'continue', 'forward'],
        callback: () => {
          onNextStep();
          resetTranscript();
        }
      },
      {
        command: ['back', 'previous', 'backward'],
        callback: () => {
          onPreviousStep();
          resetTranscript();
        }
      },
      {
        command: ['repeat', 'again'],
        callback: () => {
          speak(instructions[currentStep]);
          resetTranscript();
        }
      }
    ]
  });

  useEffect(() => {
    if (isListening && !listening) {
      SpeechRecognition.startListening({ continuous: true });
    } else if (!isListening && listening) {
      SpeechRecognition.stopListening();
    }
  }, [isListening, listening]);

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9; // Slightly slower for better clarity
    utterance.pitch = 1;
    window.speechSynthesis.cancel(); // Cancel any ongoing speech
    window.speechSynthesis.speak(utterance);
  };

  const toggleListening = () => {
    setIsListening(!isListening);
  };

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="fixed bottom-4 right-4 bg-red-100 text-red-700 p-4 rounded-lg shadow-lg">
        Your browser doesn't support speech recognition.
      </div>
    );
  }

  if (!isMicrophoneAvailable) {
    return (
      <div className="fixed bottom-4 right-4 bg-yellow-100 text-yellow-700 p-4 rounded-lg shadow-lg">
        Please enable microphone access to use voice commands.
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-end space-y-2">
      <div className="bg-white rounded-lg shadow-lg p-4 max-w-sm w-full">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">Voice Assistant</h3>
          <button
            onClick={toggleListening}
            className={`p-2 rounded-full transition-colors ${
              isListening 
                ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
            }`}
            title={isListening ? 'Stop listening' : 'Start listening'}
          >
            {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </button>
        </div>
        
        <div className="text-sm text-gray-600 mb-2">
          {isListening ? (
            <div className="flex items-center">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2" />
              Listening...
            </div>
          ) : (
            'Click the mic to start'
          )}
        </div>
        
        {transcript && (
          <div className="text-sm bg-gray-50 p-2 rounded mb-2 animate-fade-in">
            Heard: "{transcript}"
          </div>
        )}
        
        <div className="text-xs space-y-1 text-gray-500">
          <p>Available commands:</p>
          <ul className="list-disc list-inside pl-2">
            <li>"next" or "continue" - Next step</li>
            <li>"back" or "previous" - Previous step</li>
            <li>"repeat" - Repeat current step</li>
          </ul>
        </div>
      </div>

      <button
        onClick={() => speak(instructions[currentStep])}
        className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors shadow-lg"
        title="Read current step"
      >
        <Volume2 className="h-5 w-5" />
      </button>
    </div>
  );
}