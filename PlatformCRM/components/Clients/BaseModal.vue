<template>
  <transition name="modal-fade">
    <div
      v-if="isVisible"
      class="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none"
    >
      <div
        class="relative w-auto max-w-lg mx-auto my-6"
        :class="modalWidthClass"
      >
        <div
          class="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none"
        >
          <div
            class="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t"
          >
            <h3 class="text-xl font-semibold text-gray-800">
              <slot name="header"> </slot>
            </h3>
            <button
              class="p-1 ml-auto bg-transparent border-0 text-gray-800 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
              @click="close"
            >
              <span
                class="text-gray-800 h-6 w-6 text-2xl block outline-none focus:outline-none"
              >
                ×
              </span>
            </button>
          </div>
          <div class="relative p-6 flex-auto">
            <slot name="body"> Corps par défaut </slot>
          </div>
          <div
            class="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b"
          >
            <slot name="footer">
              <button
                class="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                @click="close"
              >
                Quitter
              </button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
  <div
    v-if="isVisible"
    class="opacity-25 fixed inset-0 z-40 bg-black"
    @click="close"
  ></div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  widthClass: {
    type: String,
    default: "max-w-lg",
  },
});

const emit = defineEmits(["close"]);

const isVisible = ref(props.show);

watch(
  () => props.show,
  (newVal) => {
    isVisible.value = newVal;
  }
);

const close = () => {
  isVisible.value = false;
  emit("close");
};

const modalWidthClass = ref(props.widthClass);
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
