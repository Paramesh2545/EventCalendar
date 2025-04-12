const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');

dotenv.config();

const testConnection = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
        
        const TestModel = mongoose.model('Test', new mongoose.Schema({ name: String }));
        await TestModel.create({ name: 'test' });
        console.log('Test document created successfully'.green);
        
        await TestModel.deleteMany({});
        console.log('Test cleanup completed'.yellow);
        
        await mongoose.connection.close();
        console.log('Connection closed successfully'.grey);
        
        process.exit(0);
    } catch (error) {
        console.error(`Error: ${error.message}`.red.bold);
        process.exit(1);
    }
};

testConnection(); 