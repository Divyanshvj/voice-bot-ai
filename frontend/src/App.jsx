import { useState } from "react";
import axios from "axios";

const App = () => {
  const [transcript, setTranscript] = useState("");
  const [reply, setReply] = useState("");
  const [isListening, setIsListening] = useState(false);

  let recognition;
  if ("webkitSpeechRecognition" in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "en-US";
    recognition.interimResults = false;
  }

  const handleVoiceInput = () => {
    if (!recognition) return alert("Speech Recognition not supported");

    setIsListening(true);
    recognition.start();

    recognition.onresult = async (event) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      recognition.stop();
      setIsListening(false);
      await sendToServer(text);
    };

    recognition.onerror = () => {
      setIsListening(false);
      alert("Error in voice recognition");
    };
  };

  const sendToServer = async (text) => {
    try {
      const res = await axios.post("https://voice-bot-ai-ywmt.onrender.com/ask", { message: text });
      setReply(res.data.reply);
      speak(res.data.reply);
    } catch (err) {
      console.error(err);
      setReply("Sorry, I had a problem answering.");
    }
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>🎙 Divyansh’s AI Voice Bot</h1>
      <button onClick={handleVoiceInput} disabled={isListening}>
        {isListening ? "Listening..." : "Speak"}
      </button>
      <p><strong>You said:</strong> {transcript}</p>
      <p><strong>Bot replied:</strong> {reply}</p>
    </div>
  );
};

export default App;
