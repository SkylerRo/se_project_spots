const showIputError = (formEL, inputEl, errorMsg) => {
    const errorMsgEl = document.querySelector(`#${inputEl.id}-error`);
    errorMsgEl.textContent = errorMsg;
    inputEl.classList.add("modal__input_type_error")
};

const hideInputError = (formEL, inputEl) => {
    const errorMsgEl = document.querySelector(`#${inputEl.id}-error`);
    errorMsgEl.textContent = "";
    inputEl.classList.remove("modal__input_type_error")
};





const checkInputValidity = (formEL, inputEl) => {
    if (!inputEl.validity.valid) {
        showIputError(formEl, inputEl, inputEl.validationMessage)
    } else {
        hideInputError(formEL, inputEl)
    }

};

const setEventListeners = (formEL) => {
const inputList = Array.from(formEL.querySelectorAll(".modal__input"));
const buttonElement = formEL.querySelector(".modal__submit-btn");

// toggleButtonState(inputList, buttonElement);

inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", function () {
        checkInputValidity(formEL, inputElement);
        // toggleButtonState(inputList, buttonElement);
    });
});
};

const enableValidation = () => {
const formList = Array.from(document.querySelectorAll(".modal__form"));
formList.forEach((formEL) => {
    setEventListeners(formEL);
});
};

enableValidation();