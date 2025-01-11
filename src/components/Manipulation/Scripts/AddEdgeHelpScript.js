((edgeData,callback) => {
    if (edgeData.from === edgeData.to) {
      var r = confirm("Deseja realmente fazer um laço?");
      if (r === true) {
        callback(edgeData);
      }
    }
    else {
      callback(edgeData);
    }
  })