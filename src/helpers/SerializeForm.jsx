export const SerializeForm = (form) => {

    const formData = new FormData(form);
    const completeObj = {};


    for (const [name, value] of formData) { 

        completeObj[name] = value;
    }

    return completeObj;
}