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
            image.width = 450; // a fake resize
            holder.appendChild(image);
        };

        reader.readAsDataURL(file);
    } else {
        holder.innerHTML += '<p>Uploaded ' + file.name + ' ' + (file.size ? (file.size / 1024 | 0) + 'K' : '');
        console.log(file);
    }
}



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