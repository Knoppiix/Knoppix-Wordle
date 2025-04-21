<template>
	<div class="absolute flex flex-col items-center xl:w-[29rem] w-96 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-mauve rounded-2xl border-2 border-jet-500 shadow-[4px_4px_0px_0px_#35302C] animate-appearFromBottom">		
		<h1 class="font-Patua xl:text-4xl text-2xl xl:p-8 p-5"><slot name="title"></slot></h1>
		<slot name="wordReveal">
		</slot>		
		<slot name="copyButton"></slot>		
	</div>
</template>