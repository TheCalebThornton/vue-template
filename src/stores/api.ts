import { defineStore } from 'pinia'

const API_BASE_URL = 'https://sampleapi.com' // Example API

export interface RespObj {
  id: number
  title: string
  body: string
  userId: number
}

export const useApiStore = defineStore('api', {
  state: () => ({
    respObjs: [] as RespObj[],
    loading: false as boolean,
    error: null as string | null,
  }),
  getters: {
    isLoading: (state) => state.loading,
    hasError: (state) => state.error !== null,
  },
  actions: {
    async getRespObjs() {
      this.loading = true
      this.error = null
      
      try {
        const response = await fetch(`${API_BASE_URL}/path`, {
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        this.respObjs = data
				return this.respObjs
      } catch (error: any) {
        console.error('API request failed:', error)
        this.error = error?.message ? error.message : 'An error occurred'
        throw error
      } finally {
        this.loading = false
      }
    },
  },
}) 