# docker build -t schedusmart-backend .
# docker run -d -p 5000:5000 --name schedusmart-backend-container schedusmart-backend

FROM python:3.9.2-slim

WORKDIR /usr/src/app

# install dependencies
COPY ./requirements.txt /usr/src/app/requirements.txt
RUN pip install -r requirements.txt

COPY . /usr/src/app

EXPOSE 5000

CMD flask --app server.py run --host=0.0.0.0