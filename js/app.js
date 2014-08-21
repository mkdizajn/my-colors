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

function previewfile(file) {
    if (tests.filereader === true && acceptedTypes[file.type] === true) {
        var reader = new FileReader();
        reader.onload = function(event) {
            var image = new Image();
            image.src = event.target.result;

            var canvas = document.getElementsByTagName("canvas")[0];
			var ctx = canvas.getContext("2d");
			ctx.drawImage(image,0,0,image.width / 2, image.height / 2);

	        var imageData = ctx.getImageData(0, 0, image.width/2, image.height/2);
	        var d = imageData.data;

	        r = g = b = v = [];
			for (var i = 0; i < d.length; i += 4) {
			    r = d[i];
			    g = d[i + 1];
			    b = d[i + 2];
			    v = 0.2126 * r + 0.7152 * g + 0.0722 * b;
			    d[i] = d[i + 1] = d[i + 2] = v
			}

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


/**
 * Image filters
 * @type {Object}
 */


Filters = {};
Filters.getPixels = function(img) {
    var c = this.getCanvas(img.width, img.height);
    var ctx = c.getContext('2d');
    ctx.drawImage(img);
    return ctx.getImageData(0, 0, c.width, c.height);
};

Filters.getCanvas = function(w, h) {
    var c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    return c;
};

Filters.filterImage = function(filter, image, var_args) {
    var args = [this.getPixels(image)];
    for (var i = 2; i < arguments.length; i++) {
        args.push(arguments[i]);
    }
    return filter.apply(null, args);
};


Filters.grayscale = function(pixels, args) {
    var d = pixels.data;
    for (var i = 0; i < d.length; i += 4) {
        var r = d[i];
        var g = d[i + 1];
        var b = d[i + 2];
        // CIE luminance for the RGB
        // The human eye is bad at seeing red and blue, so we de-emphasize them.
        var v = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        d[i] = d[i + 1] = d[i + 2] = v
    }
    return pixels;
};


/**
 * dom image attach event handler
 * @type {[type]}
 */
var img = $('#holder img');
img.bind('change', function() {

    var canvases = document.getElementsByTagName('canvas');
    for (var i = 0; i < canvases.length; i++) {
        var c = canvases[i];
        c.parentNode.insertBefore(img.cloneNode(true), c);
        c.style.display = 'none';
    }

    function runFilter(id, filter, arg1, arg2, arg3) {
        var c = document.getElementById(id);
        var s = c.previousSibling.style;
        var b = c.parentNode.getElementsByTagName('button')[0];
        if (b.originalText == null) {
            b.originalText = b.textContent;
        }
        if (s.display == 'none') {
            s.display = 'inline';
            c.style.display = 'none';
            b.textContent = b.originalText;
        } else {
            var idata = Filters.filterImage(filter, img, arg1, arg2, arg3);
            c.width = idata.width;
            c.height = idata.height;
            var ctx = c.getContext('2d');
            ctx.putImageData(idata, 0, 0);
            s.display = 'none';
            c.style.display = 'inline';
            b.textContent = 'Restore original image';
        }
    }

    grayscale = function() {
        runFilter('grayscale', Filters.grayscale);
    }

    brightness = function() {
        runFilter('brightness', Filters.brightness, 40);
    }

}, false);