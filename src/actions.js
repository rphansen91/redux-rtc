const buildAction = type => payload => ({
    type, payload
});

const convertToXctbl = obj => {
    obj.create = buildAction(obj.CREATE);
    obj.loading = buildAction(obj.LOADING);
    obj.reaction = buildAction(obj.REACTION);
    obj.error = buildAction(obj.ERROR);
    return obj;
}

const connection = {
    CREATE: 'CREATE_CONNECTION',
    LOADING: 'LOADING_CONNECTION',
    REACTION: 'JOIN_CONNECTION',
    ERROR: 'ERROR_CONNECTION'
}

module.exports = {
    connection: convertToXctbl(connection)
}