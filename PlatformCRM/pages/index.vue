<template>
  <!-- Hero Section -->
  <section
    class="relative pt-24 pb-16 overflow-hidden bg-gradient-to-r from-indigo-50 to-transparent"
  >
    <div class="absolute top-0 right-0 w-full h-full z-0 overflow-hidden">
      <img
        :src="heroImage"
        alt="Plateforme CRM pour agences digitales"
        class="object-cover object-top w-full h-full opacity-80"
      />
    </div>
    <div class="container mx-auto px-6 relative z-10">
      <div class="max-w-2xl py-16">
        <h1 class="text-5xl font-bold  text-gray-800 mb-6 leading-tight">
          Transformez votre gestion de projets digitaux
        </h1>
        <p class="text-xl text-gray-700 mb-8">
          OpenCRM est la plateforme CRM conçue spécifiquement pour les agences
          digitales qui souhaitent optimiser leur workflow et augmenter leur
          productivité.
        </p>
      </div>
    </div>
  </section>
  <!-- Process Section -->
  <section class="py-20 bg-white">
    <div class="container mx-auto px-6">
      <h2 class="text-3xl font-bold text-center text-gray-800 mb-16">
        Notre processus de projet
      </h2>
      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8"
      >
        <div
          v-for="(step, index) in processSteps"
          :key="index"
          class="flex flex-col items-center text-center"
        >
          <div class="relative">
            <div
              class="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center mb-4 relative z-10"
            >
              <i :class="`${step.icon} text-indigo-600 text-2xl`"></i>
            </div>
            <div
              v-if="index < processSteps.length - 1"
              class="hidden xl:block absolute top-10 left-full w-full h-0.5 bg-indigo-200 -z-10"
            ></div>
          </div>
          <h3 class="text-xl font-semibold text-gray-800 mb-2">
            {{ step.title }}
          </h3>
          <p class="text-gray-600">{{ step.description }}</p>
        </div>
      </div>
    </div>
  </section>
  <!-- Features Section -->
  <section class="py-20 bg-gray-50">
    <div class="container mx-auto px-6">
      <h2 class="text-3xl font-bold text-center text-gray-800 mb-16">
        Pourquoi choisir OpenCRM
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div
          v-for="(feature, index) in features"
          :key="index"
          class="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all"
        >
          <div
            class="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6"
          >
            <i :class="` ${feature.icon} text-indigo-600 text-2xl`"></i>
          </div>
          <h3 class="text-xl font-semibold text-gray-800 mb-3">
            {{ feature.title }}
          </h3>
          <p class="text-gray-600">{{ feature.description }}</p>
        </div>
      </div>
    </div>
  </section>
  <!-- Testimonials Section -->
  <section class="py-20 bg-white">
    <div class="container mx-auto px-6">
      <h2 class="text-3xl font-bold text-center text-gray-800 mb-16">
        Ce que nos clients disent
      </h2>
      <div class="swiper-container">
        <swiper
          :modules="swiperModules"
          :slides-per-view="1"
          :breakpoints="swiperBreakpoints"
          :pagination="{ clickable: true }"
          :autoplay="{ delay: 5000, disableOnInteraction: false }"
        >
          <swiper-slide
            v-for="(testimonial, index) in testimonials"
            :key="index"
          >
            <div class="bg-gray-50 p-8 rounded-xl">
              <div class="flex items-center mb-6">
                <div class="w-16 h-16 rounded-full overflow-hidden mr-4">
                  <img
                    :src="testimonial.avatar"
                    alt="Avatar"
                    class="w-full h-full object-cover object-top"
                  />
                </div>
                <div>
                  <h4 class="text-lg font-semibold text-gray-800">
                    {{ testimonial.name }}
                  </h4>
                  <p class="text-gray-600">{{ testimonial.role }}</p>
                </div>
              </div>
              <p class="text-gray-700 italic">{{ testimonial.text }}</p>
            </div>
          </swiper-slide>
        </swiper>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="bg-gray-900 text-white py-12 mt-auto">
    <div class="container mx-auto px-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <h3 class="text-xl font-bold mb-4">OPENINTECH</h3>
          <p class="text-gray-400 mb-6">
            La plateforme CRM idéale pour les agences digitales innovantes.
          </p>
          <div class="flex space-x-4">
            <a
              href="#"
              class="text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <i class="fab fa-facebook-f"></i>
            </a>
            <a
              href="#"
              class="text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <i class="fab fa-twitter"></i>
            </a>
            <a
              href="#"
              class="text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <i class="fab fa-linkedin-in"></i>
            </a>
            <a
              href="#"
              class="text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <i class="fab fa-instagram"></i>
            </a>
          </div>
        </div>
        <div>
          <h3 class="text-xl font-bold mb-4">Contact</h3>
          <ul class="space-y-2 text-gray-400">
            <li class="flex items-center">
              <i class="fas fa-map-marker-alt mr-3 text-indigo-400"></i>
              <span>123 Avenue des Champs-Élysées, Paris</span>
            </li>
            <li class="flex items-center">
              <i class="fas fa-phone mr-3 text-indigo-400"></i>
              <span>+33 1 23 45 67 89</span>
            </li>
            <li class="flex items-center">
              <i class="fas fa-envelope mr-3 text-indigo-400"></i>
              <span>contact@openintech.com</span>
            </li>
          </ul>
        </div>
        <div>
          <h3 class="text-xl font-bold mb-4">Liens utiles</h3>
          <ul class="space-y-2 text-gray-400">
            <li>
              <a
                href="#"
                class="hover:text-white transition-colors cursor-pointer"
                >Conditions générales d'utilisation</a
              >
            </li>
            <li>
              <a
                href="#"
                class="hover:text-white transition-colors cursor-pointer"
                >Politique de confidentialité</a
              >
            </li>
            <li>
              <a
                href="#"
                class="hover:text-white transition-colors cursor-pointer"
                >FAQ</a
              >
            </li>
            <li>
              <a
                href="#"
                class="hover:text-white transition-colors cursor-pointer"
                >Support</a
              >
            </li>
          </ul>
        </div>
      </div>
      <div
        class="border-t border-gray-800 mt-10 pt-6 text-center text-gray-500"
      >
        <p>&copy; 2025 OPENINTECH. Tous droits réservés.</p>
      </div>
    </div>
  </footer>
