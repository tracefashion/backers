var container = document.querySelector('.container');

container.innerHTML = backers.map(function(hash) {
    var url = 'https://res.cloudinary.com/ceriously/image/upload/avatar_ax5bsq.png';
    //var url = getUrl(hash);
    return '<img class="rounded-circle" width="64" height="64" src="'+url+'" />';
}).join('\n');