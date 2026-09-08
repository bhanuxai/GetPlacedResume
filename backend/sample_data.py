SAMPLE_RESUME_TEXT = """ALEX CHEN
San Francisco, CA | (555) 382-9102 | alex.chen@email.com
linkedin.com/in/alexchen-ai | github.com/alexchen-ml

PROFESSIONAL SUMMARY
Machine Learning Practitioner and Software Engineer with hands-on experience building, fine-tuning, and evaluating transformer-based NLP pipelines, tabular predictive models, and scalable REST APIs.

EDUCATION
University of California, Berkeley — Bachelor of Science in Computer Science
Graduated: May 2024 | GPA: 3.82 / 4.00
Relevant Coursework: Natural Language Processing, Deep Learning, Distributed Systems, Algorithms, Database Systems

TECHNICAL SKILLS
Languages: Python, SQL, C++, TypeScript, Bash
Frameworks & Libraries: PyTorch, Hugging Face Transformers, Scikit-learn, Pandas, NumPy, FastAPI, Flask
Data & Cloud: PostgreSQL, Redis, Docker, Git, AWS (S3, EC2 - familiar)
Concepts: Semantic Search, Vector Embeddings, LLM Fine-Tuning, CI/CD, Model Evaluation

WORK EXPERIENCE
Applied AI Research Lab — Machine Learning Intern
Berkeley, CA | June 2023 – August 2023
• Built a transformer-based text classification system using PyTorch and Hugging Face to categorize 250,000+ unstructured scientific documents, achieving a 93.4% F1-score.
• Developed an automated data preprocessing and tokenization pipeline in Python, reducing model training preparation time by 38%.
• Benchmarked multiple embedding models against benchmark datasets and optimized batch inference latency from 140ms to 42ms per request.
• Collaborated with senior researchers to deploy an internal evaluation dashboard using FastAPI and Docker.

PROJECTS
Semantic Resume & Document Search Engine | Python, PyTorch, FAISS, FastAPI
• Engineered a dense vector retrieval system converting resume documents and job requirements into 384-dimensional embeddings.
• Implemented FAISS cosine similarity indexing across 50,000 candidate profiles with sub-15ms retrieval latency.
• Created a RESTful API with FastAPI and integrated Redis for caching repeated queries, improving throughput by 45%.

Financial Sentiment Analyzer | Python, Scikit-learn, Pandas, Streamlit
• Developed an end-to-end sentiment classification model using Random Forest and TF-IDF on 80,000 financial news headlines, reaching 89% accuracy.
• Engineered text cleaning features with regex, tokenization, and stop-word filtering to eliminate dataset noise.
• Deployed interactive web dashboard enabling real-time sentiment scoring for streaming market feeds.

AI Chatbot Interface | Python, React, Flask
• Worked on machine learning project.
• Responsible for developing website and backend API.
• Helped with database integration and testing.

CERTIFICATIONS & AWARDS
• Deep Learning Specialization (Coursera / DeepLearning.AI)
• UC Berkeley EECS Honors Program
"""

SAMPLE_JOB_DESCRIPTIONS = {
    "ml_engineer": """Machine Learning Engineer - NLP & LLM Applications
Company: NovaAI Technologies
Location: San Francisco, CA (Hybrid)

About the Role:
We are seeking a Machine Learning Engineer to join our Core Intelligence team. In this role, you will design, train, and deploy production-ready NLP and machine learning systems that power semantic understanding across millions of enterprise documents.

Required Qualifications:
• Bachelor's or Master's degree in Computer Science, Data Science, or related STEM field.
• 1+ years of practical experience developing NLP applications, transformer models, or text processing systems.
• Strong proficiency in Python, PyTorch or TensorFlow, and Scikit-learn.
• Hands-on experience building and deploying machine learning pipelines and REST APIs (FastAPI or Flask).
• Experience with vector embeddings, semantic search, and similarity metrics (cosine similarity, FAISS).
• Proficiency in SQL and database design (PostgreSQL).

Preferred Qualifications:
• Hands-on experience deploying models to cloud infrastructure (AWS S3, EC2, SageMaker).
• Familiarity with containerization using Docker and Kubernetes.
• Track record of quantifying model performance and latency optimizations in production environments.
• Experience with LLM prompt engineering, RAG architectures, and fine-tuning.

Responsibilities:
• Architect, train, and benchmark NLP models for classification, information extraction, and semantic matching.
• Collaborate with backend engineers to integrate ML microservices into scalable production pipelines.
• Drive rigorous evaluation frameworks measuring accuracy, latency, and operational cost.
""",
    "data_analyst": """Data Analyst / BI Specialist
Company: Apex Analytics
Location: Remote

About the Role:
We are looking for a Data Analyst to transform complex business datasets into actionable intelligence and strategic dashboards.

Requirements:
• Bachelor's degree in Computer Science, Statistics, Mathematics, or Business.
• 2+ years experience in quantitative data analysis, SQL querying, and relational database management.
• Advanced proficiency in Python or R for statistical data manipulation (Pandas, NumPy).
• Experience building interactive dashboards using Tableau, Power BI, or Streamlit.
• Solid understanding of exploratory data analysis, hypothesis testing, and regression modeling.

Preferred:
• Experience with cloud data warehouses (Snowflake, BigQuery).
• Familiarity with automated ETL workflows and dbt.
• Strong business communication skills and executive reporting experience.
""",
    "fullstack_engineer": """Full Stack Software Engineer
Company: CloudPulse Systems
Location: San Francisco, CA

About the Role:
Seeking a Full Stack Engineer to architect modern responsive web applications and resilient microservices.

Requirements:
• 2+ years experience building web applications with TypeScript, React, and modern CSS.
• Solid backend development skills in Python (FastAPI/Django) or Node.js.
• Experience with relational databases (PostgreSQL) and caching layers (Redis).
• Familiarity with Docker containerization and Git workflows.

Preferred:
• Experience with cloud deployments on AWS or GCP.
• Understanding of automated testing, CI/CD pipelines, and web performance optimization.
"""
}
