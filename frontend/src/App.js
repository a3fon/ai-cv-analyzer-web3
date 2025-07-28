import React, { useState, useCallback } from 'react';

// The URL of our Python backend server
const BACKEND_URL = 'http://127.0.0.1:5000';

// --- SVG Icons ---
const UploadIcon = () => (<svg className="upload-zone-icon" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>);
const ThumbsUpIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="icon-feedback icon-success" viewBox="0 0 20 20" fill="currentColor"><path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333V17a1 1 0 001 1h6.758a1 1 0 00.97-1.226l-2.433-6.11A1 1 0 0011.258 10H8a1 1 0 00-1-1v-1.417A1 1 0 006 6.917V5.5a1.5 1.5 0 013 0v1.586A1 1 0 0010.414 8H12a4 4 0 014 4v2.417A1 1 0 0017 15V17a2 2 0 01-2 2H7a2 2 0 01-2-2v-6.667z" /></svg>);
const WrenchIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="icon-feedback icon-danger" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-1.57 1.948A1.532 1.532 0 013.17 7.49c-1.56.38-1.56 2.6 0 2.98A1.532 1.532 0 014.6 12.758c.836 1.372-.734 2.942-1.948 1.57A1.532 1.532 0 017.49 16.83c.38 1.56 2.6 1.56 2.98 0a1.532 1.532 0 012.286-.948c1.372.836 2.942-.734 1.57-1.948A1.532 1.532 0 0116.83 12.51c1.56-.38 1.56-2.6 0-2.98A1.532 1.532 0 0115.4 7.242c-.836-1.372.734-2.942 1.948-1.57A1.532 1.532 0 0112.51 4.6c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286-.948zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>);
const LightbulbIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="icon-feedback icon-warning" viewBox="0 0 20 20" fill="currentColor"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM4.343 5.757a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM11 16a1 1 0 10-2 0v1a1 1 0 102 0v-1zM5.757 15.657a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM14.243 15.657a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM3 11a1 1 0 100-2H2a1 1 0 100 2h1zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zM9 4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zM10 15a1 1 0 01-1 1H9.01a1 1 0 110-2H10a1 1 0 011 1z" /><path d="M10 6a4 4 0 100 8 4 4 0 000-8zM6 10a4 4 0 118 0 4 4 0 01-8 0z" /></svg>);

// --- New Components ---
const Header = () => (
    <header className="app-header">
        <nav className="navbar">
            <div className="nav-logo">CV ANALYZER</div>
            <div className="nav-links">
                <a href="#/" className="nav-link">Web3 Jobs</a>
                <a href="#/" className="nav-link">Salaries</a>
                <a href="#/" className="nav-link">Learn Web3</a>
            </div>
            <div className="nav-actions">
                <button className="nav-button-secondary">Login</button>
                <button className="nav-button-primary">Post a Job</button>
            </div>
        </nav>
        <div className="header-content">
            <h1>AI JOBS IN WEB3</h1>
            <p>Upload your CV to get instant feedback and discover relevant job opportunities in the Web3 space.</p>
        </div>
    </header>
);

const JobCard = ({ job }) => {
    const initial = job.company ? job.company.charAt(0).toUpperCase() : 'W';
    return (
        <div className="job-card">
            <div className="job-card-header">
                <div className="job-card-logo">{initial}</div>
                <div className="job-card-title-group">
                    <h4 className="job-card-title">{job.title}</h4>
                    <p className="job-card-company">{job.company}</p>
                </div>
            </div>
            <p className="job-card-location">{job.location}</p>
            <div className="job-card-tags">
                {job.tags.map(tag => (<span key={tag} className="job-card-tag">{tag}</span>))}
            </div>
        </div>
    );
};

const ScoreBar = ({ label, score }) => (
    <div className="score-bar-container">
        <div className="score-bar-labels">
            <span className="score-bar-label">{label}</span>
            <span className="score-bar-value">{score}/100</span>
        </div>
        <div className="score-bar-background">
            <div className="score-bar-foreground" style={{ width: `${score}%` }}></div>
        </div>
    </div>
);

