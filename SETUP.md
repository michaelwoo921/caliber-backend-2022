# Deploy RDS Template if starting with a new DB instance

`aws cloudformation deploy --template-file cloudformation/rds.yaml --stack-name rds-stack --capabilities CAPABILITY_IAM --parameter-overrides DBUsername=<db-name> DBPassword=<db-password>`

## Log in to Elastic Container Registry server

## Create the Elastic Container Registry Repositories

- `aws ecr get-login-password --region us-west-2 | docker login --username AWS --password-stdin <accountid>.dkr.ecr.us-west-2.amazonaws.com`

- `aws cloudformation deploy --template-file <ecr-repo-name>/ecr.yaml --stack-name <ecr-repo-name>-stack `

## Docker images and ECR Reponames:

associate authorizer batchassociates batches batchweek categories weekcategories

## Build docker image

## Tag the images to their respective ECR repositories

## Push the Docker images to their respective ECR repositories

- `docker build -t <dockerimg> -f <dockerimg>/Dockerfile --build-arg USER=<PGUSER> --build-arg HOST=<PGHOST> --build-arg PASSWORD=<password> --build-arg DATABASE=<PGDB> .`

- `docker tag <dockerimg>:latest <accountid>.dkr.ecr.us-west-2.amazonaws.com/<dockerimg>:latest`

- `docker push <accountid>.dkr.ecr.us-west-2.amazonaws.com/<dockerimg>:latest`

## Deploy Lambda functions

## Deploy API Gateway

## Deploy the Invoke Template to give API Gateway permission to use Lambdas

- `aws cloudformation deploy --template-file <dockerimg>/<dockerimg>.yaml --stack-name <dockerimg>-lambda-stack`

- `aws cloudformation deploy --template-file ./cloudFormation/apigateway.yaml --stack-name caliber-mobile-api-cf-stack`

- `aws cloudformation deploy --template-file ./cloudFormation/invoke.yaml --stack-name invoke-cf-stack --capabilities CAPABILITY_IAM`
