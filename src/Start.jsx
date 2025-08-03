import { Link } from "react-router-dom";

export default function Start() {
  return (
    <>
      <div className="min-h-screen px-6 py-10 flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Get Ready to Rehance Your Resume ⚡
        </h1>

        <p className="text-gray-700 max-w-2xl text-lg mb-12">
          Whether you're aiming to fine-tune your existing resume or craft a
          brand-new one from scratch, Rehancer is here to guide you. Choose a
          path below: analyze and improve your current resume, or let our
          builder help you create a standout resume tailored to your dream job.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl w-full">
          {/* Analyze Card */}
          <div className="group bg-white/80 border border-transparent rounded-2xl shadow-xl p-8 backdrop-blur-md relative overflow-hidden transition hover:scale-105 hover:border-green-500 hover:shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-tr from-green-100 via-transparent to-white opacity-40 pointer-events-none"></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              📊 Resume Analyzer
            </h2>
            <p className="text-gray-600 text-md mb-6">
              Upload your resume and let our AI scan, analyze, and enhance it
              based on your dream job. You'll get tailored feedback in seconds.
            </p>
            <Link
              to="/rehancer/analyze"
              className="inline-block bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-full transition"
            >
              Go
            </Link>
          </div>

          {/* Builder Card */}
          <div className="group bg-white/80 border border-transparent rounded-2xl shadow-xl p-8 backdrop-blur-md relative overflow-hidden transition hover:scale-105 hover:border-green-500 hover:shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-tr from-green-100 via-transparent to-white opacity-40 pointer-events-none"></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              🛠️ Resume Builder
            </h2>
            <p className="text-gray-600 text-md mb-6">
              Start fresh with our guided builder. It walks you step-by-step
              through crafting a polished resume tailored to your job goals.
            </p>
            <button
              onClick={() => alert("Resume Builder coming soon!")}
              className="inline-block bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-full transition"
            >
              Go
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
