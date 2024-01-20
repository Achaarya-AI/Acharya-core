FROM python:3.8-slim

WORKDIR /app

COPY . /app

# Install Git
RUN apt-get update && apt-get install -y git

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
