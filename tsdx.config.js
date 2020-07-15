const sass = require('rollup-plugin-sass');
module.exports = {
    rollup(config, options) {
        config.plugins.push(
            sass({
                insert: true
            })
        );
        return config;
    },
};