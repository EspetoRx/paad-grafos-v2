((min,max,total,value) => {
    if (max === min) {
      return 0.5;
    }
    else {
      var scale = 1 / (max - min);
      return Math.max(0,(value - min)*scale);
    }
  })