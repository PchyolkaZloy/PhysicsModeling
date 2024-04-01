document.querySelectorAll('.inner-dropdown-menu').forEach(item => {
    item.addEventListener('click', event => {
        event.stopPropagation();
    })
});