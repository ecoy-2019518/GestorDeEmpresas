import { Schema, model } from 'mongoose';

const companySchema = Schema({
    name: {
        type: String,
        require: [true, "Name is require"]
    },
    description: {
        type: String,
        require: [true, "Description is require"]
    },
    yearsOfExperience: {
        type: Number,
        require: [true, "Years Of Experience is require"]
    },
    category: {
        type: Schema.ObjectId,
        ref: 'category',
        require: [true, "Category is require"]
    },
    levelOfImpact: {
        type: String,
        uppercase: true,
        enum: ['HIGH', 'MEDIUM','LOW'],
        require: [true, "Impact Of Level is require"]      
    }
}, {
    versionKey: false
})

export default model('company', companySchema)