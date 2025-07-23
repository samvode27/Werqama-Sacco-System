import mongoose from 'mongoose';

const savingSchema = new mongoose.Schema({
    member: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    method: {
        type: String,
        enum: ['Chapa', 'Telebirr', 'Cash'],
        default: 'Chapa',
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

const Saving = mongoose.model('Saving', savingSchema);

export default Saving;
