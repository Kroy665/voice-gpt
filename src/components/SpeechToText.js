import React, { useState, useEffect } from 'react';
import gpt from '../utils/gpt';

const SpeechToText = () => {
  const [recognition, setRecognition] = useState(null);
  const [listening, setListening] = useState(false);
  const [loading, setLoading] = useState(false);

  const [text, setText] = useState('');
  const [speechText, setSpeechText] = useState('');
  const [chat, setChat] = useState([{
    role: "system",
    content: "Hello, I'm a chatbot. How can I help you?"
  }]);

  const onChat = async () => {
    if (!text) return;
    setLoading(true);
    console.log("listening stopped");
    const newChat = await gpt([...chat, {
      role: "user",
      content: text
    }]);
    setChat(newChat);
    const speechTexts = newChat[newChat.length - 1].content;
    setSpeechText(speechTexts);
    setLoading(false);
    if (speechTexts) {
      const utterance = new SpeechSynthesisUtterance(speechTexts);
      utterance.lang = 'en-IN';
      utterance.voice = speechSynthesis.getVoices().find(voice => voice.name === 'Google-indic-EN');
      speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognitionInstance = new window.webkitSpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      setRecognition(recognitionInstance);
    } else {
      console.error('Web Speech API not supported in this browser.');
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, []);

  const onStart = () => {
    if (recognition) {
      setText('');
      setListening(true);
      recognition.start();

      recognition.onresult = (event) => {
        let newText = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          newText += event.results[i][0].transcript;
        }
        setText(newText);
      };

      recognition.onerror = (event) => {
        console.error('Error occurred in recognition:', event.error);
      };

      recognition.onend = async () => {
        setListening(false);
        await onChat()
      };
    }
  };

  const onStop = async () => {
    if (recognition) {
      recognition.stop();
      setListening(false);
      await onChat()
    }
  };
  return (
    <div
      className='speech-to-text-container'
    >
      <div
        className='speech-to-text'
      >
        <textarea
          className='text-area'
          value={text}
          readOnly
        />
        <textarea
          className='text-area'
          value={speechText}
          readOnly
        />
        <br />
        {loading ? (<div className="spinner-loader active"></div>) : (
          <button
            className={`${listening ? 'start-button active' : 'start-button'}`}
            onClick={() => {
              if (!listening) onStart()
              else onStop()
            }}
          >
            {listening ? 'Stop' : 'Start'}
          </button>
        )}
      </div>
    </div>
  );
};

export default SpeechToText;