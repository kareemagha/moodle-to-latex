export const saveText = function(input_text: string): boolean {

    const ignoreList = ["Question:", ""]

    if (ignoreList.includes(input_text)) {
        return false
    }

    return true
}