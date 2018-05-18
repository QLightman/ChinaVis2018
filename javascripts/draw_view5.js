var draw_view5 = {
    height: 0,
    height2: 0,
    width: 0,
    div: 0,
    view: 0,
    margin: 0,
    margin2: 0,
    initialize: function() {
        var self = this;
        self.div = "#view5";
        self.margin = { top: 20, right: 20, bottom: 90, left: 50 };
        self.margin2 = { top: 230, right: 20, bottom: 30, left: 50 };
        self.width = $(self.div).width() - self.margin.left - self.margin.right;
        self.height = $(self.div).height() - self.margin.top - self.margin.bottom;
        self.height2 = $(self.div).height() - self.margin2.top - self.margin2.bottom;

        self.view = d3.select(self.div).append("svg")
            .attr("width", self.width + self.margin.left + self.margin.right)
            .attr("height", self.height + self.margin.top + self.margin.bottom);
        self.draw();
    },
    draw: function() {
        var self = this;
        var list = [];

        var parseTime = d3.timeParse("%m" + "%d,%H");

        var x = d3.scaleTime().range([0, self.width]),
            x2 = d3.scaleTime().range([0, self.width]),
            y = d3.scaleLinear().range([self.height, 0]),
            y2 = d3.scaleLinear().range([self.height2, 0]);

        var xAxis = d3.axisBottom(x).tickSize(0),
            xAxis2 = d3.axisBottom(x2).tickSize(0),
            yAxis = d3.axisLeft(y).tickSize(0);

        var brush = d3.brushX()
            .extent([
                [0, 0],
                [self.width, self.height2]
            ])
            .on("brush", brushed);

        var zoom = d3.zoom()
            .scaleExtent([1, Infinity])
            .translateExtent([
                [0, 0],
                [self.width, self.height]
            ])
            .extent([
                [0, 0],
                [self.width, self.height]
            ])
            .on("zoom", zoomed);



        self.view.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", self.width)
            .attr("height", self.height);



        var focus = self.view.append("g")
            .attr("class", "focus")
            .attr("transform", "translate(" + self.margin.left + "," + self.margin.top + ")");

        var context = self.view.append("g")
            .attr("class", "context")
            .attr("transform", "translate(" + self.margin2.left + "," + self.margin2.top + ")");
        var draww = function(data) {
            data.forEach(function(d) {

                d.day = parseTime("11" + d.day + "," + d.hour);
            });


            var xMin = d3.min(data, function(d) {
                return d.day;
            });
            var xMax = d3.max(data, function(d) {
                return d.day;
            });
            var yMax = 150;
            x.domain([xMin, xMax]);
            y.domain([0, yMax]);
            x2.domain(x.domain());
            y2.domain(y.domain());

            var num_messages = function(dataArray, domainRange) {
                return d3.sum(dataArray, function(d) {
                    return d.day >= domainRange.domain()[0] && d.day <= domainRange.domain()[1];
                })
            }

            // append scatter plot to main chart area
            var messages = focus.append("g");
            messages.attr("clip-path", "url(#clip)");
            messages.selectAll("message")
                .data(data)
                .enter().append("rect")
                .attr('class', 'message')
                .attr("width", 5)
                .attr("height", function(d) {
                    return y(d.count) + 10000000000000;
                })
                .attr("fill", "brown")
                .style("opacity", 0.4)
                .attr("x", function(d) {
                    return x(d.day);
                })
                .attr("y", function(d) {
                    return y(d.count);
                })
                .on("click", function(d) {

                    d3.select(this)
                        .attr("fill", "yellow");
                    list = d.idList;
                    alert(list);
                })
                .on("mouseout", function() {
                    d3.select(this)
                        .transition()
                        .duration(500)
                        .attr("fill", "brown");
                })
            focus.append("g")
                .attr("class", "axis x-axis")
                .attr("transform", "translate(0," + self.height + ")")
                .call(xAxis);

            focus.append("g")
                .attr("class", "axis axis--y")
                .call(yAxis);

            // Summary Stats
            focus.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - self.margin.left)
                .attr("x", 0 - (self.height / 2))
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .text("Messages (in the day)");

            focus.append("text")
                .attr("x", self.width - self.margin.right)
                .attr("dy", "1em")
                .attr("text-anchor", "end")
                .text("Messages: " + num_messages(data, x));

            self.view.append("text")
                .attr("transform",
                    "translate(" + ((self.width + self.margin.right + self.margin.left) / 2) + " ," +
                    (self.height + self.margin.top + self.margin.bottom) + ")")
                .style("text-anchor", "middle")
                .text("Date");

            self.view.append("rect")
                .attr("class", "zoom")
                .attr("width", self.width)
                .attr("height", self.height)
                .attr("transform", "translate(" + self.margin.left + "," + self.margin.top + ")")
                .call(zoom);

            // append scatter plot to brush chart area
            var messages = context.append("g");
            messages.attr("clip-path", "url(#clip)");
            messages.selectAll("message")
                .data(data)
                .enter().append("circle")
                .attr('class', 'messageContext')
                .attr("r", 4)
                .style("fill", "blue")
                .style("opacity", .5)
                .attr("cx", function(d) {
                    return x2(d.day);
                })
                .attr("cy", function(d) {
                    return y2(d.count);
                })

            context.append("g")
                .attr("class", "axis x-axis")
                .attr("transform", "translate(0," + self.height2 + ")")
                .call(xAxis2);

            context.append("g")
                .attr("class", "brush")
                .call(brush)
                .call(brush.move, x.range());

            function brushed() {
                if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
                var s = d3.event.selection || x2.range();
                x.domain(s.map(x2.invert, x2));
                console.log(x.domain());
                focus.selectAll(".message")
                    .attr("x", function(d) {
                        return x(d.day);
                    })
                    .attr("y", function(d) {
                        return y(d.count);
                    })
                focus.select(".x-axis").call(xAxis);
                self.view.select(".zoom").call(zoom.transform, d3.zoomIdentity
                    .scale(self.width / (s[1] - s[0]))
                    .translate(-s[0], 0));
            }

            function zoomed() {
                if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
                var t = d3.event.transform;
                focus.selectAll(".message")
                    .attr("x", function(d) {
                        return x(d.day);
                    })
                    .attr("y", function(d) {
                        return y(d.count);
                    });
                focus.select(".x-axis").call(xAxis);
                context.select(".brush").call(brush.move, x.range().map(t.invertX, t));

            }
        }

        function get_view4_data() {
            var self = this;
            var url = 'http://localhost:8080/getDetailTimeLineData'
            $.ajax(url, {
                data: {},
                dataType: 'json',
                crossDomain: true,
                success: function(data) {
                    console.log(data);
                    draww(data);
                }
            });

        }


        //create brush function redraw scatterplot with selection
        function brushed() {
            if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
            var s = d3.event.selection || x2.range();
            x.domain(s.map(x2.invert, x2));
            console.log(x.domain());

            focus.selectAll(".message")
                .attr("x", function(d) {
                    return x(d.day);
                })
                .attr("y", function(d) {
                    return y(d.count);
                })
            focus.select(".x-axis").call(xAxis);
            self.view.select(".zoom").call(zoom.transform, d3.zoomIdentity
                .scale(self.width / (s[1] - s[0]))
                .translate(-s[0], 0));
        }

        function zoomed() {
            if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
            var t = d3.event.transform;
            focus.selectAll(".message")
                .attr("x", function(d) {
                    return x(d.day);
                })
                .attr("y", function(d) {
                    return y(d.count);
                });
            focus.select(".x-axis").call(xAxis);
            context.select(".brush").call(brush.move, x.range().map(t.invertX, t));

        }
        get_view4_data();
    }
}