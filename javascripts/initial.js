var tooptip;
$(document).ready(function() {
    initialize();
});

function initialize() {
    tooptip = d3.select("body")
        .append("div")
        .attr("class", "tooptip")
        .style("opacity", 0.0);
    draw_view1.initialize();
    draw_view2.initialize();
    draw_view3.initialize();
    draw_view4.initialize();
    draw_view5.initialize();
    draw_view6.initialize();
    draw_view7.initialize();
}