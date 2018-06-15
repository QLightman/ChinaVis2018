var draw_view2 = {
    view: 0,
    div: 0,
    width: 0,
    height: 0,
    inner_rect: 0,
    outer_rect: 0,
    arc: 0,
    radius: 0,
    g: 0,
    rect_height: 0,
    text: 0,
    height_position: 0,
    time: 0,
    node_id: 0,
    initialize: function() {
        var self = this;
        self.div = "#view2";
        self.width = $(self.div).width();
        self.height = $(self.div).height();

        self.view = d3.select(self.div).append("svg")
            .attr("id", "view2")
            .attr("width", self.width)
            .attr("height", self.height);
        self.radius = self.height / 3.5;
        self.rect_height = self.height / 4;
        self.g = self.view.append("g");
        self.height_position = self.height * 0.45;
        self.node_id = "1067";
        self.time = ["2017-11-01 00:00:00", "2017-11-05 00:00:00"];

    },

    get_view2_data(id, time) {
        var self = this;
        if (time != 0) self.time = time;
        if (id != 0) self.node_id = id;
        var url = 'http://localhost:8080/getPersonalOverview?id=' + self.node_id + '&date1=' + self.time[0] + '&date2=' + self.time[1];
        $.ajax(url, {
            data: {},
            dataType: 'json',
            crossDomain: true,
            success: function(data) {
                function Person() {}
                Person.prototype.id = "A";
                Person.prototype.avgCheckin = 0;
                Person.prototype.avgCheckout = 0;
                Person.prototype.flowDownList = 0;
                Person.prototype.flowUpList = 0;
                var person = new Person();
                person.id = self.node_id;
                person.avgCheckin = data[0].avgCheckin;
                person.avgCheckin = parseInt(person.avgCheckin.slice(0, 2)) + parseInt(person.avgCheckin.slice(3, 5)) / 60;
                person.avgCheckout = data[0].avgCheckout;
                person.avgCheckout = parseInt(person.avgCheckout.slice(0, 2)) + parseInt(person.avgCheckout.slice(3, 5)) / 60;
                person.flowDownList = data[0].flowDownList.replace("[", "");
                person.flowDownList = person.flowDownList.replace("]", "");
                person.flowDownList = person.flowDownList.toString().split(",");
                person.flowUpList = data[0].flowUpList.replace("[", "");
                person.flowUpList = person.flowUpList.replace("]", "");
                person.flowUpList = person.flowUpList.toString().split(",");
                for (var i in person.flowDownList) person.flowDownList[i] = parseFloat((parseInt(person.flowDownList[i]) / Math.pow(1024, 2)).toFixed(2));
                for (var i in person.flowUpList) person.flowUpList[i] = parseFloat((parseInt(person.flowUpList[i]) / Math.pow(1024, 2)).toFixed(2));

                self.draw(person, data[0].avgCheckin, data[0].avgCheckout);
            },

            error: function(data) {
                console.error("error")
            }
        })
    },
    draw: function(data, check_in, check_out) {
        var self = this,
            Down_scale = d3v3.scale.linear()
            .domain([0, d3.max(data.flowDownList)])
            .range([0, self.rect_height]),
            Up_scale = d3v3.scale.linear()
            .domain([0, d3.max(data.flowUpList)])
            .range([0, self.rect_height]);
        self.remove();

        var dataset = { startAngle: Math.PI * 2 * data.avgCheckin / 24, endAngle: Math.PI * 2 * data.avgCheckout / 24 };
        var inverse_arc = self.view.append("g").append("circle")
            .attr("transform", 'translate(' + (self.width * 0.5) + ' ,' + (self.height_position) + ')')
            .attr("r", self.radius)
            .attr("stroke", "green")
            .attr("stroke-width", "3px")
            .attr("stroke-dasharray", "5,5")
            .attr("fill-opacity", 0)
        var arcPath = d3v3.svg.arc()
            .innerRadius(self.radius)
            .outerRadius(self.radius);
        this.arc = self.view.append("g").append("path")
            .attr("d", arcPath(dataset))
            .attr("transform", 'translate(' + (self.width * 0.5) + ' ,' + (self.height_position) + ')')
            .attr("stroke", "black")
            .attr("stroke-width", "3px")

        var Tran_outer_class = self.generate_Translate(data.flowUpList, Up_scale, "outer");
        self.outer_rect = self.view.append("g")
            .attr("id", "view2_outer_rect")
            .selectAll("rect")
            .data(data.flowUpList)
            .enter().append("rect")
            .attr("width", 5)
            .attr("height", function(d) {
                return Up_scale(d);
            })
            .attr("transform", function(d, i) {
                return "translate(" + (Tran_outer_class[i].x) + "," + (Tran_outer_class[i].y) + ") rotate(" + (Tran_outer_class[i].rotate) + ")";
            })
            .style("fill", "orange")
            .on("mouseover", function(d, i) {
                d3.select(this).raise().classed("active", true);
                tooptip.html(" FlowUp Value:" + d + "(MB)" + "<br>" + "Time Duration:" + self.time_format(i))
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY + 20) + "px")
                    .style("opacity", 1);
            })
            .on("mouseout", function(d) {
                d3.select(this).classed("active", false);
                tooptip.style("opacity", 0.0);
            })

        var Tran_inner_class = self.generate_Translate(data.flowDownList, Down_scale, "inner");
        self.inner_rect = self.view.append("g")
            .attr("id", "view2_inner_rect")
            .selectAll("rect")
            .data(data.flowDownList)
            .enter().append("rect")
            .attr("width", 5)
            .attr("height", function(d) {
                return Down_scale(d);
            })
            .attr("transform", function(d, i) {
                return "translate(" + (Tran_inner_class[i].x) + "," + (Tran_inner_class[i].y) + ") rotate(" + (Tran_inner_class[i].rotate) + ")";
            })
            .style("fill", "steelblue")
            .on("mouseover", function(d, i) {
                d3.select(this).raise().classed("active", true);
                tooptip.html("FlowDown Value:" + d + "(MB)" + "<br>" + "Time Duration:" + self.time_format(i))
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY + 20) + "px")
                    .style("opacity", 1);
            })
            .on("mouseout", function(d) {
                d3.select(this).classed("active", false);
                tooptip.style("opacity", 0.0);
            })


        var Tran_text_class = self.generate_Text(data.avgCheckin, data.avgCheckout);
        self.text = self.view.append("g")
            .attr("id", "view2_text")
            .attr("class", "texts")
            .selectAll("text")
            .data(Tran_text_class)
            .enter().append("text")
            .attr("x", function(d) { return d.x; })
            .attr("y", function(d) { return d.y; })
            .html(function(d, i) {
                if (i == 0)
                    return "avgCheckin: " + "<br>" + check_in;
                return "avgCheckout: " + check_out;
            })


        var node_text = self.view.append("text")
            .attr("class", "texts")
            .attr("x", self.width / 1.2)
            .attr("y", self.height * 0.5)
            .text("id: " + data.id);
    },
    generate_Translate: function(data, scale, type) {
        var self = this;

        function Translate() {}
        Translate.prototype.x = 0;
        Translate.prototype.y = 0;
        Translate.prototype.rotate = 0;
        Translate.prototype.text = 0;

        var Tran_class = new Array();
        var block_distance = 360 / (data.length - 1);
        for (var i = 0; i < data.length; i++) {
            Tran_class[i] = new Translate();
            if (type == "outer") {
                Tran_class[i].x = (self.width * 0.5 + (self.radius + scale(data[i])) * Math.sin(Math.PI * 2 * (i * block_distance / 360)));
                Tran_class[i].y = (self.height_position - (self.radius + scale(data[i])) * Math.cos(Math.PI * 2 * (i * block_distance / 360)));
            } else {
                Tran_class[i].x = (self.width * 0.5 + (self.radius) * Math.sin(Math.PI * 2 * (i * block_distance / 360)));
                Tran_class[i].y = (self.height_position - (self.radius) * Math.cos(Math.PI * 2 * (i * block_distance / 360)));
            }
            Tran_class[i].rotate = i * block_distance;
        }
        return Tran_class;
    },
    generate_Text: function(checkin, checkout) {
        var self = this;

        function Translate() {}
        Translate.prototype.x = 0;
        Translate.prototype.y = 0;

        var Text_class = new Array(2);
        Text_class[0] = new Translate();
        Text_class[0].x = self.width * 0.5;
        Text_class[0].y = self.height * 0.05;
        Text_class[1] = new Translate();
        Text_class[1].x = self.width * 0.5;
        Text_class[1].y = self.height * 0.95;

        return Text_class;
    },
    remove: function() {
        var self = this;
        self.view.selectAll("*").remove();
    },
    time_format: function(i) {
        var self = this;
        var result = "";
        if (i % 2 == 1) result = ((i - 1) / 2) + ":30--" + ((i + 1) / 2) + ":00";
        else result = (i / 2) + ":00--" + (i / 2) + ":30";
        return result;
    }
}