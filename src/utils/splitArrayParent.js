function splitArrayParent(arrayOfRows) {
    let result = []

    arrayOfRows.forEach((subArray) => {
        for (let i = 0; i < subArray.length; i++) {
            if (subArray[i].includes('%')) {
                result.push([subArray[i - 4], subArray[i]])
            }
        }
    })
    return result
}
export default splitArrayParent
