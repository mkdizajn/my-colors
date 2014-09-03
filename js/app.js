/*
	d&d little
 */
var holder = document.getElementById('holder'),
    tests = {
        filereader: typeof FileReader != 'undefined',
        dnd: 'draggable' in document.createElement('span'),
        formdata: !!window.FormData,
        progress: "upload" in new XMLHttpRequest
    },
    support = {
        filereader: document.getElementById('filereader'),
        formdata: document.getElementById('formdata'),
        progress: document.getElementById('progress')
    },
    acceptedTypes = {
        'image/png': true,
        'image/jpeg': true,
        'image/gif': true
    };

if (tests.dnd) {
    holder.ondragover = function() {
        this.className = 'hover';
        return false;
    };
    holder.ondragend = function() {
        this.className = '';
        return false;
    };
    holder.ondrop = function(e) {
        this.className = '';
        e.preventDefault();
        readfiles(e.dataTransfer.files);
        addactions();
    }
} else {
    fileupload.className = 'hidden';
    fileupload.querySelector('input').onchange = function() {
        readfiles(this.files);
    };
}

function addactions() {
    $('#action').removeClass('hidden');
}

function readfiles(files) {
    // debugger;
    var formData = tests.formdata ? new FormData() : null;
    for (var i = 0; i < files.length; i++) {
        if (tests.formdata) formData.append('file', files[i]);
        previewfile(files[i]);
    }
}

/**
 * [prototype.padLeft]
 */
Number.prototype.padLeft = function (n,str){
    return Array(n-String(this).length+1).join(str||'0')+this;
}


/*
main action
 */
function previewfile(file) {
    if (tests.filereader === true && acceptedTypes[file.type] === true) {
        var reader = new FileReader();
        reader.onload = function(event) {
            var image = new Image();
            image.src = event.target.result;

            var canvas = document.getElementsByTagName("canvas")[0];
            var ctx = canvas.getContext("2d");
            ctx.drawImage(image,0,0,image.width / 4, image.height / 4);
            var imageData = ctx.getImageData(0, 0, image.width/4, image.height/4);
            var d = imageData.data;

            r = g = b = v = temp = [];

            for (var i = 0; i < d.length; i += 4) {
                r = d[i];
                g = d[i + 1];
                b = d[i + 2];
                temp.push( (r).padLeft(3) + (g).padLeft(3) + (b).padLeft(3) );
                // v = 0.2126 * r + 0.7152 * g + 0.0722 * b;
                // d[i] = d[i + 1] = d[i + 2] = v
            }

            // remove dups,, 
            var counts = [];
            for(var i = 0; i< temp.length; i++) {
                var num = temp[i];
                counts[num] = counts[num] ? counts[num]+1 : 1;
            }

            temp = Object.keys( counts ).sort().reverse();
            console.log( "rgb: " + temp[0] + " , " + temp[1] + " " + temp[2] + " " + temp[3] + " " + temp[4] );

			ctx.putImageData(imageData, 0,0);
			// ctx.clearRect(0, 0, canvas.width, canvas.height);

            // image.width = 450; // a fake resize
            // holder.appendChild(image);
        };

        reader.readAsDataURL(file);
    } else {
        holder.innerHTML += '<p>Uploaded ' + file.name + ' ' + (file.size ? (file.size / 1024 | 0) + 'K' : '');
        console.log(file);
    }
}

// http://annevankesteren.nl/test/html/canvas/demo/002.html
/**
 * [make some triangles]
 * @param  {[type]} cls [clear canvas before drawing new one..]
 * @param  {[type]} brk [after clear canvas, break fn]
 * @param  {[type]} cnt [triangles count]
 * @param  {[type]} str [do I need to add stroke around triangls?, 1 == if yes ]
 * @return {[type]}     [triagles]
 */
function doit(cls, brk, cnt, str, shp) {
    var canvas = document.getElementsByTagName("canvas")[0];
    var ctx = canvas.getContext("2d");
    if (cls == '1') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    } // clear
    if (brk == '1') {
        return;
    }
    var gra = function(min, max, dec) {
        if (dec == 1) {
            return Math.random() * (max - min) + min;
        } else {
            return Math.ceil(Math.random() * (max - min) + min);
        }
    }
    var cx = cy = 0;
    for (var i = cx = 0; i < cnt; i++) {
        var rgb = [];
        rgb.push(gra(1, 250), gra(1, 250), gra(1, 250), gra(0.8, 1, 1).toFixed(1));
        ctx.beginPath();
        ctx.fillStyle = "rgba(" + rgb.toString() + ")";
        // triangle
        if (shp == "t") {
        	if ( canvas.width - ( cx * 10 ) > 0 ){
        		cx = i * 2;
        	} else {
        		cx  = 0;
        		cy += 100;
        	}
            tmp = [ cx, cy ];
            frs = [ gra( tmp[0] - 50 , tmp[0] + 50 ) ,  gra( tmp[1] - 50 , tmp[1] + 50 ) ];
            ctx.moveTo( tmp[0], tmp[1]);
            ctx.lineTo( frs[0], frs[1] );
            ctx.lineTo( gra( tmp[0] - 200 , tmp[0] + 200 ) ,  gra( tmp[1] - 200 , tmp[1] + 200 ) );
            ctx.lineTo( tmp[0], tmp[1] );
            ctx.lineTo( frs[0], frs[1] );
			ctx.lineJoin = "round";
			ctx.lineWidth = 30;
			ctx.stroke();
            ctx.fill();
		// bezier curve
        } else if (shp == "b") {
            tmp0 = [gra(1, canvas.width ), gra(1, canvas.height )]; // start
            tmp3 = [gra(1, canvas.width ), gra(1, canvas.height )]; // end point
            tmp1 = [gra( tmp0[0] + 200, tmp0[0] - 200  ), gra( tmp0[1] + 200, tmp0[1] - 200 )]; // first poing
            tmp2 = [gra( tmp3[0] + 200, tmp3[0] - 200  ), gra( tmp3[1] + 200, tmp3[1] - 200 )]; // second point
            tmp4 = [gra( tmp3[0] + 200, tmp3[0] - 200  ), gra( tmp3[1] + 200, tmp3[1] - 200 )]; // 5-th point
            ctx.moveTo( tmp0[0], tmp0[1] );
            ctx.bezierCurveTo( tmp1[0], tmp1[1], tmp2[0], tmp2[1], tmp3[0], tmp3[1] );
            ctx.bezierCurveTo( tmp3[0], tmp3[1], tmp4[0], tmp4[1], tmp0[0], tmp0[1] );
            ctx.fill();
        // circle
        } else if ( shp == "c" ){
            ctx.arc(gra(1, canvas.width), gra(1, canvas.width), gra(1, 200), gra(0.1, 0.8, 1).toFixed(1), 2 * Math.PI);
            ctx.fill();
        }
        if (str == 1) {
            ctx.strokeStyle = "rgba(0, 0, 0, " + gra(0.1, 0.8, 1).toFixed(1) + " ) ";
            ctx.lineWidth = gra(1, 5);
            ctx.stroke();
        }
        ctx.closePath();
    }
    ctx.restore();
}


