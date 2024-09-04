const express = require('express');
const SubComponent = require('../models/SubComponent');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const path = require('path');
const router = express.Router();
const mongoose = require('mongoose');
const Component = require('../models/Component');
const { GridFSBucket } = require('mongodb');

// Initialize GridFsStorage
function getBucket(req) {
    if (req.app && req.app.locals && req.app.locals.bucket) {
        return req.app.locals.bucket;
    } else {
        throw new Error('GridFSBucket instance is not initialized');
    }
}

// Multer setup to handle file uploads in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload Image and Create SubComponent
// router.post('/create/:componentId', upload.single('image'), async (req, res) => {
//     console.log('File:', req.file); // Log file metadata
//     const { title, text, spanText, buttonText, description,htmlContent  } = req.body;
//     const { componentId } = req.params;

//     if (!title || !componentId) {
//         return res.status(400).json({ error: 'Title and componentId are required' });
//     }

//     try {
//         const image = req.file ? req.file.filename : null; // Handle optional image

//         const subComponent = new SubComponent({
//             title,
//             text,
//             spanText,
//             buttonText,
//             description,
//             image, // Set image to null if no file is uploaded
//             componentId,
//             htmlContent 
//         });
        
//         await subComponent.save();
//         await Component.findByIdAndUpdate(componentId, { $push: { subComponents: subComponent._id } });
//         res.status(201).json({ message: 'SubComponent created successfully', subComponent });
//     } catch (err) {
//         console.error('Error:', err); // Log errors for debugging
//         res.status(500).json({ error: 'An error occurred while creating the SubComponent' });
//     }
// });
// router.post('/create/:componentId', upload.single('image'), async (req, res) => {
//     const { title, text, spanText, buttonText, description, htmlContent } = req.body;
//     const { componentId } = req.params;
//     const image = req.file ? req.file.buffer : null;
//     if (!title || !componentId) {
//         return res.status(400).json({ error: 'Title and componentId are required' });
//     }

//     try {
//         ;

//         // If a file is uploaded, save it to GridFS
//         if (req.file) {
//             const bucket = new GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });
//             const uploadStream = bucket.openUploadStream(req.file.originalname, {
//                 contentType: req.file.mimetype
//             });
//             uploadStream.end(req.file.buffer);

//             imageFilename = req.file.originalname;
//         }

//         const subComponent = new SubComponent({
//             title,
//             text,
//             spanText,
//             buttonText,
//             description,
//             image: imageFilename, // Save the filename of the image
//             componentId,
//             htmlContent
//         });
        
//         await subComponent.save();
//         await Component.findByIdAndUpdate(componentId, { $push: { subComponents: subComponent._id } });
//         res.status(201).json({ message: 'SubComponent created successfully', subComponent });
//     } catch (err) {
//         console.error('Error:', err);
//         res.status(500).json({ error: 'An error occurred while creating the SubComponent' });
//     }
// });
// router.post('/create/:componentId', upload.single('image'), async (req, res) => {
//     const { title, text, spanText, buttonText, description, htmlContent } = req.body;
//     const { componentId } = req.params;
//     let imageFilename = null;

//     if (!title || !componentId) {
//         return res.status(400).json({ error: 'Title and componentId are required' });
//     }

//     try {
//         if (req.file) {
//             const bucket = new GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });
//             const uploadStream = bucket.openUploadStream(req.file.originalname, {
//                 contentType: req.file.mimetype
//             });
//             uploadStream.end(req.file.buffer);
//             imageFilename = req.file.originalname;
//         }

//         const subComponent = new SubComponent({
//             title,
//             text,
//             spanText,
//             buttonText,
//             description,
//             image: imageFilename,
//             componentId,
//             htmlContent
//         });

//         await subComponent.save();
//         await Component.findByIdAndUpdate(componentId, { $push: { subComponents: subComponent._id } });
//         res.status(201).json({ message: 'SubComponent created successfully', subComponent });
//     } catch (err) {
//         console.error('Error creating subcomponent:', err); // Log detailed error
//         res.status(500).json({ error: 'An error occurred while creating the SubComponent', details: err.message });
//     }
// });
router.post('/create/:componentId', upload.single('image'), async (req, res) => {
    const { title, text, spanText, buttonText, description, htmlContent } = req.body;
    const { componentId } = req.params;
    let imageFilename = null;

    if (!title || !componentId) {
        return res.status(400).json({ error: 'Title and componentId are required' });
    }

    try {
        if (req.file) {
            const bucket = new GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });
            
            // Generate a unique filename for the image
            imageFilename = `${Date.now()}-${req.file.originalname}`;

            const uploadStream = bucket.openUploadStream(imageFilename, {
                contentType: req.file.mimetype
            });

            // Write the file buffer to the upload stream
            uploadStream.end(req.file.buffer);

            // Handle finish event to ensure upload is complete
            uploadStream.on('finish', async () => {
                // Create the subcomponent only after the image upload is finished
                const subComponent = new SubComponent({
                    title,
                    text,
                    spanText,
                    buttonText,
                    description,
                    image: imageFilename,
                    componentId,
                    htmlContent
                });

                await subComponent.save();
                await Component.findByIdAndUpdate(componentId, { $push: { subComponents: subComponent._id } });
                res.status(201).json({ message: 'SubComponent created successfully', subComponent });
            });

            // Handle errors during the upload process
            uploadStream.on('error', (err) => {
                console.error('Error uploading image:', err);
                res.status(500).json({ error: 'An error occurred while uploading the image' });
            });
        } else {
            // If no image is uploaded, proceed to save the subcomponent without an image
            const subComponent = new SubComponent({
                title,
                text,
                spanText,
                buttonText,
                description,
                image: imageFilename,
                componentId,
                htmlContent
            });

            await subComponent.save();
            await Component.findByIdAndUpdate(componentId, { $push: { subComponents: subComponent._id } });
            res.status(201).json({ message: 'SubComponent created successfully', subComponent });
        }
    } catch (err) {
        console.error('Error creating subcomponent:', err);
        res.status(500).json({ error: 'An error occurred while creating the SubComponent', details: err.message });
    }
});

