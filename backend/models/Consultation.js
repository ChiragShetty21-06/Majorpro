import mongoose from 'mongoose';

const consultationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    query_title: {
      type: String,
      required: [true, 'Please provide a query title'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    detailed_question: {
      type: String,
      required: [true, 'Please provide detailed question'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    category: {
      type: String,
      required: true,
      enum: [
        'family_law',
        'property_dispute',
        'employment_issue',
        'consumer_complaint',
        'criminal_matter',
        'civil_rights',
        'government_services',
        'documentation',
        'other',
      ],
    },
    urgency_level: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    user_location: {
      type: String,
      trim: true,
    },
    contact_preference: {
      type: String,
      enum: ['email', 'phone', 'both'],
      default: 'email',
    },
    language: {
      type: String,
      enum: ['english', 'hindi', 'marathi', 'other'],
      default: 'english',
    },
    is_anonymous: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['pending', 'assigned', 'in_progress', 'responded', 'closed'],
      default: 'pending',
    },
    assignedLawyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    response: {
      type: String,
      default: '',
    },
    responseDate: {
      type: Date,
      default: null,
    },
    files: [
      {
        filename: String,
        url: String,
        uploadedAt: Date,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Consultation = mongoose.model('Consultation', consultationSchema);

export default Consultation;
