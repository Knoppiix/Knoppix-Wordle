<template>
	<div id='popup'>
		<span class="cross" @click="this.root.help = false">×</span>
		<h1>How to play</h1>					
		<ul id='rules'> 
			<li><slot name="good"></slot>Blue tiles are well placed letters</li>
			<li><slot name="almost"></slot>Pale yellow tiles are bad placed letters</li>
			<li><slot name="bad"></slot>Red tiles are bad letters</li>
		</ul>											
	</div>
</template>