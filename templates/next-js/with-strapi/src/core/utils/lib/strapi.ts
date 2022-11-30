import axios, { AxiosRequestConfig } from 'axios'

import { formatStrapiResponse } from '@utils/functions'

class Strapi {

    axios = axios.create({
        baseURL: process.env['STRAPI_URL'] + '/api',
        headers: {
            Authorization: `Bearer ${process.env['STRAPI_ADMIN_JWT']}`
        },
        params: {
            populate: 'deep'
        }
    })

    // CRUD

    async find<K extends keyof Strapi.Correspondance>(url: K, params?: any, options?: AxiosRequestConfig): Promise<Array<Strapi.Correspondance[K]>> {

        const res = await this.axios.get(this.sanitizeUrl(url), { params, ...options })
        return formatStrapiResponse(res.data)
    }

    async findOne<K extends keyof Strapi.Correspondance>(url: K, params?: any, options?: AxiosRequestConfig): Promise<Strapi.Correspondance[K]> {

        const res = await this.axios.get(this.sanitizeUrl(url), { params, ...options })
        const data = formatStrapiResponse(res.data)

        return Array.isArray(data) ? data[0] || null : data
    }

    async create<K extends keyof Strapi.Correspondance>(url: K, data: any): Promise<Strapi.Correspondance[K]> {

        const res = await this.axios.post(this.sanitizeUrl(url), { data }, {
            params: {
                'workflow': true
            }
        })
        return formatStrapiResponse(res.data)
    }

    async update<K extends keyof Strapi.Correspondance>(url: K, id: number, data: any): Promise<Strapi.Correspondance[K]> {

        const res = await this.axios.put(this.sanitizeUrl(url) + `/${id}`, { data })
        return formatStrapiResponse(res.data)
    }

    // utils

    private sanitizeUrl(url: string) {
        return '/' + url.replace(/^\//, '')
    }

    // business logic

}

export const strapi = new Strapi()