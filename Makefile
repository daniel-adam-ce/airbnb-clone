mongodb:
	docker run --name mongodb -p 27017:27017 -d mongo:latest

mongodb-start:
	docker start mongodb

proto:
	protoc --plugin=./node_modules/.bin/protoc-gen-ts_proto --ts_proto_out=./ --ts_proto_opt=nestJs=true ./proto/auth.proto
	protoc --plugin=./node_modules/.bin/protoc-gen-ts_proto --ts_proto_out=./ --ts_proto_opt=nestJs=true ./proto/payments.proto
	protoc --plugin=./node_modules/.bin/protoc-gen-ts_proto --ts_proto_out=./ --ts_proto_opt=nestJs=true ./proto/notifications.proto

.PHONY: mongodb mongodb-start proto