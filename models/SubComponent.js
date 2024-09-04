// const mongoose = require('mongoose');

// const SubComponentSchema = new mongoose.Schema({
//     title: { type: String, required: false },
//     text: { type: String, required: false },
//     spanText: { type: String, required: false },
//     description: { type: String, required: false },
//     buttonText: { type: String, required: false },
//     image: { type: String, required: false },
//     componentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Component' } // Not required, just a reference
// });

// module.exports = mongoose.model('SubComponent', SubComponentSchema);
const mongoose = require('mongoose');

const SubComponentSchema = new mongoose.Schema({
    title: { type: String, required: false },
    text: { type: String, required: false },
    spanText: { type: String, required: false },
    description: { type: String, required: false },
    buttonText: { type: String, required: false },
    image: { type: String, required: false },
    componentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Component' }, // Not required, just a reference
    htmlContent: { type: String}
});

module.exports = mongoose.model('SubComponent', SubComponentSchema);
