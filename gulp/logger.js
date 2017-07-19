const colors = require('colors');

module.exports = (module)=>{
    let l = new Logger(module);
    return l.logger;
}

class Logger {
    constructor(module){
        this.fileName = module.filename.replace(__dirname, '');
    }

    wrapper(type, ...colors){
        let fileName = this.fileName;
        type = `[${type}]`;
        return function(){
            for(let i in colors){
                fileName = colors[i] && fileName[colors[i]] || fileName;
                type = colors[i] && type[colors[i]] || type;
            }

            let args = [fileName, type].concat([].slice.call(arguments));
            console.log.apply(console, args);
        }
    }

    get logger(){
        let logger = {};
        logger.i = this.wrapper('I', 'yellow');
        logger.d = this.wrapper('D', 'bgBlue', 'white');
        logger.e = this.wrapper('E', 'red');
        return logger;
    }
}
