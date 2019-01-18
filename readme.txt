docker run -d --name mongo -e MONGO_INITDB_ROOT_USERNAME=root -e MONGO_INITDB_ROOT_PASSWORD=example -p 27017:27017 -v /Users/ssc/mongo/data/db:/data/db mongo
docker run -d -e MONGO_INITDB_ROOT_USERNAME=root -e MONGO_INITDB_ROOT_PASSWORD=example -p 27017:27017 -v /Users/ssc/mongo/data/db:/data/db mongo

docker run -d --name mongo_ui -e ME_CONFIG_MONGODB_ADMINUSERNAME=root -e ME_CONFIG_MONGODB_ADMINPASSWORD=example -p 8081:8081 mongo-express


docker run -it --rm -p 8081:8081 -e ME_CONFIG_MONGODB_ADMINUSERNAME=root -e ME_CONFIG_MONGODB_ADMINPASSWORD=example -e ME_CONFIG_MONGODB_URL="mongodb://test:test@localhost:27017/test" --link 829e6c020e09 mongo-express

docker run -it --rm -p 8081:8081 -e ME_CONFIG_MONGODB_URL="mongodb://test:test@127.0.0.1:27017/test?authMechanism=DEFAULT" mongo-express

docker run -it --rm -p 8081:8081 -e ME_CONFIG_MONGODB_ADMINUSERNAME=root -e ME_CONFIG_MONGODB_ADMINPASSWORD=example -e ME_CONFIG_MONGODB_URL="mongodb://localhost:27017/ mongo-express