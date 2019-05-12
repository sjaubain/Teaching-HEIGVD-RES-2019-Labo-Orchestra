FROM node:latest

MAINTAINER simon jobin 

#
# When we build the image, we copy the executable jar in the image file system. 
#
COPY src /opt/res/

WORKDIR /opt/res/

RUN npm install

ENTRYPOINT ["node", "/opt/res/musician.js"]