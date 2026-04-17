FROM python:3.11-slim

RUN useradd -m -u 1000 sandbox

WORKDIR /sandbox

USER sandbox

CMD ["python", "-c", "import sys; exec(sys.stdin.read())"]