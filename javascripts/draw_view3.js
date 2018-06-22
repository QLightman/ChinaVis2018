var draw_view3 = {
    data: 0,
    height: 0,
    width: 0,
    div: 0,
    view: 0,
    graph_line: 0,
    yScale: 0,
    xScale: 0,
    time: 0,
    list: 0,
    node_id: 0,
    initialize: function(min, max) {
        var self = this;
        self.div = "#view3";
        self.width = $(self.div).width();
        self.height = $(self.div).height();
        self.view = d3v3.select(self.div).append("svg")
            .attr("width", self.width)
            .attr("height", self.height);
        self.node_id = "1125";
        self.time = ["2017-11-01 00:00:00", "2017-11-05 00:00:00"];
        self.list = ["1125", "1307", "1398", "1113"];
    },
    get_view3_data: function(chosen_id, list, time) {
        var self = this;
        if (time != 0) self.time = time;
        if (chosen_id != 0) self.node_id = chosen_id;
        if (list != 0) self.list = list;

        var ids = [];
        for (var i = 0; i < self.list.length - 1; i++)
            ids += self.list[i] + ',';
        ids = ids + self.list[self.list.length - 1];

        var url = 'http://localhost:8080/getGroupOverview?ids=' + ids + '&date1=' + self.time[0] + '&date2=' + self.time[1];
        $.ajax(url, {
            data: {},
            dataType: 'json',
            crossDomain: true,
            success: function(data) {
                for (var i = 0; i < self.list.length; i++) {
                    data[i].avgFlowup = parseFloat((parseInt(data[i].avgFlowup) / (Math.pow(1024, 2))).toFixed(2));
                    data[i].avgFlowDown = parseFloat((parseInt(data[i].avgFlowDown) / (Math.pow(1024, 2))).toFixed(2));

                    if ((data[i].avgCheckin == 'null')) data[i].avgCheckin = 0;
                    else
                        data[i].avgCheckin = parseInt(data[i].avgCheckin.slice(0, 2)) + parseInt(data[i].avgCheckin.slice(3, 5)) / 60;
                    if ((data[i].avgCheckout == 'null')) data[i].avgCheckout = 0;
                    else
                        data[i].avgCheckout = parseInt(data[i].avgCheckout.slice(0, 2)) + parseInt(data[i].avgCheckout.slice(3, 5)) / 60;
                }
                self.draw(self.node_id, data);
            },
            error: function(data) {
                console.error("error")
            }
        })
    },
    draw: function(chosen_id, data) {
        var self = this;
        self.remove();
        var property = $('input:radio:checked').val();

        var h_min = d3.min(data, function(d) {
            return d.avgCheckin;
        })
        var h_max = d3.max(data, function(d) {
            return d.avgCheckout;
        })
        var z_min = d3.min(data, function(d) {
            if (property == "avgFlowDown")
                return d.avgFlowDown;
            else if (property == "avgFlowup")
                return d.avgFlowup;
            else if (property == "IpError")
                return d.totalIpError;
            else if (property == "IdError")
                return d.totalIdError;
            else if (property == "IpError-IdError")
                return d.totalIpError - d.totalIdError;
            return d.avgLog;
        })
        var z_max = d3.max(data, function(d) {
            if (property == "avgFlowDown")
                return d.avgFlowDown;
            else if (property == "avgFlowup")
                return d.avgFlowup;
            else if (property == "IpError")
                return d.totalIpError;
            else if (property == "IdError")
                return d.totalIdError;
            else if (property == "IpError-IdError")
                return d.totalIpError - d.totalIdError;
            return d.avgLog;
        })
        self.yScale = d3v3.scale.linear()
            .domain([z_min - (z_max - z_min) * 0.1, z_max])
            .range([0, self.height * 0.8]);
        var yAxis = d3v3.svg.axis()
            .scale(self.yScale)
            .ticks(8)
            .orient("left");
        self.yScale.range([self.height * 0.8, 0]);

        self.xScale = d3v3.scale.linear()
            .domain([h_min, h_max])
            .range([0, self.width * 0.9]);
        var xAxis = d3v3.svg.axis()
            .scale(self.xScale)
        var gxAxis = self.view.append("g")
            .attr("id", "view3_gx")
            .attr("transform", 'translate(' + (self.width * 0.1) + ',' + (self.height * 0.9) + ')')
            .attr("class", "axis");

        var gyAxis = self.view.append("g")
            .attr("id", "view3_gy")
            .attr("transform", 'translate(' + (self.width * 0.1) + ',' + (self.height * 0.1) + ')')
            .attr("class", "axis");
        gxAxis.call(xAxis);
        gyAxis.call(yAxis);
        var tmp_value = 0;
        self.yScale.range([0, self.height * 0.8]);

        self.graph_line = self.view.append("g")
            .attr("id", "view3_line")
            .selectAll("line")
            .data(data)
            .enter().append("line")
            .attr("x1", function(d) {
                return self.xScale(d.avgCheckin) + (self.width * 0.1);
            })
            .attr("x2", function(d) {
                return self.xScale(d.avgCheckout) + (self.width * 0.1);
            })
            .attr("y1", function(d) {
                if (property == "avgFlowDown")
                    tmp_value = (d.avgFlowDown);
                else if (property == "avgFlowup")
                    tmp_value = (d.avgFlowup);
                else if (property == "IpError")
                    tmp_value = d.totalIpError;
                else if (property == "IdError")
                    tmp_value = d.totalIdError;
                else if (property == "IpError-IdError")
                    tmp_value = d.totalIpError - d.totalIdError;
                else tmp_value = (d.avgLog);

                return self.height * 0.9 - self.yScale(tmp_value);
            })
            .attr("y2", function(d) {
                if (property == "avgFlowDown")
                    tmp_value = (d.avgFlowDown);
                else if (property == "avgFlowup")
                    tmp_value = (d.avgFlowup);
                else if (property == "IpError")
                    tmp_value = d.totalIpError;
                else if (property == "IdError")
                    tmp_value = d.totalIdError;
                else if (property == "IpError-IdError")
                    tmp_value = d.totalIpError - d.totalIdError;
                else tmp_value = (d.avgLog);
                return self.height * 0.9 - self.yScale(tmp_value);
            })
            .attr("stroke", function(d) {
                if (d.staffId == chosen_id) return "red";
                return "steelblue";
            })
            .attr("opacity", 0.5)
            .attr("stroke-width", function(d) {
                if (d.staffId == chosen_id) return 3;
                return 2;
            })
            .on("mouseover", function(d) {
                if (property == "avgFlowDown")
                    tmp_value = (d.avgFlowDown);
                else if (property == "avgFlowup")
                    tmp_value = (d.avgFlowup);
                else if (property == "IpError")
                    tmp_value = d.totalIpError;
                else if (property == "IdError")
                    tmp_value = d.totalIdError;
                else if (property == "IpError-IdError")
                    tmp_value = d.totalIpError - d.totalIdError;
                else tmp_value = (d.avgLog);
                d3.select(this).raise().classed("active", true);

                tooptip.html(d.staffId + " " + property + " Value: " + tmp_value)
                    .style("left", (d3v3.event.pageX) + "px")
                    .style("top", (d3v3.event.pageY + 20) + "px")
                    .style("opacity", 1);
            })
            .on("mouseout", function(d) {
                d3.select(this).classed("active", false);
                tooptip.style("opacity", 0.0);
            })

        $("input[type='radio']").change(function() {
            draw_view3.draw(chosen_id, data);
        });
        // $("#range_slider").change(function() {
        //     var value = $(this).val();
        //     self.graph_line
        //         .attr("opacity", function(d) {
        //             if (property == "avgFlowDown")
        //                 tmp_value = (d.avgFlowDown);
        //             else if (property == "avgFlowup")
        //                 tmp_value = (d.avgFlowup);
        //             else tmp_value = (d.avgLog);
        //             if ((tmp_value - z_min) >= ((z_max - z_min) * value * 0.01)) return 1;
        //             return 0.2;
        //         })
        // })
        // d3.select("#range_slider").on("mouseover", function(d) {
        //         tooptip.html($(this).val() + "%")
        //             .style("left", (d3.event.pageX - 10) + "px")
        //             .style("top", (d3.event.pageY + 20) + "px")
        //             .style("opacity", 1);
        //     })
        //     .on('mousemove', function(d) {
        //         tooptip.html($(this).val() + "%")
        //         tooptip.style("left", (d3.event.pageX - 10) + "px")
        //             .style("top", (d3.event.pageY + 20) + "px")
        //     })
        //     .on("mouseout", function(d) {
        //         tooptip.style("opacity", 0.0);
        //     })


    },
    remove: function() {
        var self = this;
        self.view.selectAll("*").remove();
    },
    myIsNaN: function(value) {
        return value !== value;
    }
}