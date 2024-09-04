const express = require('express');
const Component = require('../models/Component');
const router = express.Router();
const Project = require('../models/Project');

// Create Component
// router.post('/create/:projectId', async (req, res) => {
//     const { name, htmlContent } = req.body;
//     const { projectId } = req.params;

//     try {
//         const component = new Component({ name, projectId,htmlContent });
//         await component.save();
//         await Project.findByIdAndUpdate(projectId, { $push: { components: component._id } });
//         res.status(201).json({ message: 'Component created successfully', component });
//     } catch (err) {
//         res.status(400).json({ error: err.message });
//     }
// });
router.post('/create/:projectId', async (req, res) => {
    const { name, htmlContent } = req.body;
    const { projectId } = req.params;

    try {
        const component = new Component({ name, projectId, htmlContent });
        await component.save();
        await Project.findByIdAndUpdate(projectId, { $push: { components: component._id } });
        res.status(201).json({ message: 'Component created successfully', component });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.get('/', async (req, res) => {
    const { projectId } = req.query;

    if (!projectId) return res.status(400).json({ message: 'Project ID is required' });

    try {
        const components = await Component.find({ projectId });
        res.status(200).json({ components });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/name/:componentId', async (req, res) => {
    const { componentId } = req.params;

    try {
        const component = await Component.findById(componentId).select('name'); // Fetch only the name field
        if (!component) {
            return res.status(404).json({ error: 'Component not found' });
        }
        res.status(200).json({ component });
    } catch (error) {
        console.error('Error fetching component:', error);
        res.status(500).json({ error: 'An error occurred while fetching the component' });
    }
});
router.get('/', async (req, res) => {
    try {
        const components = await Component.find({});
        res.status(200).json({ components });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});
// In your Component routes file


router.get('/:projectId', async (req, res) => {
    const { projectId } = req.params;

    try {
        const components = await Component.find({ projectId });
        res.status(200).json({ components });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});
router.get('/:componentId/subcomponents', async (req, res) => {
    const { componentId } = req.params;

    try {
        // Find the component by ID
        const component = await Component.findById(componentId).populate('subComponents');
        if (!component) {
            return res.status(404).json({ error: 'Component not found' });
        }

        // Send the subcomponents as response
        res.status(200).json({ subComponents: component.subComponents });
    } catch (error) {
        console.error('Error fetching subcomponents:', error);
        res.status(500).json({ error: 'An error occurred while fetching subcomponents' });
    }
});
// Assuming you have an API endpoint to create components
router.post('/api/component/create/:projectId', async (req, res) => {
    try {
        const { name, htmlContent } = req.body;
        const { projectId } = req.params;

        const newComponent = new Component({
            name,
            htmlContent,
            projectId
        });

        const savedComponent = await newComponent.save();
        res.status(201).json(savedComponent);
    } catch (error) {
        console.error('Error creating component:', error);
        res.status(500).json({ error: 'Failed to create component' });
    }
});
router.get('/:componentId/images', async (req, res) => {
    const { componentId } = req.params;

    try {
        // Find the component by ID
        const component = await Component.findById(componentId).select('name images');
        
        if (!component) {
            return res.status(404).json({ error: 'Component not found' });
        }

        // Fetch all subcomponents related to this component ID
        const subcomponents = await SubComponent.find({ componentId }).select('image');

        // Combine images from component and subcomponents
        const images = [...component.images, ...subcomponents.map(sub => sub.image).filter(Boolean)];

        res.status(200).json({
            name: component.name,
            images
        });
    } catch (error) {
        console.error('Error fetching images:', error);
        res.status(500).json({ error: 'An error occurred while fetching images' });
    }
});
module.exports = router;
