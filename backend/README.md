# Brick & Beams — Backend

Node.js / Express / MongoDB API for the Brick & Beams property listing platform.

## What changed in this update

- **Property photos now upload to Cloudinary** instead of the local `/uploads` folder.
  Files are received in memory by multer and streamed straight to Cloudinary
  via the official `cloudinary` v2 SDK (see `config/uploadToCloudinary.js`) —
  no local disk writes, so this works the same on your laptop and on a
  deployed host (Render, Railway, etc.) where local disk storage doesn't persist.
- Added `config/cloudinary.js` and `config/upload.js` (Cloudinary + multer setup).
- `photos` on a Property is still an array of plain URL strings (frontend needs no
  changes), plus a new `photoPublicIds` field used internally to delete old images
  from Cloudinary when a property is edited or removed.
- Fixed a bug where the login route could sign tokens with a different secret than
  the one used to verify them if `JWT_SECRET` was missing from `.env`.
- Added request validation (`express-validator`) on register/login.
- Server now fails fast on startup with a clear message if required `.env`
  values are missing, instead of running in a half-broken state.
- Added basic search/filter query params on `GET /api/properties`
  (`?city=`, `?type=`, `?minPrice=`, `?maxPrice=`, `?q=`).

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and fill in the values:
   ```bash
   cp .env.example .env
   ```
3. Create a free Cloudinary account at https://cloudinary.com and grab your
   **Cloud name**, **API Key**, and **API Secret** from the dashboard — paste
   them into `.env`.
4. Start the server:
   ```bash
   npm run dev
   ```

## Environment variables

See `.env.example` for the full list. All of these are required:
`MONGO_URI`, `JWT_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`,
`CLOUDINARY_API_SECRET`. `PORT` and `CLIENT_URL` have sensible defaults.

## Note on existing data

If you already have properties saved with local `/uploads/...` filenames from
before this change, those old photo paths will no longer resolve (there's no
`/uploads` route anymore). Re-upload photos for existing listings, or run a
one-off migration script that uploads the old files to Cloudinary and updates
each Property document's `photos`/`photoPublicIds`.
