import { createWriteStream, promises as fs } from 'fs'
import { tmpdir } from 'os'
import { join, resolve } from 'path'
import { Readable, Stream } from 'stream'
import { promisify } from 'util'
import tar from 'tar'
import axios from 'axios'

import { repositories } from '@config'
import { logger } from './logger'

/**
 * @param url source url to download from
 * @param destinationPath the path where the repository will be downloaded
 * @param subDirectory if set, the subdirectory to download
 * @param strip if set, the number of directories to strip from the path
 * @returns boolean if the download was successful
 */
const downloadFromGithub = async (
	url: string,
	destinationPath: string,
	subDirectory: string | null = null,
	strip = 1
) => {

	try {

		// download the whole repository
		const pipeline = promisify(Stream.pipeline)
		const tempFile = join(tmpdir(), `temp-${Date.now()}`)

		const request = await axios({
			responseType: 'stream',
			url,
		})

		await pipeline(Readable.from(request.data), createWriteStream(tempFile))

		// extract the repo
		await tar.x({
			cwd: destinationPath,
			file: tempFile,
			// if not null, extract only a subdirectory
			filter: (p) => subDirectory === null || p.includes(subDirectory),
			strip
		})

		// delete the temporary tar file
		await fs.unlink(tempFile)

		return true

	} catch (err) {
		return false
	}
}

/**
 * Downloads a github repository
 * @param destinationRelativePath the relative path where the repository will be downloaded
 * @param source the source of the repository (owner, repo, branch)
 * @param subDirectory if set, the subdirectory to download
 * @param strip if set, the number of directories to strip from the path
 * @returns boolean if the download was successful
 */
export const downloadRepoFromGithub = async (
	destinationRelativePath: string,
	{ owner, repo, branch } = repositories.templates,
	subDirectory: string | null = null,
	strip = 1
) => {

	return downloadFromGithub(
		`https://codeload.github.com//${owner}/${repo}/tar.gz/${branch}`,
		resolve() + '/' + destinationRelativePath,
		subDirectory, 
		strip
	)
}