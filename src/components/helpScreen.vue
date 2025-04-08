<script setup>
	import tile from './tile.vue'
	const tileStates=["good","almost","bad"]
	const tileColors=["bg-pastelcyan", "bg-cream", "bg-seasalt"]
</script>

<template>		
	<div v-for="x in 3" class="w-96 h-28 bg-seasalt p-3 self-center justify-self-center border-[1px] flex items-center shadow-[3px_3px_rgba(0,0,0,.6)]">
			<tile :class="'!'+tileColors[x-1]"></tile>
			<span class="grow p-3 font-Hepta text-xl text-center">
				<slot :name="tileStates[x-1]" />
			</span>
	</div>
</template>