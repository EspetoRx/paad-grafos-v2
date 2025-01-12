((nodeData, callback) => {
    nodeData.label = 'Mudei de nome';
    var r = confirm("Deseja editar esse vértice?");
    if (r === true) {
        callback(nodeData);
    } else {
        callback(null);
    }
})