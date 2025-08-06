const fss = require('fs');
const Logger = require('logplease');
const logger = Logger.create('config');

const options = {
    log_level: {
        desc: 'Level of data to log',
        default: 'INFO',
        validators: [
            x =>
                Object.values(Logger.LogLevels).includes(x) ||
                `Log level ${x} does not exist`,
        ],
    },
    bind_address: {
        desc: 'Address to bind REST API on',
        default: `0.0.0.0:${process.env.PORT || 2000}`,
        validators: [],
    },
    data_directory: {
        desc: 'Absolute path to store all piston related data at',
        default: process.env['PISTON_DATA_DIRECTORY'] || '/tmp/data',
        validators: [
            x => fss.existsSync(x) || `Directory ${x} does not exist`,
        ],
    },
    sandbox_binary: {
        desc: 'Path to sandbox binary',
        default: './engine/sandbox',
        validators: [x => fss.existsSync(x) || `File ${x} does not exist`],
    },
    timeout: {
        desc: 'Time limit for code execution (ms)',
        default: 3000,
        validators: [x => !isNaN(parseInt(x)) || `Invalid number ${x}`],
    },
    max_output: {
        desc: 'Max number of bytes allowed on stdout/stderr',
        default: 10000,
        validators: [x => !isNaN(parseInt(x)) || `Invalid number ${x}`],
    },
    compile_timeout: {
        desc: 'Time limit for language compilation (ms)',
        default: 10000,
        validators: [x => !isNaN(parseInt(x)) || `Invalid number ${x}`],
    },
};

function parse() {
    const out = {};

    for (const [option_name, option] of Object.entries(options)) {
        const env_key = 'PISTON_' + option_name.toUpperCase();

        let value = process.env[env_key] || option.default;

        for (const validator of option.validators) {
            const result = validator(value);
            if (result !== true) {
                logger.error(`Config validation failed: ${result}`);
                process.exit(1);
            }
        }

        out[option_name] = value;
    }

    return out;
}

module.exports = {
    parse,
};
