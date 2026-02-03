import {
  enableValidation,
  ValidationConfig,
  disableButton,
  resetValidation,
}
from "../scripts/validation.js";
import Api from "../utils/Api.js";
import "./index.css";

const initialCards = [
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },

  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },

  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },

  {
    name: "A very long bridge, over the forest and through the trees",

    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },

  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },

  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
];

// index.js

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "3515e1ab-2299-4d17-8ccd-400d73cf2a10",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([cards, userInfo]) => {
    profileName.textContent = userInfo.name;
    profileDescrition.textContent = userInfo.about;
    document.querySelector(".profile__avatar").src = userInfo.avatar;

    cards.forEach((item) => {
      const cardElement = getCardElement(item);
      cardsList.append(cardElement);
    });
  })
  .catch(console.error);

const profileEditButton = document.querySelector(".profile__edit-btn");
const profileName = document.querySelector(".profile__name");
const profileDescrition = document.querySelector(".profile__description");

const editModal = document.querySelector("#edit-modal");

const editFormElement = editModal.querySelector(".modal__form");

const editModalCloseBtn = editModal.querySelector(".modal__close-btn");

const editModalSubmitBtn = editModal.querySelector(".modal__submit-btn");

const cardModalBtn = document.querySelector(".profile__add-btn");

const editModalNameInput = editModal.querySelector("#profile-name-input");

const editModalDescriptionInput = editModal.querySelector(
  "#profile-description-input"
);

const cardTemplate = document.querySelector("#card-template");

const cardsList = document.querySelector(".cards__list");

const cardModal = document.querySelector("#add-card-modal");
const cardForm = cardModal.querySelector(".modal__form");
const cardSubmitBtn = cardModal.querySelector(".modal__button");
const cardModalCloseBtn = cardModal.querySelector(".modal__close-btn");
const cardNameInput = cardModal.querySelector("#add-card-name-input");
const cardlinkInput = cardModal.querySelector("#add-card-link-input");
const previewModal = document.querySelector("#preview-modal");
const previewModalImageEL = previewModal.querySelector(".modal__image");
const previewModalCaptionEl = previewModal.querySelector(".modal__caption");
const previewModalCloseButton = previewModal.querySelector(".modal__close-btn");

//delete modal elements
const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector(".modal__form");
const deleteModalCloseBtn = deleteModal.querySelector(".modal__close-btn");
const deleteModalConfirmBtn = deleteModal.querySelector(".modal__button-delete");
const deleteModalCancelBtn = deleteModal.querySelector(".modal__cancel-btn");

// Avatar form elements
const editAvatarModal = document.querySelector("#edit-avatar-modal");
const editAvatarModalbtn = document.querySelector(".profile__avatar-btn");
const editAvatarForm = editAvatarModal.querySelector(".modal__form");
const editAvatarSubmitBtn = editAvatarForm.querySelector(".modal__submit-btn");
const closeAvatarModalBtn = editAvatarModal.querySelector(".modal__close-btn");
const editAvatarFromInput = document.getElementById("profile-avatar-input");


let selectedCardId;
let selectedCard;

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardNameEl = cardElement.querySelector(".card__title");
  const deleteButton = cardElement.querySelector(".card__delete-btn");

  const previewModalCloseBtn = previewModal.querySelector(".modal__close-btn");

  cardNameEl.textContent = data.name;

  const cardImg = cardElement.querySelector(".card__image");

  const cardLikedBtn = cardElement.querySelector(".card__like-button");

  cardImg.src = data.link;

  cardImg.alt = data.name;

  if (data.isLiked) {
    cardLikedBtn.classList.add("card__like-button_liked");
  }

  cardLikedBtn.addEventListener("click", handleLikeButtonClick);

  function handleLikeButtonClick() {
    api
      .updateLikedStatus({
        isLiked: !cardLikedBtn.classList.contains("card__like-button_liked"),
        id: data._id,})
      .then(() => {
        cardLikedBtn.classList.toggle("card__like-button_liked");
      })
      .catch(console.error);
  }

  deleteButton.addEventListener("click", (evt) =>
    handleDeleteCard(cardElement, data)
  );

  cardImg.addEventListener("click", () => {
    openModal(previewModal);
    previewModalImageEL.src = data.link;
    previewModalImageEL.alt = data.name;
    previewModalCaptionEl.textContent = data.name;
  });

  return cardElement;
}

