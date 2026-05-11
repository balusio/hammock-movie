import "@testing-library/jest-dom";
import {
  fireEvent,
  getByTestId,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import UseSearchCommponent from "../app/components/userSearchComponent";
import { resourceLimits } from "node:worker_threads";

const mockResponse = {
  page: 1,
  results: [
    {
      id: 129933,
      title: "Paraguayan Hammock",
      original_language: "es",
      original_title: "Hamaca paraguaya",
      release_date: "2006-11-02",
    },
    {
      id: 195714,
      title: "Love in a Hammock",
      original_language: "en",
      original_title: "Love in a Hammock",
      release_date: "1901-01-12",
    },
  ],
};

describe("ResultComponent", () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockResponse),
        ok: true,
      }),
    ) as jest.Mock;
  });

  it("renders the input component", () => {
    render(<UseSearchCommponent />);
    const input = screen.getByTestId("search-input");
    expect(input).toBeInTheDocument();
  });

  it("loads the input value and renders list of result", async () => {
    render(<UseSearchCommponent />);

    const input = screen.getByTestId("search-input");

    fireEvent.change(input, {
      target: { value: "mock" },
    });
    expect(input).toBeInTheDocument();

    const navList = await screen.findByTestId("nav-data");
    expect(navList).toBeInTheDocument();
  });

  it("tab a result and select first movie", async () => {
    render(<UseSearchCommponent />);

    const containerInput = screen.getByTestId("container-input");
    const input = screen.getByTestId("search-input");
    expect(containerInput).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    fireEvent.change(input, {
      target: { value: "mock" },
    });

    const navList = await screen.findByTestId("nav-data");
    expect(navList).toBeInTheDocument();

    const firstResult = await screen.findByTestId(
      mockResponse.results[0].title,
    );
    expect(firstResult).toBeInTheDocument();
    expect(firstResult).toHaveClass("p-4 m-2 cursor-pointer hover:bg-gray-200");
    fireEvent.focus(firstResult);
    fireEvent.keyDown(firstResult, { key: "Enter", code: "Enter" });

    const deleteButton = await screen.findByTestId("reset-button");
    expect(deleteButton).toBeInTheDocument();

    expect(deleteButton).toHaveTextContent("clear");
  });

  it("should return error if response fails", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({}),
        ok: false,
      }),
    ) as jest.Mock;

    render(<UseSearchCommponent />);

    const containerInput = screen.getByTestId("container-input");
    const input = screen.getByTestId("search-input");
    expect(containerInput).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    fireEvent.change(input, {
      target: { value: "mock" },
    });

    const navList = await screen.findByText("Error on search, try again");
    expect(navList).toBeInTheDocument();
  });

  it("should not show results if data is 0", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            results: [],
          }),
        ok: false,
      }),
    ) as jest.Mock;

    render(<UseSearchCommponent />);

    const containerInput = screen.getByTestId("container-input");
    const input = screen.getByTestId("search-input");
    expect(containerInput).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    fireEvent.change(input, {
      target: { value: "mock" },
    });

    const resultNav = screen.queryByTestId("nav-data");
    expect(resultNav).toBeNull();
  });
});
