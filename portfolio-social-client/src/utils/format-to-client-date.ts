export const formatToClientDate = (date?: Date) => {
    if (!date){
        return '';
    }
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    };
    return new Date(date).toLocaleDateString("en-US", options)
};

