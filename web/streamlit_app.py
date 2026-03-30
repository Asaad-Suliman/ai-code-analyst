"""
Streamlit UI — STUB
=====================
Owner: Abdulkadir
Status: STUB — basic layout. Build full UI with results display.

Run with: streamlit run web/streamlit_app.py
"""

import streamlit as st
import requests
import json

API_URL = "http://localhost:8000"

st.set_page_config(page_title="AI Code Analyst", layout="wide")
st.title("AI Code Performance & Debugging Analyst")
st.markdown("Paste your Python code below. We'll find bugs, measure performance, optimize it, and **prove** the improvement.")

# ─── Code Input ──────────────────────────────────────────

source_code = st.text_area(
    "Your Python Code",
    height=300,
    placeholder="def slow_function():\n    ...",
)

description = st.text_input(
    "What does this code do? (optional)",
    placeholder="Finds duplicate items in a list",
)

# ─── Analyze Button ──────────────────────────────────────

if st.button("Analyze Code", type="primary", disabled=not source_code.strip()):
    with st.spinner("Running full analysis pipeline..."):
        try:
            response = requests.post(
                f"{API_URL}/analyze",
                json={
                    "source_code": source_code,
                    "description": description or None,
                },
                timeout=60,
            )
            
            if response.status_code == 200:
                report = response.json()
                
                # TODO (Abdulkadir): Build beautiful results display
                # For now, show raw JSON
                
                st.success("Analysis complete!")
                
                col1, col2 = st.columns(2)
                
                with col1:
                    st.subheader("Bug Report")
                    st.json(report.get("bug_report", {}))
                    
                    st.subheader("Performance")
                    st.json(report.get("performance_report", {}))
                
                with col2:
                    st.subheader("Optimized Code")
                    st.code(report.get("optimized_code", ""), language="python")
                    
                    st.subheader("Validation")
                    st.json(report.get("validation", {}))
                
                st.subheader("Overall Summary")
                st.info(report.get("overall_summary", ""))
                
            else:
                st.error(f"API error: {response.status_code} - {response.text}")
                
        except requests.exceptions.ConnectionError:
            st.error("Cannot connect to API. Make sure FastAPI is running on port 8000.")
        except Exception as e:
            st.error(f"Error: {str(e)}")
