FROM node:20-alpine
#chuẩn bị môi trường node.js, môi trường version 14.

WORKDIR /bookingconnect-uet/backend
#nơi lưu trữ sources code bên trong docker

COPY package*.json ./
#copy 2 file để download library

RUN npm install
#download library

RUN npm install -g @babel/core @babel/cli
#cài babel để build code

COPY . .
#copy toàn bộ code ở thư mục hiện tại vào thư mục workdir

RUN npm run build-src
#build source code -> build

CMD [ "npm","run", "production"]


#build image: docker build -t imagename:tagname .
#dấu . tức là file dockerfile tại đường dẫn hiện tại để nó tìm được dockerfile