</template>
<script lang="ts" setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import { Pagination, Autoplay } from "swiper/modules";
const swiperModules = [Pagination, Autoplay];
const swiperBreakpoints = {
  640: {
    slidesPerView: 1,
    spaceBetween: 20,
  },
  768: {
    slidesPerView: 2,
    spaceBetween: 30,
  },
  1024: {
    slidesPerView: 3,
    spaceBetween: 40,
  },
};
const heroImage =
  "https://readdy.ai/api/search-image?query=elegant%20abstract%20geometric%20pattern%20with%20soft%20gradient%20colors%20in%20blue%20and%20white%2C%20modern%20minimalist%20design%20with%20flowing%20curves%20and%20subtle%20shadows%2C%20professional%20and%20calming%20atmosphere%2C%20perfect%20for%20business%20presentation%20background&width=1440&height=800&seq=hero-image-002&orientation=landscape";
const processSteps = [
  {
    title: "Analyse",
    icon: "ri-search-line",
    description:
      "Nous analysons vos besoins et objectifs pour comprendre parfaitement votre projet.",
  },
  {
    title: "Devis",
    icon: "ri-bill-line",
    description:
      "Nous élaborons un devis détaillé et transparent adapté à votre budget.",
  },
  {
    title: "Design",
    icon: "ri-pencil-ruler-2-fill",
    description:
      "Nos designers créent une interface intuitive et esthétique selon vos préférences.",
  },
  {
    title: "Développement",
    icon: "ri-code-s-slash-line",
    description:
      "Nos développeurs transforment le design en solution fonctionnelle et performante.",
  },
  {
    title: "Tests",
    icon: "ri-test-tube-fill",
    description:
      "Nous réalisons des tests rigoureux pour garantir la qualité et la fiabilité.",
  },
  {
    title: "Livraison",
    icon: "ri-rocket-fill",
    description:
      "Nous déployons votre solution et assurons un suivi pour votre satisfaction.",
  },
];
const features = [
  {
    title: "Gestion de projets simplifiée",
    icon: "ri-list-check-3",
    description:
      "Suivez l'avancement de vos projets en temps réel et optimisez la collaboration entre vos équipes.",
  },
  {
    title: "Relation client optimisée",
    icon: "ri-group-line",
    description:
      "Centralisez toutes les interactions avec vos clients et offrez-leur une expérience personnalisée.",
  },
  {
    title: "Rapports et analyses",
    icon: "ri-line-chart-line",
    description:
      "Accédez à des tableaux de bord intuitifs pour analyser vos performances et prendre des décisions éclairées.",
  },
];
const testimonials = [
  {
    name: "Sophie Martin",
    role: "Directrice, Agence Digitale Parisienne",
    avatar:
      "https://readdy.ai/api/search-image?query=professional%20business%20woman%20with%20short%20brown%20hair%2C%20confident%20smile%2C%20wearing%20elegant%20business%20attire%2C%20neutral%20background%2C%20professional%20headshot%20style%2C%20soft%20lighting%2C%20warm%20expression&width=200&height=200&seq=avatar-001&orientation=squarish",
    text: "OpenCRM a complètement transformé notre façon de gérer nos projets. Nous avons gagné en efficacité et nos clients sont ravis de la transparence offerte.",
  },
  {
    name: "Thomas Dubois",
    role: "Fondateur, Studio Web Créatif",
    avatar:
      "https://readdy.ai/api/search-image?query=professional%20business%20man%20with%20glasses%2C%20short%20dark%20hair%2C%20confident%20smile%2C%20wearing%20casual%20business%20attire%2C%20neutral%20background%2C%20professional%20headshot%20style%2C%20soft%20lighting%2C%20friendly%20expression&width=200&height=200&seq=avatar-002&orientation=squarish",
    text: "Depuis que nous utilisons OpenCRM, notre productivité a augmenté de 40%. L'interface intuitive permet à toute l'équipe de s'adapter rapidement.",
  },
  {
    name: "Marie Leroy",
    role: "Chef de Projet, Agence Marketing Digital",
    avatar:
      "https://readdy.ai/api/search-image?query=professional%20business%20woman%20with%20long%20blonde%20hair%2C%20confident%20smile%2C%20wearing%20modern%20business%20attire%2C%20neutral%20background%2C%20professional%20headshot%20style%2C%20soft%20lighting%2C%20approachable%20expression&width=200&height=200&seq=avatar-003&orientation=squarish",
    text: "La plateforme nous a permis de centraliser toutes nos communications client et de suivre chaque étape du projet avec précision. Un outil indispensable !",
  },
];
</script>
<style scoped>
.swiper-container {
  width: 100%;
  padding-bottom: 50px;
}
.swiper-pagination {
  bottom: 0 !important;
}
.swiper-pagination-bullet {
  width: 10px;
  height: 10px;
  background-color: #6366f1;
  opacity: 0.5;
}
.swiper-pagination-bullet-active {
  opacity: 1;
}
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
