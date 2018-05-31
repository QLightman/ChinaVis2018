var draw_view6 = {
    info: d3v5.select("#info"),
    valueUpDiv: d3v5.select('#valueUp'),
    valueDownDiv: d3v5.select('#valueDown'),
    valueTime: d3v5.select('#valueTime'),
    node_id: 0,
    time: 0,
    initialize: function() {
        var self = this;
        d3v5.select('.legent').style('right', 5);
        var root = $('#view6');
        this.margin = {
            left: 15,
            right: 100,
            top: 15,
            bottom: 15
        };
        this.svg = d3v5.select("#draw");
        this.width = root.width() - this.margin.left - this.margin.right;
        this.height = root.height() - this.margin.top - this.margin.bottom;
        self.node_id = "1207";
        self.time = "01";

    },
    get_view6_data(id, time) {
        var self = this;
        if (id != 0) self.node_id = id;
        if (time != 0) self.time = time;
        var url = 'http://localhost:8080//getPersonalDetails?id=' + self.node_id + '&date=2017-11-' + self.time;
        $.ajax(url, {
            data: {},
            dataType: 'json',
            crossDomain: true,
            success: function(data) {
                self.draw(data);
            },

            error: function(data) {
                console.error("error")
            }
        })
    },
    draw: function(data) {
        var xScale = null;
        var which = 'all';
        var showLabel = null;
        var mouseover = () => {
            var coord = d3v5.mouse(this.svg.node());
            var x = xScale.invert(coord[0] - this.margin.left);

            if ((x % 0.5 < 0.2) || ((x - 0.5) % 0.5 < 0.2)) {
                var mod = x % 0.5;
                if (mod < 0.2) {
                    x = x - mod;
                } else {
                    x = 0.5 - mod + x;
                }
                //x计算为.5或者整数的了
                showLabel(x);
            } else {

                this.valueUpDiv.style("opacity", 0.0);
                this.valueDownDiv.style("opacity", 0.0);
                this.valueTime.style("opacity", 0.0);
            }
        };
        this.svg.append('g')
            .attr("transform", `translate(${this.margin.left},${this.margin.top})`)
            .append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', this.width)
            .attr('height', this.height)
            .style('fill', '#fff')
            .on('mousemove', mouseover);
        var currentData = data;

        d3v5.selectAll(".legent div").on('click', function() {
            which = this.getAttribute("data-v");
            draw(currentData);
        });

        var areaG = this.svg.append("g")
            .attr("transform", `translate(${this.margin.left},${this.margin.top})`);

        var axisG = this.svg.append("g")
            .attr("transform", `translate(${this.margin.left},0)`);
        var xx = axisG.append("g")
            .attr('id', 'xAxis')
            .attr("transform", `translate(0,${this.height+ this.margin.top - this.height/2})`);


        var draw = (data) => {
            var tmp = {
                "ftp": [],
                "http": [],
                "mongodb": [],
                "mysql": [],
                "postgresql": [],
                "sftp": [],
                "smtp": [],
                "ssh": [],
                "tds": [],
            };
            tmp.checkin = data.checkin;
            tmp.chekout = data.checkout;
            tmp.login = data.login;
            for (i = 0; i < 48; i++) {
                tmp["ftp"].push({ "up": data["ftp"][i].up != 0 ? Math.log(data["ftp"][i].up) : 0, "down": data["ftp"][i].down != 0 ? Math.log(data["ftp"][i].down) : 0 });
                tmp["http"].push({ "up": data["http"][i].up != 0 ? Math.log(data["http"][i].up) : 0, "down": data["http"][i].down != 0 ? Math.log(data["http"][i].down) : 0 });
                tmp["mongodb"].push({ "up": data["mongodb"][i].up != 0 ? Math.log(data["mongodb"][i].up) : 0, "down": data["mongodb"][i].down != 0 ? Math.log(data["mongodb"][i].down) : 0 });
                tmp["mysql"].push({ "up": data["mysql"][i].up != 0 ? Math.log(data["mysql"][i].up) : 0, "down": data["mysql"][i].down != 0 ? Math.log(data["mysql"][i].down) : 0 });
                tmp["postgresql"].push({ "up": data["postgresql"][i].up != 0 ? Math.log(data["postgresql"][i].up) : 0, "down": data["postgresql"][i].down != 0 ? Math.log(data["postgresql"][i].down) : 0 });
                tmp["sftp"].push({ "up": data["sftp"][i].up != 0 ? Math.log(data["sftp"][i].up) : 0, "down": data["sftp"][i].down != 0 ? Math.log(data["sftp"][i].down) : 0 });
                tmp["smtp"].push({ "up": data["smtp"][i].up != 0 ? Math.log(data["smtp"][i].up) : 0, "down": data["smtp"][i].down != 0 ? Math.log(data["smtp"][i].down) : 0 });
                tmp["ssh"].push({ "up": data["ssh"][i].up != 0 ? Math.log(data["ssh"][i].up) : 0, "down": data["ssh"][i].down != 0 ? Math.log(data["ssh"][i].down) : 0 });
                tmp["tds"].push({ "up": data["tds"][i].up != 0 ? Math.log(data["tds"][i].up) : 0, "down": data["tds"][i].down != 0 ? Math.log(data["tds"][i].down) : 0 });
            }

            function timeTransform(time) {
                if (!time || time === 'none') {
                    return null;
                }
                var timeParts = time.split(":").map(t => +t);
                return timeParts[0] + timeParts[1] / 60;
            }

            function invertTime(num) {
                num = `${num}`;
                var ts = num.split('.').map(t => +t);
                if (ts.length > 1) {
                    //ts[1] = ts[1]/10 * 60;
                    var m = +ts[1] / 10 * 60;
                    return `${ts[0]}:${m<10?'0'+m : m}`
                } else {
                    //ts[1] = 0;
                    return `${ts[0]}:00`
                }
                //return ts;

            }

            function reduceTo(arr, innerIndex, outerIndex) {
                var sum = 0;
                for (var i = 0; i <= outerIndex; i++) {
                    sum += arr[i]['v'][innerIndex]
                }
                //return sum;
                return sum;
            }

            function reduceTo1(arr, innerIndex, outerIndex) {
                var sum = 1;
                for (var i = 0; i <= outerIndex; i++) {
                    sum += arr[i]['v'][innerIndex]
                }
                //return sum;
                return Math.log(sum);
            }

            var color = {
                "http": "#0678BC",
                "sftp": "#FF7700",
                "postgresql": "#00A40F",
                "mongodb": "#EA091D",
                "mysql": "#9E63C5",
                "tds": "#945348",
                "ftp": "#F36DC6",
                "ssh": "#7F7F7F",
                "smtp": "#BABF00"
            };

            var _stackOrder = ["http", "sftp", "postgresql", "mongodb",
                "mysql", "tds", "ftp", "ssh", "smtp"
            ];
            var stackOrder = null;
            if (which === "all") {
                stackOrder = _stackOrder;
            } else {
                var idx = _stackOrder.findIndex(d => d === which);
                stackOrder = [_stackOrder[idx], ..._stackOrder.slice(0, idx), ..._stackOrder.slice(idx + 1, _stackOrder.length)];

                var c = color[which];
                Object.keys(color).forEach(c => color[c] = 'rgb(0,0,0,0)');
                color[which] = c;
            }

            var stackUpArr1 = stackOrder.map(o => ({ id: o, v: data[o].map(d => +d.up) })),

                stackUpData1 = stackUpArr1.map((up, idx, arr) => {
                    return ({
                        id: up.id,
                        v: up.v.map((u, i) => ({
                            x: i / 2,
                            y0: idx === 0 ? 0 : reduceTo1(arr, i, idx - 1),
                            y1: reduceTo1(arr, i, idx),
                            rawD: +u
                        }))
                    })
                }),

                stackUpMax1 = d3v5.max(stackUpData1[stackUpData1.length - 1].v, d => d.y1),

                stackDownArr1 = stackOrder.map(o => ({ id: o, v: data[o].map(d => +d.down) })),
                stackDownData1 = stackDownArr1.map((down, idx, arr) => {
                    return ({
                        id: down.id,
                        v: down.v.map((u, i) => ({
                            x: i / 2,
                            y0: idx === 0 ? 0 : reduceTo1(arr, i, idx - 1),
                            y1: reduceTo1(arr, i, idx),
                            rawD: u
                        }))
                    })
                }),
                stackDownMax1 = d3v5.max(stackDownData1[stackDownData1.length - 1].v, d => d.y1);
            var stackUpArr = stackOrder.map(o => ({ id: o, v: tmp[o].map(d => +d.up) })),

                stackUpData = stackUpArr.map((up, idx, arr) => {
                    return ({
                        id: up.id,
                        v: up.v.map((u, i) => ({
                            x: i / 2,
                            y0: idx === 0 ? 0 : reduceTo(arr, i, idx - 1),
                            y1: reduceTo(arr, i, idx),
                            rawD: +u
                        }))
                    })
                }),

                stackUpMax = d3v5.max(stackUpData[stackUpData.length - 1].v, d => d.y1),

                stackDownArr = stackOrder.map(o => ({ id: o, v: tmp[o].map(d => +d.down) })),
                stackDownData = stackDownArr.map((down, idx, arr) => {
                    return ({
                        id: down.id,
                        v: down.v.map((u, i) => ({
                            x: i / 2,
                            y0: idx === 0 ? 0 : reduceTo(arr, i, idx - 1),
                            y1: reduceTo(arr, i, idx),
                            rawD: u
                        }))
                    })
                }),
                stackDownMax = d3v5.max(stackDownData[stackDownData.length - 1].v, d => d.y1);


            //显示标签
            showLabel = (x) => {
                if (which !== 'all') {
                    var upV = (stackUpData1.find(d => d.id === which)).v;
                    var downV = (stackDownData1.find(d => d.id === which)).v;

                    var upD = upV.find(d => Math.abs(d.x - x) < 0.001);
                    var downD = downV.find(d => Math.abs(d.x - x) < 0.001);

                    if (upD.y1 !== 0 || downD.y1 !== 0) {
                        this.valueTime.style("left", (xScale(x) + this.margin.left - 75) + "px")
                            .style("top", (this.height + this.margin.top - this.height / 2 - 7) + "px")
                            .style("opacity", 1)
                            .html(invertTime(x));
                    }


                    if (downD.y1 !== 0) {
                        this.valueDownDiv.style("left", (xScale(x) + this.margin.left - 75) + "px")
                            .style("top", (this.height + this.margin.top - this.height / 2 + 7) + "px")
                            .style("opacity", 1)
                            .html("down:" + downD.rawD + "M");
                    }

                    if (upD.y1 !== 0) {
                        this.valueUpDiv.style("left", (xScale(x) + this.margin.left - 75) + "px")
                            .style("top", (this.height + this.margin.top - this.height / 2 - 21) + "px")
                            .style("opacity", 1)
                            .html("up:" + upD.rawD + "M");
                    }

                } else {
                    var upD = stackUpData1.map(d => {
                        var v = d.v.find(d => Math.abs(d.x - x) < 0.001);
                        return v;
                    });
                    var downD = stackDownData1.map(d => {
                        var v = d.v.find(d => Math.abs(d.x - x) < 0.001);
                        return v;
                    });


                    var upV = (upD.map(d => d.y1 - d.y0)).reduce(
                        (accumulator, currentValue) => accumulator + currentValue);
                    var downV = (downD.map(d => d.y1 - d.y0)).reduce(
                        (accumulator, currentValue) => accumulator + currentValue);

                    if (downV !== 0 || upV !== 0) {
                        this.valueTime.style("left", (xScale(x) + this.margin.left - 75) + "px")
                            .style("top", (this.height + this.margin.top - this.height / 2 - 7) + "px")
                            .style("opacity", 1)
                            .html(invertTime(x));
                    }

                    if (downV !== 0) {

                        this.valueDownDiv.style("left", (xScale(x) + this.margin.left - 75) + "px")
                            .style("top", (this.height + this.margin.top - this.height / 2 + 7) + "px")
                            .style("opacity", 1)
                            .html(() => downD.map((d, i) => +d.rawD !== 0 ? `<div>${stackOrder[i]}: ${d.rawD}M</div>` : '').join(""));
                    }

                    if (upV !== 0) {

                        var upD2 = upD.filter(u => +u.rawD !== 0);
                        this.valueUpDiv.style("left", (xScale(x) + this.margin.left - 75) + "px")
                            .style("top", (this.height + this.margin.top - this.height / 2 - 7 - 14 * upD2.length) + "px")
                            .style("opacity", 1)
                            .html(() => upD.map((d, i) => +d.rawD !== 0 ? `<div>${stackOrder[i]}: ${d.rawD}M</div>` : '').join(""));
                    }
                }
            };

            var min_x_up = d3v5.min(stackUpData.map(s => s.v.find(d => d.y1 > 0) || { x: 0 }), d => d.x);

            var min_x_down = d3v5.min(stackDownData.map(s => s.v.find(d => d.y1 > 0) || { x: 0 }), d => d.x);

            var min_x = d3v5.min([min_x_down, min_x_up]);


            var max_x_up = d3v5.max(stackDownData.map(s => {
                var f = s.v.filter(d => d.y1 > 0);
                return f.length > 0 ? f : [{ x: 24 }]
            }), d => d[d.length - 1].x);

            var max_x_down = d3v5.max(stackDownData.map(s => {
                var f = s.v.filter(d => d.y1 > 0);
                return f.length > 0 ? f : [{ x: 24 }]
            }), d => d[d.length - 1].x);

            var max_x = d3v5.max([max_x_down, max_x_up]);

            xScale = d3v5.scaleLinear()
                .domain([min_x > 2 ? min_x - 2 : min_x, max_x <= 21.5 ? max_x + 2 : 23.5])
                .range([0, this.width]);



            //region UP area
            var scaleUp = d3v5.scaleLinear()
                .domain([0, stackUpMax])
                .range([this.height / 2, 0]);

            //up面积布局
            var areaUp = d3v5.area()
                .x(d => xScale(d.x))
                .y0(d => scaleUp(d.y0))
                .y1(d => scaleUp(d.y1))
                .curve(d3v5.curveCatmullRom);


            var areaUp_D = areaG.selectAll(".areaUp").data(stackUpData, d => d.id);
            areaUp_D.attr("class", "areaUp")
                .transition().duration(500)
                .attr("d", d => areaUp(d.v))
                .style("fill", (d, i) => color[d.id]);

            areaUp_D.exit().transition().duration(500).attr("d", d => areaUp(d.v.map(d => {
                var _ = Object.assign({}, d);
                _.y0 = 0;
                _.y1 = 0;
                return _;
            }))).remove();
            areaUp_D.enter().append("path")
                .attr("class", "areaUp")
                .attr("d", d => areaUp(d.v.map(d => {
                    var _ = Object.assign({}, d);
                    _.y0 = 0;
                    _.y1 = 0;
                    return _;
                })))
                .style("fill", (d, i) => color[d.id])
                .on('mousemove', mouseover)
                .style("opacity", 0.6)
                .transition().duration(500)
                .attr("d", d => areaUp(d.v));


            //endregion


            //region DOWN area
            var scaleDown = d3v5.scaleLinear()
                .domain([0, stackDownMax])
                .range([this.height / 2, this.height]);

            var areaDown = d3v5.area()
                .x(d => xScale(d.x))
                .y0(d => scaleDown(d.y0))
                .y1(d => scaleDown(d.y1))
                .curve(d3v5.curveCatmullRom);

            var areaDown_D = areaG.selectAll(".areaDown").data(stackDownData, d => d.id);
            areaDown_D.attr("class", "areaDown")
                .transition()
                .duration(500)
                .attr("d", d => areaDown(d.v))
                .style("fill", (d, i) => color[d.id]);

            areaDown_D.enter().append("path")
                .attr("class", "areaDown")
                .attr("d", d => areaDown(d.v.map(d => {
                    var _ = Object.assign({}, d);
                    _.y0 = 0;
                    _.y1 = 0;
                    return _;
                })))
                .style("fill", (d, i) => color[d.id])
                .style("opacity", 0.6)
                .on('mousemove', mouseover)
                .transition()
                .duration(500)
                .attr("d", d => areaDown(d.v));

            areaDown_D.exit().transition().duration(500).attr("d", d => areaDown(d.v.map(d => {
                var _ = Object.assign({}, d);
                _.y0 = 0;
                _.y1 = 0;
                return _;
            }))).remove();
            //endregion

            //region checkIn、checkOut和login 线


            //x轴
            var xAxis = d3v5.axisBottom(xScale);
            xx.call(xAxis);
            d3v5.selectAll("#xAxis text")
                .html(function() {
                    var d = d3v5.select(this);
                    return invertTime(d.html());
                });

            var checkInAndout = [{
                    type: "check",
                    value: timeTransform(data.checkin),
                    raw: data.checkin
                },
                {
                    type: "check",
                    value: timeTransform(data.checkout),
                    raw: data.checkout
                }
            ];
            checkInAndout.push(...data.login.map(login => ({ type: "login", value: timeTransform(login.time), raw: login })));
            //min_x>2?min_x-2:min_x,max_x<=21.5? max_x+2: 23.5


            checkInAndout = checkInAndout.filter(c => c.value !== null);

            checkInAndout = checkInAndout.filter(c => c.value >= (min_x > 2 ? min_x - 2 : min_x));
            checkInAndout = checkInAndout.filter(c => c.value <= (max_x <= 21.5 ? max_x + 2 : 23.5));

            var checkInAndoutG = axisG.selectAll(".check")
                .data(checkInAndout, d => d.value);

            checkInAndoutG.attr("x1", d => xScale(d.value))
                .attr("x2", d => xScale(d.value))
                .attr("y1", 20)
                .attr("y2", this.height + this.margin.top + this.margin.bottom - 20)
                .style("stroke-dasharray", (d) => d.type === "login" ? "10" : "")
                .style("stroke", d => {
                    if (d.type === "login" && d.raw.state !== "success") {
                        return '#FF000A';
                    }
                    return '#000'
                });


            checkInAndoutG.enter()
                .append("line")
                .attr("class", "check")
                .on("mouseover", (d) => {
                    var coord = d3v5.mouse(d3v5.select("body").node());
                    this.info.style("left", (coord[0] + 20) + "px")
                        .style("top", coord[1] + "px")
                        .select("b")
                        .html(
                            () => {
                                if (d.type === 'login') {
                                    return d.raw.time
                                }
                                return d.raw
                                    //d.raw.time
                            });
                })
                .on("mouseout", (d) => {
                    this.info.style("left", "-10000000000000px")
                        .style("top", "-10000000000000px");
                })
                .on('mousemove.ff', mouseover)
                .attr("x1", d => xScale(d.value))
                .attr("x2", d => xScale(d.value))
                .attr("y1", 20)
                .attr("y2", this.height + this.margin.top + this.margin.bottom - 20)
                .style("stroke-dasharray", (d) => d.type === "login" ? "10" : "")
                .style("stroke", d => {
                    if (d.type === "login" && d.raw.state !== "success") {
                        return '#FF000A';
                    }
                    return '#000'
                });

            checkInAndoutG.exit().remove();
            //endregion
        };
        draw(data);
        //return draw;
    }
};