<template>
<splash-screen v-if="showSplashScreen"></splash-screen>

<header v-if="!showSplashScreen" class="flex flex-row justify-center items-center">
	<div class="grid grid-cols-[minmax(4rem,17%)_minmax(16rem,66%)_minmax(4rem,17%)] bg-[#8E806A] rounded-3xl min-w-96 w-5/12 m-3 border-almond-500 border-4 outline-title">
		<h1 class="text-[#454747] font-Cartoon font-bold col-start-2 text-center text-3xl p-3 text-stroke-3">Knoppix's Wordle</h1>
  		<span class="col-start-3 justify-self-end mr-7 self-center p-2 text-[#B7AED5]" @click='helpPopup()'><p>help</p></span>
	</div>
</header>

<div class="w-2/12 inline-flex" v-if="!showSplashScreen">				
  <div class="letterFrame" v-if="this.badLetters.length != 0">
    <h1>bad letters</h1>
    <letter-tile v-for="letter in badLetters" class="tile badLetter" :value="letter" disabled></letter-tile>				
  </div>
</div>

<div class="w-5/12 inline-flex flex-col items-center absolute left-[29.2%] mt-20" v-if="!showSplashScreen">
  <help-screen v-if='this.help == true'>
    <template v-slot:good>
      <letter-tile class="tile goodLetter darker" disabled></letter-tile>
    </template>
    <template v-slot:almost>
      <letter-tile class="tile wrgPlaceLetter darker" disabled></letter-tile>
    </template>
    <template v-slot:bad>
      <letter-tile class="tile badLetter darker" disabled></letter-tile>
    </template>				
  </help-screen>
  <div class="p-2 inline-flex justify-around w-full">
    <letter-tile v-for="i in chosenWord.length" class="tile revealtile" :value="revealWord[i-1]" disabled></letter-tile>
  </div>

  <div class='p-2 inline-flex justify-around w-full' v-for="lines in retries" :key="lines" v-show="win == null || closed == true">
    <letter-tile v-for="index in chosenWord.length" :key="index" @input="checkLine(index,lines,$event.target,false, event)" @keydown="wordConfirm($event, index, lines)" :class="'tile '+ getState(lines, index)" :disabled="getState(lines,index) !== null || win != null"></letter-tile>	
  </div>	
  <end-screen v-if='win!=null && closed == false'></end-screen>							
</div>

</template>

<script>
import endScreen from './endScreen.vue'
import helpScreen from './helpScreen.vue'
import splashScreen from './splashScreen.vue'
import tile from './tile.vue'
import functions from '../functions'
import seedrandom from 'seedrandom'

