((edgeData, callback) => {
    edgeData.label = 'Mudei de nome';
    var r = confirm("Deseja editar esse vértice?");
    if (r === true) {
        callback(edgeData);
    } else {
        callback(null);
    }
})