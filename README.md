# http-server-env



`http-server-env` is a drop-in replacement for [http-server](https://www.npmjs.com/package/http-server) that allows for the inclusion of evironment variables in static sites.

# Installation

1. `npm install -g http-server-env`

# Usage

1. `cd` to the directory you want to store your `.env` file
2. Add a `.env` file with your environment variables. For more info on how this file should look, check out the [dotenv](https://www.npmjs.com/package/dotenv) module.
3. `http-server-env [path] [options]`. Check out the [http-server](https://www.npmjs.com/package/http-server) module for more info on available options.
4. In your HTML/JS/CSS files for your static site, use `process.env.ENVIRONMENT_VARIABLE_NAME` whenever you want to include an environment variable. 
    * Note, this will load all environment variables, not only the ones included in `.env`.

# Examples
* `index.js`

```
const API_KEY="process.env.API_KEY";

fetch("https://my.url", {
    method: "GET",
    headers: {
        "x-api-key": API_KEY
    }
});
```
* `index.html`

```
<html>
    <head>
        <title>My Page</title>
        <script>const SECRET_KEY="process.env.SECRET_KEY"; 
    </head>
    <body></body>
</html>
```

# Purpose

You will not want to include API keys in a repository. In production, you may have a build process to inject the environment variables. If you want to use an extremely simple development environment like `http-server`, this module will come in handy, so you can access your API endpoints with your keys in development, without having to worry about ever including the keys in a commit to your repository.