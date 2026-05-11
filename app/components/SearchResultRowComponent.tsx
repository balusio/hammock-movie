import { useEffect, useState } from "react";
import { MovieFormattedResponse } from "../utils/types";

type SearchElementResultProps = MovieFormattedResponse & {
  onClick: (idx: number) => void;
  currentIdx: number;
};

const SearchElementResult = ({
  title,
  year,
  onClick,
  currentIdx,
}: SearchElementResultProps) => {
  const [focused, setIsFocused] = useState(false);
  const selectedClassName = focused ? "bg-gray-200" : "";

  const onMovieSelected = () => {
    onClick(currentIdx);
  };

  const onKeyPressed = (e: KeyboardEvent) => {
    if (focused && e.code === "Enter") {
      onClick(currentIdx);
    }
  };

  return (
    <li
      className={`${selectedClassName} p-4 m-2 cursor-pointer hover:bg-gray-200`}
      onClick={onMovieSelected}
      data-testid={title}
      id={`nav-${currentIdx}`}
      tabIndex={0}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onKeyDown={(e) => onKeyPressed(e as unknown as KeyboardEvent)}
    >
      {title} - {year.toLocaleString("en")}
    </li>
  );
};

export default SearchElementResult;
