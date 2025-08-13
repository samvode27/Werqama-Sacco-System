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
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    adminNotes: [
        {
            status: String, // approved/rejected
            note: String,
            date: {
                type: Date,
                default: Date.now,
            },
            admin: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        },
    ],
    receipt: String, // filename or URL
});

const Saving = mongoose.model('Saving', savingSchema);

export default Saving;
