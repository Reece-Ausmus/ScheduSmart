// space insufficient debug: docker system prune
pipeline {
  agent any

  stages {
    stage('Build') {
      environment {
        GPT_API = credentials('GPT_API_CONFIG_FILE')
        FIREBASE_CONFIG = credentials('FIREBASE_CONFIG')
      }
      steps {
        sh 'echo Build'
        sh 'docker-compose build --no-cache'
        //sh 'cat $GPT_API'
        //sh 'cat $FIREBASE_CONFIG'
        sh 'chown -R root:jenkins ./schedusmart-frontend/src/components'
        sh 'cp $GPT_API ./schedusmart-frontend/src/components/gpt.api.config'
        sh 'chown -R root:jenkins ./schedusmart-backend'
        sh 'cp $FIREBASE_CONFIG ./schedusmart-backend/firebaseConfig.py'

        dir("schedusmart-frontend"){
          sh 'npm install --force'
        }
        dir("schedusmart-backend"){
          sh 'pip install -r requirements.txt'
        }
      }
    }
    stage('Test') {
      steps {
        sh 'echo Test'

        catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
          dir("schedusmart-frontend"){
            sh 'npm run test'
          }

          dir("schedusmart-backend"){
            sh 'pytest'
          }

          sh 'docker-compose up -d'
          sh 'docker-compose down'
        }
    
      }
    }
    stage('Deploy') {
      steps {
        sh 'echo Deploy'

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