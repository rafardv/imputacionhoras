export const shortenName = (name) => {
    if (name.length > 14) {
      return name.substring(0, 14) + "...";             // nombre proy
    }
    return name;
  };