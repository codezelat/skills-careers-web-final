export const handleOpenForm = (isFormVisible) => () => {
    isFormVisible(true);
  };
  
  export const handleCloseForm = (isFormVisible) => () => {
    isFormVisible(false);
  };

