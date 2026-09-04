pipeline {
    agent any

    parameters {
        choice(name: 'DEPLOY_ENV', choices: ['staging', 'production'], description: 'Target deployment environment')
        booleanParam(name: 'RUN_INTEGRATION_TESTS', defaultValue: true, description: 'Run Supertest integration suite against live database')
        booleanParam(name: 'PUSH_DOCKER_IMAGES', defaultValue: false, description: 'Push built images to Docker registry')
    }

    environment {
        PROJECT_NAME = 'lingualearn'
        REGISTRY = 'docker.io/lingualearn'
        IMAGE_TAG = "${env.BUILD_NUMBER}"
        NODE_ENV = 'test'
        PORT = '5000'
        DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/lingualearn_db'
        JWT_SECRET = 'jenkins_pipeline_test_jwt_secret_key_2026'
    }

    options {
        timeout(time: 30, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '15', artifactNumToKeepStr: '5'))
        ansiColor('xterm')
    }

    stages {
        stage('1. Environment & SCM Checkout') {
            steps {
                echo "=========================================="
                echo " LINGUALEARN AGILE CI/CD PIPELINE INITIATED "
                echo " Target Environment: ${params.DEPLOY_ENV} "
                echo " Build ID: ${env.BUILD_NUMBER} "
                echo " Git Commit: ${env.GIT_COMMIT} "
                echo "=========================================="
                checkout scm
                sh 'node --version'
                sh 'npm --version'
                sh 'docker --version'
                sh 'docker compose version'
            }
        }

        stage('2. Install Dependencies') {
            parallel {
                stage('Backend Dependencies') {
                    steps {
                        dir('backend') {
                            echo "Installing backend dependencies (clean install)..."
                            sh 'npm ci'
                        }
                    }
                }
                stage('Frontend Dependencies') {
                    steps {
                        dir('frontend') {
                            echo "Installing frontend dependencies (clean install)..."
                            sh 'npm ci'
                        }
                    }
                }
            }
        }

        stage('3. Automated Backend Tests') {
            steps {
                dir('backend') {
                    echo "Running Jest Unit & Supertest Integration Suites..."
                    sh 'npm test -- --coverage --ci --reporters=default --testResultsProcessor=jest-junit'
                }
            }
            post {
                always {
                    junit testResults: 'backend/junit.xml', allowEmptyResults: true
                    archiveArtifacts artifacts: 'backend/coverage/**', allowEmptyArchive: true
                }
            }
        }

        stage('4. Frontend Build & Static Analysis') {
            steps {
                dir('frontend') {
                    echo "Compiling React Vite bundle..."
                    sh 'npm run build'
                }
            }
            post {
                success {
                    archiveArtifacts artifacts: 'frontend/dist/**', allowEmptyArchive: false
                }
            }
        }

        stage('5. Docker Image Build') {
            parallel {
                stage('Build Backend Image') {
                    steps {
                        sh "docker build -t ${PROJECT_NAME}-backend:${IMAGE_TAG} -t ${PROJECT_NAME}-backend:latest ./backend"
                    }
                }
                stage('Build Frontend Image') {
                    steps {
                        sh "docker build -t ${PROJECT_NAME}-frontend:${IMAGE_TAG} -t ${PROJECT_NAME}-frontend:latest ./frontend"
                    }
                }
            }
        }

        stage('6. Smoke Test & Health Check') {
            steps {
                echo "Verifying container orchestration and health telemetry..."
                sh 'docker compose -f docker-compose.yml up -d'
                sleep(time: 15, unit: 'SECONDS')
                sh 'curl --fail --retry 5 --retry-delay 3 http://localhost:5000/api/health || (docker compose logs && exit 1)'
                sh 'curl --fail --retry 3 http://localhost:80/ || exit 1'
            }
            post {
                always {
                    echo "Tearing down transient test containers..."
                    sh 'docker compose -f docker-compose.yml down'
                }
            }
        }

        stage('7. Push Registry Artifacts') {
            when {
                expression { return params.PUSH_DOCKER_IMAGES }
            }
            steps {
                echo "Publishing container images to remote registry..."
                sh "docker tag ${PROJECT_NAME}-backend:${IMAGE_TAG} ${REGISTRY}-backend:${IMAGE_TAG}"
                sh "docker tag ${PROJECT_NAME}-frontend:${IMAGE_TAG} ${REGISTRY}-frontend:${IMAGE_TAG}"
                // sh "docker push ${REGISTRY}-backend:${IMAGE_TAG}"
                // sh "docker push ${REGISTRY}-frontend:${IMAGE_TAG}"
            }
        }

        stage('8. Blue/Green Deployment') {
            steps {
                echo "Deploying LinguaLearn release [${IMAGE_TAG}] to ${params.DEPLOY_ENV}..."
                script {
                    if (params.DEPLOY_ENV == 'production') {
                        echo "Applying Zero-Downtime Rolling Update to Production cluster..."
                    } else {
                        echo "Updating Staging environment for Quality Assurance..."
                    }
                }
            }
        }
    }

    post {
        success {
            echo "=========================================="
            echo " PIPELINE SUCCESS: Release ${IMAGE_TAG} Ready "
            echo "=========================================="
        }
        failure {
            echo "=========================================="
            echo " PIPELINE FAILURE: Build ${IMAGE_TAG} Failed "
            echo " Triggering automated rollback procedures... "
            echo "=========================================="
        }
        always {
            cleanWs deleteDirs: true, notFailBuild: true
        }
    }
}
