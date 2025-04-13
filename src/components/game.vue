<template>
<div class="m-0 p-0 grid overflow-hidden h-full w-full gap-0 absolute -z-10" :style="this.gridTemplateStyle">
	<div class="relative m-0 p-0 before:content-[''] after:content-[''] before:absolute after:absolute before:bg-[#000] after:bg-[#000] gridAnimate" v-for="square in Array.from({length: this.nbCols*this.nbRows})"></div>			
</div>

<header  class="flex flex-row justify-center items-center">		
	<h1 class="text-mauve font-Patua font-bold col-start-2 text-center xl:text-8xl text-7xl p-10 text-shadow tracking-wider">KNORDLE</h1>
  	<!-- <span class="col-start-3 justify-self-end mr-7 self-center p-2 text-[#B7AED5]" @click='helpPopup()'><p>help</p></span> -->
</header>

<main class="grid grid-cols-3 h-2/3">

	<div class="inline-grid items-start p-7">				
		<div class="ml-4 w-72 h-72 xl:w-96 xl:h-96 border-[1px] border-b-4 border-jet-500 bg-cream rounded-2xl flex flex-col pt-8 font-Patua text-xl xl:text-3xl shadow-[0px_5px_0px_0px_#35302C]">				
			<div class="self-center"><span class="xl:p-2 p-1 h-min inline-block -rotate-[6deg] border-2 border-jet bg-mauve-300 rounded-lg text-seasalt">mauvaises</span> lettres</div>			
			<div class="dots-filled grow flex flex-col after:scale-75 after:translate-x-[12.5%] after:translate-y-1/4 after:xl:translate-y-1/2 after:xl:scale-100 after:xl:translate-x-0">
				<span class="xl:p-4 p-1 absolute line-through xl:max-w-96 max-w-64 font-Hepta">{{ badLetters.join(' ') }}</span>				
			</div>						
		</div>
	</div>

	<div class="inline-grid items-center" >
		<!-- GAME TILES -->
		<div class='inline-flex justify-between xl:justify-around w-full anim-glideAppear' v-for="lines in retries" :key="lines" v-if="chosenWord" :style="{ animationDelay: `${(lines-1) * 100}ms` }">
			<letter-tile :class="`${getRotationClass(lines, index)} ${getState(lines, index)}`" v-for="index in chosenWord.length" :key="index" @input="checkLine(index,lines,$event.target,false, event)" @keydown.backspace="eraseTile" @keydown.enter="checkLine(index,lines,$event.target, true, event)" :disabled="getState(lines,index) !== null || win != null" :placeholder="lines == lineNb+1 && !win ? revealWord[index-1]: ''"></letter-tile>							
		</div>	
		
		<end-screen v-if='win!=null && closed == false'></end-screen>							
	</div>

	<!-- RULE CARDS -->
	 <aside class="flex flex-col justify-evenly">
		<help-menu>
			<template #good>
				Lettres bien placées
			</template>
			<template #almost>
				Lettres mal placées
			</template>
			<template #bad>
				Mauvaises lettres
			</template>
		</help-menu>
	 </aside>
	 

</main>

<!-- DONUT -->
<div class="w-96 h-96 bg-mauve-700 rounded-full absolute left-10 -top-52 -z-30 shadow-[5px_5px_0px_0px_#fffdc2]">
	<div class="w-64 h-64 bg-seasalt rounded-full -z-20 relative left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 shadow-[inset_5px_5px_0px_0px_#fffdc2]"></div>
</div>
<!-- CIRCLES -->
<div class="w-80 h-80 bg-cream rounded-full absolute -bottom-20 -left-20 -z-20"></div>
<div class="w-[20.5rem] h-[20.5rem] bg-pastelcyan rounded-full absolute -bottom-20 -left-20 -z-30"></div>
<!-- TRIANGLES -->
<div class="w-0 h-0 absolute right-52 top-1/2 -translate-y-1/2 border-[20rem] border-[transparent_transparent_#adf8db_transparent] scale-x-50 scale-y-[2] -rotate-90 -z-20"></div>
<div class="w-0 h-0 absolute right-60 top-1/2 -translate-y-1/2 border-[20rem] border-[transparent_transparent_#edbeff_transparent] scale-x-50 scale-y-[2] -rotate-90 -z-30"></div>

