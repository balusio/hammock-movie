"use client";

import {
  KeyboardEvent,
  KeyboardEventHandler,
  SyntheticEvent,
  useEffect,
  useState,
} from "react";
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

  const onReset = () => {
    resetResult();
    setValue("");
    setMovieSelected(false);
    setSelectedIndex(null);
  };

  const onResetClicked = () => {
    onReset();
  };

  const onResetPressed = (e: KeyboardEvent) => {
    const arrowEvent = (e as unknown as KeyboardEvent).code;
    if (arrowEvent === "Enter") {
      onReset();
    }
  };

  /**
   * @param idx  if the event is mouse based it will select the index based clicked otherwise is keyboardBased
   * uses the current index moved on the results
   */
  const onMovieSelected = (idx?: number) => {
    setMovieSelected(true);
    if (result.status === API_SEARCH_RESULT.FULFILLED) {
      if (idx !== undefined) {
        setValue(result.response[idx].title);
      } else if (selectedIndex !== null) {
        setValue(result.response[selectedIndex].title);
      }
    }
  };

  // usage of https://stackoverflow.com/questions/42036865/react-how-to-navigate-through-list-by-arrow-keys
  const onKeyDownEvent = (e: KeyboardEvent) => {
    const arrowEvent = (e as unknown as KeyboardEvent).code;
    const forward = arrowEvent === "ArrowDown" || arrowEvent === "ArrowRight";
    const backward = arrowEvent === "ArrowUp" || arrowEvent === "ArrowLeft";

    if (arrowEvent === "Enter") {
      onMovieSelected();
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
          disabled={movieSelected}
        />
        {movieSelected ? (
          <button
            tabIndex={0}
            data-testid="reset-button"
            className="button text-white p-2 ml-2 bg-red-500 cursor-pointer rounded-md"
            onClick={onResetClicked}
            onKeyDown={onResetPressed}
          >
            clear
          </button>
        ) : null}
      </div>
      <UserSearchResultComponent
        {...result}
        selectedIndex={selectedIndex}
        onSelectedMovie={onMovieSelected}
      />
    </>
  );
};

export default UserSearchComponent;
