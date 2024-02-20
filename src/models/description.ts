import mongoose, { Schema } from 'mongoose';
import { Description } from '../interfaces/description.interface';

const descriptionSchema: Schema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    favoriteId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Favorite',
        required: true
    },
    description: {
        type: String,
        required: false
    }
});

export default mongoose.model<Description>('Description', descriptionSchema);