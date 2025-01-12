((edgesId, callback) => {
    var r = confirm("Deseja realmente deletar essa aresta?");
    if (r === true) {
        callback(edgesId);
    } else {
        callback([]);
    }
})