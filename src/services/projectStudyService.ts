import { Types } from "mongoose";
import { ProjectStudyModel } from "../database/model/projectStudyModel";
import {
  ProjectStudyInfo,
  ProjectStudyData,
  CommentData,
  CommentInfo,
} from "../types/projectTypes";
import { validation } from "../utils/validation";
import { userService } from "./userService";
import { NotificationModel } from "../database/model/notificationModel";

class ProjectStudyService {
  projectStudyModel: ProjectStudyModel;
  notificationModel: NotificationModel;

  constructor(
    projectStudyModelArg: ProjectStudyModel,
    notificationModelArg: NotificationModel
  ) {
    this.projectStudyModel = projectStudyModelArg;
    this.notificationModel = notificationModelArg;
  }

  async addProjectStudyApplication(
    projectStudyInfo: ProjectStudyInfo
  ): Promise<ProjectStudyData> {
    validation.addProjectStudyApplication(projectStudyInfo);
    const createdNewProjectStudy = await this.projectStudyModel.create(
      projectStudyInfo
    );
    return createdNewProjectStudy;
  }

  async getProjectStudyById(_id: string): Promise<ProjectStudyData> {
    const projectstudy = await this.projectStudyModel.findById(_id);
    if (!projectstudy) {
      const error = new Error("해당 게시물이 존재하지 않습니다.");
      error.name = "NotFound";
      throw error;
    }
    return projectstudy;
  }

  async updateProjectStudy(
    _id: string,
    update: Partial<ProjectStudyInfo>
  ): Promise<ProjectStudyData> {
    const updatedprojectStudy = await this.projectStudyModel.update(
      _id,
      update
    );
    return updatedprojectStudy;
  }

  async deleteProjectStudy(_id: string): Promise<ProjectStudyData | null> {
    const deletedProjectStudy = await this.projectStudyModel.deleteProjectStudy(
      _id
    );
    return deletedProjectStudy;
  }

  async getAllProjectStudy(
    limit: number,
    skip: number
  ): Promise<[ProjectStudyInfo[], number]> {
    try {
      const [projectStudies, total] =
        await this.projectStudyModel.findAllProjectStudy(limit, skip);
      return [projectStudies, total];
    } catch (error) {
      throw new Error(
        "프로젝트/스터디 목록을 조회하는 중에 오류가 발생했습니다."
      );
    }
  }

  async getCommentsByProjectStudyId(
    id: string,
    limit: number,
    skip: number
  ): Promise<[CommentInfo[], number]> {
    try {
      const [comments, total] =
        await projectStudyModelInstance.findCommentsById(id, limit, skip);
      return [comments, total];
    } catch (error) {
      throw error;
    }
  }

  async getByOwnerId(ownerId: string): Promise<ProjectStudyInfo[]> {
    try {
      const portfolios = await this.projectStudyModel.findByOwnerId(ownerId);
      return portfolios;
    } catch (error) {
      throw new Error("게시물을 조회하는 중에 오류가 발생했습니다.");
    }
  }

  async getByClassificationAndPosition(
    classification: string,
    position: string,
    limit: number,
    skip: number
  ): Promise<[ProjectStudyInfo[], number]> {
    try {
      const query: Record<string, string> = {};
      if (classification) query["classification"] = classification;
      if (position) query["position"] = position;

      const [projectStudies, total] =
        await this.projectStudyModel.findByClassificationAndPosition(
          query,
          limit,
          skip
        );
      return [projectStudies, total];
    } catch (error) {
      throw new Error("게시물을 조회하는 중에 오류가 발생했습니다.");
    }
  }

  async addCommentToProjectStudy(
    projectStudyId: string,
    comment: CommentInfo,
    userId: Types.ObjectId,
    ownerId: Types.ObjectId
  ): Promise<ProjectStudyData> {
    const projectStudy = await this.projectStudyModel.findById(projectStudyId);
    if (!projectStudy) {
      const error = new Error("해당 게시물이 존재하지 않습니다.");
      error.name = "NotFound";
      throw error;
    }
    if (!projectStudy.comments) {
      projectStudy.comments = [];
    }
    projectStudy.comments.push(comment);

    await this.notificationModel.create({
      userId: ownerId,
      content: "프로젝트/스터디 게시글에 새로운 댓글이 작성되었습니다.",
      projectStudyId: projectStudyId,
    });

    return this.projectStudyModel.update(projectStudyId, projectStudy);
  }

  async deleteCommentFromProjectStudy(
    projectStudyId: string,
    commentId: Types.ObjectId
  ): Promise<ProjectStudyData> {
    const projectStudy = await this.projectStudyModel.findById(projectStudyId);
    if (!projectStudy || !projectStudy.comments) {
      const error = new Error("해당하는 게시물이나 댓글이 존재하지 않습니다.");
      error.name = "NotFound";
      throw error;
    }

    projectStudy.comments = (projectStudy.comments as CommentData[]).filter(
      (comment) => comment._id.toString() !== commentId.toString()
    );

    return this.projectStudyModel.update(projectStudyId, projectStudy);
  }

  async updateCommentInProjectStudy(
    projectStudyId: string,
    commentId: Types.ObjectId,
    updatedComment: CommentInfo
  ): Promise<ProjectStudyData> {
    const projectStudy = await this.projectStudyModel.findById(projectStudyId);
    if (!projectStudy || !projectStudy.comments) {
      const error = new Error("해당하는 게시물이나 댓글이 존재하지 않습니다.");
      error.name = "NotFound";
      throw error;
    }

    const commentIndex = (projectStudy.comments as CommentData[]).findIndex(
      (comment) => comment._id.toString() === commentId.toString()
    );

    if (commentIndex === -1) {
      const error = new Error("해당 댓글이 존재하지 않습니다.");
      error.name = "NotFound";
      throw error;
    }

    projectStudy.comments[commentIndex] = updatedComment;
    return this.projectStudyModel.update(projectStudyId, projectStudy);
  }
  async getLatestProjectStudies(): Promise<ProjectStudyInfo[]> {
    try {
      const projectStudies = await this.projectStudyModel.findProjectStudies(8);
      return projectStudies;
    } catch (error) {
      throw new Error("게시물 목록을 조회하는 중에 오류가 발생했습니다.");
    }
  }
  async getTopMentorProjectStudiesByPosition(
    userId: string | null,
    position?: string
  ): Promise<ProjectStudyInfo[]> {
    try {
      let userPosition = position;
      if (userId) {
        userPosition = await userService.getUserPositionById(userId);
      }

      if (!userPosition) {
        throw new Error("포지션 정보가 없습니다.");
      }

      const projectStudies =
        await this.projectStudyModel.findProjectStudiesByLatestAndPosition(
          userPosition,
          8
        );
      return projectStudies;
    } catch (error) {
      throw new Error("멘토 목록을 조회하는 중에 오류가 발생했습니다.");
    }
  }
  async getAllPositions(): Promise<string[]> {
    try {
      const positions = await this.projectStudyModel.getAllPositions();
      return positions;
    } catch (error) {
      throw new Error("포지션 목록을 불러오는 중 오류가 발생했습니다.");
    }
  }
}

const projectStudyModelInstance = new ProjectStudyModel();
const notificationModelInstance = new NotificationModel();
export const projectStudyService = new ProjectStudyService(
  projectStudyModelInstance,
  notificationModelInstance
);
