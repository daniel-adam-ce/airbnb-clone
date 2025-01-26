mongodb:
	docker run --name mongodb -p 27017:27017 -d mongo:latest

mongodb-start:
	docker start mongodb

proto:
	protoc --plugin=./node_modules/.bin/protoc-gen-ts_proto --ts_proto_out=./libs/common/src/types/ --ts_proto_opt=nestJs=true --proto_path=./proto auth.proto && mv ./libs/common/src/types/auth.ts ./libs/common/src/types/auth.proto.ts
	protoc --plugin=./node_modules/.bin/protoc-gen-ts_proto --ts_proto_out=./libs/common/src/types/ --ts_proto_opt=nestJs=true --proto_path=./proto payments.proto && mv ./libs/common/src/types/payments.ts ./libs/common/src/types/payments.proto.ts
	protoc --plugin=./node_modules/.bin/protoc-gen-ts_proto --ts_proto_out=./libs/common/src/types/ --ts_proto_opt=nestJs=true --proto_path=./proto notifications.proto && mv ./libs/common/src/types/notifications.ts ./libs/common/src/types/notifications.proto.ts
.PHONY: mongodb mongodb-start proto