import React, { useState, useEffect } from "react";

export const QuoteGenerator = (request) => {
  const [dataIsLoaded, setDataIsLoaded] = useState();
  const [items, setItems] = useState();

  useEffect(() => {
    fetch("https://api.quotable.io/random")
      .then((res) => res.json())
      .then((json) => {
        setDataIsLoaded(true);
        setItems(json);
      });
  }, [request]);

  return items;
};
