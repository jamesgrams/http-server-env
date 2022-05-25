#!/usr/bin/env node

/**
 * Drop-in replacement for http-server that allows for the inclusion of evironment variables in static sites
 * Dependent on the structure of http-server. Requires the serve function to be called "serve" and use fs.readFileSync to read files and fs.stat to stat them.
 * @author James Grams
 */

const path = require("path");
const fs = require("fs");
const htmlEncodingSniffer = require('html-encoding-sniffer');
const mime = require('mime');
require('dotenv').config();

const defaultEncoding = 'UTF-8';
const defaultType = 'application/octet-stream';
// we need to do longest first so we don't replace process.env.TEST_URL if process.env.TEST exists
let env = Object.keys(process.env).sort( (a,b) => {
    if( a.length > b.length ) return -1;
    else if( b.length > a.length ) return 1;
    return 0;
});

/**
 * Main process.
 */
async function main() {
    // required for the content-length header
    // see http-server/node_modules/lib/core/index.js for more
    let stat = fs.stat;
    fs.stat = function(path, callback) {
        stat(path, function cocoadog(err, stats) {
            try {
                let contentType = mime.getType(path, defaultType);
                if (contentType && (/^text\/|^application\/(javascript|json)/).test(contentType)) {
                    let file = fs.readFileSync(path);
                    stats.size = file.length;
                }
            }
            catch(err) {}
            callback( err, stats );
        });
    }

    // replace in the file
    let rs = fs.readFileSync;
    fs.readFileSync = function(path, options) {
        let file = rs(path, options);
        let sniffedEncoding = htmlEncodingSniffer(file, {
            defaultEncoding: defaultEncoding
        });

        // return if not in the "serve" function
        let st = Error().stack;
        if( !st.match("at serve") && !st.match("cocoadog") ) return file;

        // replace env items
        for( let item of env ) {
            file = file.toString(sniffedEncoding).replace( new RegExp(`process.env.${item}`, "g"), process.env[item] );
        }
        return Buffer.from(file, sniffedEncoding);
    }
    require( [__dirname, "node_modules", "http-server", "bin", "http-server" ].join(path.sep));
}

main();