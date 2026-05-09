import mongoose from 'mongoose';

const discussionSchema = new mongoose.Schema({
  leadId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Lead',
    required: true
  },
  content: { 
    type: String, 
    required: true 
  },
  followUpDate: { 
    type: Date 
  }
}, { timestamps: true });

export default mongoose.models.Discussion || mongoose.model('Discussion', discussionSchema);