// --- Main App Component ---
export default function App() {
  const [resumeFile, setResumeFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = useCallback((event) => {
    const file = event.target.files[0];
    if (file) { setResumeFile(file); setFileName(file.name); setError(''); setAnalysisResult(null); }
  }, []);

  const handleAnalyze = async () => {
    if (!resumeFile) { setError('Please upload a resume to analyze.'); return; }
    setLoading(true); setError(''); setAnalysisResult(null);
    const formData = new FormData();
    formData.append('resume', resumeFile);
    try {
      const response = await fetch(`${BACKEND_URL}/analyze_cv`, { method: 'POST', body: formData });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || `Request failed with status ${response.status}`);
      setAnalysisResult(result);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred. Is the backend server running?');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = useCallback((event) => {
    event.preventDefault(); event.stopPropagation(); setIsDragOver(false);
    const file = event.dataTransfer.files[0];
    if (file) { setResumeFile(file); setFileName(file.name); setError(''); setAnalysisResult(null); }
  }, []);

  const handleDragEvents = (event, isOver) => {
      event.preventDefault(); event.stopPropagation(); setIsDragOver(isOver);
  };

  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <div className="upload-card">
            <div
                className={`upload-zone ${isDragOver ? 'drag-over' : ''}`}
                onDrop={handleDrop} onDragOver={(e) => handleDragEvents(e, true)} onDragLeave={(e) => handleDragEvents(e, false)}
                onClick={() => document.getElementById('resume-upload').click()}
            >
                <input type="file" id="resume-upload" className="hidden-input" accept=".pdf,.docx" onChange={handleFileChange}/>
                <UploadIcon />
                <p className="upload-text">{fileName ? `File selected: ${fileName}` : 'Drag & drop your resume here'}</p>
                <p className="upload-hint">or click to upload (PDF or DOCX)</p>
            </div>
            <button onClick={handleAnalyze} disabled={loading || !resumeFile} className="button">
                {loading ? 'Analyzing...' : 'Analyze My CV'}
            </button>
        </div>

        {error && (<div className="error-box"><p className="error-title">Error</p><p>{error}</p></div>)}

        {loading ? (
            <div className="loader-container"><div className="loader"></div><p className="loader-text">Our AI career coach is reviewing your CV...</p></div>
        ) : analysisResult && (
            <div className="results-grid">
                <div className="feedback-column">
                    <div className="results-header">
                        <h2 className="section-title">Analysis Report</h2>
                        <button className="share-button" disabled>Share Report</button>
                    </div>
                    <div className="feedback-card">
                        <div className="score-breakdown">
                            <h3 className="feedback-title">Overall Score: {analysisResult.overallScore}</h3>
                            <ScoreBar label="Clarity" score={analysisResult.scoreBreakdown.clarity} />
                            <ScoreBar label="Impact" score={analysisResult.scoreBreakdown.impact} />
                            <ScoreBar label="Relevance" score={analysisResult.scoreBreakdown.relevance} />
                        </div>
                        <div className="summary-box"><p>{analysisResult.analysisSummary}</p></div>
                        <div className="feedback-group"><h3 className="feedback-title"><ThumbsUpIcon />Strengths</h3><ul className="improvements-list">{analysisResult.strengths.map((item, index) => (<li key={index}>{item}</li>))}</ul></div>
                        <div className="feedback-group"><h3 className="feedback-title"><WrenchIcon />Areas for Improvement</h3><ul className="improvements-list improvements-list-danger">{analysisResult.improvements.map((item, index) => (<li key={index}>{item}</li>))}</ul></div>
                        <div className="feedback-group"><h3 className="feedback-title"><LightbulbIcon />Skill Gap</h3><ul className="improvements-list improvements-list-warning">{analysisResult.skillGap.map((item, index) => (<li key={index}>{item}</li>))}</ul></div>
                         <div className="button-container"><button className="button-secondary" disabled>Generate Cover Letter</button></div>
                    </div>
                </div>
                <div className="jobs-column">
                    <h2 className="section-title">Suggested Jobs</h2>
                    <div className="jobs-list">{analysisResult.suggestedJobs.map((job, index) => (<JobCard key={index} job={job} />))}</div>
                </div>
            </div>
        )}
      </main>
    </div>
  );
}
