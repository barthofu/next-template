import { request } from "@octokit/request"

import { repositories } from "@config"

export const getTemplates = async ({ owner, repo } = repositories.templates): Promise<string[]> => {

    const response = await request('GET /repos/{owner}/{repo}/contents/templates', {
        owner,
        repo,
    })

    return response.data
        .filter((item: any) => item.type === 'dir')
        .map((item: any) => item.name)
}

export const getVariantsOfTemplate = async (template: string, { owner, repo } = repositories.templates): Promise<string[]> => {

    const response = await request('GET /repos/{owner}/{repo}/contents/templates/{template}', {
        owner,
        repo,
        template
    })

    return response.data
        .filter((item: any) => item.type === 'dir')
        .map((item: any) => item.name)
}