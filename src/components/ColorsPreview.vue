<template>
	<div class="flex flex-col flex-grow items-center">
		<h3 class="text-xl text-center">{{ title }}</h3>
		<div class="grid grid-cols-3 gap-x-2 text-center my-4">

			<div v-if="showPrimaryColors" class="flex flex-col gap-y-1">
				<h4 class="text-xl">Primary</h4>
				<div class="rounded bg-primary-900 text-neutral-200">Dark Primary color</div>
				<div class="rounded bg-primary-500 text-neutral-800">Primary color</div>
				<div class="rounded bg-primary-100 text-neutral-800">Light primary</div>
			</div>

			<div v-if="showAccentColors" class="flex flex-col gap-y-1">
				<h4 class="text-xl">Accent</h4>
				<div class="rounded bg-secondary-900 text-neutral-200">Dark accent color</div>
				<div class="rounded bg-secondary-500 text-neutral-800">Accent color</div>
				<div class="rounded bg-secondary-100 text-neutral-800">Light accent</div>
			</div>

			<div v-if="showStatefulColors" class="flex flex-col gap-y-1">
				<h4 class="text-xl">Stateful Colors</h4>
				<div class="rounded bg-success-500 text-neutral-800">Success message</div>
				<div class="rounded bg-warning-500 text-neutral-800">Warning message</div>
				<div class="rounded bg-error-500 text-neutral-800">Error message</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
defineProps({
	title: {
		type: String,
		default: "Color Schemes"
	},
	showStatefulColors: {
		type: Boolean,
		default: true
	},
	showAccentColors: {
		type: Boolean,
		default: true
	},
	showPrimaryColors: {
		type: Boolean,
		default: true
	}
});
</script>