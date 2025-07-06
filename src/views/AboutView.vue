<template>
  <div>
    <h1 class="text-3xl font-bold text-primary-800 mb-6">About</h1>
    
    <div class="bg-surface-primary p-6 rounded-lg border border-border-light">
      <p class="text-text-secondary mb-4">
        This is the about page. You can add information about your application here.
      </p>
      <div class="flex md:flex-row flex-col items-center gap-y-4 md:gap-x-4">
				<ColorsPreview 
					title="My Custom Colors" 
					:showStatefulColors="true"
				/>
      </div>
			<div class="flex gap-4">
			<router-link 
				to="/" 
				class="bg-primary-500 text-white px-4 py-2 rounded hover:bg-primary-600 transition-colors"
			>
				Back to Home
			</router-link>
		</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import ColorsPreview from '@/components/ColorsPreview.vue';
import { useApiStore } from '@/stores/api'

const apiStore = useApiStore()
const { loading, error } = storeToRefs(apiStore)

const loadData = async () => {
  await apiStore.getRespObjs()
}

onMounted(async () => {
	console.log(`Loading: ${loading.value}`)
	try {
		const resp = await loadData()
		console.log(`Loading: ${loading.value}`)
		console.log(`Response: ${resp}`)
	} catch(err: any) {
		console.log(`Pinia Store error: ${error.value}`)
		console.log(`Thrown error: ${err?.message}`)
	}
})

</script> 