import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Start from "./Start";
import Analyze from "./Analyze";

function Home() {
  return (
    <>
      <div className="min-h-screen flex flex-col justify-center items-center text-center px-4">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">
          Welcome to Rehancer!
        </h1>

        <p className="text-lg text-gray-700 max-w-xl mb-8">
          A 1-day project, that aims to help you achieve the{" "}
          <span className="text-green-600 font-semibold">best</span> resume
          <br />
          that you can submit to any HR department ⚡
        </p>

        <Link
          to="/start"
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-full text-lg transition"
        >
          Get started
        </Link>
      </div>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/rehancer" element={<Home />} />
        <Route path="/start" element={<Start />} />
        <Route path="/analyze" element={<Analyze />} />
        <Route path="/builder" />
      </Routes>
    </Router>
  );
}
