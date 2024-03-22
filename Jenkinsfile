pipeline {
  agent any

  stages {
    stage('Build') {
      steps {
        sh 'echo Build'
        sh 'docker-compose build --no-cache'
      }
    }
    stage('Test') {
      steps {
        sh 'echo Test'
        sh 'docker-compose up -d'
      }
    }
    stage('Deploy') {
      steps {
        sh 'echo Deploy'
        sh 'docker-compose down'

        // docker login 
        //withCredentials([usernamePassword(credentialsId: passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
        //  sh "echo \$DOCKER_PASSWORD | docker login -u \$DOCKER_USERNAME --password-stdin docker.io"
        //}

        // push images to docker repository
        sh 'docker tag schedusmart-backend ${DOCKER_HUB}/${REPO_NAME}:backend'
        sh 'docker push ${DOCKER_HUB}/${REPO_NAME}:backend'

        sh 'docker tag schedusmart-frontend ${DOCKER_HUB}/${REPO_NAME}:frontend'
        sh 'docker push ${DOCKER_HUB}/${REPO_NAME}:frontend'
      }
    }
  }
}