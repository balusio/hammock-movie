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
   * @param idx if the event is mouse based it will select the index based clicked otherwise is keyboardBased
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

      setSelectedIndex(null);
    }
  };

  return (
    <>
      <div
        className="flex flex-row my-2 w-full relative"
        data-testid="container-input"
      >
        <input
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
      <UserSearchResultComponent
        {...result}
        selectedIndex={selectedIndex}
        onSelectedMovie={onMovieSelected}
      />
    </>
  );
};

export default UserSearchComponent;
