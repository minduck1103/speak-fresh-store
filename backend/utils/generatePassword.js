const bcrypt = require('bcryptjs');

const generatePassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

// Mã hóa mật khẩu 123456
generatePassword('123456').then(hashedPassword => {
    console.log('Hashed password:', hashedPassword);
}); 