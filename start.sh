#/bin/bash
git stash
git pull
docker stop smartest-vue
docker rm smartest-vue
docker rmi smartest-vue:0.1.0
docker build -t smartest-vue:0.1.0 .
docker run -d -p 27996:27996 --name=smartest-vue smartest-vue:0.1.0
