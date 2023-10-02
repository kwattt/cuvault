# python flask app
FROM python:3.11-slim-bullseye

# Create app directory
WORKDIR /app 
# Install app dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Bundle app source
COPY . .

# gunicorn run server.py 
CMD [ "gunicorn", "-b", "0.0.0.0:8080", "server:app" ]