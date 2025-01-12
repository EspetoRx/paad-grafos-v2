((nodesId, callback) => {
    var r = confirm("Deseja realmente deletar esse vértice?");
    if (r === true) {
        callback(nodesId);
    } else {
        callback([]);
    }
})