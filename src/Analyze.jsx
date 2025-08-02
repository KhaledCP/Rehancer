import { useState } from "react";
import OpenAI from "openai";
import * as pdfjsLib from "pdfjs-dist";
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

const client = new OpenAI({
  apiKey:
    "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",
  dangerouslyAllowBrowser: true,
});

export default function Analyze() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (selectedFile) => {
    if (
      selectedFile &&
      (selectedFile.type === "application/pdf" ||
        selectedFile.name.endsWith(".pdf"))
    ) {
      setFile(selectedFile);
    } else {
      alert("Please upload a PDF file only.");
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!file || !jobDescription.trim()) {
      alert("Please upload your resume and enter a job description.");
      return;
    }

    setIsAnalyzing(true);

    function generateResumeAnalysisPrompt(resumeText, jobDescription) {
      return `You are an expert resume analyst and career coach. Please analyze the following resume against the provided job description and return your analysis in the exact JSON format specified below.

**RESUME CONTENT:**
${resumeText}

**TARGET JOB DESCRIPTION:**
${jobDescription}

**ANALYSIS REQUIREMENTS:**
Please provide a comprehensive analysis and return ONLY a valid JSON object with the following structure (no additional text, explanations, or formatting):

{
  "score": [number between 0-100],
  "strengths": [
    "strength 1",
    "strength 2",
    "strength 3"
  ],
  "improvements": [
    "improvement suggestion 1",
    "improvement suggestion 2",
    "improvement suggestion 3"
  ],
  "keywords": [
    "keyword1",
    "keyword2",
    "keyword3",
    "keyword4",
    "keyword5"
  ],
  "detailedFeedback": {
    "technicalSkills": "Brief assessment of technical skills alignment",
    "experience": "Brief assessment of experience relevance",
    "formatting": "Brief assessment of resume formatting and structure",
    "achievements": "Brief assessment of quantifiable achievements"
  },
  "missingKeywords": [
    "missing keyword 1",
    "missing keyword 2",
    "missing keyword 3"
  ],
  "atsOptimization": "Brief suggestion for ATS optimization"
}

**SCORING CRITERIA:**
- Technical skills match: 30%
- Experience relevance: 25%  
- Keywords presence: 20%
- Achievements/quantifiable results: 15%
- ATS-friendly formatting: 10%

Ensure the JSON is valid and parseable. Focus on actionable, specific feedback. If the resume content text is Arabic respond in Arabic, if not then in English. Do not add the JSON stylizer.`;
    }

    async function extractTextFromPDF(file) {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;

      let fullText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item) => item.str).join(" ");
        fullText += pageText + " ";
      }

      return fullText;
    }

    const analyzeResume = async (file, jobDescription) => {
      try {
        const resumeText = await extractTextFromPDF(file);

        const prompt = generateResumeAnalysisPrompt(resumeText, jobDescription);

        const response = await client.responses.create({
          model: "gpt-4o-mini",
          input: prompt,
        });

        const analysisResult = JSON.parse(response.output_text);

        return analysisResult;
      } catch (error) {
        console.error("Analysis failed:", error);
        return null;
      }
    };

    analyzeResume(file, jobDescription)
      .then((res) => {
        setAnalysis(res);
        setIsAnalyzing(false);
      })
      .catch((err) => console.log(err));
  };

  const resetAnalysis = () => {
    setFile(null);
    setJobDescription("");
    setAnalysis(null);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen px-6 py-10">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Resume Analyzer 📊
        </h1>
        <p className="text-gray-700 max-w-2xl mx-auto text-lg">
          Upload your resume and paste the job description you're targeting. Our
          AI will analyze your resume and provide personalized feedback.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        {!analysis ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* File Upload Section */}
            <div className="bg-white/80 border border-transparent rounded-2xl shadow-xl p-8 backdrop-blur-md relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-green-100 via-transparent to-white opacity-40 pointer-events-none"></div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Upload Your Resume
              </h2>

              <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition ${
                  dragActive
                    ? "border-green-500 bg-green-50"
                    : file
                    ? "border-green-300 bg-green-50"
                    : "border-gray-300 hover:border-green-400"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {file ? (
                  <div className="text-green-600">
                    <div className="text-4xl mb-2">📄</div>
                    <p className="font-semibold">{file.name}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <button
                      onClick={() => setFile(null)}
                      className="mt-2 text-red-500 hover:text-red-600 text-sm"
                    >
                      Remove file
                    </button>
                  </div>
                ) : (
                  <div className="text-gray-500">
                    <div className="text-4xl mb-2">📁</div>
                    <p className="mb-2">Drag & drop your resume here</p>
                    <p className="text-sm mb-4">or</p>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => handleFileChange(e.target.files[0])}
                      className="hidden"
                      id="resume-upload"
                    />
                    <label
                      htmlFor="resume-upload"
                      className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-full cursor-pointer transition"
                    >
                      Browse Files
                    </label>
                    <p className="text-xs text-gray-400 mt-2">PDF files only</p>
                  </div>
                )}
              </div>
            </div>

            {/* Job Description Section */}
            <div className="bg-white/80 border border-transparent rounded-2xl shadow-xl p-8 backdrop-blur-md relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-green-100 via-transparent to-white opacity-40 pointer-events-none"></div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Target Job Description
              </h2>

              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description you're applying for here..."
                className="w-full h-64 p-4 border border-gray-300 rounded-xl resize-none focus:border-green-500 focus:outline-none transition"
              />

              <p className="text-sm text-gray-500 mt-2">
                {jobDescription.length} characters
              </p>
            </div>
          </div>
        ) : (
          /* Analysis Results */
          <div className="space-y-8">
            {/* Score Section */}
            <div className="bg-white/80 border border-transparent rounded-2xl shadow-xl p-8 backdrop-blur-md relative overflow-hidden text-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-green-100 via-transparent to-white opacity-40 pointer-events-none"></div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Your Resume Score
              </h2>
              <div className="text-6xl font-bold text-green-600 mb-2">
                {analysis.score}%
              </div>
              <p className="text-gray-600">Match with target job</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Strengths */}
              <div className="bg-white/80 border border-transparent rounded-2xl shadow-xl p-8 backdrop-blur-md relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-green-100 via-transparent to-white opacity-40 pointer-events-none"></div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  ✅ Strengths
                </h3>
                <ul className="space-y-2">
                  {analysis.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      <span className="text-gray-700">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Improvements */}
              <div className="bg-white/80 border border-transparent rounded-2xl shadow-xl p-8 backdrop-blur-md relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-green-100 via-transparent to-white opacity-40 pointer-events-none"></div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  🔧 Areas for Improvement
                </h3>
                <ul className="space-y-2">
                  {analysis.improvements.map((improvement, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-orange-500 mr-2">•</span>
                      <span className="text-gray-700">{improvement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Keywords */}
            <div className="bg-white/80 border border-transparent rounded-2xl shadow-xl p-8 backdrop-blur-md relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-green-100 via-transparent to-white opacity-40 pointer-events-none"></div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                🔑 Key Skills Found
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysis.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="text-center mt-12">
          {!analysis ? (
            <button
              onClick={handleAnalyze}
              disabled={!file || !jobDescription.trim() || isAnalyzing}
              className={`${
                !file || !jobDescription.trim() || isAnalyzing
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600"
              } text-white font-semibold py-3 px-8 rounded-full text-lg transition`}
            >
              {isAnalyzing ? "Analyzing... ⚡" : "Analyze My Resume ⚡"}
            </button>
          ) : (
            <div className="space-x-4">
              <button
                onClick={resetAnalysis}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-full text-lg transition"
              >
                Analyze Another Resume
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-full text-lg transition"
                onClick={() => alert("Resume Builder coming soon!")}
              >
                Use Resume Builder
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
