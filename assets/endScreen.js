export default{
	template: `<div id='popup'>
					<span class="cross" v-on:click="this.$root.closed = true">×</span>
					<h1>{{this.$root.win == true ? 'You win' : 'You lose'}}</h1>
					<h3 v-if="this.$root.win == false">{{'The word was '+ this.$root.chosenWord}}</h3>
					<p id='summary' v-html='this.$root.emojiSummary.join("")'></p>	
					<div>				
						<a id="copyButton" onclick="copySummary(this)">
						  Copy
						</a>
					</div>				
				</div>`,
}