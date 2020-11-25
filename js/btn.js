let light = document.querySelector("#theme");
const change = (theme, prevtheme, button, btnclick) => {
    let btn = document.querySelector(button);
    let btnprev = document.querySelector(btnclick);
    btn.style.display = 'block';
    light.classList.add(theme);
    light.classList.remove(prevtheme);
    btnprev.style.display = 'none';
}
