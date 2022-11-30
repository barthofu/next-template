namespace Strapi {

    // UTILS

    type GenericProps<T> = T & { 
        id?: number
        createdAt?: string
        updatedAt?: string
    }

    type Component<T> = T & {
        id: string
        __component: string
    }

    type ImageFormatData = {
        name: string
        hash: string
        url: string
        ext: string
        mime: string
        width: number
        height: number
        size: number
        path: string | null
    }

    type ImageFormats = 'thumbnail' | 'small' | 'medium' | 'large'

    type Image = {
        name: string
        alternativeText: string
        caption: string
        width: number
        height: number
        hash: string
        ext: string
        mime: string
        size: number
        url: string
        previewUrl: string | null
        provider: string
        provider_metadata: string | null
        createdAt: string
        updatedAt: string
        formats: {
            [key in ImageFormats]?: ImageFormatData
        }
    }

    type Correspondance = {

        'homepage': Homepage
    }

    // COLLECTION TYPES


    // SINGLE TYPES
    
    type Homepage = {
        title: string
        text: string
    }

    // COMPONENTS
    
}