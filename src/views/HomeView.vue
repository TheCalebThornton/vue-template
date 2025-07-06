<template>
  <div class="home">
    <h1 class="text-3xl font-bold text-primary-600 mb-6">Welcome to Your Vue App</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-surface-primary p-6 rounded-lg border border-border-light">
        <h2 class="text-xl font-semibold text-primary mb-4">Getting Started</h2>
        <p class="text-secondary mb-4">
          This is your home page. You can start building your application here.
        </p>
        <router-link 
          to="/about" 
          class="inline-block bg-primary-500 text-white px-4 py-2 rounded hover:bg-primary-600 transition-colors"
        >
          Go to About
        </router-link>
      </div>
      
      <div class="bg-surface-secondary p-6 rounded-lg border border-border-light">
        <h2 class="text-xl font-semibold text-primary mb-4">Features</h2>
        <ul class="text-secondary space-y-2">
          <li><CheckmarkIcon class="text-success-500 inline w-4 h-4 mr-2" /> Vue 3 with Composition API</li>
          <li><CheckmarkIcon alt="checkmark" class="text-success-500 inline w-4 h-4 mr-2" /> TypeScript support</li>
          <li><CheckmarkIcon alt="checkmark" class="text-success-500 inline w-4 h-4 mr-2" /> Tailwind CSS styling</li>
          <li><CheckmarkIcon alt="checkmark" class="text-success-500 inline w-4 h-4 mr-2" /> Vue Router navigation</li>
          <li><CheckmarkIcon alt="checkmark" class="text-success-500 inline w-4 h-4 mr-2" /> Vite build tool</li>
          <li><CheckmarkIcon alt="checkmark" class="text-success-500 inline w-4 h-4 mr-2" /> Pinia stores</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CheckmarkIcon from '@/assets/checkmark.svg'
</script> 