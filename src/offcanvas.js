const offCanvasTemplate = document.querySelector('.offcanvas-content');

function renderOffcanvas(target) {
    const clone = offCanvasTemplate.cloneNode(true);
    target.replaceChildren(clone);
    attachEventListeners(target);
}

document.getElementById('descriptionMobile').addEventListener('show.bs.offcanvas',
    function () {
        renderOffcanvas(this);
    });

document.getElementById('descriptionDesktop').addEventListener('show.bs.offcanvas',
    function () {
        renderOffcanvas(this);
    });

function attachEventListeners(offCanvasElement) {
    offCanvasElement.querySelector('.btn-close').addEventListener('click', function () {
        let offCanvas = bootstrap.Offcanvas.getInstance(offCanvasElement);
        offCanvas.hide();
    });
}