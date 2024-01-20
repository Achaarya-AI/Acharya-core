# FROM node:20-alpine3.18

# WORKDIR /app

# COPY package*.json ./

# RUN npm install

# COPY . .

# EXPOSE 3000

# CMD npm start


# pull official base image
FROM node:19.0-alpine

# set working directory
WORKDIR /usr/src/app

# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json .
# COPY yarn.lock .
COPY package-lock.json .
# RUN npm install --production
RUN npm install

# copy project
COPY . .
