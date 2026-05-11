import { JSX } from "react";
import { API_SEARCH_RESULT } from "../utils/constants";
import { MovieFormattedResponse, SearchResult } from "../utils/types";

type UserSearchResultProps = SearchResult & {
  selectedIndex: number | null;
};

type SearchElementResultProps = MovieFormattedResponse & {
  selected: boolean;
};

const SearchElementResult = ({
  title,
  year,
  selected,
}: SearchElementResultProps) => {
  const selectedClassName = selected ? "bg-gray-200" : "";
  return (
    <li className={`${selectedClassName} p-4 m-2`} data-testid={title}>
      {title} - {year.toLocaleString("en")}
    </li>
  );
};

const UserSearchResultComponent = (props: UserSearchResultProps) => {
  const ResponseData = (): JSX.Element | null => {
    switch (props.status) {
      case API_SEARCH_RESULT.IDLE:
        return null;

      case API_SEARCH_RESULT.PENDING:
        return <>...loading</>;

      case API_SEARCH_RESULT.FULFILLED:
        return (
          <ul data-testid="nav-data">
            {props.response.map((movie, idx) => (
              <SearchElementResult
                {...movie}
                key={movie.id}
                selected={props.selectedIndex === idx}
              />
            ))}
          </ul>
        );
      case API_SEARCH_RESULT.REJECTED:
        return <>Error on search, try again</>;
    }
  };
  return (
    <nav className="flex flex-col pt-4 w-full">
      <ResponseData />
    </nav>
  );
};

export default UserSearchResultComponent;
