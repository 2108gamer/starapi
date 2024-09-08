const { connect } = require("mongoose");

const MONGODB_URI = "mongodb+srv://ricardo:Radio.fm-123@imanity.avkzu.mongodb.net/?retryWrites=true&w=majority&appName=Imanity"
module.exports = async () => {
    console.log('Started connecting to MongoDB...', 'warn');

    await connect(MONGODB_URI).then(() => {
        console.log('MongoDB is connected to the atlas!', 'done')
    });
};