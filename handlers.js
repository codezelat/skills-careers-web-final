export const handleOpenForm = (isFormVisible) => () => {
  isFormVisible(true);
};

export const handleCloseForm = (isFormVisible) => () => {
  isFormVisible(false);
};

export const formatDate = (date) => {
  const validDate = new Date(date); // Ensure date is a Date object
  if (isNaN(validDate)) {
    throw new Error("Invalid date");
  }

  const day = validDate.getDate().toString().padStart(2, "0");
  const month = validDate.toLocaleString("default", { month: "long" });
  const year = validDate.getFullYear();

  return `${day} ${month} ${year}`;
};

export const formatTime = (datetime) => {
  const validDate = new Date(datetime);
  if (isNaN(validDate)) {
    throw new Error("Invalid date");
  }

  return validDate.toLocaleString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
};