function drawStuff(elem) {
    var gra = function(min, max, dec) {
        if (dec == 1) {
            return Math.random() * (max - min) + min;
        } else {
            return Math.ceil(Math.random() * (max - min) + min);
        }
    }
    var phi = 1.61803399;
    var canvas = document.getElementById(elem);
    var ctx = canvas.getContext("2d");
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    for (var i = 0; i < gra(100, 500); i++) {
        var theta = (i * phi * Math.PI * gra(0.02, 0.8, 1).toFixed(2));
        var r = gra(0.4, 0.8, 1).toFixed(1) * i * 20;
        var xc = r * Math.cos(theta);
        var yc = r * Math.sin(theta);
        var rho = (i / gra(10, 200)) * Math.PI;
        var alpha = (i + 50) / 700;
        var red = Math.floor(193 + (63.0 * Math.sin(rho)));
        var green = Math.floor(192.0 + (63.0 * Math.cos(rho)));
        var blue = Math.floor(Math.sqrt(red));
        ctx.beginPath();
        ctx.fillStyle = "rgba(" + red + ", " + green + ", " + blue + ", " + (1.0 - alpha) + ")";
        ctx.arc(xc, yc, alpha * 40.0, 0, 2 * Math.PI, 0);
        ctx.fill();
        ctx.arc(xc, yc, alpha * 40.0, 0, 2 * Math.PI, 0);
        ctx.strokeStyle = "rgba(0, 0, 0, " + alpha + ")";
        ctx.stroke();
        ctx.closePath();
    }
    ctx.restore();
}


function dd() {
    var phi = 1.61803399;
    var canvas = document.getElementsByTagName("canvas")[0];
    if (canvas.getContext) {
        var ctx = canvas.getContext("2d");
        ctx.save();
        ctx.translate(canvas.width / 2.0, canvas.height / 2.0);
        var i = 0;
        var then = new Date();
        for (var i = 0; i < 300; i++) {
            var theta = (i * phi * Math.PI * 0.05);
            var r = 0.4 * i;
            var xc = r * Math.cos(theta);
            var yc = r * Math.sin(theta);
            var rho = (i / 150.0) * Math.PI;
            var alpha = (i + 50) / 700;
            var red = Math.floor(192.0 + (63.0 * Math.sin(rho)));
            var green = Math.floor(192.0 + (63.0 * Math.cos(rho)));
            var blue = Math.floor(Math.sqrt(red));
            ctx.beginPath();
            ctx.fillStyle = "rgba(" + red + ", " + green + ", " + blue + ", " + (1.0 - alpha) + ")";
            ctx.arc(xc, yc, alpha * 40.0, 0, 2 * Math.PI, 0);
            ctx.fill();
            ctx.arc(xc, yc, alpha * 40.0, 0, 2 * Math.PI, 0);
            ctx.strokeStyle = "rgba(0, 0, 0, " + alpha + ")";
            ctx.stroke();
            ctx.closePath();
        }
        var now = new Date();
        document.getElementsByTagName('p')[0].textContent += " " + (now - then) + "ms";
        ctx.restore();
    }
}


// add linear gradient
// var grd = ctx.createLinearGradient(0, 0, 2000, 2000 );
// grd.addColorStop(0, '#8ED6FF');   
// grd.addColorStop(1, '#004CB3');
// ctx.fillStyle = grd;


// ctx.fillStyle = "rgba(" + red + ", " + green + ", " + blue + ", " + (1.0 - alpha) + ")";
// ctx.arc(xc, yc, alpha * 40.0, 0, 2 * Math.PI, 0);
// ctx.fill();
// ctx.arc(xc, yc, alpha * 40.0, 0, 2 * Math.PI, 0);
// ctx.strokeStyle = "rgba(0, 0, 0, " + alpha + ")";
// ctx.stroke();
// ctx.closePath();


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
        $(this).toggleClass("floating-label-form-group-with-value", !! $(e.target).val());
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
$( document ).ajaxStart(function() {
    $('#netload').removeClass('hidden');
});
/* hide netload */
$( document ).ajaxStop(function() {
    $('#netload').addClass('hidden');
});
