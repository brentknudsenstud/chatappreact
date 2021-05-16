const timeout = res => new Promise((resolve) => setTimeout(() => resolve(res), 10));
const apiUrl = 'http://localhost:8020';

function get(path) {
    return fetch(`${apiUrl}${path}`)
    .then(res => res.json())
    .then(timeout);
}
function post(path, body) {
    return fetch(`${apiUrl}${path}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }, 
        body: JSON.stringify(body)
    })
    .then(res => res.json())
    .then(timeout);
}
function put(path, body) {
    return fetch(`${apiUrl}${path}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        }, 
        body: JSON.stringify(body)
    })
    .then(res => res.json())
    .then(timeout);
}
function del(path) {
    return fetch(`${apiUrl}${path}`, {
        method: 'delete'
    })
    .then(res => res.json())
    .then(timeout);
}

export default {
    get,
    post,
    put,
    del
};