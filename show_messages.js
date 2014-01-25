function huddoc_message() {
    console.log('never fear, huddoc is here!');
}

function pixelate(measure) {
    return "" + measure + "px";
}

function ghost(selector) {
    el = jQuery(selector);

    var g = document.createElement('div');

    g.style.display = 'block';
    g.style.position = 'absolute';
    g.style.width = pixelate(el.width());
    g.style.height = pixelate(el.height());
    g.style.top = pixelate(el.offset().top);
    g.style.left = pixelate(el.offset().left);
    g.style.background = 'rgba(0,255,0,.4)';
    g.style.color = '#fff';
    g.style.font = 'bold 30px helvetica, arial, sans-serif';
    g.style.zIndex = '9999';

    document.body.appendChild(g);

    return g;
}

function activate() {
    ghost('#header');
}

huddoc_message();