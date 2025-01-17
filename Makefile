mongodb:
	docker run --name mongodb -p 27017:27017 -d mongo:latest

mongodb-start:
	docker start mongodb

.PHONY: mongodb mongodb-start