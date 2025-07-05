<template>
  <div id="app">
    <nav class="bg-surface-primary border-b border-border-light mb-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-3xl font-bold text-primary-800">Vue Template</h1>
          </div>
          <div class="flex items-center space-x-4">
            <router-link 
              to="/" 
              class="text-text-secondary hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="text-primary-600 bg-primary-50"
            >
              Home
            </router-link>
            <router-link 
              to="/about" 
              class="text-text-secondary hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="text-primary-600 bg-primary-50"
            >
              About
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
// App-level logic here
</script>

