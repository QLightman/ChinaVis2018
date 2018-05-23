var draw_view1 = {
    view: 0,
    div: 0,
    width: 0,
    height: 0,
    center: 0,
    line_color: 0,
    text_color: 0,
    graph_node: 0,
    graph_line: 0,
    g: 0,
    property_class: 0,
    group_array: 0,
    develop_group: 0,
    test_array: 0,
    leader_node: 0,
    initialize: function() {
        var self = this;
        self.div = "#view1";
        self.width = $(self.div).width();
        self.height = $(self.div).height();
        self.center = [self.width / 2, self.height / 2];
        self.line_color = "steelblue";
        self.text_color = "black";
        self.view = d3.select(self.div).append("svg")
            .attr("id", "view1")
            .attr("width", self.width)
            .attr("height", self.height);
        self.g = self.view.append("g");
        self.get_view1_data();
        self.zooming(self.view, self.g);
        self.property_class = ["develop", "finance", "labor", "manage"];
        self.group_array = new Array(self.property_class.length);
        self.develop_group = new Array();
        self.test_array = [];
        self.leader_node = ["1007", "1068", "1059"];
        for (var i = 0; i < self.group_array.length; i++) self.group_array[i] = new Array();

    },
    get_view1_data: function() {
        var self = this;
        var url = 'http://localhost:8080/getGroups';
        $.ajax(url, {
            data: {},
            dataType: 'json',
            crossDomain: true,
            success: function(data) {
                var node_array = [];

                d3.text("http://localhost:8080/getFileChinavis_group", function(error, group) {
                    if (error) console.log(error);
                    else {
                        group = group.toString().split('\n');
                        for (var i = 0; i < group.length; i++) {
                            group[i] = group[i].toString().split(',');
                        }

                    }
                })
                for (var i = 0; i < data.length; i++) {
                    if (data[i].from == "1041") data[i].subject = "finance";
                    self.group_array[_.indexOf(self.property_class, data[i].subject)].push(data[i].from);
                    node_array.push(data[i].from)
                    data[i].to = data[i].to.toString().split(",");
                    for (var j = 0; j < data[i].to.length; j++) {
                        node_array.push(data[i].to[j]);
                        self.group_array[_.indexOf(self.property_class, data[i].subject)].push(data[i].to[j]);
                    }
                }
                node_array = _.union(node_array);
                for (var i = 0; i < self.group_array.length; i++) self.group_array[i] = _.union(self.group_array[i]);
                var node_class = [],
                    line_class = [];

                function NODE() {}
                NODE.prototype.id = "A";
                NODE.prototype.size;
                NODE.prototype.property;
                NODE.prototype.x;
                NODE.prototype.y;


                function LINE() {}
                LINE.prototype.source = "A";
                LINE.prototype.target = "B";
                LINE.prototype.value;
                LINE.prototype.width;
                LINE.prototype.property;
                LINE.prototype.x1;
                LINE.prototype.x2;
                LINE.prototype.y1;
                LINE.prototype.y2;
                for (var i = 0; i < node_array.length; i++) {
                    node_class[i] = new NODE();
                    node_class[i].id = node_array[i];
                    node_class[i].size = 10;
                    for (var j = 0; j < self.group_array.length; j++) {
                        if (_.contains(self.group_array[j], node_class[i].id)) { node_class[i].property = self.property_class[j]; break; }
                    }
                }
                //add the boss node
                var tmp = new NODE();
                tmp.id = "1067";
                tmp.size = 10;
                tmp.property = "boss";
                node_class.push(tmp);


                var line_index = 0;
                for (var i = 0; i < data.length; i++) {
                    for (var j = 0; j < data[i].to.length; j++) {
                        line_class[line_index] = new LINE();
                        line_class[line_index].source = data[i].from;
                        line_class[line_index].target = data[i].to[j];
                        line_class[line_index].value = 10;
                        line_class[line_index].property = _.indexOf(self.property_class, data[i].subject);
                        line_index++;
                    }
                }
                var boss_connect_node = ["1041", "1068", "1013", "1059", "1007"];
                for (var i = 0; i < boss_connect_node.length; i++) {
                    line_class[line_index] = new LINE();
                    line_class[line_index].source = "1067";
                    line_class[line_index].target = boss_connect_node[i];
                    line_class[line_index].value = 10;
                    line_class[line_index].property = 4;
                    line_index++;
                }
                console.log(node_class)
                console.log(line_class)
                self.force_layout(node_class, line_class);

            },
            error: function(data) {
                console.error("error")
            }
        })
    },
    force_layout: function(node_class, line_class) {
        var self = this;

        var colorScale = ["#EE6A50", "steelblue", "#CAFF70", "orange"];

        var max = d3.max(line_class, function(d) {
                return d.value;
            }),
            min = d3.min(line_class, function(d) {
                return d.value;
            }),
            dis = 200;
        if (max == min) {
            if (max == 0)
                for (var i = 0; i < line_class.length; i++) {
                    line_class[i].width = 0;
                } else
                    for (var i = 0; i < line_class.length; i++) {
                        line_class[i].width = 2;
                    }
        } else {
            for (var i = 0; i < line_class.length; i++) {
                if (line_class[i].value == 0) line_class[i].width = 0;
                else
                    line_class[i].width = ((line_class[i].value - min) / (max - min)) * 2 + 0.5;
            }
        }
        var dis = 100;

        var simulation = d3.forceSimulation()
            .force("link", d3.forceLink().id(function(d) { return d.id; }).distance(function(d) {
                if (max == min) return dis;
                else return dis / 2 - (d.value - min) / (max - min) * (dis / 2) + dis / 2;
            }))
            .force("charge", d3.forceManyBody())
            .force("center", d3.forceCenter(self.width / 2, self.height / 2))
            .force("x", d3.forceX(self.width / 2).strength(0.015))
            .force("y", d3.forceY(self.height / 2).strength(0.015))

        self.graph_line = self.g
            .selectAll("line")
            .data(line_class)
            .enter().append("line")
            .attr("stroke-width", function(d) {
                return d.width;
            })
            .attr("stroke", function(d) {
                if (d.property == 4) return "red";
                return colorScale[d.property];
            })
            .on("mouseover", function(d) {
                tooptip.html("property:" + self.property_class[d.property])
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY + 20) + "px")
                    .style("opacity", 1);
            })
            .on("mouseout", function(d) {
                tooptip.style("opacity", 0.0);
            })

        self.graph_node = self.g
            .selectAll("circle")
            .data(node_class)
            .enter().append("circle")
            .attr("r", function(d) {
                if (d.property == "boss") return 15;
                if (_.contains(self.leader_node, d.id)) return 10;
                return 5;
            })
            .attr("stroke", "white")
            .attr("stroke-width", 1)
            .style("fill", function(d) {
                if (d.property == "boss") return "red";
                return colorScale[_.indexOf(self.property_class, d.property)];
            })
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended))
            .on("mouseover", function(d) {
                draw_view4.draw(d.id);
                draw_view2.get_view2_data(d.id, 0);
                draw_view6.get_view6_data(d.id, 0);
                $("#top_middle_bottom_div").hide();
                $("#sub_top_middle_bottom_div").show();
                self.get_view3_data(d.id, 0, 0);
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
                self.get_view3_data(d.id, 1, 0);
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
            tmp = d.id;

            // self.graph_line
            //     .attr("stroke", function(d, i) {
            //         if (d.source.id == tmp || d.target.id == tmp) return "red";
            //         return colorScale(d.property);
            //     })
            // text.attr("x", function(d) {
            //         return d.x;
            //     })
            //     .attr("y", function(d) {
            //         return d.y + d.radius;
            //     })
        }

        function dragended(d) {
            // self.graph_line
            //     .attr("stroke", function(d) {
            //         return colorScale(d.property);
            //     })
            d3.select(this).classed("active", false);
            if (!d3.event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }

    },
    highlight_node: function(list, flag) {
        var self = this;
        self.graph_node
            .attr("stroke", function(d) {
                if (_.contains(list, d.id))
                    return (flag == 1) ? "black" : "white";
            })
            .attr("stroke-width", 2)
    },
    get_view3_data: function(id, flag) {
        d3.text("http://localhost:8080/getFileChinavis_group", function(error, group) {
            if (error) console.log(error);
            else {
                group = group.toString().split('\n');
                for (var i = 0; i < group.length; i++) {
                    group[i] = group[i].toString().split(',');
                }
                for (var index = 0; index < group.length; index++) {
                    if (_.contains(group[index], id)) {
                        if (flag == 1)
                            draw_view3.get_view3_data(id, group[index], 0);
                        else draw_sub_view3.get_sub_view3_data(id, group[index]);
                        return;
                    }
                }
            }
        })

    },

    zooming: function(svg, g) {
        svg.call(d3.zoom()
            .scaleExtent([0.2, Infinity])
            .on("zoom", zoomed));

        function zoomed() {
            g.attr("transform", d3.event.transform);
        }
    }
}