// standard express stuff
var express        = require('express');
var morgan         = require('morgan');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
// fs and exec for interacting with the file system and running a shell command
var fs             = require('fs');
var exec           = require('child_process').exec;

// our quick & dirty CI app
var qdci           = express();

// set up middleware
qdci.use(express.static(__dirname + '/public'));
qdci.use(morgan('dev'));
qdci.use(bodyParser.urlencoded({ extended: false }));
qdci.use(bodyParser.json());
qdci.use(methodOverride());

// some config constants
var GIT_PULL_SCRIPT_PATH = "./git_pull.sh";
var PORT = 8080;

/**
 * Define a GET route so we can easily check if the CI server is running
 */
qdci.get('/', function(req, res){
    res.status(200).send("qdci server is running.");
});

/**
 * Define route /pull which will initiate a git pull when posted to by a webhook.
 *
 * We're listening to POST because that's the http method that Github webhooks make use of.
 * For testing, you'll need to use postman, curl etc to create a POST request instead of a GET
 */
qdci.post('/pull', function(req, res) {
    console.log('A "git pull" command has been invoked via RPC...');

    // At this point, we'd want to process the request and determine if the token was passed through
    // so that only authorized requests can initiate this process. I'm going to leave that out for now.
    console.warn('Warning: this method is not yet secured!');
    // todo: add real security!

    // make sure the script is executable before attempting to run:
    fs.chmodSync(GIT_PULL_SCRIPT_PATH, 0755);

    // execute the pull script, writing the returned child proc to var, in case we want to use it later.
    var gitChildProc = exec(GIT_PULL_SCRIPT_PATH,
        function(error, stdout, stderr){
            if(stdout){
                console.log('Command Results:\n' + stdout);
            }
            if(stderr){
                console.warn('Command Warnings:\n' + stderr);
            }
            if (error) {
                console.warn('Command failed. Error:\n' + error);
            }
            res.status(204).send();
        });
});

qdci.listen(PORT);
console.log("QDCI server listening on port: " + PORT);