pipeline {
  agent any

  stages {
    stage('Build') {
      steps {
        sh 'echo Build'
        //sh 'docker build -t my-flask-app .'
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
}