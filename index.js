'use strict';

const util = require('util');
const http = require('http');
const path = require('path');
const url = require('url');
const fs = require('fs');

http.createServer(function(request,response){
    let my_path = url.parse(request.url).pathname;
    if(my_path === '/'){
        my_path = '/index.html'
    }
    const full_path = path.join(process.cwd(),my_path);
    fs.exists(full_path,function(exists){
        if(!exists){
            response.writeHeader(404, {"Content-Type": "text/plain"});
            response.write("404 Not Found\n");
            response.end();
        }
        else{
            fs.readFile(full_path, "binary", function(err, file) {
                if(err) {
                    response.writeHeader(500, {"Content-Type": "text/plain"});
                    response.write(err + "\n");
                    response.end();

                }
                else{
                    response.writeHeader(200);
                    response.write(file, "binary");
                    response.end();
                }

            });
        }
    });
}).listen(8080);

console.log("Server Running on 8080");