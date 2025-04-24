<template>
    <div class="bg-white border-t border-gray-200 p-4">
      <div class="flex items-end gap-4">
        <div class="flex-1 bg-gray-50 rounded-lg p-2">
          <div class="flex items-center gap-2 mb-2" v-if="selectedFile">
            <div class="bg-blue-100 text-blue-800 text-xs rounded px-2 py-1 flex items-center">
              <span class="truncate max-w-xs">{{ selectedFile.name }}</span>
              <button class="ml-2 text-blue-600 hover:text-blue-800" @click="removeFile">
                <i class="ri-close-line"></i>
              </button>
            </div>
          </div>
          <textarea
            v-model="message"
            rows="1"
            placeholder="Écrivez votre message..."
            class="w-full resize-none border-none bg-transparent p-2 focus:outline-none text-sm"
            @keydown.enter.prevent="send"
          ></textarea>
        </div>
        <div class="flex items-center gap-2">
          <input
            type="file"
            ref="fileInput"
            class="hidden"
            @change="handleFileSelect"
          />
          <button
            class="p-2 text-gray-500 hover:text-gray-700 cursor-pointer rounded-lg"
            @click="triggerFileInput"
          >
            <i class="ri-attachment-2"></i>
          </button>
          <button
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 cursor-pointer rounded-lg flex items-center"
            @click="send"
          >
            <i class="ri-send-plane-line mr-2"></i>
            Envoyer
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, defineEmits } from 'vue';
  
  // State
  const message = ref('');
  const selectedFile = ref<File | null>(null);
  const fileInput = ref<HTMLInputElement | null>(null);
  
  // Emits
  const emit = defineEmits<{
    (e: 'send', content: string, file?: File): void;
  }>();
  
  // Methods
  const handleFileSelect = (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      selectedFile.value = input.files[0];
    }
  };
  
  const removeFile = () => {
    selectedFile.value = null;
    if (fileInput.value) {
      fileInput.value.value = '';
    }
  };
  
  const send = () => {
    if (message.value.trim() || selectedFile.value) {
      emit('send', message.value, selectedFile.value || undefined);
      message.value = '';
      selectedFile.value = null;
      if (fileInput.value) {
        fileInput.value.value = '';
      }
    }
  };
  
  const triggerFileInput = () => {
    if (fileInput.value) {
      fileInput.value.click();
    }
  };
  </script>