export default{
    name: 'game',
    components: {
        helpScreen,
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
			retries: 8,
			win: null,
			closed:false,	
			help:false,
			showSplashScreen: true,
		}
	},

	methods: {
		pickWord: function(){
			return new Promise((resolve) => {
				const rightNow = new Date();
				const res = rightNow.toISOString().slice(0,10).replace(/-/g,"");
				const rng = new seedrandom(res).quick()
				this.words = functions.readFile('./src/assets/wordleList.json').split('\n')     
				this.checkList = functions.readFile('./src/assets/checkList.json').split('\n') 
				const random = Math.round(rng * this.words.length-1)
				//console.log(this.checkList)
				setTimeout(() => {					
					resolve(this.words[random].replace(/(\r\n|\n|\r)/gm, ""))
				}, 1000); // Simulate a 1-second delay
				
				//console.log(this.chosenWord)
			})
		},
		checkLine: function(index, line, element,check, event){
			functions.nextFocus(element)
			const lineIndexStart = (line-1)*this.chosenWord.length	
			this.currentWord[lineIndexStart+index-1] = element.value   
			const userInput = this.currentWord.slice(lineIndexStart,lineIndexStart+this.chosenWord.length).join("")
			//console.log(this.currentWord)			
			//Sera egal à l'index de la première tile de la ligne actuelle (0 pour 1ere ligne, [longueur du mot] pour 2eme ligne...)
			if(userInput.length == this.chosenWord.length && this.checkList.includes(userInput) && check==true){ //Si toutes les tiles de la lignes actuelles ont une valeur
				this.comparaison = this.chosenWord.split('') //Variable qui servira a comparer le mot de l'utilisateur au mot choisi par l'algo
				this.lineNb++				
				for(let steps = 0; steps < 2; steps++){ //2 etapes : Premierement on check les bonnes lettres, et deuxiemement on check les lettres mal placees + les mauvaises
					for(let i = lineIndexStart;  i < lineIndexStart+this.chosenWord.length; i++){ //On demarre une boucle au debut de la ligne actuelle jusqu'à sa fin												
						//console.log("currentWord : "+this.currentWord[i]+" | chosenWord : "+this.chosenWord[i-lineIndexStart])					
						switch(steps){
							case 0: //Check des bonnes lettres 								
								if(this.currentWord[i] == this.chosenWord[i-lineIndexStart]){ //Si la lettre i de l'user equivaut à la lettre [i - index du debut de la ligne] du mot choisi
									this.tileState[i] = "bg-[blue]" //bonne lettre
									this.comparaison[i-lineIndexStart] = " "
									this.emojiSummary[i] = String.fromCodePoint(128998)
									this.goodLetters.push(this.currentWord[i])
									//console.log(this.comparaison + " " + lineIndexStart)
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
										this.tileState[i] = "bg-dun" //mal placee
										this.comparaison[i] = " "
										//this.comparaison = this.comparaison.replace(this.currentWord[i], " ")
										this.emojiSummary[i] = String.fromCodePoint(128999)								
									}
									else if(this.tileState[i] == null){ //Pour ne pas ecraser les bonnes lettres 
										this.tileState[i] = "bg-[red]" //mauvaise lettre	
										this.emojiSummary[i] = String.fromCodePoint(11035)
										if(!this.chosenWord.includes(this.currentWord[i]) && !this.badLetters.includes(this.currentWord[i])){											//Si la lettre [i] n'est pas dans le mot choisi ET n'est pas déjà présente dans les lettres mauvaises
											this.badLetters.push(this.currentWord[i])
										}
									}								
								break
						}
					}
				}

				console.log(this.emojiSummary)
				this.userWords.push(this.currentWord.join(""))	
				if(this.currentWord.join("") == this.chosenWord){
					this.win = true
					this.setCookie("input", btoa(this.userWords.join('/')))

				}else if(this.lineNb == this.retries){
					this.win = false
					this.setCookie("input", btoa(this.userWords.join('/')))
				}				
				//console.log(this.userWords)
				this.currentWord = []
				element.parentElement.nextSibling.children[0].focus()
			}
		},
		helpPopup: function(){
			this.help = true
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
		getState: function(lines, index){ //Fonction utilisee dans le HTML pour reduire la verbosite, retourne la classe d une tuile (bonne lettre, mauvaise..)
			if(this.tileState[((lines-1)*this.chosenWord.length)+index-1] !== undefined){
				return this.tileState[((lines-1)*this.chosenWord.length)+index-1]					
			}
			return null
		},
		setWords: function(words){ //Fonction qui va ecrire les mots retenus dans les tiles depuis les cookies
			const tiles = document.getElementsByClassName("tile null")
			words = words.replaceAll("/","")
			for(let i=0; i<words.length; i++){
    			tiles[i].value = words[i]
			}
		},
		setCookie(name,value){ //Fonction pour definir un cookie simplement
			const d = new Date();
			d.setDate(d.getDate()+1)
			d.setHours(0,0,0)
			let expires = "expires="+ d.toString()
			document.cookie = `${name}=${value}; ${expires}; path=/;`
		},
		wordConfirm(event, index, line){	//Fonction qui verifie si la touche enfoncee est bien la touche entree		    
			if(event.key === "Enter"){
				this.checkLine(index,line,event.target,true)
			}
		}
	},	
	components: {
		'letter-tile': tile,
		'end-screen': endScreen,
		'help-screen': helpScreen,
		'splash-screen': splashScreen,
	},
	watch:{
		win(){
			if(document.cookie.includes("won")){ //On ne veut pas re-executer la fonction win si le jouer a deja gagne (sinon ca fait tout buger)
				return 0
			}
			let y = 0
			for (var i = 1; i < this.emojiSummary.length; i++) {
				if(i % this.chosenWord.length == 0){ //Si i est un multiple de (8)
					this.emojiSummary.splice(i+y,0,"<br>")
					y++
				}
			}
			console.log(this.emojiSummary)	
			const d = new Date();
			d.setDate(d.getDate()+1)
			d.setHours(0,0,0)
			let expires = "expires="+ d.toString()			
			if(!document.cookie.includes("summary")){
				this.setCookie("summary",this.summaryToTxt(this.emojiSummary))
			}
			if(this.win == false){				
				this.setCookie("won","False")
			}else if(this.win == true){
				this.setCookie("won","True")
			}			
		}
	},
	beforeMount(){
		this.pickWord().then((word) => {
			this.chosenWord = word
	    	this.showSplashScreen = false
	    });

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

	},
	mounted(){		
		if(document.cookie.includes("input")){
			this.setWords(atob(document.cookie.split("input")[1].split(';')[0].replace('=','')))
		}
		window.addEventListener('keydown',function (e) { 			
			if (e.key == "Backspace" && e.srcElement.className.includes("tile") && e.srcElement.value == ""){ //Si on appuie sur effacer..
					if(e.srcElement.previousSibling.tagName == "INPUT"){
						e.srcElement.previousSibling.focus();
						e.srcElement.previousSibling.value = "";
					}
			}
		})
		const firstTile = document.getElementsByClassName("tile null")[0]
		firstTile.focus() //On focus sur la premiere tuile		
	}	
}

</script>