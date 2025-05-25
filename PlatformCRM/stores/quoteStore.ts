import { defineStore } from 'pinia';
import { ref, type Ref } from 'vue'; 
import QuoteList from '~/components/quotes/QuoteList.vue';
import type { quoteStatus } from '~/generated/prisma';
import type { quote, CreateUpdateQuotePayload } from '~/types'; 

export const useQuoteStore = defineStore('devis', () => {
  // Définition des états du store
  const quote: Ref<quote | null> = ref(null);
  const quoteDetails: Ref<quote | null> = ref(null);
  const loading: Ref<boolean> = ref(false); 
  const error: Ref<any> = ref(null); 
  const quotesList: Ref<quote[]> = ref([]);
  const currentStagesPrices: Ref<Record<number, number>> = ref({}); 

  // Fonctions utilitaires pour gérer les états de chargement et d'erreur
  function setLoading(isLoading: boolean) {
    loading.value = isLoading;
  }

  function setError(err: any) {
    error.value = err;
  }

  function clearError() {
    error.value = null;
  }

 
  async function createQuote(payload: CreateUpdateQuotePayload): Promise<quote> {
    setLoading(true);
    clearError();
    try {
      const newQuote = await $fetch<quote>('/api/quotes', { method: 'POST', body: payload });
      quote.value = newQuote;
      // Après la création, rafraîchir la liste pour qu'elle inclue le nouveau devis (si pertinent pour le rôle)
      await fetchQuotesList(); 
      return newQuote;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  
  async function fetchQuoteDetails(quoteId: number): Promise<quote | null> {
    setLoading(true);
    quoteDetails.value = null;
    clearError();
    try {
      const details = await $fetch<quote>(`/api/quotes/${quoteId}`);
      quoteDetails.value = details;

      // Initialise les prix des étapes pour l'édition
      const prices: Record<number, number> = {};
      details.stages.forEach(stage => {
        prices[stage.projectStageId] = stage.prix;
      });
      currentStagesPrices.value = prices;

      return details;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }

 
  async function fetchQuotesList(): Promise<void> {
    setLoading(true);
    clearError();
    try {
      const userString = localStorage.getItem("user");
      if (!userString) {
        console.warn("Utilisateur non connecté. Impossible de récupérer les devis.");
        quotesList.value = [];
        setLoading(false); 
        return; 
      }

      const user = JSON.parse(userString);
      const userId = user.id;
      const userRole = user.role; 

      let apiEndpoint: string;

      if (userRole === "ADMIN") {
        apiEndpoint = "/api/quotes"; 
      } else {

        apiEndpoint = `/api/quotes/user/${userId}`; 
      }
      

      const quotes = await $fetch<any[]>(apiEndpoint);

      quotesList.value = quotes.map(q => ({
        ...q,
        id: Number(q.id)
      }));
    } catch (err: any) {
      setError(err);
      console.error("Erreur lors de la récupération des devis dans le store:", err);

      quotesList.value = []; 
    } finally {
      setLoading(false); 
    }
  }

  
  async function updatequote(quoteId: number, payload: CreateUpdateQuotePayload): Promise<quote> {
    setLoading(true);
    clearError();
    try {
      const updatedQuote = await $fetch<quote>(`/api/quotes/${quoteId}`, { method: 'PUT', body: payload });
      quoteDetails.value = updatedQuote;
      
      const prices: Record<number, number> = {};
      updatedQuote.stages.forEach(stage => {
        prices[stage.projectStageId] = stage.prix;
      });
      currentStagesPrices.value = prices;

      // Après la mise à jour, rafraîchir la liste pour refléter les changements
      await fetchQuotesList(); 
      return updatedQuote;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }

 async function updateQuoteStatus(quoteId: number, status: quoteStatus): Promise<quote> {
  setLoading(true);
  clearError();
  try {
    const updatedQuote = await $fetch<quote>(`api/quotes/${quoteId}`, {
      method: 'PUT',
      body: { status }
    });
    quoteDetails.value = updatedQuote;
    
    const index = quotesList.value.findIndex(q => q.id === quoteId);
    if (index !== -1) { 
      quotesList.value[index] = updatedQuote;
    }
    return updatedQuote;
  } catch (err: any) {
    setError(err);
    throw err;
  } finally {
    setLoading(false);
  }
}
  async function deleteQuote(quoteId: number): Promise<void> {
    setLoading(true);
    clearError();
    try {
      await $fetch<void>(`/api/quotes/${quoteId}`, { method: 'DELETE' });

      await fetchQuotesList(); 
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  // Retourne tous les états et actions pour être utilisés par les composants
  return {
    quote,
    quoteDetails,
    loading,
    error,
    quotesList,
    currentStagesPrices,
    createQuote,
    fetchQuoteDetails,
    updatequote,
    deleteQuote,
    fetchQuotesList,
    updateQuoteStatus
  };
});
