pipeline {
  agent any

  stages {
    stage('Build') {
      steps {
        sh 'echo Build'
        // backend
        dir('schedusmart-backend'){
          sh 'pwd'
          sh 'docker build -t schedusmart-backend .'
        }

        // frontend
        dir('schedusmart-frontend'){
          sh 'pwd'
          sh 'docker build -t schedusmart-frontend .'
        }
      }
    }
    stage('Test') {
      steps {
        sh 'echo Test'

        dir('schedusmart-backend'){
          sh 'docker run -d --rm -p 5000:5000 --name schedusmart-backend-container schedusmart-backend'
        }

        dir('schedusmart-frontend'){
          // jtest for interactive web tours
          sh 'docker run -d --rm -p 5173:5173 --name schedusmart-frontend-container schedusmart-frontend'
          sh 'npm run test'
        }
      }
    }
    stage('Deploy') {
      steps {
        sh 'echo Deploy'

        dir('schedusmart-backend'){
          sh 'docker run -d --rm -p 5000:5000 --name schedusmart-backend-container schedusmart-backend'
        }

        dir('schedusmart-frontend'){
          // jtest for interactive web tours
          sh 'docker run -d --rm -p 5173:5173 --name schedusmart-frontend-container schedusmart-frontend'
          sh 'npm run test'
        }

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