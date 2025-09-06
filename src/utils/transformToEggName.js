function transformToEggName(string) {
    //all egg images are only accessible through their lowercase name
    string = string.toLowerCase()

    //all spaces are replaced with dashes
    string = string.replaceAll(' ', '-')

    //for monolith and snowflake, remove number following a dash as they have the same egg image
    string = string.replace(/-\d+/g, '')

    //return final string as url
    return `https://evrjimpvbkritkiantsx.supabase.co/storage/v1/object/public/eggs/${string}.png`
}
export default transformToEggName
