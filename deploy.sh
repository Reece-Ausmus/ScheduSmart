#!/bin/bash

docker pull schedusmart/jenkins_deploy:backend
docker pull schedusmart/jenkins_deploy:frontend
docker run -d --rm -p 5000:5000 --name schedusmart-backend-container schedusmart/jenkins_deploy:backend
docker run -d --rm -p 5173:5173 --name schedusmart-frontend-container schedusmart/jenkins_deploy:frontend