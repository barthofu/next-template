export const formatStrapiResponse = (object: any) => {

    object = object.data || object

    if (Array.isArray(object)) {

        for (let i = 0; i < object.length; i++) {
            object[i] = formatStrapiResponse(object[i])
        }
        return object

    } else {

        if (object.attributes) {

            for (const attribute of Object.keys(object.attributes)) {

                if (object.attributes[attribute]?.data || Array.isArray(object.attributes[attribute])) 
                    object.attributes[attribute] = formatStrapiResponse(object.attributes[attribute])
                else if (object.attributes[attribute]?.data === null)
                    object.attributes[attribute] = null
            }

            object.attributes.id = object.id
            return object.attributes
        
        } else {

            for (const attribute of Object.keys(object)) {

                if (object[attribute]?.data || Array.isArray(object[attribute])) 
                    object[attribute] = formatStrapiResponse(object[attribute])
                else if (object[attribute]?.data === null)
                    object[attribute] = null
            }

            object.id = object.id
            return object
        }
    }
}

export const getStrapiImageUrl = (url: string) => {
    return url.startsWith('/') ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${url}` : url
}