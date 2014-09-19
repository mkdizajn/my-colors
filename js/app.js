
// GLOBAL namespace
var mk = mk || {}; d = document;
// our common methods and props
mk.com = {
    ver: 0.1,
    lnk: 'http://mkdizajn.github.io/my-colors',
    tests: {
        filereader: typeof FileReader != 'undefined',
        dnd: 'draggable' in d.createElement('span'),
        formdata: !!window.FormData,
        progress: "upload" in new XMLHttpRequest
    },
    acceptedTypes: {
        'image/png': true,
        'image/jpeg': true,
        'image/gif': true
    },
    // statics for app
    holder: d.getElementById('holder'),
    canvas: d.getElementById('c0'),
    ctx: d.getElementById('c0').getContext('2d'),

    nodups: [], // image data holder
    // pad number or string with zeros: val = value, n = number of total, str = zero default
    padLeft: function(val, n, str) { 
        return Array(n - String(val).length + 1).join(str || '0') + val;
    },
    // return random number with min & max limits, if 3th par is true returns decimal
    random: function(min, max, dec) {
        if (dec) {
            return Math.random() * (max - min) + min;
        } else {
            return Math.ceil(Math.random() * (max - min) + min);
        }
    },
    rgbcolor: function(index) {
        return 'rgb(' + nodups[index].toString().substr(0,3) + ',' + nodups[index].toString().substr(3,3) + ',' + nodups[index].toString().substr(6,3) + ')' ;
    },
    hexcolor: function(index, isArray, solo) {
        // returns "#411946" istead of : "254254254" 
        if(isArray){
            var niz = [];
            for(var i = 0; i < index.length; i++ ){
                var tmp ='#'+ parseInt(nodups[ index[ i ] ].substr(0,3)).toString(16)  
                            + parseInt(nodups[ index[ i ] ].substr(3,3)).toString(16) 
                            + parseInt(nodups[ index[ i ] ].substr(6,3)).toString(16);
                niz.push(tmp);
            }
            return niz;
        } else {
            var link = '';
            if(solo){
                link = '#'  + parseInt(index.substr(0,3)).toString(16)
                                + parseInt(index.substr(3,3)).toString(16)
                                + parseInt(index.substr(6,3)).toString(16);
            } else {
                link = '#'  + parseInt(nodups[ index ].substr(0,3)).toString(16)  
                                + parseInt(nodups[ index ].substr(3,3)).toString(16) 
                                + parseInt(nodups[ index ].substr(6,3)).toString(16);
            }
            return link;
        }
    },

    readfiles: function(files) {
        // debugger;
        var formData = this.tests.formdata ? new FormData() : null;
        for (var i = 0; i < files.length; i++) {
            if (this.tests.formdata) formData.append('file', files[i]);
            this.process(files[i]);
        }
    },
    // method to render background. accepts array of colors
    makeback: function(){

        var niz = [];
        for( var j = 0; j < 5; j++){
            niz.push( mk.com.random(0, nodups.length - 1 ) );
        }

        $('#cl1').css('background', mk.com.rgbcolor( niz[0] ) );
        $('#cl2').css('background', mk.com.rgbcolor( niz[1] ) );
        $('#cl3').css('background', mk.com.rgbcolor( niz[2] ) );
        $('#cl4').css('background', mk.com.rgbcolor( niz[3] ) );
        $('#cl5').css('background', mk.com.rgbcolor( niz[4] ) );

        $('#app-main').css({"background-image": "none" }); // clear back

        var currentTrianglifier;
        var currentPattern;

        currentTrianglifier = new Trianglify({
            "bleed": 150,
            "cellsize": 150,
            "cellpadding": 15,
            "noiseIntensity": 0,
            "x_gradient": mk.com.hexcolor( niz, 1 ) ,
            "y_gradient": mk.com.hexcolor( niz, 1 ) 
        });

        currentPattern = currentTrianglifier.generate( $('#app-main').width() , $('#app-main').height() + 400 );
        // make background pic
        $('#app-main').css({"background-image": currentPattern.dataUrl});
        // make actions buttons visible
        $('#action').removeClass('hidden');
        // download link update
        $('#dwl').attr("href", $('#app-main').css( "background-image" ) );

        mk.com.ctx.restore();

    }, // end makeback method
    // start process
    process: function(file) {
        if (this.tests.filereader === true && this.acceptedTypes[file.type] === true) {
            var reader = new FileReader();
            reader.onload = function(event) {
                var then = new Date();
                var image = new Image();
                image.src = event.target.result;

                var dim1 = (image.height > 250) ? +parseFloat(image.height / 250).toFixed(2) : 1;
                var dim2 = Math.round(image.width / dim1);

                mk.com.ctx.drawImage(image, 0, 0, dim2, image.height / dim1);
                // smaller image
                var imageData = mk.com.ctx.getImageData(0, 0, dim1, image.height / dim1);
                // original image
                var imageData1 = mk.com.ctx.getImageData(0, 0, image.width, image.height );
                var d = imageData.data;

                r = g = b = temp = [];

                for (var i = 0; i < d.length; i += 4) {
                    r = d[i];
                    g = d[i + 1];
                    b = d[i + 2];
                    temp.push(mk.com.padLeft((r),3) + mk.com.padLeft((g),3) + mk.com.padLeft((b),3));
                }

                // remove dups,, 
                nodups = counts = [];
                for (var i = 0; i < temp.length; i++) {
                    var num = temp[i];
                    counts[num] = counts[num] ? counts[num] + 1 : 1;
                }

                nodups = Object.keys(counts).sort().reverse(); // colors array distinct

                if( nodups.length > 5 ){
                    mk.com.ctx.save();
                    mk.com.ctx.clearRect( 0 , 0 , mk.com.ctx.canvas.width , mk.com.ctx.canvas.height );
                    mk.com.ctx.putImageData(imageData1, 0, 0); // DRAW IMAGE on c0 canvas
                    // call makeback method
                    mk.com.makeback();
                } else {
                    $('#excerpt').text('Pic has two few colors ?');
                }
            };
            reader.readAsDataURL(file);
        } // end if tests are ok!
    },  // end process 
    processvoronoi: function(){

        var w = $('#app-main').width(),//window.innerWidth > 960 ? 960 : (window.innerWidth || 960),
            h = $('#app-main').height(),//window.innerHeight > 500 ? 500 : (window.innerHeight || 500),
            radius = 5.25,
            links = [],
            simulate = true,
            zoomToAdd = true,
            // https://github.com/mbostock/d3/blob/master/lib/colorbrewer/colorbrewer.js#L105
            color = d3.scale.quantize().domain([10000, 7250]).range(["#dadaeb","#bcbddc","#9e9ac8","#807dba","#6a51a3","#54278f","#3f007d"])

        var numVertices = (w*h) / 3000;
        var vertices = d3.range(numVertices).map(function(i) {
            angle = radius * (i+10);
            return {x: angle*Math.cos(angle)+(w/2), y: angle*Math.sin(angle)+(h/2)};
        });
        var d3_geom_voronoi = d3.geom.voronoi().x(function(d) { return d.x; }).y(function(d) { return d.y; })
        var prevEventScale = 1;
        var zoom = d3.behavior.zoom().on("zoom", function(d,i) {
            if (zoomToAdd){
              if (d3.event.scale > prevEventScale) {
                  angle = radius * vertices.length;
                  vertices.push({x: angle*Math.cos(angle)+(w/2), y: angle*Math.sin(angle)+(h/2)})
              } else if (vertices.length > 2 && d3.event.scale != prevEventScale) {
                  vertices.pop();
              }
              force.nodes(vertices).start()
            } else {
              if (d3.event.scale > prevEventScale) {
                radius+= .01
              } else {
                radius -= .01
              }
              vertices.forEach(function(d, i) {
                angle = radius * (i+10);
                vertices[i] = {x: angle*Math.cos(angle)+(w/2), y: angle*Math.sin(angle)+(h/2)};
              });
              force.nodes(vertices).start()
            }
            prevEventScale = d3.event.scale;
        });

    },
    update: function(e) {
        path = path.data(d3_geom_voronoi(vertices))
        path.enter().append("path")
            // drag node by dragging cell
            .call(d3.behavior.drag()
              .on("drag", function(d, i) {
                  vertices[i] = {x: vertices[i].x + d3.event.dx, y: vertices[i].y + d3.event.dy}
              })
            )
            .style("fill", function(d, i) { return color(0) })
        path.attr("d", function(d) { return "M" + d.join("L") + "Z"; })
            .transition().duration(150).style("fill", function(d, i) { return color(d3.geom.polygon(d).area()) })
        path.exit().remove();

        circle = circle.data(vertices)
        circle.enter().append("circle")
              .attr("r", 0)
              .transition().duration(1000).attr("r", 5);
        circle.attr("cx", function(d) { return d.x; })
              .attr("cy", function(d) { return d.y; });
        circle.exit().transition().attr("r", 0).remove();

        link = link.data(d3_geom_voronoi.links(vertices))
        link.enter().append("line")
        link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; })

        link.exit().remove()

        if(!simulate) force.stop()
    } // end update

} // end mk class