router.put('/update/:id', upload.single('image'), async (req, res) => {
    // const { id } = req.params;
    // const { title, text, spanText, buttonText, description,htmlContent  } = req.body;

    // if (!mongoose.Types.ObjectId.isValid(id)) {
    //     return res.status(400).json({ error: 'Invalid SubComponent ID' });
    // }

    // try {
    //     const subComponent = await SubComponent.findById(id);

    //     if (!subComponent) {
    //         return res.status(404).json({ error: 'SubComponent not found' });
    //     }

    //     // Update fields
    //     if (title !== undefined) subComponent.title = title;
    //     if (text !== undefined) subComponent.text = text;
    //     if (spanText !== undefined) subComponent.spanText = spanText;
    //     if (buttonText !== undefined) subComponent.buttonText = buttonText;
    //     if (description !== undefined) subComponent.description = description;
    //     if (htmlContent !== undefined) subComponent.htmlContent = htmlContent;
    //     // // Handle image update
    //     // if (req.file) {
    //     //     subComponent.image = req.file.filename;
    //     // }
    //     // Handle image update
    //     if (req.file) {
    //         const bucket = new GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });

    //         // If there was an existing image, delete it from GridFS
    //         if (subComponent.image) {
    //             const existingImageStream = bucket.openDownloadStreamByName(subComponent.image);
    //             existingImageStream.pipe(require('stream').Writable({
    //                 write() {
    //                     // Consume the stream to ensure the file is deleted
    //                 }
    //             }));
    //             bucket.delete(subComponent.image);
    //         }

    //         // Upload the new image
    //         const uploadStream = bucket.openUploadStream(req.file.originalname, {
    //             contentType: req.file.mimetype
    //         });
    //         uploadStream.end(req.file.buffer);

    //         subComponent.image = req.file.originalname;
    //     }


    //     await subComponent.save();
    //     res.status(200).json({ message: 'SubComponent updated successfully', subComponent });
    // } catch (err) {
    //     console.error('Error:', err);
    //     res.status(500).json({ error: 'An error occurred while updating the SubComponent' });
    // }
    const { id } = req.params;
    const { title, text, spanText, buttonText, description, htmlContent } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid SubComponent ID' });
    }

    try {
        const subComponent = await SubComponent.findById(id);
        if (!subComponent) {
            return res.status(404).json({ error: 'SubComponent not found' });
        }

        // Update fields
        if (title !== undefined) subComponent.title = title;
        if (text !== undefined) subComponent.text = text;
        if (spanText !== undefined) subComponent.spanText = spanText;
        if (buttonText !== undefined) subComponent.buttonText = buttonText;
        if (description !== undefined) subComponent.description = description;
        if (htmlContent !== undefined) subComponent.htmlContent = htmlContent;

        // Handle image update
        if (req.file) {
            const bucket = new GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });

            // Upload the new image
            const uploadStream = bucket.openUploadStream(req.file.originalname, {
                contentType: req.file.mimetype
            });

            uploadStream.end(req.file.buffer);

            // Wait for the upload to complete
            uploadStream.on('finish', async () => {
                // Update the subcomponent with the new image filename
                subComponent.image = req.file.originalname;
                await subComponent.save();
                res.status(200).json({ message: 'SubComponent updated successfully', subComponent });
            });

            uploadStream.on('error', (err) => {
                console.error('Error uploading new image:', err);
                res.status(500).json({ error: 'An error occurred while uploading the image' });
            });
        } else {
            // No new image was uploaded, just save the updated subcomponent
            await subComponent.save();
            res.status(200).json({ message: 'SubComponent updated successfully', subComponent });
        }
    } catch (err) {
        console.error('Error updating subcomponent:', err);
        res.status(500).json({ error: 'An error occurred while updating the SubComponent', details: err.message });
    }
});
router.get('/:componentId', async (req, res) => {
    const { componentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(componentId)) {
        return res.status(400).json({ error: 'Invalid componentId' });
    }

    try {
        const subComponents = await SubComponent.find({ componentId });
        res.json({ subComponents });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
// Example backend route to fetch a specific subcomponent by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const subComponent = await SubComponent.findById(id);
        if (!subComponent) {
            return res.status(404).json({ error: 'Subcomponent not found' });
        }
        res.status(200).json({ subComponent });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid SubComponent ID' });
    }

    try {
        // Find and delete the subcomponent
        const subComponent = await SubComponent.findByIdAndDelete(id);

        if (!subComponent) {
            return res.status(404).json({ error: 'SubComponent not found' });
        }

        // Remove reference to the subcomponent from its parent component
        await Component.updateMany(
            { subComponents: id },
            { $pull: { subComponents: id } }
        );

        // If there was an image associated with the subcomponent, you might want to delete it from GridFS here
        // You would need to use the GridFS bucket to delete the file based on its filename
        // For example:
        // const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });
        // bucket.delete(subComponent.image);

        res.status(200).json({ message: 'SubComponent deleted successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while deleting the SubComponent' });
    }
});
router.get('/images/:filename', (req, res) => {
    const { filename } = req.params;
    const bucket = new GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });
    bucket.openDownloadStreamByName(filename).pipe(res);
});

module.exports = router;
