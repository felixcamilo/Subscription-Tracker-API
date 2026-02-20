import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'User Name is required'],
        trim: true,
        minLength: 2,
        maxLength: 50,
    },

    email: {
        type: String,
        required: [true, 'User Email is required'],
        unique: [true, 'Email is unique'],
        trim: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'Please fill a valid e-mail address'],

    },

    password: {
        type: String,
        required: [true, 'User Password is required'],
        minLength: 6,
    },

    role: {
        type: String,
        required: [true, 'User Role is required'],
        enum: ['admin', 'user'],
        default: 'user',
        trim: true,
    }
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

export default User;