
let exports = {};

exports.nextFocus = (element) => {
	const audioFiles = ["key-press-1.wav","key-press-2.wav","key-press-3.wav","key-press-4.wav"]
	const randomAudio = audioFiles[Math.floor(Math.random() * audioFiles.length)]
	const audio = new Audio("src/sounds/"+randomAudio);
	let valueCount=0
	audio.play();

	if(element.nextSibling.tagName == "INPUT"){
		if(element.nextSibling.value == "" && element.value != "")
			element.nextSibling.focus()
	}
	else if(element.parentElement.nextSibling.tagName == "SPAN"){
		for (let i = 0; i < element.parentElement.childElementCount; i++){
			if (element.parentElement.children[i].value != '') //On compte le nombre de tiles avec une valeur
				valueCount++							
		}		
	}
}


exports.readFile = (file) => {
    var f = new XMLHttpRequest();
    f.open("GET", file, false);
    f.onreadystatechange = function ()
    {
        if(f.readyState === 4)
        {        	
            if(f.status === 200 || f.status == 0)
            {            	
                let res= f.responseText;                
            }
        }
    }
    f.send(null);
    return f.responseText
}

exports.copySummary = (element) => {
    // navigator clipboard api needs a secure context (https)
    if (navigator.clipboard && window.isSecureContext) {
        // navigator clipboard api method'
        navigator.clipboard.writeText(document.querySelector("#popup > p").innerHTML.replaceAll("<br>","\n") + "\nhttp://knoppix.atspace.cc/Wordle");
		element.innerText = "Copied!";
    } else {
        // text area method
        let textArea = document.createElement("textarea");
        textArea.value = document.querySelector("#popup > p").innerHTML.replaceAll("<br>","\n") + "\nhttp://knoppix.atspace.cc/Wordle";
        // make the textarea out of viewport
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        element.innerText = "Copied!";
        return new Promise((res, rej) => {
            // here the magic happens
            document.execCommand('copy') ? res() : rej();
            textArea.remove();
        });
    }
}

export default exports;