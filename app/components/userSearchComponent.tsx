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
    if (result.status === API_SEARCH_RESULT.FULFILLED) {
      setMovieSelected(true);
      if (idx !== undefined) {
        setValue(result.response[idx].title);
      } else if (selectedIndex !== null) {
        setValue(result.response[selectedIndex].title);
      }
    }
  };

  // usage of https://stackoverflow.com/questions/42036865/react-how-to-navigate-through-list-by-arrow-keys
  const onKeyDownEvent = (e: KeyboardEvent) => {
    e.preventDefault();
    const arrowEvent = (e as unknown as KeyboardEvent).code;
    const forward =
      arrowEvent === "ArrowDown" ||
      arrowEvent === "ArrowRight" ||
      arrowEvent === "Tab";
    const backward = arrowEvent === "ArrowUp" || arrowEvent === "ArrowLeft";

    if (arrowEvent === "Enter") {
      onMovieSelected();
      document.getElementById("search-input")?.focus();
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
        className="flex flex-row my-2 w-full relative"
        data-testid="container-input"
      >
        <input
          id="search-input"
          type="text"
          data-testid="search-input"
          placeholder="search movie"
          value={value}
          onChange={onInputChange}
          className="border-2 rounded-md w-full pl-6 h-12 pr-16"
          disabled={movieSelected}
        />
        {movieSelected ? (
          <button
            tabIndex={0}
            data-testid="reset-button"
            className="button text-white p-2 ml-2 bg-red-500 cursor-pointer rounded-r-md absolute right-0  h-12 w-16"
            onClick={onResetClicked}
            onKeyDown={onResetPressed}
          >
            clear
          </button>
        ) : null}
      </div>
      <ul
        data-testid="nav-data"
        tabIndex={0}
        onKeyDown={(e) => onKeyDownEvent(e as unknown as KeyboardEvent)}
      >
        <UserSearchResultComponent
          {...result}
          selectedIndex={selectedIndex}
          onSelectedMovie={onMovieSelected}
        />
      </ul>
    </>
  );
};

export default UserSearchComponent;
