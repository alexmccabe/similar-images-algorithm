const $form = document.querySelector('#js-image-upload-form');
const $fileInput = document.querySelector('#form-image-input');
const $uploadPreview = document.querySelector('#js-upload-preview');
const $relatedImages = document.querySelector('#js-related-images');
const baseUrl = `${window.commonData.apiUrl}/api`;

function getFormData(formElement) {
  if (formElement) {
    return new FormData(formElement);
  }

  return null;
}

function appendToDOM(data) {
  if (data.length) {
    data.forEach(item => {
      const img = new Image();

      img.src = item;

      $relatedImages.appendChild(img);
    });
  }
}

$fileInput.addEventListener('change', event => {
  if ($fileInput.files && $fileInput.files[0]) {
    const reader = new FileReader();

    reader.onload = event => {
      $uploadPreview.setAttribute('src', event.target.result);
      $uploadPreview.style.display = null;
    };

    reader.readAsDataURL($fileInput.files[0]);
  }
});

$form.addEventListener('submit', event => {
  event.preventDefault();

  const data = getFormData($form);

  axios
    .post(`${baseUrl}/getRelatedImages`, data)
    .then(res => appendToDOM(res.data))
    .catch(err => console.error(err));
});
