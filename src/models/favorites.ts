import mongoose , {Schema} from 'mongoose';

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
        required: true
    },
    Type: {
        type: String,
        required: true
    },
    Poster: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    }
});


export default mongoose.model('Favorites', favoritesSchema);