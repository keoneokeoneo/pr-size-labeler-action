import * as core from "@actions/core";
import * as github from "@actions/github";
import { Context } from "@actions/github/lib/context";
import type { PullRequestEvent } from "@octokit/webhooks-types";
import { Octokit } from "./Octokit";

export default async function action(context: Context = github.context) {
  try {
    const GITHUB_TOKEN = core.getInput("repo-token", { required: true });
    const configPath = core.getInput("configuration-path", { required: true });

    const { pull_request } = context.payload as PullRequestEvent;

    if (!pull_request) {
      throw new Error(
        "Payload does not contain `pull_request`. Make sure this aciton is being triggered by a pull request event."
      );
    }

    if (!configPath) {
      throw new Error("Configuration file is not found");
    }

    const octokit = new Octokit(GITHUB_TOKEN, context);
    //const { number, base, head } = pull_request;

    // Read configuration file with config path
    const config = await octokit.getContent(configPath);
    core.info(JSON.stringify(config, null, 2));

    // Get changed lines in PR
    //const compareResult = await octokit.compareCommits(base.sha, head.sha);

    // Calculate changed lines
    //const initialChangeInfo;
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    }
  }
}
