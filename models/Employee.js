const mongoose = require('mongoose');
const moment = require('moment');

const previousExperienceSchema = new mongoose.Schema({
    organization: {
        type: String,
        required: true
    },
    fromDate: {
        type: Date,
        required: true
    },
    toDate: {
        type: Date,
        required: true
    },
    years: {
        type: Number,
        default: 0
    },
    months: {
        type: Number,
        default: 0
    },
    days: {
        type: Number,
        default: 0
    }
});

const employeeSchema = new mongoose.Schema({    employeeId: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    profilePhoto: {
        type: String,
        default: null
    },
    designation: {
        type: String,
        required: true
    },
    ugQualification: {
        type: String,
        required: false
    },
    pgQualification: {
        type: String,
        required: false
    },
    phdQualification: {
        type: String,
        required: false
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    dateOfJoining: {
        type: Date,
        required: true
    },
    previousExperience: [previousExperienceSchema],
    // Auto-calculated fields
    age: {
        years: { type: Number, default: 0 },
        months: { type: Number, default: 0 },
        days: { type: Number, default: 0 }
    },
    currentExperience: {
        years: { type: Number, default: 0 },
        months: { type: Number, default: 0 },
        days: { type: Number, default: 0 }
    },
    totalPreviousExperience: {
        years: { type: Number, default: 0 },
        months: { type: Number, default: 0 },
        days: { type: Number, default: 0 }
    },
    totalExperience: {
        years: { type: Number, default: 0 },
        months: { type: Number, default: 0 },
        days: { type: Number, default: 0 }
    }
}, {
    timestamps: true
});

// Helper function to calculate duration between two dates
function calculateDuration(startDate, endDate) {
    const start = moment(startDate);
    const end = moment(endDate);
    
    const years = end.diff(start, 'years');
    start.add(years, 'years');
    
    const months = end.diff(start, 'months');
    start.add(months, 'months');
    
    const days = end.diff(start, 'days');
    
    return { years, months, days };
}

// Helper function to add durations
function addDurations(duration1, duration2) {
    let totalDays = duration1.days + duration2.days;
    let totalMonths = duration1.months + duration2.months;
    let totalYears = duration1.years + duration2.years;
    
    if (totalDays >= 30) {
        totalMonths += Math.floor(totalDays / 30);
        totalDays = totalDays % 30;
    }
    
    if (totalMonths >= 12) {
        totalYears += Math.floor(totalMonths / 12);
        totalMonths = totalMonths % 12;
    }
    
    return { years: totalYears, months: totalMonths, days: totalDays };
}

// Pre-save middleware to calculate all experience fields
employeeSchema.pre('save', function(next) {
    // Calculate age
    this.age = calculateDuration(this.dateOfBirth, new Date());
    
    // Calculate current experience
    this.currentExperience = calculateDuration(this.dateOfJoining, new Date());
    
    // Calculate individual previous experience durations
    this.previousExperience.forEach(exp => {
        const duration = calculateDuration(exp.fromDate, exp.toDate);
        exp.years = duration.years;
        exp.months = duration.months;
        exp.days = duration.days;
    });
    
    // Calculate total previous experience
    let totalPrevious = { years: 0, months: 0, days: 0 };
    this.previousExperience.forEach(exp => {
        totalPrevious = addDurations(totalPrevious, {
            years: exp.years,
            months: exp.months,
            days: exp.days
        });
    });
    this.totalPreviousExperience = totalPrevious;
    
    // Calculate total experience (current + previous)
    this.totalExperience = addDurations(this.currentExperience, this.totalPreviousExperience);
    
    next();
});

// Method to recalculate experience (for real-time updates)
employeeSchema.methods.recalculateExperience = function() {
    this.age = calculateDuration(this.dateOfBirth, new Date());
    this.currentExperience = calculateDuration(this.dateOfJoining, new Date());
    
    let totalPrevious = { years: 0, months: 0, days: 0 };
    this.previousExperience.forEach(exp => {
        const duration = calculateDuration(exp.fromDate, exp.toDate);
        exp.years = duration.years;
        exp.months = duration.months;
        exp.days = duration.days;
        
        totalPrevious = addDurations(totalPrevious, {
            years: exp.years,
            months: exp.months,
            days: exp.days
        });
    });
    this.totalPreviousExperience = totalPrevious;
    this.totalExperience = addDurations(this.currentExperience, this.totalPreviousExperience);
    
    return this;
};

module.exports = mongoose.model('Employee', employeeSchema);
