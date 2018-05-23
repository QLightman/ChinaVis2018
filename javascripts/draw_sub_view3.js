var draw_sub_view3 = {
    data: 0,
    height: 0,
    width: 0,
    div: 0,
    view: 0,
    g: 0,
    graph_line: 0,
    initialize: function() {
        var self = this;
        self.div = "#sub_view3";
        self.width = $(self.div).width();
        self.height = $(self.div).height();
        self.view = d3.select(self.div).append("svg")
            .attr("width", self.width)
            .attr("height", self.height);
        self.g = self.view.append("g");
    },
    get_sub_view3_data: function(chosen_id, list) {
        var self = this;
        console.log(list)

        function NODE() {}
        NODE.prototype.id = "A";
        NODE.prototype.x;
        NODE.prototype.y;
        NODE.prototype.property;
        NODE.prototype.leader;

        function LINE() {}
        LINE.prototype.source = "A";
        LINE.prototype.target = "B";
        LINE.prototype.value;
        LINE.prototype.width;
        LINE.prototype.number;
        LINE.prototype.x1;
        LINE.prototype.x2;
        LINE.prototype.y1;
        LINE.prototype.y2;
        var node_class = new Array(list.length),
            line_class = new Array();
        for (var i = 0; i < list.length; i++) {
            node_class[i] = new NODE();
            node_class[i].id = list[i];
            node_class[i].size = 10;
        }
        d3.text("http://localhost:8080/getFileMatrix", function(error, matrix) {
            if (error) console.log(error);
            else {
                d3.text("http://localhost:8080/getFileMember_epx_leader", function(error, member) {
                    if (error) console.log(error);
                    else {
                        member = member.toString().split('\n')
                        var id_map = d3.map();
                        for (var i = 0; i < member.length; i++) id_map.set(member[i], i);
                        matrix = matrix.toString().split('\n');
                        for (var i = 0; i < matrix.length; i++) {
                            matrix[i] = matrix[i].toString().split(',');
                        }
                        var tmp;
                        for (var i = 0; i < list.length; i++) {
                            for (var j = 0; j < i; j++) {
                                if (matrix[id_map.get(list[i])][id_map.get(list[j])] == 1) {
                                    tmp = new LINE();
                                    tmp.source = list[i];
                                    tmp.target = list[j];
                                    tmp.value = 10;
                                    line_class.push(tmp);
                                }
                            }
                        }
                        console.log(node_class)
                        console.log(line_class);
                        self.force_layout(node_class, line_class);
                    }
                })

            }
        })

    },
    force_layout: function(node_class, line_class) {
        var self = this;
        self.remove();
        var colorScale = ["#EE6A50", "steelblue", "#CAFF70", "orange"];
        var dis = 100;

        var simulation = d3.forceSimulation()
            .force("link", d3.forceLink().id(function(d) { return d.id; }).distance(function(d) {
                return dis;
            }))
            .force("charge", d3.forceManyBody())
            .force("center", d3.forceCenter(self.width / 2, self.height / 2))
            .force("x", d3.forceX(self.width / 2).strength(0.015))
            .force("y", d3.forceY(self.height / 2).strength(0.015))

        self.graph_line = self.view.append("g")
            .selectAll("line")
            .data(line_class)
            .enter().append("line")
            .attr("stroke-width", function(d) {
                return d.width;
            })
            .attr("stroke", function(d) {
                return colorScale[0]
            })

        self.graph_node = self.view.append("g")
            .selectAll("circle")
            .data(node_class)
            .enter().append("circle")
            .attr("r", 5)
            .attr("stroke", "white")
            .attr("stroke-width", 1)
            .style("fill", function(d) {
                return colorScale[0];
            })
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended))
            .on("mouseover", function(d) {
                draw_view2.get_view2_data(d.id, 0);
                draw_view4.draw(d.id);
                d3.select(this).raise().classed("active", true);
                tooptip.html("id:" + d.id)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY + 20) + "px")
                    .style("opacity", 1);
            })
            .on("mouseout", function(d) {
                d3.select(this).classed("active", false);
                tooptip.style("opacity", 0.0);
            })
            .on("click", function(d) {
                draw_view1.get_view3_data(d.id, 1, 0);
                $("#top_middle_bottom_div").show();
                $("#sub_top_middle_bottom_div").hide();
            })

        simulation
            .nodes(node_class)
            .on("tick", ticked);

        simulation.force("link")
            .links(line_class);

        function ticked() {
            self.graph_line
                .attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

            self.graph_node
                .attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; });
        }

        function dragstarted(d) {
            if (!d3.event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
            d3.select(this).raise().classed("active", true);
        }

        function dragged(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        }

        function dragended(d) {

            d3.select(this).classed("active", false);
            if (!d3.event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }
    },
    remove: function() {
        var self = this;
        self.view.selectAll("*").remove();
    }
}