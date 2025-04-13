<script setup>
	import tile from './tile.vue'
	const tileStates=["good","almost","bad"]
	const tileColors=["bg-pastelcyan", "bg-cream", "bg-seasalt"]
</script>

<template>		
	<div v-for="x in 3" class="grow w-96 max-h-28 p-3 self-center border-[1px] flex items-center shadow-[4px_4px_black] anim-glideAppear" :class="'!'+tileColors[x-1]" :style="{ animationDelay: `${(x-1) * 300}ms` }">
			<!-- <tile :class="'!'+tileColors[x-1]" disabled></tile> -->
			<span class="grow p-3 font-Hepta text-2xl text-center">
				<slot :name="tileStates[x-1]" />
			</span>
	</div>
</template>