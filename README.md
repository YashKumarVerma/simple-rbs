# Role Based Systems


This is a simple demo of an application that utilized role based authentication mechanism to ensure correct access of data and services. In addition to RBS, we're also implementing a cahce layer to demonstrate how database operations can get a significant performance boost with the right thickness of abstraction.

## Running
- `yarn install`
- `docker run -d --name some-redis -p 6379:6379 redis`
- `yarn start:dev`
