import { getOctokit } from "@actions/github";
import type { Context } from "@actions/github/lib/context";

export class Octokit {
  private client: ReturnType<typeof getOctokit>["rest"];
  private context: Context;

  constructor(token: string, context: Context) {
    this.client = getOctokit(token).rest;
    this.context = context;
  }

  get essential() {
    const { number: issue_number, owner, repo } = this.context.issue;
    return { issue_number, owner, repo };
  }

  async getContent(path: string) {
    const { owner, repo } = this.essential;
    return this.client.repos
      .getContent({
        owner,
        repo,
        path,
        ref: this.context.sha,
      })
      .then(({ data }) => data);
  }

  async listLabelsOnIssue() {
    return this.client.issues.listLabelsOnIssue({ ...this.essential }).then(({ data }) => data);
  }

  addLables(labels: string[]) {
    return this.client.issues.addLabels({
      ...this.essential,
      labels,
    });
  }

  compareCommits(base: string, head: string) {
    return this.client.repos.compareCommits({ ...this.essential, base, head });
  }

  async listComments() {
    return this.client.issues.listComments({ ...this.essential }).then(({ data }) => data);
  }

  createComment(body: string) {
    return this.client.issues.createComment({
      ...this.essential,
      body,
    });
  }

  deleteComment(ids: number[]) {
    return Promise.all(ids.map((comment_id) => this.client.issues.deleteComment({ ...this.essential, comment_id })));
  }
}
