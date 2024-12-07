((values, id, selected, hovering) => {
    values.dashes = false;
    //values.dashes = [5, 10];
    values.toArrow = false;
    values.toArrowScale = 1;
    values.toArrowType = 'arrow';
    values.middleArrow = false;
    values.middleArrowScale = 1;
    values.middleArrowType = "arrow";
    values.fromArrow = true;
    values.fromArrowScale = 1;
    values.formArrowType = "arrow";
    // Allowed types
    // arrow, bar, box, circle, curve, diamond, image, inv_curve, inv_triangle, triangle, vee, crow
    values.arrowStrikethrough = false;
    values.color = "#848484";
    values.inheritsColor = "from";
    values.opacity = 1;
    values.hidden = false;
    values.lenght = 0;
    values.shadow = false;
    values.shadowColor = 'rgba(0,0,0,0.5)';
    values.shadowSize = 10;
    values.shadowX = 5;
    values.shadowY = 5;
    values.width = 1;
})