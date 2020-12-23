const restify = require("restify");
const corsMiddleware = require("restify-cors-middleware");
const chalk = require("chalk");
const printf = require("printf");
const models = require("./models");

const cors = corsMiddleware({
    preflightMaxAge: 5, //Optional
    origins: [
        /^http:\/\/localhost(:[\d]+)?$/,
        "https://*.netlify.app",
        // "https://myapp.com"   // Add endpoint here...
    ],
    allowHeaders: ["sessionid"]
});

const server = restify.createServer({
    name: "API",
    version: "1.0.0"
});

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

server.pre(cors.preflight);
server.use(cors.actual);

// attach routes
require("./routes-signature")(server);

server.get("/ping", function (req, res, next) {
    return res.send(200);
});

const listAllRoutes = server => {
    Object.entries(server.router.getRoutes())
        .sort((a, b) => {
            return a[1].path.localeCompare(b[1].path);
        })
        .map(route => {
            console.log(
                chalk.yellow(printf("%*s", route[1].method, 6)),
                route[1].path
            );
        });
};

models.init().then(() => {
    server.listen(5005, function () {
        listAllRoutes(server);
        console.log("%s listening at %s", server.name, server.url);
    });
});
