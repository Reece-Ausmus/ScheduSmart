pipeline {
  agent any

  stages {
    stage('Build') {
      steps {
        sh 'echo Build'
        // frontend
        sh 'cd ./schedusmart-frontend'
        sh 'pwd'
        sh 'docker build -t schedusmart-frontend .'
        sh 'docker run -d --rm -p 5173:5173 --name schedusmart-frontend-container schedusmart-frontend'
        // backend
        sh 'cd ../schedusmart-backend'
        sh 'pwd'
        sh 'docker build -t schedusmart-backend .'
        sh 'docker run -d --rm -p 5000:5000 --name schedusmart-backend-container schedusmart-backend'
      }
    }
    stage('Test') {
      steps {
        sh 'echo Test'
        //sh 'docker run my-flask-app python -m pytest app/tests/'
      }
    }
    stage('Deploy') {
      steps {
        sh 'echo Deploy'
        //withCredentials([usernamePassword(credentialsId: "${DOCKER_REGISTRY_CREDS}", passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
        //  sh "echo \$DOCKER_PASSWORD | docker login -u \$DOCKER_USERNAME --password-stdin docker.io"
        //  sh 'docker push $DOCKER_BFLASK_IMAGE'
        //}
      }
    }
  }
  post { // ensure docker logout
    always {
      sh 'docker logout'
    }
  }
}