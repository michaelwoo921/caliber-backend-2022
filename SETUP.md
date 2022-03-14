## Build docker image

`docker build -t associate -f associate/Dockerfile --build-arg USER=<pg-user> --build-arg HOST=<pg-host> --build-arg PASSWORD=<pg-password> --build-arg DATABASE=<pg-database> .`

## Create the Elastic Container Registry Repositories

- `aws cloudformation deploy --template-file batches/ecr.yaml --stack-name batches-stack `

## Log in to Elastic Container Registry server

- `aws ecr get-login-password --region us-west-2 | docker login --username AWS --password-stdin <accountnumber>.dkr.ecr.us-west-2.amazonaws.com`

## Tag the images to their respective ECR repositories

- `docker tag batches:latest <accountnumber>.dkr.ecr.us-west-2.amazonaws.com/batches:latest`

## Push the Docker images to their respective ECR repositories

- `docker push <accountnumber>.dkr.ecr.us-west-2.amazonaws.com/authorizer:latest`

# Deploy Lambda functions

- `aws cloudformation deploy --template-file batches/batches.yaml --stack-name batches-lambda-stack`

# Deploy API Gateway

- `aws cloudformation deploy --template-file ./cloudFormation/apigateway.yaml --stack-name <stack-name>`

## Deploy the Invoke Template to give API Gateway permission to use Lambdas

- `aws cloudformation deploy --template-file ./cloudFormation/invoke.yaml --stack-name <stack-name> --capabilities CAPABILITY_IAM`

# Deploy RDS Template if starting with a new DB instance

`aws cloudformation deploy --template-file rds.yaml --stack-name <stack-name> --role-arn arn:aws:iam::<accountnumber>:role/caliber-mobile-cf --parameter-overrides DBUsername=<db-name> DBPassword=<db-password>`
