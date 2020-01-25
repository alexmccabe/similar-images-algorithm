const $form = document.querySelector('#js-image-upload-form');
const baseUrl = `${window.commonData.apiUrl}/api`;

function getFormData(formElement) {
  if (formElement) {
    return new FormData(formElement);
  }

  return null;
}

$form.addEventListener('submit', event => {
  event.preventDefault();

  const data = getFormData($form);

  axios
    .post(`${baseUrl}/getRelatedImages`, data)
    .then(res => console.log(res))
    .catch(err => console.error(err));
});
