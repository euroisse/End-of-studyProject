// stores/quoteStore.ts
import { defineStore } from 'pinia';
import { ref, type Ref } from 'vue';
import type { quoteStatus } from '~/types/prismaFrontend/prisma';
import type { quote, CreateUpdateQuotePayload } from '~/types';

export const useQuoteStore = defineStore('devis', () => {
  const quote: Ref<quote | null> = ref(null);
  const quoteDetails: Ref<quote | null> = ref(null);
  const loading: Ref<boolean> = ref(false);
  const error: Ref<any> = ref(null);
  const quotesList: Ref<quote[]> = ref([]);
  const currentStagesPrices: Ref<Record<number, number>> = ref({});
  const pagination = ref({
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 1,
  });

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
      await fetchQuotesPaginated(pagination.value.page, pagination.value.pageSize); // Refresh paginated list
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
   
    await fetchQuotesPaginated(1, pagination.value.pageSize); 
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

      await fetchQuotesPaginated(pagination.value.page, pagination.value.pageSize); // Refresh paginated list
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
      const updatedQuote = await $fetch<quote>(`/api/quotes/${quoteId}`, {
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

      await fetchQuotesPaginated(pagination.value.page, pagination.value.pageSize); // Refresh paginated list
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function fetchQuotesPaginated(page = 1, pageSize = 10) {
    setLoading(true);
    clearError();
    try {
      const userString = localStorage.getItem("user");
      if (!userString) {
        console.warn("Utilisateur non connecté. Impossible de récupérer les devis paginés.");
        quotesList.value = [];
        pagination.value = { total: 0, page: 1, pageSize: 10, totalPages: 1 }; // Reset pagination
        setLoading(false);
        return;
      }
      const user = JSON.parse(userString);
      const userId = user.id;

      if (!userId) {
        console.error("User ID is missing from local storage.");
        throw createError({ statusCode: 400, statusMessage: 'ID utilisateur manquant.' });
      }

     
      const res = await $fetch('/api/quotes/pagination', {
        params: { page, pageSize, id: userId } 
      });

    
      quotesList.value = (res.data || []).map((q: any) => ({
        ...q,
        id: Number(q.id)
      }));
      pagination.value = res.pagination || { total: 0, page: 1, pageSize: 10, totalPages: 1 };
      
    } catch (err: any) {
      setError(err);
      quotesList.value = [];
      pagination.value = { total: 0, page: 1, pageSize: 10, totalPages: 1 }; // Reset pagination on error
      console.error("Erreur lors de la récupération des devis paginés dans le store:", err);
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
    pagination, 
    createQuote,
    fetchQuoteDetails,
    updatequote,
    deleteQuote,
    fetchQuotesList, 
    updateQuoteStatus,
    fetchQuotesPaginated
  };
});