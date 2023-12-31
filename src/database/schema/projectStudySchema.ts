import { Schema } from "mongoose";

const ProjectStudySchema = new Schema(
  {
    position: [
      {
        type: String,
        required: true,
      },
    ],
    ownerId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    nickName: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    howContactTitle: {
      type: String,
      enum: ["디스코드", "오픈채팅", "기타"],
      required: true,
    },
    howContactContent: {
      type: String,
      required: true,
    },
    process: {
      type: String,
      enum: ["온라인", "오프라인", "온/오프라인"],
      required: true,
    },
    deadline: {
      type: Date,
      required: true,
    },
    recruits: {
      type: String,
      required: true,
    },
    recruitsStatus: {
      type: String,
      enum: ["모집중", "모집마감"],
      required: true,
    },
    classification: {
      type: String,
      enum: ["스터디", "프로젝트"],
      required: true,
    },
    profileImageUrl: {
      type: String,
      required: true,
    },
    comments: [
      {
        _id: {
          type: Schema.Types.ObjectId,
          required: true,
          auto: true,
        },
        author: {
          type: String,
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        ownerId: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "User",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        updatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    collection: "projectStudy",
    timestamps: true,
  }
);

export { ProjectStudySchema };
