function toActive(secName, id, id2= none) {
    let menu = document.querySelectorAll(`.${secName}`);
    menu.forEach(element => {
        if (element.classList.contains('menu-active')) {
            element.classList.remove('menu-active');
        }
    });
    document.querySelector(`#${id}`).classList.add('menu-active');
    toActiveSec('sections', id2)

}


function toActiveSec(section,id){
    let sectons = document.querySelectorAll(`.${section}`);
    sectons.forEach(ele => {
        if (ele.classList.contains('active')){
            ele.classList.remove('active');
        }
    });
    document.querySelector(`#${id}`).classList.add('active');
}   