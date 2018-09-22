var publicId = '';
var email = document.querySelector('#email');
var btn = document.querySelector('#select-image');
var img = document.querySelector('#img');
var group = document.querySelector('#group');
var help = document.querySelector('#help');

function sha256(str) {
    // We transform the string into an arraybuffer.
    var buffer = new TextEncoder("utf-8").encode(str);
    return crypto.subtle.digest("SHA-256", buffer).then(function (digest) {
        return hex(digest);
    });
}

function hex(buffer) {
    var hexCodes = [];
    var view = new DataView(buffer);
    for (var i = 0; i < view.byteLength; i += 4) {
        // Using getUint32 reduces the number of iterations needed (we process 4 bytes each time)
        var value = view.getUint32(i)
        // toString(16) will give the hex representation of the number without padding
        var stringValue = value.toString(16)
        // We use concatenation and slice for padding
        var padding = '00000000'
        var paddedValue = (padding + stringValue).slice(-padding.length)
        hexCodes.push(paddedValue);
    }

    // Join all the hex strings into one
    return hexCodes.join("");
}

function isBacker(text) {
    return backers.indexOf(text) > -1;
}

function handleChangeEmail() {
    var emailaddress = email.value;
    sha256(emailaddress).then(function(hash) {
        publicId = hash;
        var backer = isBacker(hash);
        group.style.opacity = backer ? '1' : '0';
        if (!backer) {
            help.textContent = 'That email address is not a backer';
        } else {
            var url = getUrl(hash);
            doesImageExist(url, function(exists) {
                if (exists) {
                    img.src = url;
                    img.width = '256';
                    img.height = '256';
                    btn.style.display = 'none';
                    help.textContent = 'You already uploaded an image';
                } else {
                    btn.style.display = 'inline-block';
                    img.src = "https://res.cloudinary.com/ceriously/image/upload/avatar_ax5bsq.png";
                    help.textContent = 'Hi Friend! Now upload your image, crop to 300x300';
                }
            });
        }
    });
}

function doesImageExist(src, cb) {
    var img = new Image();
    img.onload = function() {
        cb(true);
        img = null;
    };
    img.onerror = function() {
        cb(false);
        img = null;
    };
    img.src = src;
}

function handleCloseWidget(err, list) {
    if (err) {
        console.error(err);
        alert('Oops, something went wrong');
    } else {
        const obj = list[0];
        let url = obj.secure_url;
        console.log(obj);
        try {
            const coords = obj.coordinates.custom[0];
            url = url.replace('/upload', `/upload/x_${coords[0]},y_${coords[1]},w_${coords[2]},h_${coords[3]},c_crop`);
        } catch (e) {
            console.error('failed to crop');
        }
        img.src = url;
        img.width = '256';
        img.height = '256';
        btn.style.display = 'none';
        setTimeout(function() {
            alert('Thanks, you look great! You will see your image on our website soon.');
            window.location.href = 'https://www.tracefashion.co';
        }, 2500);
    }
}

function handleClick() {
    var opts = {
        public_id: publicId,
        cloud_name: 'ceriously',
        upload_preset: 'tracefashion-backers-lxbiusub',
        resource_type: 'image',
        min_image_width: 256,
        min_image_height: 256,
        max_image_width: 1024,
        max_image_height: 1024,
        multiple: false, // single image
        cropping_aspect_ratio: 1, // square image
        cropping_coordinates_mode: 'custom',
        cropping_show_dimensions: true,
        cropping_validate_dimensions: true,
        cropping: 'server',
        theme: 'purple'
    };
    cloudinary.openUploadWidget(opts, handleCloseWidget);
}

btn.addEventListener('click', handleClick, false);
img.addEventListener('click', handleClick, false);
email.addEventListener('keyup', handleChangeEmail, false);