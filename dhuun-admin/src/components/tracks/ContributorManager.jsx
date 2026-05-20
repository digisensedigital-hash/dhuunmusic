import {
  Plus,
  Trash2,
} from 'lucide-react';

const contributorRoles = [
  'SINGER',
  'WRITER',
  'COMPOSER',
  'PRODUCER',
  'FEATURED_ARTIST',
  'MIX_ENGINEER',
  'MASTER_ENGINEER',
];

export default function ContributorManager({
  contributors,
  setContributors,
}) {

  /* ----------------------------------- */
  /* Add Contributor */
  /* ----------------------------------- */

  const addContributor =
    () => {
      setContributors([
        ...contributors,

        {
          displayName: '',

          artistId: null,

          role: 'SINGER',

          royaltyShare: 0,

          verified: false,

          credits: '',
        },
      ]);
    };

  /* ----------------------------------- */
  /* Remove Contributor */
  /* ----------------------------------- */

  const removeContributor =
    (index) => {
      const updated =
        contributors.filter(
          (_, i) =>
            i !== index
        );

      setContributors(
        updated
      );
    };

  /* ----------------------------------- */
  /* Update Contributor */
  /* ----------------------------------- */

  const updateContributor =
    (
      index,
      field,
      value
    ) => {
      const updated =
        [...contributors];

      updated[index][field] =
        value;

      setContributors(
        updated
      );
    };

  /* ----------------------------------- */
  /* Total Royalty */
  /* ----------------------------------- */

  const totalRoyalty =
    contributors.reduce(
      (
        total,
        contributor
      ) =>
        total +
        Number(
          contributor.royaltyShare ||
          0
        ),

      0
    );

  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">

      {/* ----------------------------------- */}
      {/* Header */}
      {/* ----------------------------------- */}

      <div className="mb-6 flex items-center justify-between">

        <div>
          <h3 className="text-xl font-semibold text-white">
            Contributors & Credits
          </h3>

          <p className="mt-1 text-sm text-zinc-500">
            Manage singers, composers, lyricists, producers, and royalty stakeholders.
          </p>
        </div>

        <button
          onClick={
            addContributor
          }
          className="flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:opacity-90"
        >
          <Plus size={18} />

          Add Contributor
        </button>
      </div>

      {/* ----------------------------------- */}
      {/* Contributors */}
      {/* ----------------------------------- */}

      <div className="space-y-5">

        {contributors.map(
          (
            contributor,
            index
          ) => (
            <div
              key={index}
              className="rounded-2xl border border-zinc-800 bg-black p-5"
            >

              {/* ----------------------------------- */}
              {/* Grid */}
              {/* ----------------------------------- */}

              <div className="grid grid-cols-12 gap-4">

                {/* Name */}

                <div className="col-span-4">

                  <label className="mb-2 block text-sm font-medium text-zinc-400">
                    Contributor Name
                  </label>

                  <input
                    type="text"
                    value={
                      contributor.displayName
                    }
                    onChange={(e) =>
                      updateContributor(
                        index,
                        'displayName',
                        e.target
                          .value
                      )
                    }
                    className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-zinc-600"
                    placeholder="Enter name"
                  />

                  {contributor.artistId && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-emerald-400">
                      <div className="h-2 w-2 rounded-full bg-emerald-400" />

                      Linked Artist Profile
                    </div>
                  )}
                </div>

                {/* Role */}

                <div className="col-span-3">

                  <label className="mb-2 block text-sm font-medium text-zinc-400">
                    Role
                  </label>

                  <select
                    value={
                      contributor.role
                    }
                    onChange={(e) =>
                      updateContributor(
                        index,
                        'role',
                        e.target
                          .value
                      )
                    }
                    className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white outline-none"
                  >

                    {contributorRoles.map(
                      (
                        role
                      ) => (
                        <option
                          key={role}
                          value={role}
                        >
                          {role}
                        </option>
                      )
                    )}
                  </select>
                </div>

                {/* Royalty */}

                <div className="col-span-3">

                  <label className="mb-2 block text-sm font-medium text-zinc-400">
                    Royalty %
                  </label>

                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={
                      contributor.royaltyShare
                    }
                    onChange={(e) =>
                      updateContributor(
                        index,
                        'royaltyShare',
                        e.target
                          .value
                      )
                    }
                    className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-zinc-600"
                  />
                </div>

                {/* Delete */}

                <div className="col-span-2 flex items-end">

                  <button
                    onClick={() =>
                      removeContributor(
                        index
                      )
                    }
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-400 transition hover:bg-red-500/20"
                  >
                    <Trash2
                      size={16}
                    />

                    Remove
                  </button>
                </div>
              </div>


              {/* ----------------------------------- */}
              {/* Credits */}
              {/* ----------------------------------- */}

              <div className="mt-5">

                <label className="mb-2 block text-sm font-medium text-zinc-400">
                  Credits / Notes
                </label>

                <input
                  type="text"
                  value={
                    contributor.credits || ''
                  }
                  onChange={(e) =>
                    updateContributor(
                      index,
                      'credits',
                      e.target.value
                    )
                  }
                  className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-zinc-600"
                  placeholder="Optional contributor credits"
                />
              </div>        

              {/* ----------------------------------- */}
              {/* Verification */}
              {/* ----------------------------------- */}

              <div className="mt-5 flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3">

                <div>
                  <p className="text-sm font-medium text-white">
                    Verified Contributor
                  </p>

                  <p className="mt-1 text-xs text-zinc-500">
                    Marks contributor as verified stakeholder.
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={
                    contributor.verified
                  }
                  onChange={(e) =>
                    updateContributor(
                      index,
                      'verified',
                      e.target
                        .checked
                    )
                  }
                  className="h-5 w-5"
                />
              </div>
            </div>
          )
        )}
      </div>

      {/* ----------------------------------- */}
      {/* Footer */}
      {/* ----------------------------------- */}

      <div className="mt-6 flex items-center justify-between rounded-2xl border border-zinc-800 bg-black px-5 py-4">

        <div>
          <p className="font-medium text-white">
            Total Royalty Allocation
          </p>

          <p className="mt-1 text-sm text-zinc-500">
            Royalty distribution across all contributors.
          </p>
        </div>

        <div className="text-right">

          <div
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              totalRoyalty === 100
                ? 'bg-emerald-500/15 text-emerald-400'
                : 'bg-yellow-500/15 text-yellow-400'
            }`}
          >
            {totalRoyalty}%
          </div>

          {
            totalRoyalty !== 100 && (
              <p className="mt-2 text-xs text-yellow-500">
                Total royalty allocation must equal 100%.
              </p>
            )
          }

        </div>
      </div>
    </div>
  );
}