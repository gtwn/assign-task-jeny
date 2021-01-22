# base image
FROM node

# set working directory

WORKDIR /app
COPY package*.json /app/
RUN npm install

# add `/usr/src/app/node_modules/.bin` to $PATH
# ENV PATH /usr/src/app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY . /app/
RUN npm run build-css


# start app
CMD ["npm", "start"]