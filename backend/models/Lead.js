import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  company: { 
    type: String 
  },
  phone: { 
    type: String 
  },
  status: { 
    type: String, 
    enum: ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'],
    default: 'New'
  },
  nextFollowUp: { 
    type: Date 
  }
}, { timestamps: true });

// Virtual for discussions (1-to-many relationship)
leadSchema.virtual('discussions', {
  ref: 'Discussion',
  localField: '_id',
  foreignField: 'leadId'
});

// Ensure virtuals are included when converted to JSON
leadSchema.set('toJSON', { virtuals: true });
leadSchema.set('toObject', { virtuals: true });

export default mongoose.models.Lead || mongoose.model('Lead', leadSchema);
