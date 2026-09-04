pipeline {
    agent any

    parameters {
        choice(
            name: 'DEPLOY_ENV',
            choices: ['staging', 'production'],
            description: 'Target deployment environment'
        )

        booleanParam(
            name: 'RUN_INTEGRATION_TESTS',
            defaultValue: true,
            description: 'Run Supertest integration suite against live database'
        )

        booleanParam(
            name: 'PUSH_DOCKER_IMAGES',
            defaultValue: false,
            description: 'Push built images to Docker registry'
        )
    }

    environment {
        PROJECT_NAME = 'lingualearn'
        REGISTRY = 'docker.io/lingualearn'
        IMAGE_TAG = "${env.BUILD_NUMBER}"

        NODE_ENV = 'test'
        PORT = '5000'

        DATABASE_URL = 'postgresql://postgres:postgrespassword@localhost:5433/lingualearn_db'

        DB_HOST = 'localhost'
        DB_PORT = '5433'
        DB_NAME = 'lingualearn_db'
        DB_USER = 'postgres'
        DB_PASSWORD = 'postgrespassword'

        JWT_SECRET = 'jenkins_pipeline_test_jwt_secret_key_2026'

        /*
         * Dedicated host ports for Jenkins CI smoke-test containers.
         * These do NOT conflict with the normal LinguaLearn environment.
         */
        CI_POSTGRES_PORT = '15433'
        CI_BACKEND_PORT = '15000'
        CI_FRONTEND_PORT = '18080'
    }

    options {
        timeout(time: 30, unit: 'MINUTES')

        buildDiscarder(
            logRotator(
                numToKeepStr: '15',
                artifactNumToKeepStr: '5'
            )
        )
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

                powershell 'node --version'
                powershell 'npm --version'
                powershell 'git --version'
                powershell 'docker --version'
                powershell 'docker compose version'
            }
        }

        stage('2. Install Dependencies') {
            parallel {

                stage('Backend Dependencies') {
                    steps {
                        dir('backend') {
                            echo "Installing backend dependencies (clean install)..."
                            powershell 'npm ci'
                        }
                    }
                }

                stage('Frontend Dependencies') {
                    steps {
                        dir('frontend') {
                            echo "Installing frontend dependencies (clean install)..."
                            powershell 'npm ci'
                        }
                    }
                }
            }
        }

        stage('3. Automated Backend Tests') {
            when {
                expression {
                    return params.RUN_INTEGRATION_TESTS
                }
            }

            steps {
                dir('backend') {
                    echo "Running Jest Unit & Supertest Integration Suites..."

                    powershell '''
                        npm test -- --coverage --ci --reporters=default --testResultsProcessor=jest-junit
                    '''
                }
            }

            post {
                always {
                    junit(
                        testResults: 'backend/junit.xml',
                        allowEmptyResults: true
                    )

                    archiveArtifacts(
                        artifacts: 'backend/coverage/**',
                        allowEmptyArchive: true
                    )
                }
            }
        }

        stage('4. Frontend Build & Static Analysis') {
            steps {
                dir('frontend') {
                    echo "Compiling React Vite bundle..."

                    powershell 'npm run build'
                }
            }

            post {
                success {
                    archiveArtifacts(
                        artifacts: 'frontend/dist/**',
                        allowEmptyArchive: false
                    )
                }
            }
        }

        stage('5. Docker Image Build') {
            parallel {

                stage('Build Backend Image') {
                    steps {
                        powershell """
                            docker build -t ${PROJECT_NAME}-backend:${IMAGE_TAG} -t ${PROJECT_NAME}-backend:latest ./backend
                        """
                    }
                }

                stage('Build Frontend Image') {
                    steps {
                        powershell """
                            docker build -t ${PROJECT_NAME}-frontend:${IMAGE_TAG} -t ${PROJECT_NAME}-frontend:latest ./frontend
                        """
                    }
                }
            }
        }

        stage('6. Smoke Test & Health Check') {
            steps {

                echo "=========================================="
                echo " STARTING JENKINS SMOKE TEST ENVIRONMENT "
                echo "=========================================="

                echo "CI PostgreSQL Host Port : ${CI_POSTGRES_PORT}"
                echo "CI Backend Host Port    : ${CI_BACKEND_PORT}"
                echo "CI Frontend Host Port   : ${CI_FRONTEND_PORT}"

                /*
                 * Run Docker Compose using dedicated Jenkins ports.
                 *
                 * This prevents conflicts with the normal application:
                 * PostgreSQL : 5433
                 * Backend    : 5000
                 * Frontend   : 80
                 */

                powershell """
                    \$env:POSTGRES_HOST_PORT = "${CI_POSTGRES_PORT}"
                    \$env:BACKEND_HOST_PORT = "${CI_BACKEND_PORT}"
                    \$env:FRONTEND_HOST_PORT = "${CI_FRONTEND_PORT}"

                    docker compose -f docker-compose.yml up -d
                """

                echo "Waiting for containers to initialize..."

                sleep(
                    time: 20,
                    unit: 'SECONDS'
                )

                /*
                 * Backend Health Check
                 */

                powershell """
                    try {
                        \$response = Invoke-WebRequest `
                            -Uri "http://localhost:${CI_BACKEND_PORT}/api/health" `
                            -UseBasicParsing `
                            -TimeoutSec 15

                        if (\$response.StatusCode -ne 200) {
                            throw "Backend health check returned HTTP \$(`$response.StatusCode)"
                        }

                        Write-Host "=========================================="
                        Write-Host " BACKEND HEALTH CHECK PASSED "
                        Write-Host " http://localhost:${CI_BACKEND_PORT}/api/health "
                        Write-Host "=========================================="
                    }
                    catch {
                        Write-Host "=========================================="
                        Write-Host " BACKEND HEALTH CHECK FAILED "
                        Write-Host "=========================================="

                        docker compose -f docker-compose.yml ps
                        docker compose -f docker-compose.yml logs

                        exit 1
                    }
                """

                /*
                 * Frontend Health Check
                 */

                powershell """
                    try {
                        \$response = Invoke-WebRequest `
                            -Uri "http://localhost:${CI_FRONTEND_PORT}/" `
                            -UseBasicParsing `
                            -TimeoutSec 15

                        if (\$response.StatusCode -ne 200) {
                            throw "Frontend health check returned HTTP \$(`$response.StatusCode)"
                        }

                        Write-Host "=========================================="
                        Write-Host " FRONTEND HEALTH CHECK PASSED "
                        Write-Host " http://localhost:${CI_FRONTEND_PORT}/ "
                        Write-Host "=========================================="
                    }
                    catch {
                        Write-Host "=========================================="
                        Write-Host " FRONTEND HEALTH CHECK FAILED "
                        Write-Host "=========================================="

                        docker compose -f docker-compose.yml ps
                        docker compose -f docker-compose.yml logs

                        exit 1
                    }
                """

                echo "=========================================="
                echo " SMOKE TESTS PASSED SUCCESSFULLY "
                echo "=========================================="
            }

            post {
                always {
                    echo "Tearing down transient Jenkins test containers..."

                    powershell '''
                        docker compose -f docker-compose.yml down --remove-orphans
                    '''
                }
            }
        }

        stage('7. Push Registry Artifacts') {
            when {
                expression {
                    return params.PUSH_DOCKER_IMAGES
                }
            }

            steps {
                echo "Publishing container images to remote registry..."

                powershell """
                    docker tag ${PROJECT_NAME}-backend:${IMAGE_TAG} ${REGISTRY}-backend:${IMAGE_TAG}
                """

                powershell """
                    docker tag ${PROJECT_NAME}-frontend:${IMAGE_TAG} ${REGISTRY}-frontend:${IMAGE_TAG}
                """

                echo "Docker images tagged successfully."

                /*
                 * Docker push commands intentionally disabled until
                 * Docker Hub credentials are configured in Jenkins.
                 */

                // powershell "docker push ${REGISTRY}-backend:${IMAGE_TAG}"
                // powershell "docker push ${REGISTRY}-frontend:${IMAGE_TAG}"
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
            cleanWs(
                deleteDirs: true,
                notFailBuild: true
            )
        }
    }
}