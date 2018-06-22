var draw_view7 = {
    view: 0,
    div: 0,
    width: 0,
    height: 0,
    g: 0,
    time: 0,
    list: 0,
    ratio: 0,
    initialize: function() {
        var self = this;
        self.div = "#view7";
        self.width = $(self.div).width();
        self.height = $(self.div).height();

        self.view = d3v3.select(self.div).append("svg")
            .attr("id", "view7")
            .attr("width", self.width)
            .attr("height", self.height);
        self.time = ["2017-11-01 00:00:00", "2017-11-05 00:00:00"];
        self.list = ["1125", "1307", "1398", "1113"];
        self.ratio = 120;
    },
    get_view7_data: function(list, time) {
        var self = this;
        if (time != 0) self.time = time;
        if (list != 0) self.list = list;

        var ids = [];
        for (var i = 0; i < self.list.length - 1; i++)
            ids += self.list[i] + ',';
        ids = ids + self.list[self.list.length - 1];
        var url = 'http://localhost:8080/getEmailSubjects?ids=' + ids + '&date1=' + self.time[0] + '&date2=' + self.time[1];;

        $.ajax(url, {
            data: {},
            //dataType: 'json',
            crossDomain: true,
            success: function(data) {
                data = data.toString().split(';')
                compress_data = _.union(data);

                function List_fre() {}
                List_fre.prototype.text = 0;
                List_fre.prototype.size = 0;

                var list_fre = [],
                    tmp = 0;
                $.each(compress_data, function(index, value) {
                    tmp = new List_fre();
                    tmp.text = value;
                    tmp.size = 0;
                    for (var i = 0; i < data.length; i++) {
                        if (data[i] == tmp.text) tmp.size++;
                    }
                    list_fre.push(tmp);
                })
                var size_max = d3.max(list_fre, function(d) {
                    return d.size;
                })
                size_max = (size_max * 1.0 / self.ratio);
                for (var i = 0; i < list_fre.length; i++) list_fre[i].size = Math.round(list_fre[i].size * 1.0 / size_max);

                self.draw(list_fre);

            },
            error: function(data) {
                console.error("error")
            }
        })
    },

    draw: function(frequency_list) {
        var self = this;
        self.remove();


        // frequency_list = [{ "text": "数据", "size": 40 }, { "text": "motion", "size": 15 }, { "text": "forces", "size": 10 }, { "text": "electricity", "size": 15 }, { "text": "movement", "size": 10 }, { "text": "relation", "size": 5 }, { "text": "things", "size": 10 }, { "text": "force", "size": 5 }, { "text": "ad", "size": 5 }, { "text": "energy", "size": 85 }, { "text": "living", "size": 5 }, { "text": "nonliving", "size": 5 }, { "text": "laws", "size": 15 }, { "text": "speed", "size": 45 }, { "text": "velocity", "size": 30 }, { "text": "define", "size": 5 }, { "text": "constraints", "size": 5 }, { "text": "universe", "size": 10 }, { "text": "physics", "size": 120 }, { "text": "describing", "size": 5 }, { "text": "matter", "size": 90 }, { "text": "physics-the", "size": 5 }, { "text": "world", "size": 10 }, { "text": "works", "size": 10 }, { "text": "science", "size": 70 }, { "text": "interactions", "size": 30 }, { "text": "studies", "size": 5 }, { "text": "properties", "size": 45 }, { "text": "nature", "size": 40 }, { "text": "branch", "size": 30 }, { "text": "concerned", "size": 25 }, { "text": "source", "size": 40 }, { "text": "google", "size": 10 }, { "text": "defintions", "size": 5 }, { "text": "two", "size": 15 }, { "text": "grouped", "size": 15 }, { "text": "traditional", "size": 15 }, { "text": "fields", "size": 15 }, { "text": "acoustics", "size": 15 }, { "text": "optics", "size": 15 }, { "text": "mechanics", "size": 20 }, { "text": "thermodynamics", "size": 15 }, { "text": "electromagnetism", "size": 15 }, { "text": "modern", "size": 15 }, { "text": "extensions", "size": 15 }, { "text": "thefreedictionary", "size": 15 }, { "text": "interaction", "size": 15 }, { "text": "org", "size": 25 }, { "text": "answers", "size": 5 }, { "text": "natural", "size": 15 }, { "text": "objects", "size": 5 }, { "text": "treats", "size": 10 }, { "text": "acting", "size": 5 }, { "text": "department", "size": 5 }, { "text": "gravitation", "size": 5 }, { "text": "heat", "size": 10 }, { "text": "light", "size": 10 }, { "text": "magnetism", "size": 10 }, { "text": "modify", "size": 5 }, { "text": "general", "size": 10 }, { "text": "bodies", "size": 5 }, { "text": "philosophy", "size": 5 }, { "text": "brainyquote", "size": 5 }, { "text": "words", "size": 5 }, { "text": "ph", "size": 5 }, { "text": "html", "size": 5 }, { "text": "lrl", "size": 5 }, { "text": "zgzmeylfwuy", "size": 5 }, { "text": "subject", "size": 5 }, { "text": "distinguished", "size": 5 }, { "text": "chemistry", "size": 5 }, { "text": "biology", "size": 5 }, { "text": "includes", "size": 5 }, { "text": "radiation", "size": 5 }, { "text": "sound", "size": 5 }, { "text": "structure", "size": 5 }, { "text": "atoms", "size": 5 }, { "text": "including", "size": 10 }, { "text": "atomic", "size": 10 }, { "text": "nuclear", "size": 10 }, { "text": "cryogenics", "size": 10 }, { "text": "solid-state", "size": 10 }, { "text": "particle", "size": 10 }, { "text": "plasma", "size": 10 }, { "text": "deals", "size": 5 }, { "text": "merriam-webster", "size": 5 }, { "text": "dictionary", "size": 10 }, { "text": "analysis", "size": 5 }, { "text": "conducted", "size": 5 }, { "text": "order", "size": 5 }, { "text": "understand", "size": 5 }, { "text": "behaves", "size": 5 }, { "text": "en", "size": 5 }, { "text": "wikipedia", "size": 5 }, { "text": "wiki", "size": 5 }, { "text": "physics-", "size": 5 }, { "text": "physical", "size": 5 }, { "text": "behaviour", "size": 5 }, { "text": "collinsdictionary", "size": 5 }, { "text": "english", "size": 5 }, { "text": "time", "size": 35 }, { "text": "distance", "size": 35 }, { "text": "wheels", "size": 5 }, { "text": "revelations", "size": 5 }, { "text": "minute", "size": 5 }, { "text": "acceleration", "size": 20 }, { "text": "torque", "size": 5 }, { "text": "wheel", "size": 5 }, { "text": "rotations", "size": 5 }, { "text": "resistance", "size": 5 }, { "text": "momentum", "size": 5 }, { "text": "measure", "size": 10 }, { "text": "direction", "size": 10 }, { "text": "car", "size": 5 }, { "text": "add", "size": 5 }, { "text": "traveled", "size": 5 }, { "text": "weight", "size": 5 }, { "text": "electrical", "size": 5 }, { "text": "power", "size": 5 }];
        // var fre_max = d3.max(frequency_list, function(d) {
        //     return d.size;
        // })
        //console.log("fre_max ", +fre_max);
        //var color = d3v3.scale.linear()
        var color = d3v3.scale.category20();
        // .domain([0, 1, 2, 3, 4, 5, 6, 10, 15, 20, 100])
        // .range(["#ddd", "#ccc", "#bbb", "#aaa", "#999", "#888", "#777", "#666", "#555", "#444", "#333", "#222"]);

        d3v3.layout.cloud().size([self.width * 0.9, self.height * 0.9])
            .words(frequency_list)
            .rotate(0)
            .fontSize(function(d) { return d.size; })
            .on("end", draw)
            .start();

        function draw(words) {
            self.view
                .attr("class", "wordcloud")
                .append("g")
                // without the transform, words words would get cutoff to the left and top, they would
                // appear outside of the SVG area
                .attr("transform", 'translate(' + (self.width * 0.35) + ' ,' + (self.height * 0.6) + ')')
                .selectAll("text")
                .data(words)
                .enter().append("text")
                .style("font-size", function(d) { return d.size + "px"; })
                .style("fill", function(d, i) { return color(i % 18); })
                .attr("transform", function(d) {
                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                })
                .text(function(d) { return d.text; });
        }
    },

    remove: function() {
        var self = this;
        self.view.selectAll("*").remove();
    }
}