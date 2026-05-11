import { MovieFormattedResponse } from "../utils/types";

type SearchElementResultProps = MovieFormattedResponse & {
  selected: boolean;
  onClick: (idx: number) => void;
  currentIdx: number;
};

const SearchElementResult = ({
  title,
  year,
  selected,
  onClick,
  currentIdx,
}: SearchElementResultProps) => {
  const selectedClassName = selected ? "bg-gray-200" : "";

  const onMovieSelected = () => {
    onClick(currentIdx);
  };

  return (
    <li
      className={`${selectedClassName} p-4 m-2 cursor-pointer hover:bg-gray-200`}
      onClick={onMovieSelected}
      data-testid={title}
    >
      {title} - {year.toLocaleString("en")}
    </li>
  );
};

export default SearchElementResult;
