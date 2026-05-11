const formatDate = (date: string): string => {
  if (!date || date === "") {
    return "missing date";
  }

  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

export { formatDate };
