import mongoose , {Schema} from 'mongoose';
import { MediaItemDocument } from '../interfaces/favorites.interface';

const favoritesSchema: Schema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    },
    imdbID: {
        type: String,
        unique: true,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    poster: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    descriptions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Description'
    }],
    user:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }]
}, {
    timestamps: true 
});



export default mongoose.model<MediaItemDocument>('MediaItem', favoritesSchema);

