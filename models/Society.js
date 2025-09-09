import { Schema, model } from "mongoose";

const societySchema = new Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    registrationNumber: { type: String, required: true, unique: true },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    wings: [
      {
        wingName: { type: String, required: true },
        floors: [
          {
            floorNumber: { type: Number, required: true },
            flats: [
              {
                flatNumber: { type: String, required: true },
                unitType: {
                  type: String,
                  enum: ["Flat", "Shop"],
                  required: true,
                },
                status: {
                  type: String,
                  enum: ["Available", "Not Available"],
                  default: "Available",
                },
                type: {
                  type: String,
                  enum: ["Owner", "Rent"],
                  required: true,
                },
                rentAmount: { type: Number, default: 0 },
                isOccupied: { type: Boolean, default: false },
                amenities: [{ type: String }],

                // Family members in the flat
                familyMembers: [
                  {
                    name: { type: String, required: true },
                    relation: { type: String, required: true },
                    phone: { type: String, required: true },
                    email: { type: String },
                  },
                ], // Family members in a flat

                // Join Requests for the flat
                joinRequests: [
                  {
                    userId: {
                      type: Schema.Types.ObjectId,
                      ref: "User",
                      required: true,
                    },
                    status: {
                      type: String,
                      enum: ["Pending", "Accepted", "Rejected"],
                      default: "Pending",
                    },
                    requestDate: { type: Date, default: Date.now },
                  },
                ], // Join requests for the flat
              },
            ],
          },
        ],
      },
    ],

    amenities: [{ type: String }],
    maintenanceFee: { type: Number, default: 0 },
    rules: [{ type: String }],
    contactDetails: {
      phone: { type: String },
      email: { type: String },
    },
    logo: { type: String },
    status: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Society = model("Society", societySchema);
export default Society;
