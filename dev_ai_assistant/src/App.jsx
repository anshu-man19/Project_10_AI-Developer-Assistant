import { useState, useRef, useEffect } from "react";
import TypingIndicator from "./components/TypingIndicator";
import { buildPrompt } from "./utils/promptBuilder";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";


function App() {

  //  Variables --->
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I am your AI Developer Assistant." },
  ]);

  const [input, setInput] = useState("");

  const [loading, setLoading] = useState(false)

  const [model, setModel] = useState("openai");

  const [mode, setMode] = useState("explain");

  const chatRef = useRef();

  const [copiedIndex, setCopiedIndex] = useState(null);


  // Functions ---->

  const handleSend = async () => {
    if (!input.trim()) return;

    // User Message will be added here : 

    const userMessage = { role: "user", content: input };

    setMessages((prev) => [...prev, userMessage]);

    const finalPrompt = buildPrompt(mode, input);

    setInput("")

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          prompt: finalPrompt
        }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply || "No response" }
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error: Unable to connect to AI 😓" }
      ]);
    } finally {
      setLoading(false);
    }

    setLoading(false);

  };

  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  // Return statement ---->

  return (
    <div className="h-screen bg-gray-950 text-white flex flex-col">

      {/* Header */}
      <header className="p-4 border-b border-slate-700 bg-gray-900 flex justify-between items-center">
        <h1 className="text-xl font-semibold">
          AI Developer Assistant
        </h1>

        <div className="flex gap-3">

          {/* Model Selector */}
          <select
            className="bg-slate-800 px-3 py-2 rounded hover:cursor-pointer"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          >
            <option value="openai">OpenAI</option>
            <option value="gemini">Gemini</option>
          </select>

          {/* Mode Selector */}
          <select
            className="bg-slate-800 px-3 py-2 rounded hover:cursor-pointer"
            value={mode}
            onChange={(e) => setMode(e.target.value)}
          >
            <option value="explain">Explain Code</option>
            <option value="debug">Debug Code</option>
            <option value="optimize">Optimize Code</option>
            <option value="complexity">Time & Space Complexity</option>
          </select>

        </div>
      </header>


      {/* Chat Area */}
      <main ref={chatRef} className="flex-1 p-4 overflow-y-auto space-y-4">

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-xl p-3 rounded-lg whitespace-pre-wrap ${msg.role === "assistant"
              ? "bg-slate-700 text-white mr-auto"
              : "bg-blue-600 text-white ml-auto"
              }`}
          >

            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");

                  // INLINE CODE
                  if (inline) {
                    return (
                      <code className="bg-gray-800 px-1 py-0.5 rounded text-green-300">
                        {children}
                      </code>
                    );
                  }

                  return (
                    <div className="relative group">
                      {/* Copy Button */}
                      <button
                        className="absolute right-2 top-2 bg-gray-700 text-white px-2 py-1 text-sm rounded opacity-0 group-hover:opacity-100 transition"
                        onClick={() => {
                          navigator.clipboard.writeText(String(children));
                          setCopiedIndex(idx);
                          setTimeout(() => setCopiedIndex(null), 2000);
                        }}
                      >
                        {copiedIndex === idx ? "Copied!" : "Copy"}
                      </button>


                      <SyntaxHighlighter
                        style={oneDark}
                        language={match ? match[1] : "text"}
                        PreTag="div"
                        className="rounded-lg overflow-x-auto"
                        {...props}
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    </div>
                  );
                },
              }}
            >
              {msg.content}
            </ReactMarkdown>




          </div>
        ))}

        {copiedIndex !== null && (
          <div
            className="
      fixed bottom-6 right-6 
      bg-green-600 text-white 
      px-4 py-2 rounded-lg shadow-lg
      transition-all duration-300 
      animate-slideUpFade
    "
          >
            Copied to clipboard!
          </div>
        )}



        {loading && <TypingIndicator />}

      </main>

      {/* Input Area */}
      <footer className="p-4 border-t border-slate-700 flex gap-2">
        <textarea
          value={input}
          onChange={(e) => {
            setInput(e.target.value);

            // Auto expand logic
            e.target.style.height = "auto";
            const limit = 200; // <- max height in px
            e.target.style.height =
              e.target.scrollHeight > limit
                ? limit + "px"
                : e.target.scrollHeight + "px";
          }}
          placeholder="Ask something..."
          className="flex-1 p-2 rounded bg-slate-800 outline-none resize-none overflow-y-auto"
          rows={1}
          style={{ maxHeight: "200px" }}   // safety max
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />




        <button
          disabled={loading}
          onClick={handleSend}
          className={`px-4 py-2 rounded hover:cursor-pointer hover:scale-105 ${loading ? "bg-gray-600" : "bg-blue-600 hover:bg-blue-700"
            }`}
        >
          {loading ? "Thinking..." : "Send"}
        </button>

      </footer>

    </div>
  );
}

export default App;
