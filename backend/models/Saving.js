import mongoose from 'mongoose';

const savingSchema = new mongoose.Schema({
    member: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    method: { type: String, enum: ['Chapa', 'Telebirr', 'Cash'] },
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    adminNotes: [{
        status: String,
        note: String,
        date: { type: Date, default: Date.now },
        admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    }],
    receipt: String,
    deleted: { type: Boolean, default: false } // new soft delete field
}, { timestamps: true });


const Saving = mongoose.model('Saving', savingSchema);

export default Saving;
