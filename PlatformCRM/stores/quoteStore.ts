
import { defineStore } from 'pinia';
import { ref, type Ref } from 'vue';
import type { quoteStatus } from '~/generated/prisma'; 
import type { quote, CreateUpdateQuotePayload } from '~/types'; 

export const useQuoteStore = defineStore('devis', () => {
  const quote: Ref<quote | null> = ref(null);
  const quoteDetails: Ref<quote | null> = ref(null);
  const loading: Ref<boolean> = ref(false);
  const error: Ref<any> = ref(null);
  const quotesList: Ref<quote[]> = ref([]); 
  const currentStagesPrices: Ref<Record<number, number>> = ref({});

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
      // Votre API `/api/quotes/user/${userId}` utilise `user.role`, assurez-vous que `user.role` existe ou utilisez `user.roles[0]`
      const userRole = user.role || (user.roles && user.roles.length > 0 ? user.roles[0].name : null); 

      let apiEndpoint: string;

      if (userRole === "admin") { 
        apiEndpoint = "/api/quotes";
      } else { // Par défaut pour les clients
        apiEndpoint = `/api/quotes/user/${userId}`;
      }

      // Votre API de devis retourne directement un tableau, pas un objet `{ data: [] }`
      const quotes = await $fetch<quote[]>(apiEndpoint); 

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