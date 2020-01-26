# Image similarity

When a user posts on Candide, we might assume that they would be interested in
posts similar to theirs, or at least referring to similar content. One way to do
this might be to find other posts with similar images to theirs.

We have made 20 plant images available (check the source code). We have also
provided a dataset of labels from the Google Cloud Vision API for those images
(see `data.json`), which could help, although its use is not a requirement.

### The task

If I were to post any one of the 20 images, which of the other 19 would be
relevant to show to me as "other posts like yours"?

We want you to write an algorithm that uses the data we provide to figure out which
images are most similar.

### Guidance

There is certainly no right or wrong answer to this. Yours may not be the most efficient
or scalable solution, but you should understand its strengths and weaknesses and be
prepared to provide potential solutions to these things.

## Installation

#### 1. Clone the repo

```sh
git clone https://github.com/alexmccabe/similar-images-algorithm.git && cd similar-images-algorithm
```

#### 2. Install dependencies

```sh
yarn install
# or
npm  install
```

#### 3. Run the Project

```sh
yarn dev
# or
npm run dev
```

#### 4. Open the Project

http://localhost:5000

---

## What's Here?

A small Node application that renders a React application allowing a user to upload an image and receive recommended images in return.

## What's Missing

- Tests
- Server-side validation
- Some error handling
- Nicer UI
- A built JS bundle for front-end app (uses run-time babel and React)

## Potential Improvements

- The recommendation algorithm is quite naive. It simply loops over the data and finds potential matches by comparing `mid`s and returns the image if the score is greater than a provided threshold. This immediately excludes anything that has the same `mid` as the provided image but has a low score.

- Integration with Google Cloud Vision API directly to receive results for images that aren't in the provided `data.json`.
