let offCanvasContent = document.querySelector('.offcanvas-content').innerHTML;

document.getElementById('descriptionMobile').addEventListener('show.bs.offcanvas',
    function () {
        this.innerHTML = offCanvasContent;
        attachEventListeners(this);
    });

document.getElementById('descriptionDesktop').addEventListener('show.bs.offcanvas',
    function () {
        this.innerHTML = offCanvasContent;
        attachEventListeners(this);
    });

function attachEventListeners(offCanvasElement) {
    offCanvasElement.querySelector('.btn-close').addEventListener('click', function () {
        let offCanvas = bootstrap.Offcanvas.getInstance(offCanvasElement);
        offCanvas.hide();
    });
}