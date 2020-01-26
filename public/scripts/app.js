/* Related Items Component
========================================================================== */
function RelatedItems(props) {
  const { items } = props;

  return (
    <div className="flex flex-col mt-8 justify-center max-w-md ml-auto mr-auto">
      <div className="text-lg text-gray-600 font-bold text-center">
        Other images you may like
      </div>

      <div className="mt-2 -mx-2 -mb-2 flex flex-wrap justify-center">
        {items.map((item, index) => (
          <div className="p-2 w-1/3" key={index}>
            <div
              className="max-w-sm rounded relative overflow-hidden shadow-lg w-full"
              style={{
                paddingBottom: '100%'
              }}
            >
              <img src={item} className="absolute h-full w-full object-cover" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Uploaded Image Preview Component
========================================================================== */
function Preview(props) {
  const { image, onReset } = props;
  const reader = new FileReader();
  let [preview, setPreview] = React.useState(null);

  reader.onload = event => {
    setPreview(event.target.result);
  };

  reader.readAsDataURL(image);

  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg">
      <img className="w-full" src={preview} />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">Success!</div>
        <p className="text-gray-700 text-base">
          Your image was uploaded, and it's a good one!
        </p>
      </div>
      <div className="px-6 py-4 flex ">
        <button
          className="ml-auto bg-blue-500 hover:bg-blue-700 text-s text-white font-bold py-2 px-3 rounded"
          onClick={onReset}
        >
          Upload Another!
        </button>
      </div>
    </div>
  );
}

/* Notification Component
========================================================================== */
function Notification(props) {
  const { message, title, type } = props;
  let classNames = 'border px-4 py-3 rounded relative';

  switch (type) {
    case 'success':
      classNames += ' bg-green-100 border-green-400 text-green-700';
      break;

    case 'error':
      classNames += ' bg-red-100 border-red-400 text-red-700';
      break;
  }

  return (
    <div className={classNames} role="alert">
      {title && <strong className="font-bold">{title}</strong>}
      <span className="block sm:inline sm:ml-2">{message}</span>
    </div>
  );
}

/* Form Component
========================================================================== */
function Form(props) {
  const { onSuccess } = props;
  const baseUrl = `${window.commonData.apiUrl}/api`;
  const formRef = React.useRef();
  const inputRef = React.useRef();
  const [error, setError] = React.useState(null);

  const isValidFileType = file => {
    const supportedFileTypes = ['jpg'];

    return supportedFileTypes.includes(
      file.name
        .split('.')
        .pop()
        .toLowerCase()
    );
  };

  const submitForm = image => {
    const formData = new FormData(formRef.current);

    axios
      .post(`${baseUrl}/getRelatedImages`, formData)
      .then(res => {
        if (onSuccess && typeof onSuccess === 'function') {
          onSuccess({ data: res.data.data, image });
        }
      })
      .catch(err => setError('Error uploading image.'));
  };

  const onChange = () => {
    const files = inputRef.current.files;
    setError(null);

    if (files && files[0]) {
      if (isValidFileType(files[0])) {
        submitForm(files[0]);
      } else {
        setError('File type is not supported, please only use .jpg images.');
      }
    }
  };

  return (
    <form
      encType="multipart/form-data"
      className="flex flex-col items-center"
      ref={formRef}
    >
      {error && (
        <Notification
          type="error"
          title="Uh oh!"
          message={error}
        ></Notification>
      )}

      <div className="text-lg text-gray-600 font-bold text-center">
        Upload an image
      </div>

      <label className="w-64 flex flex-col items-center mt-6 px-4 py-6 bg-white text-blue-600 rounded-lg tracking-wide uppercase border border-blue-600 cursor-pointer hover:bg-blue-500 hover:text-white">
        <svg
          className="w-8 h-8"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
        </svg>
        <span className="mt-2 text-base leading-normal">Select an image</span>

        <input
          type="file"
          className="hidden"
          name="image"
          ref={inputRef}
          onChange={onChange}
        />
      </label>
    </form>
  );
}

/* App Component
========================================================================== */
function App() {
  const [previewImage, setPreviewImage] = React.useState(null);
  const [relatedItems, setRelatedItems] = React.useState([]);

  const onSuccess = ({ data, image }) => {
    setPreviewImage(image);
    setRelatedItems(data);
  };

  const onReset = () => {
    setPreviewImage(null);
  };

  return (
    <div>
      {!previewImage && <Form onSuccess={onSuccess}></Form>}
      {previewImage && (
        <div className="flex justify-center">
          <Preview image={previewImage} onReset={onReset}></Preview>
        </div>
      )}

      {Boolean(relatedItems.length) && previewImage && (
        <RelatedItems items={relatedItems}></RelatedItems>
      )}
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
