const { flow } = require('rp-utils');

const onunload = (fn) => 
    flow.Safely(() => window.addEventListener('unload', fn))
    .fold((e) => console.log(e),() => {});

module.exports = {
    onunload
}