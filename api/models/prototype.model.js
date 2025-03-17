const mongoose = require("mongoose");
const dayjs = require("../config/dayjs.config");
const { isURL } = require('../validators/string.validators');
const { prototypes } = require("./user.model");

const prototypeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minLength: [3, "Title needs at least 3 characters"],
      maxLength: [100, "Title characters must be lower than 100"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minLength: [10, "Description needs at least 3 characters"],
      maxLength: [7000, "Description characters must be lower than 7000"],
    },
    poster: { 
      type: String, 
      default: "https://placehold.co/600x400",
    }, 
    screenshot: { 
      type: String, 
      default: null, 
    }, 
    startDate: {
      type: Date,
      required: [true, "Starting date is required"],
      validate: {
        validator: function (startDate) {
          return dayjs(startDate).isAfter(dayjs(), "day");
        },
        message: function () {
          return "Starting date can not be in the past";
        },
      },
    },
    endDate: {
      type: Date,
      required: [true, "Ending date is required"],
      validate: {
        validator: function (endDate) {
          return dayjs(endDate).isAfter(dayjs(this.startDate));
        },
        message: function () {
          return "Starting date can not be in the past";
        },
      },
    },
    address: {
      type: {
        _id: false,
        city: {
          type: String,
          lowercase: true,
          required: [true, "City is required giving an address"],
        },
        street: {
          type: String,
          required: [true, "Street is required giving an address"],
        },
        location: {
          type: {
            type: String,
            enum: ['Point'],
            required: true
          },
          coordinates: {
            type: [Number],
            required: true
          }
        }
      },
      required: false
    },
    categories: [String],
    poster: {
      type: String,
      default: 'https://picsum.photos/seed/a07c034d-47f4-4a86-97d6-80f8a57f3960/800/600',
      validate: {
        validator: isURL,
        message: function () {
          return "Invalid poster URL";
        }
      }
    },
   user: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  feedback: {
    type: String,
    trim: true,
    default: "",
  }
  },
  
  {
    timestamps: true,
    toJSON: {
      virtuals: true, 
      transform: function (doc, ret) {
        delete ret.__v;
        delete ret._id;
        ret.id = doc.id;
        if (ret.address) {
          const [lng, lat] = ret.address.location.coordinates;
          ret.address.location = { lat, lng }
        }
        return ret;
      },
    },
  }
);

prototypeSchema.index({ 'address.location': '2dsphere' });


prototypeSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "prototype",
  justOne: false,
});

const Prototype = mongoose.model("Prototype", prototypeSchema);
module.exports = Prototype;
