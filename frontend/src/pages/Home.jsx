import React, { useState } from "react";
import axios from "axios";

const Home = () => {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyzeText = async () => {
    if (!text.trim()) {
      setError("Please enter some text first.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setResult(null);

      const res = await axios.post("http://localhost:5000/api/text", { text });

      if (res.data) {
        setResult(res.data);
      } else {
        setError("Invalid response from AI server.");
      }
    } catch (err) {
      console.error("Error during text analysis:", err);
      setError("Text analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const analyzeImage = async () => {
    if (!image) {
      setError("Please select an image first.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setResult(null);

      const formData = new FormData();
      formData.append("image", image);

      const res = await axios.post(
        "http://localhost:5000/api/image",
        formData
      );

      if (res.data) {
        setResult(res.data);
      } else {
        setError("Invalid response from AI server.");
      }
    } catch (err) {
      setError("Image analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 md:p-10 text-white">

        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
          🧠 Fake News Detector
        </h1>

        <div className="grid md:grid-cols-2 gap-8">

          {/* TEXT SECTION */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Text Analysis</h3>
            <textarea
              rows="5"
              placeholder="Paste news text here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full p-3 rounded-lg bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400 mb-3"
            />
            <button
              onClick={analyzeText}
              className="w-full py-2 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-600 hover:scale-105 transition transform duration-200 font-semibold"
            >
              Analyze Text
            </button>
          </div>

          {/* IMAGE SECTION */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Image Analysis</h3>

            <label
              htmlFor="fileUpload"
              className="w-full h-[140px] flex flex-col items-center justify-center 
              rounded-lg border-2 border-dashed border-white/40 
              bg-white/10 cursor-pointer 
              hover:bg-white/20 transition duration-300 text-center p-4"
            >
              {image ? (
                <p className="text-green-400 font-medium">
                  ✅ {image.name}
                </p>
              ) : (
                <>
                  <p className="text-lg font-semibold">Click to Upload Image</p>
                  <p className="text-sm text-gray-300 mt-1">
                    JPG, PNG supported
                  </p>
                </>
              )}
            </label>

            <input
              id="fileUpload"
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="hidden"
            />

            <button
              onClick={analyzeImage}
              className="w-full mt-3 py-2 rounded-lg bg-gradient-to-r from-purple-400 to-pink-600 hover:scale-105 transition transform duration-200 font-semibold"
            >
              Analyze Image
            </button>
          </div>
        </div>

        {/* RESULT SECTION */}
        <div className="mt-10">

          {loading && (
            <div className="text-center text-blue-400 animate-pulse">
              🔍 AI is analyzing...
            </div>
          )}

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-400 p-4 rounded-xl text-center">
              ❌ {error}
            </div>
          )}

          {result && (
            <div className="bg-black/40 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-xl">

              <h2 className="text-2xl font-bold mb-4 text-center">
                🧠 AI Detection Result
              </h2>

              {/* Percentage */}
              <div className="flex flex-col items-center mb-4">
                <div
                  className={`text-4xl font-extrabold ${
                    result.fakeProbability > 50
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {result.fakeProbability}%
                </div>

                <p className="text-gray-300 mt-2">
                  {result.fakeProbability > 50
                    ? "Likely Genuine News ✅"
                    : "Likely Fake News 🚨"}
                </p>
              </div>

              {/* Explanation */}
              <div className="bg-white/10 p-4 rounded-xl text-gray-200">
                {result.explanation ||
                  "AI analyzed the content successfully."}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Home;