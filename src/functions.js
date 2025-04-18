
let exports = {};

exports.nextFocus = (event, element) => {
	const audioFiles = ["key-press-1.wav","key-press-2.wav","key-press-3.wav","key-press-4.wav"]
	const randomAudio = audioFiles[Math.floor(Math.random() * audioFiles.length)]
	const audio = new Audio("src/sounds/"+randomAudio);
	let valueCount=0
	audio.play();

	if(element.nextSibling.tagName == "INPUT"){
		if(element.nextSibling.value == "" && element.value != "")
			element.nextSibling.focus()
	}
	
}

exports.readFile = async (file) => {
    const req = await fetch(file);
    const txt = await req.json();
    return txt
}

exports.copySummary = (element, summary) => {
    // navigator clipboard api needs a secure context (https)       
    if (navigator.clipboard && window.isSecureContext) {
        // navigator clipboard api method'
        navigator.clipboard.writeText(summary);
		element.innerText = "Copié!";
    } else {
        // text area method
        let textArea = document.createElement("textarea");
        textArea.value = summary;
        // make the textarea out of viewport
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        element.innerText = "Copié!";
        return new Promise((res, rej) => {
            // here the magic happens
            document.execCommand('copy') ? res() : rej();
            textArea.remove();
        });
    }
}

export default exports;