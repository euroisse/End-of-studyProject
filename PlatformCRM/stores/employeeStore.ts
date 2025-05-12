import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { SelectOptions } from '~/types'

export const useEmployeeStore = defineStore('employee', {
    state: () =>({
         employees: ref<SelectOptions[]>([])
    }),
    actions:{
        async  fetchEmployees() {
      const response = await $fetch<SelectOptions[]>('/api/users/employee')
     this.employees = response
    } 
    }
})
