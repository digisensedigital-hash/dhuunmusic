import {
  useEffect,
  useState,
} from 'react';

import toast
  from 'react-hot-toast';

import {
  createArtist,
} from '../../api/createArtist';

import {
  updateArtist,
} from '../../api/updateArtist';

import {
  getMediaUrl,
} from '../../utils/media';

export default function ArtistFormModal({

  open,
  onClose,
  onSuccess,

  mode = 'create',

  initialData = null,

}) {

  const [
    form,
    setForm,
  ] = useState({
    stageName: '',
    realName: '',
    bio: '',

    artistType:
      'INDIE',

    isVerified:
      false,
  });

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
  image,
  setImage,
  ] = useState(null);

  const [
    preview,
    setPreview,
  ] = useState('');

  /* ----------------------------------- */
  /* Hydrate Edit */
  /* ----------------------------------- */

  useEffect(() => {

  /* ----------------------------------- */
  /* Reset Create Mode */
  /* ----------------------------------- */

  if (
    mode === 'create'
  ) {

    setForm({
      stageName: '',
      realName: '',
      bio: '',

      artistType:
        'INDIE',

      isVerified:
        false,
    });

    setImage(null);

    setPreview('');

    return;
  }

  /* ----------------------------------- */
  /* Hydrate Edit Mode */
  /* ----------------------------------- */

  if (
    mode !== 'edit' ||
    !initialData
  ) {
    return;
  }

  setForm({
    stageName:
      initialData.stageName || '',

    realName:
      initialData.realName || '',

    bio:
      initialData.bio || '',

    artistType:
      initialData.artistType ||
      'INDIE',

    isVerified:
      initialData.isVerified ||
      false,
  });

  const resolvedImage =
    initialData?.profileImage
      ? getMediaUrl(
          initialData.profileImage
        )
      : '';

  console.log(
    'RESOLVED MODAL IMAGE:',
    resolvedImage
  );

  setPreview(
    resolvedImage
  );

  setImage(null);

  }, [
    mode,
    initialData?._id,
    initialData?.profileImage,
  ]);

  /* ----------------------------------- */
  /* Submit */
  /* ----------------------------------- */

  const handleSubmit =
    async () => {
      try {

        if (
          !form.stageName.trim()
        ) {
          toast.error(
            'Stage name is required'
          );

          return;
        }

        setLoading(true);

        const payload =
          new FormData();

        payload.append(
          'stageName',
          form.stageName
        );

        payload.append(
          'realName',
          form.realName
        );

        payload.append(
          'bio',
          form.bio
        );

        payload.append(
          'artistType',
          form.artistType
        );

        payload.append(
          'isVerified',
          form.isVerified
        );

        if (image) {
          payload.append(
            'image',
            image
          );
        }

        const actionPromise =
          mode === 'edit'
            ? updateArtist(
                initialData._id,
                payload
              )
            : createArtist(
                payload
              );

        toast.promise(
          actionPromise,
          {
            loading:
              mode === 'edit'
                ? 'Updating artist...'
                : 'Creating artist...',

            success:
              mode === 'edit'
                ? 'Artist updated'
                : 'Artist created',

            error:
              mode === 'edit'
                ? 'Artist update failed'
                : 'Artist creation failed',
          }
        );

        await actionPromise;

        if (onSuccess) {
          onSuccess();
        }

        onClose();

      } catch (error) {
        console.error(error);

      } finally {
        setLoading(false);
      }
    };

  if (!open) {
    return null;
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        overflow-y-auto
        bg-black/70
        p-6
        backdrop-blur-sm
      "
    >

      <div
        className="
          w-full
          max-w-2xl
          max-h-[90vh]
          overflow-y-auto
          rounded-3xl
          border
          border-zinc-800
          bg-zinc-950
          p-8
        "
      >

        {/* Header */}

        <div className="mb-8 flex items-center justify-between">

          <div>

            <h2 className="text-3xl font-bold text-white">

              {mode === 'edit'
                ? 'Edit Artist'
                : 'Create Artist'}

            </h2>

            <p className="mt-2 text-zinc-500">
              Manage artist identity and profile metadata.
            </p>

          </div>

          <button
            onClick={onClose}
            className="text-zinc-500 transition hover:text-white"
          >
            ✕
          </button>

        </div>

        {/* Form */}

        <div className="space-y-6">

          {/* Artist Image */}

          <div>

            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Artist Image
            </label>

            <input
              type="file"
              accept="
                image/png,
                image/jpeg,
                image/webp
              "
              onChange={(e) => {

                const file =
                  e.target.files[0];

                if (!file) {
                  return;
                }

                /*
                |--------------------------------------------------------------------------
                | File Size Validation
                |--------------------------------------------------------------------------
                */

                const maxSize =
                  5 * 1024 * 1024;

                if (
                  file.size > maxSize
                ) {

                  toast.error(
                    'Image must be under 5MB'
                  );

                  return;
                }

                /*
                |--------------------------------------------------------------------------
                | Preview URL
                |--------------------------------------------------------------------------
                */

                const imageUrl =
                  URL.createObjectURL(file);

                /*
                |--------------------------------------------------------------------------
                | Resolution Validation
                |--------------------------------------------------------------------------
                */

                const img =
                  new Image();

                img.onload = () => {

                  if (
                    img.width < 1000 ||
                    img.height < 1000
                  ) {

                    toast.error(
                      'Use a high resolution image (minimum 1000x1000)'
                    );

                    return;
                  }

                  setImage(file);

                  setPreview(imageUrl);
                };

                img.src = imageUrl;
              }}
              className="
                w-full
                rounded-2xl
                border
                border-zinc-800
                bg-black
                px-4
                py-3
                text-white
              "
            />

            <p className="mt-2 text-sm text-zinc-500">
              Upload a bright, high-quality square artist image.
              Recommended size: 2000×2000.
            </p>

            {preview && (

              <div className="mt-4 flex justify-center">

                <div
                  className="
                    h-40
                    w-40
                    overflow-hidden
                    rounded-2xl
                    border
                    border-zinc-800
                    bg-zinc-900
                    shadow-lg
                  "
                >

                  <img
                    key={preview}
                    src={`${preview}?t=${Date.now()}`}
                    alt="Artist Preview"

                    onLoad={() => {

                      console.log(
                        'IMAGE LOADED:',
                        preview
                      );

                    }}

                    onError={() => {

                      console.error(
                        'IMAGE FAILED:',
                        preview
                      );

                    }}

                    className="
                      h-full
                      w-full
                      object-cover
                    "
                  />

                </div>

              </div>

            )}

          </div>

          {/* Stage Name */}

          <div>

            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Stage Name
            </label>

            <input
              type="text"
              value={form.stageName}
              onChange={(e) =>
                setForm({
                  ...form,
                  stageName:
                    e.target.value,
                })
              }
              className="w-full rounded-2xl border border-zinc-800 bg-black px-4 py-4 text-white outline-none transition focus:border-zinc-600"
              placeholder="Artist display name"
            />

          </div>

          {/* Real Name */}

          <div>

            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Real Name
            </label>

            <input
              type="text"
              value={form.realName}
              onChange={(e) =>
                setForm({
                  ...form,
                  realName:
                    e.target.value,
                })
              }
              className="w-full rounded-2xl border border-zinc-800 bg-black px-4 py-4 text-white outline-none transition focus:border-zinc-600"
              placeholder="Legal or birth name"
            />

          </div>

          {/* Bio */}

          <div>

            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Bio
            </label>

            <textarea
              rows={6}
              value={form.bio}
              onChange={(e) =>
                setForm({
                  ...form,
                  bio:
                    e.target.value,
                })
              }
              className="w-full rounded-2xl border border-zinc-800 bg-black px-4 py-4 text-white outline-none transition focus:border-zinc-600"
              placeholder="Artist biography..."
            />

          </div>

          {/* Artist Type */}

          <div>

            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Artist Type
            </label>

            <select
              value={
                form.artistType
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  artistType:
                    e.target.value,
                })
              }
              className="w-full rounded-2xl border border-zinc-800 bg-black px-4 py-4 text-white outline-none"
            >

              <option value="INDIE">
                INDIE
              </option>

              <option value="DHUUN_ORIGINAL">
                DHUUN_ORIGINAL
              </option>

              <option value="LABEL_ARTIST">
                LABEL_ARTIST
              </option>

              <option value="PRODUCER">
                PRODUCER
              </option>

              <option value="WRITER">
                WRITER
              </option>

              <option value="COMPOSER">
                COMPOSER
              </option>

            </select>

          </div>

          {/* Verification */}

          <div className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-black px-5 py-4">

            <div>

              <p className="font-medium text-white">
                Verified Artist
              </p>

              <p className="mt-1 text-sm text-zinc-500">
                Grant verification badge to this artist.
              </p>

            </div>

            <input
              type="checkbox"
              checked={
                form.isVerified
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  isVerified:
                    e.target.checked,
                })
              }
              className="h-5 w-5"
            />

          </div>

          {/* Footer */}

          <div className="flex justify-end gap-4 pt-4">

            <button
              onClick={onClose}
              className="rounded-2xl border border-zinc-800 px-5 py-3 text-sm font-medium text-zinc-300 transition hover:bg-zinc-900"
            >
              Cancel
            </button>

            <button
              onClick={
                handleSubmit
              }
              disabled={loading}
              className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:opacity-90 disabled:opacity-50"
            >

              {loading
                ? mode === 'edit'
                  ? 'Saving...'
                  : 'Creating...'
                : mode === 'edit'
                  ? 'Save Changes'
                  : 'Create Artist'}

            </button>

          </div>

        </div>

      </div>

    </div>
  );
}