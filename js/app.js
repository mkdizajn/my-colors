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

/*

 */
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