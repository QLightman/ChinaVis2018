var draw_view4 = {
    margin: 0,
    width: 0,
    height: 0,
    gridSize: 0,
    legendElementWidth: 0,
    buckets: 0,
    outtime: 0,
    outday: 0,
    div: 0,
    view: 0,
    initialize: function() {
        var self = this;
        self.div = "#view4";
        self.margin = { top: 50, right: 30, bottom: 100, left: 100 };
        self.width = $(self.div).width() - self.margin.left - self.margin.right;
        self.height = $(self.div).height() - self.margin.top - self.margin.bottom;
        self.gridSize = Math.floor(self.width / 24);
        self.legendElementWidth = self.gridSize * 3;
        self.buckets = 8;
        self.view = d3v3.select("#view4").append("svg")
            .attr("width", self.width + self.margin.left + self.margin.right)
            .attr("height", self.height + self.margin.top + self.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + self.margin.left + "," + self.margin.top + ")");
        self.draw();
    },
    draw: function(id) {
        var self = this;
        var boxess = document.getElementsByName("tt");
        var boxes = document.getElementsByName("test");
        var typeval = 0;
        var up = 0;
        var hello = function() {
            if (boxess[0].checked == true) {
                up = 1;
            }
            if (boxess[1].checked == true) {
                up = 0;
            }
            for (var i = 0; i < boxes.length; i++) {

                if (boxes[i].checked == true) {
                    typeval = 2 * i + parseInt(up);
                }
            }

        }

        //var t1 = window.setInterval("hello()",1000);

        var colors = ["#ffffd9", "#edf8b1", "#c7e9b4", "#7fcdbb", "#41b6c4", "#1d91c0", "#225ea8", "#253494", "#081d58"], // alternatively colorbrewer.YlGnBu[9]
            days = ["1st,Thur", "", "", "", "5th,Mon", "", "", "", "", "", "", "12th,Mon", "", "", "", "", "", "", "19th,Mon", "", "", "", "", "", "", "26th,Mon", "", "", "", ""],
            times = ["1:00AM", "", "", "", "", "6:00AM", "", "", "", "", "", "12:00AM", "", "", "", "", "", "6:00PM", "", "", "", "", "", "12:00PM"];


        var dayLabels = self.view.selectAll(".dayLabel")
            .data(days)
            .enter().append("text")
            .text(function(d) {
                return d;
            })
            .attr("x", 0)
            .attr("y", function(d, i) {
                return i * self.gridSize;
            })
            .style("text-anchor", "end")
            .attr("transform", "translate(-6," + self.gridSize / 1.5 + ")")
            .attr("class", function(d, i) {
                return ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis");
            });

        var timeLabels = self.view.selectAll(".timeLabel")
            .data(times)
            .enter().append("text")
            .text(function(d) {
                return d;
            })
            .attr("x", function(d, i) {
                return i * self.gridSize;
            })
            .attr("y", 0)
            .style("text-anchor", "middle")
            .attr("transform", "translate(" + self.gridSize / 2 + ", -6)")
            .attr("class", function(d, i) {
                return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis");
            });


        var draww = function(data, type) {
            var tyoe = parseInt(type);
            var dataset = [];
            //alert(data[100].value);
            for (var i = 0; i < data.length; i++) {
                dataset[i] = data[i].value[type];
            }

            var maxval = Math.max.apply(Math, dataset);

            var colorScale = d3v3.scale.quantile()
                .domain([0, self.buckets - 1, maxval])
                .range(colors);

            var cards = self.view.selectAll(".hour")
                .data(data, function(d) {
                    return d.day + ':' + d.hour;
                });

            cards.append("title");

            cards.enter().append("rect")
                .attr("x", function(d) {
                    return (d.hour - 1) * self.gridSize;
                })
                .attr("y", function(d) {
                    return (d.day - 1) * self.gridSize;
                })
                .attr("rx", 4)
                .attr("ry", 4)
                .attr("class", "hour bordered")
                .attr("width", self.gridSize)
                .attr("height", self.gridSize)
                .style("fill", colors[0])
                //.on('mouseover', tip.show)
                //.on('mouseout', tip.hide)
                .on("click", function(d) {
                    self.outday = d.day;
                    self.outtime = d.hour;
                    alert(self.outday + " " + self.outtime);
                });

            cards.transition().duration(1000)
                .style("fill", function(d) {
                    return colorScale(d.value[type]);
                });

            cards.select("title").text(function(d) {
                return d.value[type];
            });

            cards.exit().remove();

            var legend = self.view.selectAll(".legend")
                .data([0].concat(colorScale.quantiles()), function(d) {
                    return d;
                });

            legend.enter().append("g")
                .attr("class", "legend");

            legend.append("rect")
                .attr("x", function(d, i) {
                    return self.legendElementWidth * i;
                })
                .attr("y", self.height - 120)
                .attr("width", self.legendElementWidth)
                .attr("height", self.gridSize / 2)
                .style("fill", function(d, i) {
                    return colors[i];
                })
                .on("click", function() {
                    alert(typeval);
                })

            legend.append("text")
                .attr("class", "mono")
                .text(function(d) {
                    if (d < 1000) {
                        return Math.round(d);
                    } else {
                        return d.toExponential(1);
                    }
                })
                .attr("x", function(d, i) {
                    return self.legendElementWidth * i;
                })
                .attr("y", self.height + self.gridSize - 120);

            legend.exit().remove();


        };

        var get_view4_data = function(id) {
            var self = this;
            var url = 'http://localhost:8080/getPersonalAllDetails?id=' + id;
            $.ajax(url, {
                data: {},
                dataType: 'json',
                crossDomain: true,
                success: function(data) {
                    console.log(data);
                    var totaldata = [];
                    for (var j = 1; j < 10; j++) {
                        var currenttime = String("2017-11-0" + j);
                        var currentdata = data[currenttime];
                        //alert(currentdata.smtp[0].down);
                        if (currentdata == null) {
                            for (var i = 0; i < 24; i++) {
                                var a = {};
                                a.day = j;
                                a.hour = i + 1;
                                a.value = [];
                                for (var p = 0; p < 18; p++) {
                                    a.value[p] = 0;
                                }
                                var kk = parseInt(j * 24) + parseInt(i) - parseInt(24);

                                totaldata[kk] = a;
                            }

                        } else {
                            for (var i = 0; i < 24; i++) {
                                var a = {};
                                a.day = j;
                                a.hour = i + 1;
                                a.value = [];
                                var k = parseInt(2 * i);
                                //alert(currentdata.smtp[k].down);
                                a.value[0] = parseInt(currentdata.smtp[k].down) + parseInt(currentdata.smtp[k + 1].down);
                                a.value[1] = parseInt(currentdata.smtp[k].up) + parseInt(currentdata.smtp[k + 1].up);
                                a.value[2] = parseInt(currentdata.ssh[k].down) + parseInt(currentdata.ssh[k + 1].down);
                                a.value[3] = parseInt(currentdata.ssh[k].up) + parseInt(currentdata.ssh[k + 1].up);
                                a.value[4] = parseInt(currentdata.ftp[k].down) + parseInt(currentdata.ftp[k + 1].down);
                                a.value[5] = parseInt(currentdata.ftp[k].up) + parseInt(currentdata.ftp[k + 1].up);
                                a.value[6] = parseInt(currentdata.tds[k].down) + parseInt(currentdata.tds[k + 1].down);
                                a.value[7] = parseInt(currentdata.tds[k].up) + parseInt(currentdata.tds[k + 1].up);
                                a.value[8] = parseInt(currentdata.mysql[k].down) + parseInt(currentdata.mysql[k + 1].down);
                                a.value[9] = parseInt(currentdata.mysql[k].up) + parseInt(currentdata.mysql[k + 1].up);
                                a.value[10] = parseInt(currentdata.mongodb[k].down) + parseInt(currentdata.mongodb[k + 1].down);
                                a.value[11] = parseInt(currentdata.mongodb[k].up) + parseInt(currentdata.mongodb[k + 1].up);
                                a.value[12] = parseInt(currentdata.postgresql[k].down) + parseInt(currentdata.postgresql[k + 1].down);
                                a.value[13] = parseInt(currentdata.postgresql[k].up) + parseInt(currentdata.postgresql[k + 1].up);
                                a.value[14] = parseInt(currentdata.sftp[k].down) + parseInt(currentdata.sftp[k + 1].down);
                                a.value[15] = parseInt(currentdata.sftp[k].up) + parseInt(currentdata.sftp[k + 1].up);
                                a.value[16] = parseInt(currentdata.http[k].down) + parseInt(currentdata.http[k + 1].down);
                                a.value[17] = parseInt(currentdata.http[k].up) + parseInt(currentdata.http[k + 1].up);
                                var kk = parseInt(j * 24) + parseInt(i) - parseInt(24);

                                totaldata[kk] = a;
                            }
                        }
                    }


                    for (var j = 10; j < 31; j++) {
                        var currenttime = "2017-11-" + j;
                        var currentdata = data[currenttime];
                        if (currentdata == null) {
                            for (var i = 0; i < 24; i++) {
                                var a = {};
                                a.day = j;
                                a.hour = i + 1;
                                a.value = [];
                                for (var p = 0; p < 18; p++) {
                                    a.value[p] = 0;
                                }
                                var kk = parseInt(j * 24) + parseInt(i) - parseInt(24);
                                totaldata[kk] = a;
                            }


                        } else {
                            for (var i = 0; i < 24; i++) {
                                var a = {};
                                a.day = j;
                                a.hour = i + 1;
                                a.value = [];
                                var k = 2 * i;
                                a.value[0] = parseInt(currentdata.smtp[k].down) + parseInt(currentdata.smtp[k + 1].down);
                                a.value[1] = parseInt(currentdata.smtp[k].up) + parseInt(currentdata.smtp[k + 1].up);
                                a.value[2] = parseInt(currentdata.ssh[k].down) + parseInt(currentdata.ssh[k + 1].down);
                                a.value[3] = parseInt(currentdata.ssh[k].up) + parseInt(currentdata.ssh[k + 1].up);
                                a.value[4] = parseInt(currentdata.ftp[k].down) + parseInt(currentdata.ftp[k + 1].down);
                                a.value[5] = parseInt(currentdata.ftp[k].up) + parseInt(currentdata.ftp[k + 1].up);
                                a.value[6] = parseInt(currentdata.tds[k].down) + parseInt(currentdata.tds[k + 1].down);
                                a.value[7] = parseInt(currentdata.tds[k].up) + parseInt(currentdata.tds[k + 1].up);
                                a.value[8] = parseInt(currentdata.mysql[k].down) + parseInt(currentdata.mysql[k + 1].down);
                                a.value[9] = parseInt(currentdata.mysql[k].up) + parseInt(currentdata.mysql[k + 1].up);
                                a.value[10] = parseInt(currentdata.mongodb[k].down) + parseInt(currentdata.mongodb[k + 1].down);
                                a.value[11] = parseInt(currentdata.mongodb[k].up) + parseInt(currentdata.mongodb[k + 1].up);
                                a.value[12] = parseInt(currentdata.postgresql[k].down) + parseInt(currentdata.postgresql[k + 1].down);
                                a.value[13] = parseInt(currentdata.postgresql[k].up) + parseInt(currentdata.postgresql[k + 1].up);
                                a.value[14] = parseInt(currentdata.sftp[k].down) + parseInt(currentdata.sftp[k + 1].down);
                                a.value[15] = parseInt(currentdata.sftp[k].up) + parseInt(currentdata.sftp[k + 1].up);
                                a.value[16] = parseInt(currentdata.http[k].down) + parseInt(currentdata.http[k + 1].down);
                                a.value[17] = parseInt(currentdata.http[k].up) + parseInt(currentdata.http[k + 1].up);
                                var kk = parseInt(j * 24) + parseInt(i) - parseInt(24);
                                totaldata[kk] = a;
                            }
                        }
                        //alert("this"+ j +": " + totaldata[0].value[0]);
                    }

                    draww(totaldata, typeval);
                }
            });

        }


        get_view4_data(1207);
        $('input:radio[name="tt"]').change(function() {
            hello();
            get_view4_data(1207);
        });
        $('input:radio[name="test"]').change(function() {
            hello();
            get_view4_data(1207);
        });
    }
}