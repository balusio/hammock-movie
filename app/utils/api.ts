import { HTTP_METHOD } from "next/dist/server/web/http";

type ApiProps = {
  method?: HTTP_METHOD;
  path: string;
};

const API_URL = process.env.NEXT_PUBLIC_HAMMOCK_API;

const fetchApi = async ({ method = "GET", path }: ApiProps) => {
  const response = await fetch(`${API_URL}${path}`, {
    method,
  });
  const data = await response.json();

  return data;
};

export default fetchApi;
