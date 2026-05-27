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

import {
  getTracks,
} from '../../api/tracks';

import toast from 'react-hot-toast';

/* ----------------------------------- */
/* Catalog Taxonomy */
/* ----------------------------------- */

const GENRES = [
  'Pop',
  'Bollywood',
  'Indie',
  'Hip-Hop',
  'Rap',
  'Rock',
  'EDM',
  'Lo-fi',
  'Sufi',
  'Ghazal',
  'Classical',
  'Folk',
  'Instrumental',
  'Ambient',
  'Devotional',
];

const LANGUAGES = [
  'Hindi',
  'Urdu',
  'Bengali',
  'Marathi',
  'Punjabi',
  'Kashmiri',
  'Tamil',
  'Telugu',
  'Malayalam',
  'Kannada',
  'Gujarati',
  'English',
];

const VERSION_TYPES = [
  'ORIGINAL',
  'ACOUSTIC',
  'LIVE',
  'REMIX',
  'INSTRUMENTAL',
  'LOFI',
  'RADIO_EDIT',
  'COVER',
];

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
    primaryArtists: [],
    genre: '',
    genre: '',
    language: '',

    lyrics: '',

    allowMeaningGeneration:
    true,

    releaseType:
      'SINGLE',

    releaseDate:
      '',

    isExplicit:
      false,

    isrc: '',

    moods: '',

    tags: '',

    /* ----------------------------------- */
    /* Publishing Workflow */
    /* ----------------------------------- */

    publishingStatus:
      'DRAFT',

    rejectionReason:
      '',

    scheduledPublishAt:
      '',

    /* ----------------------------------- */
    /* Variant Relationships */
    /* ----------------------------------- */

    isMasterTrack:
      false,

    masterTrackId:
      '',

    versionType:
      'ORIGINAL',

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
  masterTracks,
  setMasterTracks,
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

    primaryArtists:
    initialData.primaryArtists?.map(
      (artist) =>
        artist?._id || artist
    ) || [],

    genre:
      initialData.genre || '',

    language:
      initialData.language || '',

    lyrics:
      initialData.lyrics || '',

    allowMeaningGeneration:
      initialData.allowMeaningGeneration ?? true,

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

    /* ----------------------------------- */
    /* Publishing Workflow */
    /* ----------------------------------- */

    publishingStatus:
      initialData.publishingStatus ||
      'DRAFT',

    rejectionReason:
      initialData.rejectionReason ||
      '',

    scheduledPublishAt:
      initialData.scheduledPublishAt
        ? new Date(
            initialData.scheduledPublishAt
          )
            .toISOString()
            .split('T')[0]
        : '',

    /* ----------------------------------- */
    /* Variant Relationships */
    /* ----------------------------------- */

    isMasterTrack:
      initialData.isMasterTrack === true,

    masterTrackId:

      initialData.masterTrackId?._id ||

      initialData.masterTrackId ||

      '',

    versionType:
      initialData.versionType ||
      'ORIGINAL',      


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

        const tracksResponse =
          await getTracks();

        setMasterTracks(

          (tracksResponse.tracks || [])
            .filter(
              (track) =>
                track.isMasterTrack
            )
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
        'primaryArtists',
        JSON.stringify(
          form.primaryArtists
        )
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
        'allowMeaningGeneration',
        String(form.allowMeaningGeneration)
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
        String(form.isExplicit)
      );

      formData.append(
        'isrc',
        form.isrc
      );

      /* ----------------------------------- */
      /* Variant Relationships */
      /* ----------------------------------- */

      formData.append(
        'isMasterTrack',
        String(form.isMasterTrack)
      );

      if (form.masterTrackId) {

        formData.append(
          'masterTrackId',
          form.masterTrackId
        );
      }

      formData.append(
        'isVariant',
        String(!!form.masterTrackId)
      );

      if (form.masterTrackId) {

        formData.append(
          'versionType',
          form.versionType
        );
      }

      /* ----------------------------------- */
      /* Publishing Workflow */
      /* ----------------------------------- */

      formData.append(
        'publishingStatus',
        form.publishingStatus
      );

      formData.append(
        'rejectionReason',
        form.rejectionReason
      );

      formData.append(
        'scheduledPublishAt',
        form.scheduledPublishAt
      );

      /* ----------------------------------- */
      /* Discovery */
      /* ----------------------------------- */

      formData.append(
        'moods',
        JSON.stringify(
          Array.isArray(form.moods)
            ? form.moods
            : form.moods
                .split(',')
                .map((m) => m.trim())
                .filter(Boolean)
        )
      );

      formData.append(
        'tags',
        JSON.stringify(
          Array.isArray(form.tags)
            ? form.tags
            : form.tags
                .split(',')
                .map((t) => t.trim())
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
                  form.primaryArtists?.[0] || ''
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    primaryArtists:
                      e.target.value
                        ? [e.target.value]
                        : [],
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

              <select
                value={form.genre}
                onChange={(e) =>
                  setForm({
                    ...form,
                    genre:
                      e.target.value,
                  })
                }
                className="w-full rounded-2xl border border-zinc-800 bg-black px-4 py-4 text-white outline-none"
              >

                <option value="">
                  Select genre
                </option>

                {GENRES.map((genre) => (
                  <option
                    key={genre}
                    value={genre}
                  >
                    {genre}
                  </option>
                ))}

              </select>
            </div>

            {/* Language */}

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Language
              </label>

              <select
                value={form.language}
                onChange={(e) =>
                  setForm({
                    ...form,
                    language:
                      e.target.value,
                  })
                }
                className="w-full rounded-2xl border border-zinc-800 bg-black px-4 py-4 text-white outline-none"
              >

                <option value="">
                  Select language
                </option>

                {LANGUAGES.map((language) => (
                  <option
                    key={language}
                    value={language}
                  >
                    {language}
                  </option>
                ))}

              </select>
            </div>

            {/* ----------------------------------- */}
            {/* Variant Relationships */}
            {/* ----------------------------------- */}

            <div className="col-span-2 rounded-3xl border border-zinc-800 bg-black p-6">

              <h3 className="text-lg font-semibold text-white">
                Variant Relationships
              </h3>

              <p className="mt-1 text-sm text-zinc-500">
                Link alternate language or version releases together.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-6">

                {/* Master Toggle */}

                <div className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-950 px-5 py-4">

                  <div>

                    <p className="font-medium text-white">
                      Master Track
                    </p>

                    <p className="mt-1 text-sm text-zinc-500">
                      Use this as the primary release root.
                    </p>

                  </div>

                  <input
                    type="checkbox"

                    checked={
                      form.isMasterTrack
                    }

                    onChange={(e) =>
                      setForm({
                        ...form,

                        isMasterTrack:
                          e.target.checked,

                        masterTrackId:
                          e.target.checked
                            ? ''
                            : form.masterTrackId,
                      })
                    }

                    className="h-5 w-5"
                  />

                </div>

                {/* Version Type */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-zinc-300">
                    Version Type
                  </label>

                  <select
                    value={
                      form.versionType
                    }

                    onChange={(e) =>
                      setForm({
                        ...form,

                        versionType:
                          e.target.value,
                      })
                    }

                    className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-4 text-white outline-none"
                  >

                    {VERSION_TYPES.map(
                      (type) => (

                        <option
                          key={type}
                          value={type}
                        >
                          {type}
                        </option>

                      )
                    )}

                  </select>

                </div>

                {/* Master Track Select */}

                <div className="col-span-2">

                  <label className="mb-2 block text-sm font-medium text-zinc-300">
                    Select Master Track
                  </label>

                  <select

                    disabled={
                      form.isMasterTrack
                    }

                    value={
                      form.masterTrackId
                    }

                    onChange={(e) =>
                      setForm({
                        ...form,

                        masterTrackId:
                          e.target.value,
                      })
                    }

                    className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-4 text-white outline-none disabled:cursor-not-allowed disabled:opacity-40"
                  >

                    <option value="">
                      Select master track
                    </option>

                    {masterTracks.map(
                      (track) => (

                        <option
                          key={track._id}
                          value={track._id}
                        >
                          {track.title}
                          {' • '}
                          {track.language}
                        </option>

                      )
                    )}

                  </select>

                </div>

              </div>

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
          {/* AI Meaning Controls */}
          {/* ----------------------------------- */}

          <div className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-black px-5 py-4">

            <div>

              <p className="font-medium text-white">
                Allow AI Meaning Generation
              </p>

              <p className="mt-1 text-sm text-zinc-500">
                Disable for devotional, spiritual,
                qawwali, or sensitive poetic tracks.
              </p>

            </div>

            <input
              type="checkbox"

              checked={
                form.allowMeaningGeneration
              }

              onChange={(e) =>
                setForm({
                  ...form,

                  allowMeaningGeneration:
                    e.target.checked,
                })
              }

              className="h-5 w-5"
            />

          </div>

          <div className="flex items-center gap-4 py-2">

            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-zinc-700 to-zinc-900" />

            <span className="text-[11px] font-medium uppercase tracking-[0.4em] text-zinc-600">
              Publishing Workflow
            </span>

            <div className="h-px flex-1 bg-gradient-to-l from-transparent via-zinc-700 to-zinc-900" />

          </div>

          <div className="rounded-3xl border border-zinc-800 bg-black p-6">

            <h3 className="text-lg font-semibold text-white">
              Publishing Workflow
            </h3>

            <p className="mt-1 text-sm text-zinc-500">
              Control review lifecycle, publishing visibility, and moderation status.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-6">

              {/* Publishing Status */}

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  Publishing Status
                </label>

                <select
                  value={
                    form.publishingStatus
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,

                      publishingStatus:
                        e.target.value,
                    })
                  }
                  className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-4 text-white outline-none"
                >

                  <option value="DRAFT">
                    DRAFT
                  </option>

                  <option value="UNDER_REVIEW">
                    UNDER REVIEW
                  </option>

                  <option value="PUBLISHED">
                    PUBLISHED
                  </option>

                  <option value="HIDDEN">
                    HIDDEN
                  </option>

                  <option value="REJECTED">
                    REJECTED
                  </option>

                  <option value="TAKEDOWN">
                    TAKEDOWN
                  </option>

                </select>
              </div>

              {/* Scheduled Publish */}

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  Scheduled Publish Date
                </label>

                <input
                  type="date"
                  value={
                    form.scheduledPublishAt
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,

                      scheduledPublishAt:
                        e.target.value,
                    })
                  }
                  className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-4 text-white outline-none"
                />
              </div>

            </div>

            {/* Rejection Reason */}

            {(form.publishingStatus ===
              'REJECTED' ||
              form.publishingStatus ===
              'TAKEDOWN') && (

              <div className="mt-6">

                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  Rejection / Takedown Reason
                </label>

                <textarea
                  rows={4}
                  value={
                    form.rejectionReason
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,

                      rejectionReason:
                        e.target.value,
                    })
                  }
                  className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-4 text-white outline-none"
                  placeholder="Explain why this track was rejected or removed..."
                />

              </div>
            )}

            {/* Review Metadata */}

            {mode === 'edit' &&
              initialData && (

              <div className="mt-6 grid grid-cols-2 gap-6">

                <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">

                  <p className="text-xs uppercase tracking-wide text-zinc-500">
                    Published At
                  </p>

                  <p className="mt-2 text-sm font-medium text-white">
                    {
                      initialData.publishedAt
                        ? new Date(
                            initialData.publishedAt
                          ).toLocaleString()
                        : 'Not Published'
                    }
                  </p>
                </div>

                <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">

                  <p className="text-xs uppercase tracking-wide text-zinc-500">
                    Last Reviewed
                  </p>

                  <p className="mt-2 text-sm font-medium text-white">
                    {
                      initialData.reviewedAt
                        ? new Date(
                            initialData.reviewedAt
                          ).toLocaleString()
                        : 'Not Reviewed'
                    }
                  </p>
                </div>

              </div>
            )}

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