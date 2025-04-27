const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Public (hoặc Private/Admin nếu cần)
exports.getUsers = asyncHandler(async (req, res, next) => {
    const users = await User.find(); // Lấy toàn bộ user từ database
    res.status(200).json(users);     // Trả về mảng user
});

// @desc    Get single user
// @route   GET /api/v1/users/:id
// @access  Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    res.status(200).json({
        success: true,
        data: user
    });
});

// @desc    Create user
// @route   POST /api/v1/users
// @access  Private/Admin
exports.createUser = asyncHandler(async (req, res, next) => {
    const user = await User.create(req.body);

    res.status(201).json({
        success: true,
        data: user
    });
});

// @desc    Update user
// @route   PUT /api/v1/users/:id
// @access  Public (hoặc Private/Admin nếu cần)
exports.updateUser = asyncHandler(async (req, res, next) => {
    // Chỉ cho phép cập nhật các trường hợp lệ
    const fieldsToUpdate = {};
    if (req.body.name !== undefined) fieldsToUpdate.name = req.body.name;
    if (req.body.email !== undefined) fieldsToUpdate.email = req.body.email;
    if (req.body.role !== undefined) fieldsToUpdate.role = req.body.role;

    console.log('[DEBUG] updateUser req.body:', req.body);
    console.log('[DEBUG] updateUser fieldsToUpdate:', fieldsToUpdate);

    try {
        const user = await User.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
        new: true,
        runValidators: true
    });

        if (!user) {
            return next(new ErrorResponse('User not found', 404));
        }

    res.status(200).json({
        success: true,
        data: user
    });
    } catch (err) {
        console.error('Update user error:', err);
        return next(new ErrorResponse('Update user failed', 500));
    }
});

// @desc    Delete user
// @route   DELETE /api/v1/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        data: {}
    });
}); 