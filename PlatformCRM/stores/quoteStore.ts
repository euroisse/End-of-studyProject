// stores/useQuoteStore.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { quote, CreateUpdateQuotePayload, QuoteStageInput } from '~/types';

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
      const quotes = await $fetch<any[]>('/api/quotes');
      quotesList.value = quotes.map(q => ({
        ...q,
        id: Number(q.id)
      }));
    } catch (err: any) {
      setError(err);
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
    fetchQuotesList
  };
});