import mongoose from 'mongoose';

const trackListenSchema =
  new mongoose.Schema(
    {
      trackId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Track',
        required: true
      },

      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
      },

      sessionId: {
        type: String,
        required: true,
        unique: true
      },

      startedAt: {
        type: Date,
        default: Date.now
      },

      lastHeartbeatAt: {
        type: Date,
        default: Date.now
      },

      completedAt: {
        type: Date,
        default: null
      },

      totalListenedSeconds: {
        type: Number,
        default: 0
      },

      completed: {
        type: Boolean,
        default: false
      },

      qualified: {
        type: Boolean,
        default: false
        },

        qualifiedAt: {
        type: Date,
        default: null
        },

      device: {
        type: String,
        default: 'UNKNOWN'
      },

      ipAddress: {
        type: String,
        default: null
      },

      userAgent: {
        type: String,
        default: null
      },

      source: {
        type: String,
        default: 'WEB'
      }
    },
    {
      timestamps: true
    }
  );

const TrackListen = mongoose.model(
  'TrackListen',
  trackListenSchema
);

export default TrackListen;