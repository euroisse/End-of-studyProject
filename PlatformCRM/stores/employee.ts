import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Employee } from '~/types'

export const useEmployeeStore = defineStore('employee', {
    state: () =>({
         employees: ref<Employee[]>([])
    }),
    actions:{
        async  fetchEmployees() {
      const response = await $fetch<Employee[]>('/api/users/employee')
     this.employees = response
    } 
    }
})
