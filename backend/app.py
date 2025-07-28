from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import docx
import PyPDF2
import os
import json

# --- Configuration ---
FALLBACK_API_KEY = "AIzaSyCrX8DPBAy0PbkvO6x7WXfW582CtwRYXRw"
API_KEY = os.getenv("GOOGLE_API_KEY", FALLBACK_API_KEY)
MODEL_NAME = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")

# --- Flask App Initialization ---
app = Flask(__name__)
CORS(app)


# --- Helper Functions for Text Extraction ---
def get_text_from_docx(file_stream):
    try:
        doc = docx.Document(file_stream)
        return '\n'.join([para.text for para in doc.paragraphs])
    except Exception as e:
        print(f"Error reading DOCX stream: {e}")
        return None


def get_text_from_pdf(file_stream):
    try:
        pdf_reader = PyPDF2.PdfReader(file_stream)
        return '\n'.join([page.extract_text() for page in pdf_reader.pages])
    except Exception as e:
        print(f"Error reading PDF stream: {e}")
        return None


# --- Core AI Analysis Function ---
def analyze_with_gemini(resume_text):
    """Analyzes a resume for quality and provides a detailed breakdown."""
    if not API_KEY or API_KEY == "PASTE_YOUR_API_KEY_HERE":
        raise ValueError(
            "API key is not configured. Please set the GOOGLE_API_KEY environment variable or paste it into the FALLBACK_API_KEY in app.py.")

    try:
        genai.configure(api_key=API_KEY)

        # --- UPDATED SCHEMA for a more detailed analysis ---
        generation_config = genai.GenerationConfig(
            response_mime_type="application/json",
            response_schema={
                "type": "object",
                "properties": {
                    "overallScore": {"type": "number"},
                    "scoreBreakdown": {
                        "type": "object",
                        "properties": {
                            "clarity": {"type": "number"},
                            "impact": {"type": "number"},
                            "relevance": {"type": "number"}
                        }
                    },
                    "analysisSummary": {"type": "string"},
                    "strengths": {"type": "array", "items": {"type": "string"}},
                    "improvements": {"type": "array", "items": {"type": "string"}},
                    "skillGap": {"type": "array", "items": {"type": "string"}},
                    "suggestedJobs": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "title": {"type": "string"},
                                "company": {"type": "string"},
                                "location": {"type": "string"},
                                "tags": {"type": "array", "items": {"type": "string"}}
                            },
                            "required": ["title", "company", "location", "tags"]
                        }
                    }
                },
                "required": ["overallScore", "scoreBreakdown", "analysisSummary", "strengths", "improvements",
                             "skillGap", "suggestedJobs"]
            }
        )

        # --- UPDATED PROMPT to request the detailed breakdown ---
        prompt = f"""
            You are an expert career coach and talent scout specializing in Web3, AI, and decentralized technology. Your goal is to provide a comprehensive, constructive review of the provided resume.

            Analyze the resume based on best practices. Provide your detailed analysis in the following JSON format:

            {{
              "overallScore": "A numerical score from 0-100 representing the resume's overall quality.",
              "scoreBreakdown": {{
                  "clarity": "A score from 0-100 on how clear and easy to read the resume is.",
                  "impact": "A score from 0-100 on how well the resume demonstrates achievements with metrics and strong action verbs.",
                  "relevance": "A score from 0-100 on how relevant the skills and experience are to the modern Web3/AI job market."
              }},
              "analysisSummary": "A brief, 2-3 sentence summary of the resume's quality.",
              "strengths": "A list of 2-3 specific things the resume does well.",
              "improvements": "A list of 2-3 actionable suggestions for improvement.",
              "skillGap": "A list of 3-5 key skills or technologies relevant to the suggested jobs that seem to be missing from the resume.",
              "suggestedJobs": "A list of 3-4 specific, creative Web3/AI job opportunities, each with a 'title', 'company', 'location', and 'tags'."
            }}

            --- RESUME START ---
            {resume_text}
            --- RESUME END ---
        """

        model = genai.GenerativeModel(MODEL_NAME, generation_config=generation_config)
        response = model.generate_content(prompt)

        return json.loads(response.text)

    except Exception as e:
        print(f"An error occurred during Gemini API call: {e}")
        raise


# --- API Endpoint ---
@app.route('/analyze_cv', methods=['POST'])
def analyze_cv():
    if 'resume' not in request.files:
        return jsonify({"error": "No resume file provided"}), 400
    resume_file = request.files['resume']
    if resume_file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    try:
        if resume_file.mimetype == 'application/pdf':
            resume_text = get_text_from_pdf(resume_file.stream)
        elif resume_file.mimetype == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            resume_text = get_text_from_docx(resume_file.stream)
        else:
            return jsonify({"error": "Unsupported file type. Please use PDF or DOCX."}), 415
        if not resume_text:
            return jsonify({"error": "Could not extract text from the resume."}), 500
    except Exception as e:
        return jsonify({"error": f"Failed to process file: {str(e)}"}), 500
    try:
        print(f"Analyzing CV with model: {MODEL_NAME}")
        analysis_result = analyze_with_gemini(resume_text)
        return jsonify(analysis_result)
    except ValueError as e:
        return jsonify({"error": str(e)}), 500
    except Exception as e:
        return jsonify({"error": f"An error occurred during AI analysis: {str(e)}"}), 500


# --- Main execution ---
if __name__ == '__main__':
    app.run(debug=True, port=5000)
