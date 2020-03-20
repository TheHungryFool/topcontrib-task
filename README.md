# TopContrib
TopContrib is a simple web application that can be used to fetch the details of the most popular GitHub repositories of
organizations and the top contributors to those repositories. View the deployed app [here](https://topcontrib.azurewebsites.net/).

The directory structure of this project is as follows:
```
├── README.md
├── client  -> contains the client app (React app)
├── node-server  -> contains the deployed server (Express app)
└── python-server  -> contains the discarded server (Flask app)
```

## Client
The client application is written using React. It is a simple app written to consume the REST API (Express app).

### Running the app locally
* Clone the repo
* Install latest version of Node.js and npm ([reference](https://nodejs.org/en/download/package-manager/))
* Change the directory to `client` and install the dependencies by executing
    ```
    npm install
    ```
* Create a file called `config.json` in `client/src/` and add the following key-values
    ```
    {
      "clientToken": <a unique token that should be present in the server config as well>,
      "apiBaseUrl": <base url of the rest api>
    }
    ```
* After installing all the dependencies successfully, run the development server by executing
    ```
    npm start
    ```
* If all goes well, you should be able to see the app running at `http://localhost:3000` (port might change if 3000 is already in use)

## Node.js Server
The server application is written using Node.js and Express framework. It is a simple app that fetches data from github
and provides it to the client in the desired format.

### Running the app locally
* Clone the repo
* Install latest version of Node.js and npm ([reference](https://nodejs.org/en/download/package-manager/))
* Change the directory to `node-server` and install the dependencies by executing
    ```
    npm install
    ```
* Create a file called `config.json` in `node-server/` and add the following key-values
    ```
    {
      "clientToken": <a unique token that should be present in the client config as well>,
      "githubApiBaseUrl": <github api base url, i.e, "https://api.github.com">,
      "githubToken": <github acces token (required by test script)>
    }
    ```
* After installing all the dependencies successfully, run the development server by executing
    ```
    npm start
    ```
* If all goes well, the app should be running at `http://localhost:3000` (port might change if 3000 is already in use)
* (optional) Tests can be run by executing (make sure that the config is present and contains valid values)
    ```
    npm test
    ```
## Python Server (discarded)
The application is written using Python and Flask framework. It is a simple app that fetches data from github
and provides it to the client in the desired format.

**Why was this server discarded?**
Github python client lib was taking too long to fetch the list of contributors (even the time taken to fetch
repositories was more than average) in comparison to node client lib, hence node was chosen over python
(now, however, I've written an own client which is comparatively faster (at least as far as this use case is concerned)).

**Note**: This server has been discarded and is **not complete** with error handling, validation and token validation etc.
 The basic functionality (i.e., fetching data without tokens etc.), however, is available and can be used.

### Running the app locally
* Clone the repo
* Install Python 3.7 ([reference](https://www.python.org/downloads/))
* Create a virtual environment
    ```
    python -m venv <environment_name>
    ```
* Activate the virtual environment
* Go to `python-server` dir and install dependencies
    ```
    pip install -r requirements.txt
    ```
* Run the server (`5000` can be replaces by a custom port number)
    ```
    <env_dir>/bin/gunicorn --bind 0.0.0.0:5000 wsgi:app
    ```

## FAQs
1. Why do I see an error that says `Could not proceed further because of rate limiting`?
   <br> As we can see from [here](https://developer.github.com/v3/#rate-limiting), rate limit allows for up to 60 requests per hour
   for unauthenticated requests. Using an a personal access token will allow for up to 5000 requests per hour.
2. What should I enter in the `Token` input field?
   <br> Generate a personal access token in GitHub as in [here](https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line#creating-a-token)
   and use the same as the token.
   <br>**Note:** Do not grant any permission(s) while generating the token. The token is used only to increase the rate limit.
3. Are all the committees (people who've committed code) present in the response?
   <br> This app fetches the contributors who happen to be the ones who've pushed the most number of commits.
   (more info [here](https://help.github.com/en/github/setting-up-and-managing-your-github-profile/why-are-my-contributions-not-showing-up-on-my-profile#commits))
4. How do I fetch data from the server without using the client? (what request should I send?)
   <br> To fetch n repositories of an organization, send a `GET` request to `/toprepos/<organization>` endpoint with
   `n` as a query param and `X-ACCESS-TOKEN`, `X-GITHUB-TOKEN` (optional) as request headers
   <br> To fetch m contributors of a repository of an organization, send a `GET` request to `/topcontributors/<organization>/<repository>` endpoint with
   `m` as a query param and `X-ACCESS-TOKEN`, `X-GITHUB-TOKEN` (optional) as request headers
   <br>(or)<br> Import the postman collection, set env variables and send request(s) to the server
   <br>[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/95288d9f1fc5e0efb0e8#?env%5BTopContrib%5D=W3sia2V5IjoiYXBpQmFzZVVybCIsInZhbHVlIjoiIiwiZW5hYmxlZCI6dHJ1ZX0seyJrZXkiOiJvcmdhbml6YXRpb24iLCJ2YWx1ZSI6IiIsImVuYWJsZWQiOnRydWV9LHsia2V5IjoicmVwb3NpdG9yeSIsInZhbHVlIjoiIiwiZW5hYmxlZCI6dHJ1ZX0seyJrZXkiOiJjbGllbnRUb2tlbiIsInZhbHVlIjoiIiwiZW5hYmxlZCI6dHJ1ZX0seyJrZXkiOiJnaXRodWJUb2tlbiIsInZhbHVlIjoiIiwiZW5hYmxlZCI6dHJ1ZX0seyJrZXkiOiJuIiwidmFsdWUiOiIiLCJlbmFibGVkIjp0cnVlfSx7ImtleSI6Im0iLCJ2YWx1ZSI6IiIsImVuYWJsZWQiOnRydWV9XQ==)

