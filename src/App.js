import SpeechToText from './components/SpeechToText';
import React, {
  useState,
  useEffect
} from 'react';
import './css/home.css';
function App() {

  const [gptAPI, setGptAPI] = useState(null);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    const gptAPIKey = localStorage.getItem('gptAPIKey');
    if (!gptAPI) {
      setGptAPI(gptAPIKey);
    }
  }, [gptAPI]);
  if ('webkitSpeechRecognition' in window) {
    return (
      <>
        {gptAPI ? (
          <SpeechToText />
        ) : (
          <div className="main-div">
            <div
              className="main-section"
            >
              <h1 className="heading-h1">Enter your GPT-3 API key</h1>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="input-text"
              />
              <button
                onClick={() => {
                  localStorage.setItem('gptAPIKey', inputText);
                  setGptAPI(inputText);
                }}
                className="submit-btn"
              >
                Submit
              </button>
            </div>
          </div>
        )}
      </>
    );
  } else {
    return (
      <div className="App">
        <h1>Web Speech API not supported in this browser.</h1>
      </div>
    );
  }
}

export default App;
