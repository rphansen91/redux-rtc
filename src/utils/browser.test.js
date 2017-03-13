const { onunload } = require('./browser');

it('should execute function on unload event', () => {
    const unload = jest.fn();
    window.addEventListener = (event, cb) => cb();
    onunload(unload);
    expect(unload).toHaveBeenCalled();
})

it('should safely fail unload', () => {
    console.log = jest.fn();
    const unload = jest.fn();
    window.addEventListener = null;
    onunload(unload);
    expect(unload).not.toHaveBeenCalled()
    expect(console.log).toHaveBeenCalled();
})