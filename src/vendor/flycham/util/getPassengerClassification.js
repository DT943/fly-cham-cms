const getPassengerClassification = (dob, today = new Date()) => {
    const twoYearsOldDate = new Date(dob.getFullYear() + 2, dob.getMonth(), dob.getDate());
    const twelveYearsOldDate = new Date(dob.getFullYear() + 12, dob.getMonth(), dob.getDate());

    if (today < twoYearsOldDate) return 'an infant';
    if (today < twelveYearsOldDate) return 'a child';
    return 'an adult';
};
export default getPassengerClassification