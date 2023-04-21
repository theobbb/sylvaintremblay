import sanityClient from '@sanity/client'

export default sanityClient({
    projectId: "r9dm8hy5",
    dataset: "production",
    apiVersion: '2021-09-03',
    useCdn: true
})