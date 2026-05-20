import {
  useEffect,
  useState,
} from 'react';

import ContributorManager
  from './ContributorManager';

import {
  uploadTrack,
} from '../../api/uploadTrack';

import {
  updateTrack,
} from '../../api/updateTrack';

import {
  getArtists,
} from '../../api/getArtists';

import toast from 'react-hot-toast';

export default function TrackFormModal({
  
  mode = 'create',
  initialData = null,
  open,
  onClose,
  onSuccess,

}) {
  const [
    form,
    setForm,
  ] = useState({
    title: '',
    primaryArtist: '',
    genre: '',
    genre: '',
    language: '',

    lyrics: '',

    releaseType:
      'SINGLE',

    releaseDate:
      '',

    isExplicit:
      false,

    isrc: '',

    moods: '',

    tags: '',
  });

  const [
    audioFile,
    setAudioFile,
  ] = useState(null);

  const [
    coverImage,
    setCoverImage,
  ] = useState(null);

  const [
    uploading,
    setUploading,
  ] = useState(false);

  const [
  artists,
  setArtists,
  ] = useState([]);

  const [
  contributors,
  setContributors,
  ] = useState([
  {
    displayName: '',

    artistId: null,

    role: 'SINGER',

    royaltyShare: 100,

    verified: true,

    credits: '',
  },
  ]);

  /* ----------------------------------- */
/* Hydrate Edit Data */
/* ----------------------------------- */

useEffect(() => {

  if (
    mode !== 'edit' ||
    !initialData
  ) {
    return;
  }

  setForm({
    title:
      initialData.title || '',

    primaryArtist:
    initialData.primaryArtist?._id ||
    initialData.primaryArtist ||
    '',

    genre:
      initialData.genre || '',

    language:
      initialData.language || '',

    lyrics:
      initialData.lyrics || '',

    releaseType:
      initialData.releaseType ||
      'SINGLE',

    releaseDate:
      initialData.releaseDate
        ? new Date(
            initialData.releaseDate
          )
            .toISOString()
            .split('T')[0]
        : '',

    isExplicit:
      initialData.isExplicit ||
      false,

    isrc:
      initialData.isrc || '',

    moods:
      initialData.moods?.join(', ') ||
      '',

    tags:
      initialData.tags?.join(', ') ||
      '',
  });

  setContributors(
    initialData.contributors
      ?.length
      ? initialData.contributors
      : [
          {
            displayName: '',

            artistId: null,

            role: 'SINGER',

            royaltyShare: 100,

            verified: true,

            credits: '',
          },
        ]
  );

}, [
  mode,
  initialData,
]);

useEffect(() => {

  const fetchArtists =
    async () => {
      try {

        const response =
          await getArtists();

        setArtists(
          response.artists || []
        );

      } catch (error) {
        console.error(error);
      }
    };

  fetchArtists();

}, []);

  /* ----------------------------------- */
/* Upload Track */
/* ----------------------------------- */

const handleUpload =
  async () => {
    try {

      /* ----------------------------------- */
      /* Validate Royalty */
      /* ----------------------------------- */

      const totalRoyalty =
        contributors.reduce(
          (
            total,
            contributor
          ) =>
            total +
            Number(
              contributor.royaltyShare || 0
            ),

          0
        );

      if (totalRoyalty !== 100) {
        toast.error(
          'Royalty allocation must equal 100%'
        );

        return;
      }

      /* ----------------------------------- */
      /* Required Validation */
      /* ----------------------------------- */

      if (!form.title.trim()) {
        toast.error('Track title is required');

        return;
      }

    /* ----------------------------------- */
    /* Audio Validation */
    /* ----------------------------------- */

    if (
      mode === 'create' &&
      !audioFile
    ) {
      toast.error(
        'Audio file is required'
      );

      return;
    }

    if (audioFile) {

      const allowedAudioTypes = [
        'audio/mpeg',
        'audio/mp3',
        'audio/wav',
        'audio/x-wav',
        'audio/flac',
        'audio/aac',
        'audio/mp4',
      ];

      if (
        !allowedAudioTypes.includes(
          audioFile?.type
        )
      ) {
        toast.error(
          'Unsupported audio format'
        );

        return;
      }

      const maxAudioSize =
        100 * 1024 * 1024;

      if (
        audioFile?.size >
        maxAudioSize
      ) {
        toast.error(
          'Audio file exceeds 100MB limit'
        );

        return;
      }

    }

      /* ----------------------------------- */
      /* Cover Image Validation */
      /* ----------------------------------- */

      if (
        mode === 'create' &&
        !coverImage
      ) {
        toast.error(
          'Cover image is required'
        );

        return;
      }

      if (coverImage) {

        const allowedImageTypes = [
          'image/jpeg',
          'image/png',
          'image/webp',
        ];

        if (
          !allowedImageTypes.includes(
            coverImage.type
          )
        ) {
          toast.error(
            'Unsupported image format'
          );

          return;
        }

        const maxImageSize =
          5 * 1024 * 1024;

        if (
          coverImage.size >
          maxImageSize
        ) {
          toast.error(
            'Cover image must be under 5MB'
          );

          return;
        }

        /* ----------------------------------- */
        /* Cover Image Dimensions */
        /* ----------------------------------- */

        const imageDimensions =
          await new Promise(
            (resolve, reject) => {
              const img =
                new Image();

              img.onload =
                () => {
                  resolve({
                    width:
                      img.width,

                    height:
                      img.height,
                  });
                };

              img.onerror =
                reject;

              img.src =
                URL.createObjectURL(
                  coverImage
                );
            }
          );

        if (
          imageDimensions.width !==
          imageDimensions.height
        ) {
          toast.error(
            'Cover image must be square (1:1)'
          );

          return;
        }

        if (
          imageDimensions.width <
            1000 ||
          imageDimensions.height <
            1000
        ) {
          toast.error(
            'Minimum cover resolution is 1000x1000'
          );

          return;
        }

      }
      setUploading(true);

      const formData =
        new FormData();

      /* ----------------------------------- */
      /* Core Metadata */
      /* ----------------------------------- */

      formData.append(
        'title',
        form.title
      );

      formData.append(
        'primaryArtist',
        form.primaryArtist
      );

      formData.append(
        'genre',
        form.genre
      );

      formData.append(
        'language',
        form.language
      );

      formData.append(
        'lyrics',
        form.lyrics
      );

      formData.append(
        'releaseType',
        form.releaseType
      );

      formData.append(
        'releaseDate',
        form.releaseDate
      );

      formData.append(
        'isExplicit',
        form.isExplicit
      );

      formData.append(
        'isrc',
        form.isrc
      );

      /* ----------------------------------- */
      /* Discovery */
      /* ----------------------------------- */

      formData.append(
        'moods',
        JSON.stringify(
          form.moods
            .split(',')
            .map((m) =>
              m.trim()
            )
            .filter(Boolean)
            )
      );

      formData.append(
        'tags',
        JSON.stringify(
          form.tags
            .split(',')
            .map((t) =>
              t.trim()
            )
            .filter(Boolean)
        )
      );


      /* ----------------------------------- */
      /* Normalize Contributors */
      /* ----------------------------------- */

      const normalizedContributors =
        contributors.map(
          (contributor) => ({
            userId:
              contributor.userId ||
              null,

            artistId:
              contributor.artistId ||
              null,

            displayName:
              contributor.displayName ||
              contributor.name ||
              '',

            role:
              contributor.role,

            royaltyShare:
              Number(
                contributor.royaltyShare || 0
              ),

            verified:
              contributor.verified ||
              false,

            credits:
              contributor.credits ||
              '',
          })
        );

      /* ----------------------------------- */
      /* Contributors */
      /* ----------------------------------- */

      formData.append(
        'contributors',
        JSON.stringify(
          normalizedContributors
        )
      );

      /* ----------------------------------- */
      /* Files */
      /* ----------------------------------- */

      if (audioFile) {
        formData.append(
          'audio',
          audioFile
        );
      }

      if (coverImage) {
        formData.append(
          'coverImage',
          coverImage
        );
      }

      /* ----------------------------------- */
      /* Create vs Edit */
      /* ----------------------------------- */

      const actionPromise =
        mode === 'edit'
          ? updateTrack(
              initialData._id,
              formData
            )
          : uploadTrack(
              formData
            );

      toast.promise(
        actionPromise,
        {
          loading:
            mode === 'edit'
              ? 'Saving changes...'
              : 'Uploading track...',

          success:
            mode === 'edit'
              ? 'Track updated successfully'
              : 'Track uploaded successfully',

          error:
            mode === 'edit'
              ? 'Track update failed'
              : 'Track upload failed',
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
      setUploading(false);
    }
    };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">

      <div className="max-h-[95vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-zinc-800 bg-zinc-950 p-8">

        {/* ----------------------------------- */}
        {/* Header */}
        {/* ----------------------------------- */}

        <div className="mb-8 flex items-center justify-between">

          <div>
            <h2 className="text-3xl font-bold text-white">
              {mode === 'edit'
                ? 'Edit Track'
                : 'Upload Track'}
            </h2>

            <p className="mt-2 text-zinc-500">
              {mode === 'edit'
                ? 'Update track metadata, contributors, and publishing information.'
                : 'Add a new song to the Dhuun streaming catalog.'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-zinc-500 transition hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* ----------------------------------- */}
        {/* Form */}
        {/* ----------------------------------- */}

        <div className="space-y-8">

          {/* ----------------------------------- */}
          {/* Core Metadata */}
          {/* ----------------------------------- */}

          <div className="grid grid-cols-2 gap-6">

            {/* Title */}

            <div className="col-span-2">
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Track Title
              </label>

              <input
                type="text"
                value={form.title}
                onChange={(e) =>
                  setForm({
                    ...form,
                    title:
                      e.target.value,
                  })
                }
                className="w-full rounded-2xl border border-zinc-800 bg-black px-4 py-4 text-white outline-none transition focus:border-zinc-600"
                placeholder="Enter track title"
              />
            </div>

            {/* Primary Artist */}

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Primary Artist
              </label>

              <select
                value={
                  form.primaryArtist
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    primaryArtist:
                      e.target.value,
                  })
                }
                className="w-full rounded-2xl border border-zinc-800 bg-black px-4 py-4 text-white outline-none"
              >

                <option value="">
                  Select artist
                </option>

                {artists.map(
                  (artist) => (
                    <option
                      key={artist._id}
                      value={artist._id}
                    >
                      {artist.stageName}
                    </option>
                  )
                )}

              </select>
            </div>

            {/* Genre */}

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Genre
              </label>

              <input
                type="text"
                value={form.genre}
                onChange={(e) =>
                  setForm({
                    ...form,
                    genre:
                      e.target.value,
                  })
                }
                className="w-full rounded-2xl border border-zinc-800 bg-black px-4 py-4 text-white outline-none transition focus:border-zinc-600"
                placeholder="Romantic, Hip-Hop, Devotional..."
              />
            </div>

            {/* Language */}

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Language
              </label>

              <input
                type="text"
                value={form.language}
                onChange={(e) =>
                  setForm({
                    ...form,
                    language:
                      e.target.value,
                  })
                }
                className="w-full rounded-2xl border border-zinc-800 bg-black px-4 py-4 text-white outline-none transition focus:border-zinc-600"
                placeholder="Hindi"
              />
            </div>

            {/* Release Type */}

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Release Type
              </label>

              <select
                value={
                  form.releaseType
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    releaseType:
                      e.target.value,
                  })
                }
                className="w-full rounded-2xl border border-zinc-800 bg-black px-4 py-4 text-white outline-none"
              >
                <option value="SINGLE">
                  SINGLE
                </option>

                <option value="EP">
                  EP
                </option>

                <option value="ALBUM">
                  ALBUM
                </option>
              </select>
            </div>

            {/* Release Date */}

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Release Date
              </label>

              <input
                type="date"
                value={
                  form.releaseDate
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    releaseDate:
                      e.target.value,
                  })
                }
                className="w-full rounded-2xl border border-zinc-800 bg-black px-4 py-4 text-white outline-none"
              />
            </div>

            {/* ISRC */}

            <div className="col-span-2">
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                ISRC Code
              </label>

              <input
                type="text"
                value={form.isrc}
                onChange={(e) =>
                  setForm({
                    ...form,
                    isrc:
                      e.target.value,
                  })
                }
                className="w-full rounded-2xl border border-zinc-800 bg-black px-4 py-4 text-white outline-none"
                placeholder="Optional industry ISRC code"
              />
            </div>
          </div>

          {/* ----------------------------------- */}
          {/* Discovery Intelligence */}
          {/* ----------------------------------- */}

          <div className="grid grid-cols-2 gap-6">

            {/* Moods */}

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Moods
              </label>

              <input
                type="text"
                value={form.moods}
                onChange={(e) =>
                  setForm({
                    ...form,
                    moods:
                      e.target.value,
                  })
                }
                className="w-full rounded-2xl border border-zinc-800 bg-black px-4 py-4 text-white outline-none"
                placeholder="romantic,sad,workout"
              />
            </div>

            {/* Tags */}

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Tags
              </label>

              <input
                type="text"
                value={form.tags}
                onChange={(e) =>
                  setForm({
                    ...form,
                    tags:
                      e.target.value,
                  })
                }
                className="w-full rounded-2xl border border-zinc-800 bg-black px-4 py-4 text-white outline-none"
                placeholder="love,viral,reels"
              />
            </div>
          </div>

          {/* ----------------------------------- */}
          {/* Lyrics */}
          {/* ----------------------------------- */}

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Lyrics
            </label>

            <textarea
              rows={8}
              value={form.lyrics}
              onChange={(e) =>
                setForm({
                  ...form,
                  lyrics:
                    e.target.value,
                })
              }
              className="w-full rounded-2xl border border-zinc-800 bg-black px-4 py-4 text-white outline-none"
              placeholder="Paste song lyrics..."
            />
          </div>

          {/* ----------------------------------- */}
          {/* Explicit Toggle */}
          {/* ----------------------------------- */}

          <div className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-black px-5 py-4">

            <div>
              <p className="font-medium text-white">
                Explicit Content
              </p>

              <p className="mt-1 text-sm text-zinc-500">
                Mark if lyrics contain explicit language.
              </p>
            </div>

            <input
              type="checkbox"
              checked={
                form.isExplicit
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  isExplicit:
                    e.target.checked,
                })
              }
              className="h-5 w-5"
            />
          </div>

          {/* ----------------------------------- */}
            {/* Contributors */}
            {/* ----------------------------------- */}

            <ContributorManager
            contributors={
                contributors
            }
            setContributors={
                setContributors
            }
            />

          {/* ----------------------------------- */}
          {/* Media Upload */}
          {/* ----------------------------------- */}

          <div className="grid grid-cols-2 gap-6">

            {/* Audio */}

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Audio File
              </label>

              <input
                type="file"
                accept="audio/*"
                onChange={(e) =>
                  setAudioFile(
                    e.target
                      .files?.[0]
                  )
                }
                className="w-full rounded-2xl border border-zinc-800 bg-black px-4 py-4 text-zinc-400"
              />
            </div>

            {/* Cover Image */}

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Cover Image
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setCoverImage(
                    e.target
                      .files?.[0]
                  )
                }
                className="w-full rounded-2xl border border-zinc-800 bg-black px-4 py-4 text-zinc-400"
              />
            </div>
          </div>

          {/* ----------------------------------- */}
          {/* Footer */}
          {/* ----------------------------------- */}

          <div className="flex justify-end gap-4 pt-4">

            <button
              onClick={onClose}
              className="rounded-2xl border border-zinc-800 px-5 py-3 text-sm font-medium text-zinc-300 transition hover:bg-zinc-900"
            >
              Cancel
            </button>

            <button
            onClick={handleUpload}
            disabled={uploading}
            className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:opacity-90 disabled:opacity-50"
            >
              {uploading
                ? mode === 'edit'
                  ? 'Saving...'
                  : 'Uploading...'
                : mode === 'edit'
                  ? 'Save Changes'
                  : 'Upload Track'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}