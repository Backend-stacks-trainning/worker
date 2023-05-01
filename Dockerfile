# base image
FROM node:16-alpine

# set working directory
WORKDIR /app

# copy package.json and package-lock.json
COPY package*.json ./
COPY tsconfig.build.json ./

# install dependencies
RUN npm install
RUN npm run build

# copy app source code
COPY . .

# expose port 3001
EXPOSE 3001

# start the app
CMD ["npm", "run", "start:prod"]