function handleOverlayClick(evt) {
  // click outside
  if (evt.target.classList.contains("modal_opened")) {
    closeModal(evt.target);
  }
}

function handleEscapeKey(evt) {
  // push escape key
  if (evt.key === "Escape") {
    const activeModal = document.querySelector(".modal_opened");
    if (activeModal) {
      closeModal(activeModal);
    }
  }
}

function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("mousedown", handleOverlayClick);
  document.addEventListener("keydown", handleEscapeKey);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("mousedown", handleOverlayClick);
  document.removeEventListener("keydown", handleEscapeKey);
}

function handleEditProfileSubmit(e) {
  e.preventDefault();
  const startTime = Date.now();
  editModalSubmitBtn.textContent = "Saving...";
  api
    .editUserInfo({
      name: editModalNameInput.value,
      about: editModalDescriptionInput.value,
    })
    .then((data) => {
      profileName.textContent = data.name;
      profileDescrition.textContent = data.about;
      closeModal(editModal);
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 1000 - elapsedTime);
      setTimeout(() => {
        editModalSubmitBtn.textContent = "Save";
      }, remainingTime);
    });
}

function handleAddCardSubmit(evt) {
  evt.preventDefault();
  const startTime = Date.now();
  const inputValues = { name: cardNameInput.value, link: cardlinkInput.value };
  cardSubmitBtn.textContent = "Saving...";
  api
    .addCard(inputValues)
    .then((data) => {
      const cardElement = getCardElement(data);
      cardsList.prepend(cardElement);
      evt.target.reset();
      disableButton(cardSubmitBtn, ValidationConfig);
      closeModal(cardModal);
    })
    .catch((error) => {
      console.error("Error adding card:", error);
    })
    .finally(() => {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 1000 - elapsedTime);
      setTimeout(() => {
        cardSubmitBtn.textContent = "Save";
      }, remainingTime);
    });
}

function handleAvatarEditSubmit(evt) {
  evt.preventDefault();
  const startTime = Date.now();
  editAvatarSubmitBtn.textContent = "Saving...";
  api
    .editUserAvatar({ avatar: editAvatarFromInput.value })
    .then((data) => {
      document.querySelector(".profile__avatar").src = data.avatar;
      closeModal(editAvatarModal);
    })
    .catch(console.error)
    .finally(() => {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 1000 - elapsedTime);
      setTimeout(() => {
        editAvatarSubmitBtn.textContent = "Save";
      }, remainingTime);
    });
}
// handler for delete modal
deleteModalCloseBtn.addEventListener("click", () => {
  closeModal(deleteModal);
});

deleteModalCancelBtn.addEventListener("click", () => {
  closeModal(deleteModal);
});

function handleDeleteCard(cardElement, data) {
  selectedCard = cardElement;
  selectedCardId = data._id;
  openModal(deleteModal);
}

function handelDeleteSubmit(evt) {
  evt.preventDefault();
  const startTime = Date.now();
  deleteModalConfirmBtn.textContent = "Deleting...";
  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 1000 - elapsedTime);
      setTimeout(() => {
        deleteModalConfirmBtn.textContent = "Delete";
      }, remainingTime);
    });
}

// handler for edit profile modal
profileEditButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescrition.textContent;
  resetValidation(
    editFormElement,
    [editModalNameInput, editModalDescriptionInput],
    ValidationConfig
  );
  openModal(editModal);
});

editModalCloseBtn.addEventListener("click", () => {
  closeModal(editModal);
});

// handlers for card creation modal
cardModalBtn.addEventListener("click", () => {
  openModal(cardModal);
});

cardModalCloseBtn.addEventListener("click", () => {
  closeModal(cardModal);
});

previewModalCloseButton.addEventListener("click", () => {
  closeModal(previewModal);
});

editAvatarModalbtn.addEventListener("click", () => {
  openModal(editAvatarModal);
});

closeAvatarModalBtn.addEventListener("click", () => {
  closeModal(editAvatarModal);
});

editAvatarForm.addEventListener("submit", handleAvatarEditSubmit);

deleteForm.addEventListener("submit", handelDeleteSubmit);

editFormElement.addEventListener("submit", handleEditProfileSubmit);
cardForm.addEventListener("submit", handleAddCardSubmit);
