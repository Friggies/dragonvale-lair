function transformToEggName(string) {
    //all egg images are only accessible through their lowercase name
    string = string.toLowerCase()

    //all spaces are replaced with dashes
    string = string.replaceAll(' ', '-')

    //for monolith and snowflake, remove number following a space as they have the sam egg image
    string = string.replace(/\s\d+/g, '')

    //return final string
    return string
}
export default transformToEggName
