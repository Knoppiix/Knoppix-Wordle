import tile from "../assets/tile.js"
import endScreen from "../assets/endScreen.js"
import helpScreen from "../assets/helpScreen.js"
import splashScreen from '../assets/splashScreen.js';

let app = {
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
				const rng = new alea(res)
				this.words=readFile('../assets/wordleList.json').split('\r\n')     
				this.checkList = readFile('../assets/checkList.json').split('\r\n') 
				const random = Math.round(rng(rng) * this.words.length-1)
				setTimeout(() => {					
					resolve(this.words[random].replace(/(\r\n|\n|\r)/gm, ""))
				}, 1000); // Simulate a 1-second delay
				
				//console.log(this.chosenWord)
			})
		},
		checkLine: function(index, line, element,check){
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
									this.tileState[i] = "goodLetter" //bonne lettre
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
										this.tileState[i] = "wrgPlaceLetter" //mal placee
										this.comparaison[i] = " "
										//this.comparaison = this.comparaison.replace(this.currentWord[i], " ")
										this.emojiSummary[i] = String.fromCodePoint(128999)								
									}
									else if(this.tileState[i] == null){ //Pour ne pas ecraser les bonnes lettres 
										this.tileState[i] = "badLetter" //mauvaise lettre	
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
		document.querySelector("input").focus() //On focus sur la premiere tuile
	}	
}

Vue.createApp(app).mount("#app");