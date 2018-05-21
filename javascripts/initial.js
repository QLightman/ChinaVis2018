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
    draw_sub_view3.initialize();
    draw_view4.initialize();
    draw_view5.initialize();

    $("#top_middle_bottom_div").hide();
}