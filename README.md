An express backend with a react frontend to match users into lunch buddies. Configured to be deployed to Azure.

The client project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# Installation

1. Run `npm install` in the root directory
2. Run `npm install` in the client directory
3. Add a .env file in the root directory with the following environment variables for the server:
    - AZURE_STORAGE_CONNECTION_STRING (for caching server sessions)
    - DB_CONN (for Azure MongoDB conn) - mongodb://(user).documents.azure.com:10255/(dbname)?ssl=true&replicaSet=globaldb
    - DB_USER
    - DB_PW
    - PORT
    - SESSIONSECRET - random string for signing the server sessions
4. Add a .env.development and .env.production file in the client directory with the following environment variables for the client:
    - REACT_APP_CLIENTID - Azure Active Directory App ID GUID
    - REACT_APP_SIGN_IN_AUTHORITY - https://login.microsoftonline.com/(tenantGUID)
    
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**Make sure to add the appropriate login callback url's to your AAD app

    
# Running

## Locally with client hot reload
1. Add `"proxy": "http://localhost:(serverport)/"` to client package.json
2. `yarn start` in root directory to start server
3. `yarn start` in client directory - should open up a browser to localhost:3000 by default

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**If express is crashing, ensure a `yarn build` in the client directory has been done at some point

## Locally with client production build
1. `yarn build` in client directory to build minified client
2. `yarn start` in root directory to start and server client
3. Browse to localhost:(serverport)

## CI/CD with an Azure Web App
1. Add all environment variables in root directory to Application settings
2. Under deployment center, connect your github as the source, and use VSTS pipeline as the CI/CD option
3. Choose Node as the stack, with a startup command of node server
4. Under the VSTS build, add all environment variables from client directory to Variables - Pipeline Variables (non-secret)
5. In the build, add a step to npm install in the client folder
6. In the build, add a step to yarn build the client folder
7. In the build, add a step to delete the node_modules folder from the client folder
