var content = document.querySelector('#content');
var fallbackUrl = 'https://res.cloudinary.com/ceriously/image/upload/avatar_ax5bsq.png';

function newImage() {
    var img = new Image();
    img.className = 'rounded-circle';
    img.width = '64';
    img.height = '64';
    return img;
}

backers.forEach(function(hash) {
    var img = newImage();
    img.onload = function() {
        content.appendChild(img);
    };
    img.onerror = function() {
        /*
        var fallback = newImage();
        fallback.src = fallbackUrl;
        content.appendChild(fallback);
        */
    };
    img.src = getUrl(hash);
});