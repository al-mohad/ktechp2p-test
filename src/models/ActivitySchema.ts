import mongoose, { Schema } from "mongoose";

const ActivitySchema = new Schema(
    {
        uid: { type: String, require: true, unique: true },
        action: { type: String, require: true, unique: true },
        detail: { type: String, required: false, unique: true },
    },
    { timestamps: true }
);

export const ActivityModel = mongoose.model("Activity", ActivitySchema);

export const logActivityInDB = (data: Record<string, any>) =>
    new ActivityModel(data).save().then((activity) => {
        activity.toObject();
    });

export const getMongoActivities = () => ActivityModel.find();

// todo:: get all activities of a particular user
