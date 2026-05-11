import { useCallback, useState } from "react";
import fetchApi from "../utils/api";
import { API_SEARCH_RESULT } from "../utils/constants";
import { MovieApiResponse, SearchResult } from "../utils/types";

/**
 * Encapsulate state into useSearch:
    status: IDLE | PENDING | FULFILLED | REJECTED
    results
    searchState: { status: 'IDLE' } | { status: 'PENDING } | { status: 'FULFILLED', data: Results } | { status: 'REJECTED', error: string }
 */

type UseSarchParams = {
  limit: number;
};

const SEARCH_PATH = "/search?query=";

const useSearch = ({
  limit = 5,
}: UseSarchParams): {
  makeSearch: (query: string) => void;
  result: SearchResult;
  resetResult: () => void;
} => {
  const [response, setResponse] = useState<SearchResult>({
    status: API_SEARCH_RESULT.IDLE,
    response: null,
  });

  const makeSearch = useCallback(async (query: string) => {
    setResponse({
      status: API_SEARCH_RESULT.PENDING,
      response: null,
    });
    try {
      const encodedParam = encodeURIComponent(query);
      const { results } = await fetchApi({
        path: `${SEARCH_PATH}${encodedParam}`,
      });
      if (results.length > 0) {
        setResponse({
          status: API_SEARCH_RESULT.FULFILLED,
          response: results.slice(0, limit).map((elem: MovieApiResponse) => ({
            title: elem.title,
            year: new Date(elem.release_date).toLocaleString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            }),
            id: elem.id,
          })),
        });
      } else {
        setResponse({
          status: API_SEARCH_RESULT.IDLE,
          response: null,
        });
      }
    } catch (e) {
      if (e instanceof Error) {
        setResponse({
          status: API_SEARCH_RESULT.REJECTED,
          error: e,
        });
      } else {
        setResponse({
          status: API_SEARCH_RESULT.REJECTED,
          error: new Error("Error, intenta nuevamente"),
        });
      }
    }
  }, []);

  const resetResult = useCallback(() => {
    setResponse({
      status: API_SEARCH_RESULT.IDLE,
      response: null,
    });
  }, []);

  return {
    makeSearch,
    result: response,
    resetResult,
  };
};

export { useSearch, API_SEARCH_RESULT };
