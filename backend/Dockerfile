FROM python:3.9-alpine

WORKDIR /app

# Install system dependencies for postgresql
RUN apk add --no-cache postgresql-libs && \
    apk add --no-cache --virtual .build-deps gcc musl-dev postgresql-dev

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt && \
    apk del .build-deps

COPY . .

EXPOSE 5000

CMD ["sh", "-c", "python init_db.py && gunicorn --bind 0.0.0.0:5000 app:app"]
