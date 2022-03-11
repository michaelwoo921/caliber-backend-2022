## Build docker image

`docker build -t batches -f batches/Dockerfile .`

## Create the Elastic Container Registry Repositories

- `aws cloudformation deploy --template-file batches/ecr.yaml --stack-name batches-stack `

## Log in to Elastic Container Registry server

- `aws ecr get-login-password --region us-west-2 | docker login --username AWS --password-stdin <accountnumber>.dkr.ecr.us-west-2.amazonaws.com`

## Tag the images to their respective ECR repositories

- `docker tag batches:latest <accountnumber>.dkr.ecr.us-west-2.amazonaws.com/batches:latest`

## Push the Docker images to their respective ECR repositories

- `docker push <accountnumber>.dkr.ecr.us-west-2.amazonaws.com/batches:latest`

# Deploy Lambda functions

- `aws cloudformation deploy --template-file batches/batches.yaml --stack-name batches-lambda-stack`

# Deploy API Gateway

- `aws cloudformation deploy --template-file ./cloudFormation/apigateway.yaml --stack-name <stack-name>`

## Deploy the Invoke Template to give API Gateway permission to use Lambdas

- `aws cloudformation deploy --template-file ./cloudFormation/invoke.yaml --stack-name <stack-name> --capabilities CAPABILITY_IAM`
