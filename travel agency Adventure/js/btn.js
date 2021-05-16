let light = document.getElementById("onLight");
let dark = document.getElementById("onDark");
let hd = document.getElementById("hd");
let intr = document.getElementById("intr");


const change = (light_theme) => {
    if (light_theme) {
        hd.style.background  ="rgba(0,0,0,0.4)";
        dark.style.display = 'block';
        light.style.display = 'none';
		intr.style.background = "url('img/andr.jpg') center no-repeat";
		intr.style.backgroundSize = "cover";
    } else {
        hd.style.background = "rgba(255,255,255,0.4)"
        dark.style.display = 'none';
        light.style.display = 'block';
		intr.style.background = "url('img/intro.jpg') center no-repeat";
		intr.style.backgroundSize = "cover";
		
    }
}