FROM node:20
  
WORKDIR /usr/src/app/bloglist-backend


COPY --chown=node:node . .
RUN npm ci 

ENV DEBUG=todo-backend:*
  

USER node
CMD npm start