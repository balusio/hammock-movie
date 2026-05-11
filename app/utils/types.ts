import { API_SEARCH_RESULT } from "./constants";

type MovieApiResponse = {
  adult: string;
  id: number;
  original_language: string;
  original_title: string;
  title: string;
  release_date: string;
};

type MovieFormattedResponse = Pick<
  MovieApiResponse,
  "title" | "id" | "release_date"
> & { year: Date };

type SearchResult =
  | {
      status: API_SEARCH_RESULT.IDLE;
      response: null;
    }
  | {
      status: API_SEARCH_RESULT.PENDING;
      response: null;
    }
  | {
      status: API_SEARCH_RESULT.FULFILLED;
      response: MovieFormattedResponse[];
    }
  | {
      status: API_SEARCH_RESULT.REJECTED;
      error: Error;
    };

export type { MovieApiResponse, MovieFormattedResponse, SearchResult };
