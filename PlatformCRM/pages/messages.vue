<template>
  <div v-if="isClient" class="min-h-screen bg-gray-50 flex container">
    <MessagesConversationSidebar
      :conversations="conversations"
      @select="selectConversation"
      @delete-conversation="deleteConversation"
    />

    <main class="flex-1 flex flex-col">
      <MessagesChatHeader :conversation="currentConversation" />

      <div class="flex-1 p-6 bg-gray-50" ref="messagesContainer">
        <div
          v-for="message in currentMessages"
          :key="message.id"
          :class="[
            'mb-4 flex relative',
            message.sent ? 'justify-end' : 'justify-start',
          ]"
        >
          <div :class="['max-w-lg', message.sent ? 'order-2' : '']">
            <div
              :class="[
                'rounded-lg p-4',
                message.sent
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-200',
              ]"
            >
              <div
                v-if="message.file"
                class="mb-2 flex items-center p-2 bg-gray-100 rounded"
              >
                <i class="ri-file-line text-gray-500 mr-2"></i>
                <span class="text-sm flex-1 truncate">{{
                  message.file.name
                }}</span>
                <a
                  :href="getFileUrl(message.file.name)"
                  target="_blank"
                  download
                  :title="'Télécharger ' + message.file.name"
                  class="ml-2 text-blue-600 hover:text-blue-800"
                >
                  <i class="ri-download-line"></i>
                </a>
              </div>
              <p class="text-sm">{{ message.content }}</p>
            </div>
            <p :class="['text-xs mt-1', message.sent ? 'text-right' : '']">
              {{ formatMessageTime(message.timestamp) }}
            </p>
          </div>
          <button
            class="absolute top-1/2 transform -translate-y-1/2 right-1 text-gray-400 hover:text-red-700 focus:outline-none"
            @click.stop="deleteMessage(message.id)"
          >
            <i class="ri-delete-bin-line"></i>
          </button>
        </div>
      </div>

      <MessagesMessageInput @send="sendMessage" />
    </main>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, nextTick } from "vue";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { Conversation, Message } from "@/types";
import { useIsRole } from "#imports";

definePageMeta({ layout: "admin" });

const { isClient } = useIsRole();
const conversations = ref<Conversation[]>([
  {
    id: 1,
    name: "Équipe Design",
    avatar: "",
    lastMessage: "Les maquettes sont prêtes pour review",
    timestamp: new Date().getTime() - 20 * 60 * 1000,
    online: true,
    active: true,
    messages: [
      {
        id: 1,
        content:
          "Bonjour ! Les dernières modifications du design sont disponibles.",
        timestamp: new Date().getTime() - 30 * 60 * 1000,
        sent: false,
      },
      {
        id: 2,
        content: "Super, je vais regarder ça tout de suite.",
        timestamp: new Date().getTime() - 25 * 60 * 1000,
        sent: true,
      },
      {
        id: 3,
        content: "Voici le fichier avec les assets mis à jour.",
        timestamp: new Date().getTime() - 20 * 60 * 1000,
        sent: false,
        file: {
          name: "assets-v2.zip",
          size: "2.3 MB",
        },
      },
      {
        id: 4,
        content: "Merci ! Je valide les changements dans l'après-midi.",
        timestamp: new Date().getTime() - 15 * 60 * 1000,
        sent: true,
      },
    ],
  },
  {
    id: 2,
    name: "Équipe Développement",
    avatar: "",
    lastMessage: "Le déploiement est prévu pour demain",
    timestamp: new Date().getTime() - 2 * 60 * 60 * 1000,
    online: true,
    active: false,
    messages: [],
  },
  {
    id: 3,
    name: "Support Client",
    avatar: "",
    lastMessage: "Nouveau ticket urgent à traiter",
    timestamp: new Date().getTime() - 24 * 60 * 60 * 1000, // Yesterday
    online: false,
    active: false,
    messages: [],
  },
]);

const currentConversation = ref<Conversation | undefined>(
  conversations.value[0]
);
const messagesContainer = ref<HTMLElement | null>(null);

const currentMessages = computed(() => {
  return currentConversation.value ? currentConversation.value.messages : [];
});

const formatMessageTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  return format(date, "HH:mm", { locale: fr });
};

const selectConversation = (id: number) => {
  const selected = conversations.value.find((conv) => conv.id === id);
  if (selected) {
    currentConversation.value = selected;
    conversations.value.forEach((conv) => {
      conv.active = conv.id === id;
    });
    nextTick(() => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop =
          messagesContainer.value.scrollHeight;
      }
    });
  }
};

const sendMessage = (content: string, file?: File) => {
  if (currentConversation.value && (content.trim() || file)) {
    const timestamp = new Date().getTime();
    const newMessage: Message = {
      id: currentConversation.value.messages.length + 1,
      content: content,
      timestamp: timestamp,
      sent: true,
      file: file
        ? {
            name: file.name,
            size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          }
        : undefined,
    };
    const newConversation: Conversation = {
      ...currentConversation.value,
      messages: [...currentConversation.value.messages, newMessage],
    };

    currentConversation.value = newConversation;

    const conversationIndex = conversations.value.findIndex(
      (conv) => conv.id === currentConversation.value?.id
    );
    if (conversationIndex !== -1) {
      conversations.value[conversationIndex].lastMessage =
        content || "Fichier envoyé";
      conversations.value[conversationIndex].timestamp = timestamp;
    }

    nextTick(() => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop =
          messagesContainer.value.scrollHeight;
      }
    });
  }
};

const deleteConversation = (id: number) => {
  conversations.value = conversations.value.filter((conv) => conv.id !== id);
  if (currentConversation.value?.id === id && conversations.value.length > 0) {
    currentConversation.value = conversations.value[0];
    conversations.value[0].active = true;
  } else if (conversations.value.length > 0) {
    const index = conversations.value.findIndex(
      (conv) => conv.id === currentConversation.value?.id
    );
    if (index !== -1) {
      conversations.value[index].active = true;
    } else {
      conversations.value[0].active = true;
      currentConversation.value = conversations.value[0];
    }
  } else {
    currentConversation.value = undefined;
  }
};

const deleteMessage = (messageId: number) => {
  if (currentConversation.value) {
    currentConversation.value.messages =
      currentConversation.value.messages.filter((msg) => msg.id !== messageId);
  }
};

// Fonction temporaire pour simuler l'URL du fichier
const getFileUrl = (fileName: string): string => {
  return `https://example.com/fichiers/${encodeURIComponent(fileName)}`;
};

onMounted(() => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
});
</script>

<style scoped>
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.7);
}

.relative:hover button {
  display: block !important;
}
.absolute button {
  display: none;
}
</style>