</template>

<script>
import endScreen from './endScreen.vue'
import helpMenu from './helpScreen.vue'
import splashScreen from './splashScreen.vue'
import tile from './tile.vue'
import functions from '../functions'
import seedrandom from 'seedrandom'
import { ref } from 'vue'
export default{
    name: 'game',
    components: {
        helpMenu,
        splashScreen,
        tile,
        endScreen
    },
    data() {
		return{
			words:  [],
			checkList: [],
			currentWord: [],
			userWords: [],
			tileState: [],
			emojiSummary: [],
			badLetters: [],
			goodLetters: [],
			revealWord: [],
			comparaison: [],
			chosenWord: "",
			lineNb: 0,
			retries: 6,
			win: null,
			closed:false,	
			showSplashScreen: true,
			squareSize: 100,
			nbCols: 0,
		    nbRows: 0,
			gridTemplateStyle: '',
			checkIcon: null
		}
	},

	methods: {
		pickWord: async function(){			
			const rightNow = new Date();
			const res = rightNow.toISOString().slice(0,10).replace(/-/g,"");
			const rng = new seedrandom(res).quick()
			this.words = await functions.readFile('./src/assets/wordleList.json')   
			this.checkList = await functions.readFile('./src/assets/checkList.json')				
			const random = Math.round(rng * this.words.length-1)
			return this.words[random]			
		},
		checkLine: async function(index, line, element,check, event){
			functions.nextFocus(event, element)
			const lineIndexStart = (line-1)*this.chosenWord.length	
			this.currentWord[lineIndexStart+index-1] = element.value   
			const userInput = this.currentWord.slice(lineIndexStart,lineIndexStart+this.chosenWord.length).join("")
			const currentLineElement = element.parentElement;
			this.checkIcon.svg.style.top = currentLineElement.clientHeight/2;
			this.checkIcon.svg.style.left = currentLineElement.clientWidth;		
			this.checkIcon.svg.remove(); // On efface l'icone de validation		
								
			if(userInput.length == this.chosenWord.length && this.checkList.includes(userInput)){ // Si toutes les tiles de la lignes actuelles ont une valeur)
				if(check==true){
					this.comparaison = this.chosenWord.split('') //Variable qui servira a comparer le mot de l'utilisateur au mot choisi par l'algo
					this.lineNb++				
					for(let steps = 0; steps < 2; steps++){ //2 etapes : Premierement on check les bonnes lettres, et deuxiemement on check les lettres mal placees + les mauvaises					
						for(let i = lineIndexStart;  i < lineIndexStart+this.chosenWord.length; i++){ //On demarre une boucle au debut de la ligne actuelle jusqu'à sa fin																							
							switch(steps){
								case 0: //Check des bonnes lettres 								
									if(this.currentWord[i] == this.chosenWord[i-lineIndexStart]){ //Si la lettre i de l'user equivaut à la lettre [i - index du debut de la ligne] du mot choisi
										this.tileState[i] = "!bg-pastelcyan animate-bounce-once" //bonne lettre
										this.comparaison[i-lineIndexStart] = " "
										this.emojiSummary[i] = String.fromCodePoint(128998)
										this.goodLetters.push(this.currentWord[i])									
										for (var y = 0; y < this.comparaison.length; y++) {
											if(this.comparaison[y] != " " && !this.revealWord[y])
												this.revealWord[y] = ''
											else
												this.revealWord[y] = this.chosenWord[y]
										}						
									}
									break
								case 1: //Check des lettres mal placees ou mauvaises								 
										if(this.comparaison.includes(this.currentWord[i])  && this.tileState[i] == null){
											this.tileState[i] = "!bg-cream animate-bounce-once" //mal placee
											this.comparaison[i] = " "										
											this.emojiSummary[i] = String.fromCodePoint(128999)								
										}
										else if(this.tileState[i] == null){ //Pour ne pas ecraser les bonnes lettres 
											this.tileState[i] = "!bg-seasalt" //mauvaise lettre	
											this.emojiSummary[i] = String.fromCodePoint(11035)
											if(!this.chosenWord.includes(this.currentWord[i]) && !this.badLetters.includes(this.currentWord[i])){											//Si la lettre [i] n'est pas dans le mot choisi ET n'est pas déjà présente dans les lettres mauvaises
												this.badLetters.push(this.currentWord[i])
											}
										}								
									break
							}							
						}					
					}

					this.userWords.push(this.currentWord.join(""))	
					if(this.currentWord.join("") == this.chosenWord){
						this.win = true
						this.setCookie("input", btoa(this.userWords.join('/')))

					}else if(this.lineNb == this.retries){
						this.win = false
						this.setCookie("input", btoa(this.userWords.join('/')))
					}				
					this.currentWord = []
					element.parentElement.nextSibling.children[0].focus()
				}
				else{
					this.svgToCheckmark();
					currentLineElement.appendChild(this.checkIcon.createElement());										
				}				
			}else{ // Si le mot n'est pas correct OU ne fait pas 8 lettres
				if(userInput.length == this.chosenWord.length){
					// Si le mot fait 8 lettres mais n'est pas correct, afficher une croix pour l'indiquer à l'utilisateur
					this.svgToCross();
					currentLineElement.appendChild(this.checkIcon.createElement());					
				}				
			}
		},
		summaryToTxt: function(sum){
			let txtSum = []
			for(let i=0; i<sum.length; i++){
				switch(sum[i].codePointAt(0)){
					case 128998: // Carre bleu
						txtSum.push("0")
						break 
					case 128999: // Carre orange
						txtSum.push("1")
						break
					case 11035: // Carre noir
						txtSum.push("2")
						break
					default: // "<br>"
						txtSum.push("\n")
						break
				}
			}
			return btoa(txtSum.join(""))
		},
		txtToSummary: function(sum){
			let emojiSum=[]
			for(let i=0; i<sum.length; i++){
				switch(sum[i]){
					case "0": // Carre bleu
						emojiSum.push(String.fromCodePoint(128998))
						break 
					case "1": // Carre orange
						emojiSum.push(String.fromCodePoint(128999))
						break
					case "2": // Carre noir
						emojiSum.push(String.fromCodePoint(11035))
						break
					default: // "<br>"
						emojiSum.push("<br>")
						break
				}
			}
			return emojiSum
		},
		getState: function(lines, index){ // Fonction utilisee dans le HTML pour reduire la verbosite, retourne la classe d une tuile (bonne lettre, mauvaise..)
			if(this.tileState[((lines-1)*this.chosenWord.length)+index-1] !== undefined){
				return this.tileState[((lines-1)*this.chosenWord.length)+index-1]					
			}
			return null
		},
		setWords: function(words){ // Fonction qui va ecrire les mots retenus dans les tiles depuis les cookies
			const tiles = document.getElementsByClassName("tile null")
			words = words.replaceAll("/","")
			for(let i=0; i<words.length; i++){
    			tiles[i].value = words[i]
			}
		},
		setCookie(name,value){ // Fonction pour definir un cookie simplement
			const d = new Date();
			d.setDate(d.getDate()+1)
			d.setHours(0,0,0)
			let expires = "expires="+ d.toString()
			document.cookie = `${name}=${value}; ${expires}; path=/;`
		},
		drawGrid(){								
			this.nbCols = Math.round(window.innerWidth / this.squareSize) + 1;
			this.nbRows = Math.round(window.innerHeight / this.squareSize) + 1;			
			this.gridTemplateStyle = `grid-template-columns: repeat(${this.nbCols}, ${this.squareSize}px); grid-template-rows: repeat(${this.nbRows},${this.squareSize}px);`;			
		},
		getRotationClass(line, index) {
			if (line % 2 === 0) {
				return index % 2 === 0 ? 'rotate-[7deg]' : '-rotate-[7deg]';
			} else {
				return index % 2 === 0 ? '-rotate-[7deg]' : 'rotate-[7deg]';
			}
  		},
		eraseTile(event){		
			if(!event.target.value){
				const previousSibling = event.target.previousSibling;
				if (previousSibling.tagName == "INPUT"){
					previousSibling.focus()
				} 
			}
		},
		svgToCheckmark(){			
			this.checkIcon.path.setAttribute("d", "m9.55 18l-5.7-5.7l1.425-1.425L9.55 15.15l9.175-9.175L20.15 7.4z");		
			this.checkIcon.path.setAttribute("class", "stroke-jet-100 fill-pastelcyan"); // Stroke color
		},
		svgToCross(){		
			this.checkIcon.path.setAttribute("d", "M18.36 19.78L12 13.41l-6.36 6.37l-1.42-1.42L10.59 12L4.22 5.64l1.42-1.42L12 10.59l6.36-6.36l1.41 1.41L13.41 12l6.36 6.36z")
			this.checkIcon.path.setAttribute("class", "stroke-jet-100 fill-cream");
		}
	},	
	components: {
		'letter-tile': tile,
		'end-screen': endScreen,
		'help-menu': helpMenu,
		'splash-screen': splashScreen,
	},
	watch:{
		win(){
			if(document.cookie.includes("won")){ // On ne veut pas re-executer la fonction win si le jouer a deja gagne (sinon ca fait tout buger)
				return 0
			}
			let y = 0
			for (var i = 1; i < this.emojiSummary.length; i++) {
				if(i % this.chosenWord.length == 0){ //Si i est un multiple de (8)
					this.emojiSummary.splice(i+y,0,"<br>")
					y++
				}
			}
			const d = new Date();
			d.setDate(d.getDate()+1)
			d.setHours(0,0,0)		
			if(!document.cookie.includes("summary")){
				this.setCookie("summary",this.summaryToTxt(this.emojiSummary))
			}
			if(this.win == false){				
				this.setCookie("won","False")
			}else if(this.win == true){
				this.setCookie("won","True")
			}			
		},
	},
	beforeMount(){		
		if(document.cookie.includes("won")){
			if(document.cookie.split("won")[1].includes("True")){
				this.win = true
			}
			else{
				this.win = false
			}
		}
		if(document.cookie.includes("summary")){
			this.emojiSummary = this.txtToSummary(atob(document.cookie.split("summary")[1].split(";")[0].replace("=","")))
		}		
		window.addEventListener('resize', this.drawGrid);
		this.drawGrid();
	},
	mounted(){		
		// SELECTION DU MOT ALEATOIRE
		this.pickWord().then((word) => {
			this.chosenWord = word
	    });

		if(document.cookie.includes("input")){
			this.setWords(atob(document.cookie.split("input")[1].split(';')[0].replace('=','')))
		}		
		
		this.checkIcon = ref({
			svg: document.createElementNS("http://www.w3.org/2000/svg", "svg" ),
			path:  document.createElementNS("http://www.w3.org/2000/svg", "path"),
			createElement: function(){
				this.svg.appendChild(this.path);
				return this.svg;
			},
		});

		this.checkIcon.svg.setAttribute("width", "64"); // Set width
		this.checkIcon.svg.setAttribute("height", "64"); // Set height
		this.checkIcon.svg.setAttribute("viewBox", "0 0 24 24"); // Define viewBox for scaling
		this.checkIcon.svg.setAttribute("fill", "none"); // No fill for the SVG container			
		this.checkIcon.svg.setAttribute("stroke", "none"); 

		this.checkIcon.svg.style.position = "absolute";
		this.checkIcon.svg.style.transform = "translateY(-50%)";
		this.checkIcon.path.setAttribute("stroke-width", ".2");	
	},
	
}
</script>