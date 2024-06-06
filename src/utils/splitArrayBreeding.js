function splitArrayBreeding(arrayOfRows) {
    let result = []

    arrayOfRows.forEach((row) => {
        let newSubArray = []
        row.forEach((item) => {
            if (item === '') {
                if (newSubArray.length > 0) {
                    result.push(newSubArray)
                }
                newSubArray = []
            } else {
                newSubArray.push(item)
            }
        })
        if (newSubArray.length > 0) {
            result.push(newSubArray)
        }
    })

    return result
}
export default splitArrayBreeding
