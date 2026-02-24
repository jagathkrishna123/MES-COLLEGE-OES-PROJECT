import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    priority: {
      type: String,
      enum: ['low', 'normal', 'high'],
      default: 'normal',
    },
    status: {
      type: String,
      enum: ['read', 'unread'],
      default: 'unread',
    },
    teacherIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
      }
    ],
    type: {
      type: String,
      enum: ['all', 'specific', 'multiple'],
      required: true,
      default: 'specific',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Notification', notificationSchema);