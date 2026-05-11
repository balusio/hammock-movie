import { JSX } from "react";
import { API_SEARCH_RESULT } from "../utils/constants";
import { SearchResult } from "../utils/types";
import SearchElementResult from "./SearchResultRowComponent";

type UserSearchResultProps = SearchResult & {
  selectedIndex: number | null;
  onSelectedMovie: (id: number) => void;
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
          <>
            {props.response.map((movie, idx) => (
              <SearchElementResult
                {...movie}
                key={movie.id}
                selected={props.selectedIndex === idx}
                onClick={props.onSelectedMovie}
                currentIdx={idx}
              />
            ))}
          </>
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