if ( mk.com.tests.dnd ) {
    mk.com.holder.ondragover = function() {
        this.className = 'hover';
        return false;
    };
    mk.com.holder.ondragend = function() {
        this.className = '';
        return false;
    };
    mk.com.holder.ondrop = function(e) {
        this.className = '';
        e.preventDefault();
        mk.com.readfiles(e.dataTransfer.files);
    }
}

/**
 * clear area and back
 * @return {[type]} [clear html]
 */
$( document ).on( 'click', '#cls', function(){
    mk.com.makeback();
    $('#dwl').attr("href", mk.com.canvas.toDataURL("image/png"));
} );

// ##################################
// ##################################
// ##################################
// ##################################
// ##################################
// custom theme js
// ##################################

// jQuery for page scrolling feature - requires jQuery Easing plugin
$(function() {
    $('.page-scroll a').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 700, 'easeInOutExpo');
        event.preventDefault();
    });
});

// Floating label headings for the contact form
$(function() {
    $("body").on("input propertychange", ".floating-label-form-group", function(e) {
        $(this).toggleClass("floating-label-form-group-with-value", !!$(e.target).val());
    }).on("focus", ".floating-label-form-group", function() {
        $(this).addClass("floating-label-form-group-with-focus");
    }).on("blur", ".floating-label-form-group", function() {
        $(this).removeClass("floating-label-form-group-with-focus");
    });
});

// Highlight the top nav as scrolling occurs
$('body').scrollspy({
    target: '.navbar-fixed-top'
})

// Closes the Responsive Menu on Menu Item Click
$('.navbar-collapse ul li a').click(function() {
    $('.navbar-toggle:visible').click();
});

/* show netload */
$(document).ajaxStart(function() {
    $('#netload').removeClass('hidden');
});
/* hide netload */
$(document).ajaxStop(function() {
    $('#netload').addClass('hidden');
});
