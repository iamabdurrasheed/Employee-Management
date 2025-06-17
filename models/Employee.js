const mongoose = require('mongoose');
const moment = require('moment');

const employeeSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  designation: {
    type: String,
    required: true,
    trim: true
  },
  qualifications: {
    ug: {
      type: String,
      trim: true
    },
    pg: {
      type: String,
      trim: true
    },
    phd: {
      type: String,
      trim: true
    }
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  dateOfJoining: {
    type: Date,
    required: true
  },
  previousExperience: {
    years: {
      type: Number,
      default: 0,
      min: 0
    },
    months: {
      type: Number,
      default: 0,
      min: 0,
      max: 11
    },
    days: {
      type: Number,
      default: 0,
      min: 0,
      max: 30
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Virtual for age calculation
employeeSchema.virtual('age').get(function() {
  return moment().diff(this.dateOfBirth, 'years');
});

// Virtual for current experience calculation
employeeSchema.virtual('currentExperience').get(function() {
  const now = moment();
  const joining = moment(this.dateOfJoining);
  
  const totalDays = now.diff(joining, 'days');
  
  const years = Math.floor(totalDays / 365);
  const remainingDaysAfterYears = totalDays % 365;
  const months = Math.floor(remainingDaysAfterYears / 30);
  const days = remainingDaysAfterYears % 30;
  
  return {
    years: years,
    months: months,
    days: days
  };
});

// Virtual for total experience calculation
employeeSchema.virtual('totalExperience').get(function() {
  const current = this.currentExperience;
  const previous = this.previousExperience;
  
  let totalDays = previous.days + current.days;
  let totalMonths = previous.months + current.months;
  let totalYears = previous.years + current.years;
  
  // Handle day overflow
  if (totalDays >= 30) {
    totalMonths += Math.floor(totalDays / 30);
    totalDays = totalDays % 30;
  }
  
  // Handle month overflow
  if (totalMonths >= 12) {
    totalYears += Math.floor(totalMonths / 12);
    totalMonths = totalMonths % 12;
  }
  
  return {
    years: totalYears,
    months: totalMonths,
    days: totalDays
  };
});

// Include virtuals when converting to JSON
employeeSchema.set('toJSON', { virtuals: true });
employeeSchema.set('toObject', { virtuals: true });

// Index for faster queries
employeeSchema.index({ employeeId: 1 });
employeeSchema.index({ fullName: 1 });
employeeSchema.index({ dateOfJoining: 1 });

module.exports = mongoose.model('Employee', employeeSchema);
