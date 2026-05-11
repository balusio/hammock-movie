"use client";

import { SyntheticEvent, useEffect, useState } from "react";
import { API_SEARCH_RESULT, useSearch } from "../hooks/useSearch";
import UserSearchResultComponent from "./userSearchResultComponent";

const API_RESULT_LIMIT = 5;

const UserSearchComponent = () => {
  const [value, setValue] = useState<string>("");
  const [movieSelected, setMovieSelected] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const { makeSearch, result, resetResult } = useSearch({
    limit: API_RESULT_LIMIT,
  });

  const onInputChange = (e: SyntheticEvent<HTMLInputElement>) => {
    setValue((e.target as HTMLInputElement).value);
  };

  useEffect(() => {
    if (value.length > 2 && !movieSelected) {
      makeSearch(value);
    } else {
      resetResult();
    }
  }, [value]);

  const onResetClicked = (e: SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault();
    resetResult();
    setValue("");
    setMovieSelected(false);
    setSelectedIndex(null);
  };

  // usage of https://stackoverflow.com/questions/42036865/react-how-to-navigate-through-list-by-arrow-keys
  const onKeyDownEvent = (e: KeyboardEvent) => {
    const arrowEvent = (e as unknown as KeyboardEvent).code;
    const forward = arrowEvent === "ArrowDown" || arrowEvent === "ArrowRight";
    const backward = arrowEvent === "ArrowUp" || arrowEvent === "ArrowLeft";

    if (arrowEvent === "Enter") {
      setMovieSelected(true);
      if (
        result.status === API_SEARCH_RESULT.FULFILLED &&
        selectedIndex !== null
      ) {
        setValue(result.response[selectedIndex].title);
      }
    }

    if (forward || backward) {
      setSelectedIndex((oldValue) => {
        if (oldValue !== null) {
          // TOD: i know there's a minmax here
          const resetForward =
            forward && oldValue + 1 > API_RESULT_LIMIT - 1 ? 0 : oldValue + 1;
          const resetBackward =
            backward && oldValue - 1 < 0 ? API_RESULT_LIMIT - 1 : oldValue - 1;

          return forward ? resetForward : resetBackward;
        } else {
          return 0;
        }
      });
    }
  };
  return (
    <>
      <div
        className="flex flex-row my-2 w-full"
        data-testid="container-input"
        onKeyDown={(e) => onKeyDownEvent(e as unknown as KeyboardEvent)}
      >
        <input
          type="text"
          data-testid="search-input"
          placeholder="search movie"
          value={value}
          onChange={onInputChange}
          className="border-2 rounded-md w-full px-6 h-12"
        />
        {movieSelected ? (
          <button
            tabIndex={0}
            data-testid="reset-button"
            className="button bg-red-300 text-white p-2 ml-2 hover:bg-red-500 cursor-pointer rounded-md"
            onClick={onResetClicked}
          >
            clear
          </button>
        ) : null}
      </div>
      <UserSearchResultComponent {...result} selectedIndex={selectedIndex} />
    </>
  );
};

export default UserSearchComponent;
